import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import "source-map-support/register";

import { verify, decode } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";
import Axios from "axios";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";
import { Jwk } from "../../auth/Jwk";

const logger = createLogger("auth");

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = "https://dev-1la8x365.us.auth0.com/.well-known/jwks.json";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  logger.info("Authorizing a user", event);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  logger.info(`verifyToken receives ${authHeader}`);
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt; // Decode from base64 to JSON

  logger.info(`Bearer token is ${token}`, { token });
  logger.info(`Decoded JWT is ${jwt}`, { jwt });
  // Get the certificate
  const secret = await getCertificate(jwksUrl, jwt.header.kid);
  const cert = `-----BEGIN CERTIFICATE-----\n${secret}\n-----END CERTIFICATE-----`;
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  logger.info("Verifying certificate", cert);
  return verify(token, cert, { algorithms: ["RS256"] }) as JwtPayload;
}

async function getCertificate(jwksUrl: string, kid: string): Promise<string> {
  const response = await Axios.get(jwksUrl);
  const jwks: any = response.data;
  const signingKeys = jwks.keys.filter((key) => key.kid === kid);
  if (signingKeys.length === 0) {
    throw new Error("Invalid signing key");
  }
  return signingKeys[0].x5c[0];
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];
  logger.info(`getToken returns ${token}`);
  return token;
}
