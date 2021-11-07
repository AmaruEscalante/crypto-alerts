// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Axios from "axios";

export default function helloAPI(req, res) {
  res.status(200).json({ name: "John Doe" });
}

const apiId = "tj78nqd7o5";
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;

export const getAlerts = async (idToken) => {
  const response = await Axios.get(`${apiEndpoint}/alert`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("Alerts fetched are:", response.data);
  return response.data.items;
};
