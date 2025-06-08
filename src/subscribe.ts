import { EventSource } from "eventsource";
import { forwardWebhook } from "./forward";
import consola from "consola";

export const subscribToWebhook = async (
  url: string,
  route: string,
  port: number
) => {
  new Promise((resolve, reject) => {
    // Append 'subscribe' to the URL
    const subscribeUrl = new URL(url);
    subscribeUrl.pathname = subscribeUrl.pathname.endsWith("/")
      ? subscribeUrl.pathname + "subscribe"
      : subscribeUrl.pathname + "/subscribe";

    const forwardUrl = `http://localhost:${port}${
      route.startsWith("/") ? route : "/" + route
    }`;

    console.log(`Forwarding ${url} to ${forwardUrl}`);

    // Create EventSource connection
    const es = new EventSource(subscribeUrl.toString());

    es.onmessage = async (event) => {
      await forwardWebhook(forwardUrl, event.data);
    };

    es.addEventListener("webhook-response-received", async (event) => {
      await forwardWebhook(forwardUrl, event.data);
    });

    es.addEventListener("connected", (event) => {
      consola.success(`Connected to ${url}`);
      consola.box(`subscribe url: ${subscribeUrl.toString()}`);
    });

    es.addEventListener("error", (event) => {
      console.log("error", event);
      reject(event.message);
    });

    es.addEventListener("heartbeat", (event) => {
      console.log("heartbeat", event);
    });

    // Handle incoming messages
    // eventSource.onmessage = async (event) => {
    //   console.log("event ===> ", event);
    // try {
    //   console.log("Received webhook payload:", event.data);

    //   // Forward the payload to the local endpoint
    //   const localUrl = `http://localhost:${port}/${route}`;
    //   const response = await fetch(localUrl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: event.data,
    //   });

    //   if (response.ok) {
    //     console.log(`Successfully forwarded payload to ${localUrl}`);
    //   } else {
    //     console.error(
    //       `Failed to forward payload to ${localUrl}:`,
    //       response.status,
    //       response.statusText
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error forwarding webhook payload:", error);
    // }
    // };

    // Return cleanup function
  });
};
