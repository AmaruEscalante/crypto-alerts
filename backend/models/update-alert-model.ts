export default {
  type: "object",
  properties: {
    cryptoId: { type: "string" },
    priceThreshold: { type: "number" },
    errorMargin: { type: "number" },
    isActive: { type: "boolean" },
  },
  required: ["cryptoId", "priceThreshold", "errorMargin", "isActive"],
} as const;
