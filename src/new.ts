import { LHOOK_ENDPOINT } from "./config";

export const newWebhook = async (url: string) => {
  const response = await fetch(`${LHOOK_ENDPOINT}/webhooks`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
};
