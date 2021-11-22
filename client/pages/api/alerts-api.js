// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Axios from "axios";

export default function helloAPI(req, res) {
  res.status(200).json({ name: "John Doe" });
}

const apiId = "tj78nqd7o5";
const wssId = "54mwefi7ba";
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;
export const wssEndpoint = `wss://${wssId}.execute-api.us-east-1.amazonaws.com/dev`;

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

export const createAlert = async (idToken, newAlert) => {
  const response = await Axios.post(
    `${apiEndpoint}/alert`,
    JSON.stringify(newAlert),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.item;
};

export const patchAlert = async (idToken, alertId, updatedAlert) => {
  const response = await Axios.patch(
    `${apiEndpoint}/alert/${alertId}`,
    JSON.stringify(updatedAlert),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.item;
};

export const deleteAlert = async (idToken, alertId) => {
  const response = await Axios.delete(`${apiEndpoint}/alert/${alertId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data.item;
};
