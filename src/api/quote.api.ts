import api from "./axios";

export const getQuote = async () => {
  const res = await api.get("/quote");
  return res.data;
};
