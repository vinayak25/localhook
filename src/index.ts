import figlet from "figlet";
import { program } from "commander";
import { subscribToWebhook } from "./subscribe";
import { LHOOK_ENDPOINT } from "./config";
import { newWebhook } from "./new";

program
  .name("localhook")
  .description("CLI to create and manage local webhooks")
  .version("0.0.1");

program
  .command("new")
  .description("Create a new webhook")
  .option("-u, --url <url>", "The url of the webhook")
  .action(async (str, options) => {
    const { url = LHOOK_ENDPOINT } = options.opts();
    const webhook = await newWebhook(url);
    console.log(`\x1b[33mNew webhook created: ${webhook.url}\x1b[0m`);
  });

program
  .description("Localhook is a tool for creating and managing localwebhooks")
  //   .option("-h, --help", "output usage information")
  .option("-u, --url <url>", "The url of the webhook")
  .option("-r, --route <route>", "The route of the webhook")
  .option("-p, --port <port>", "The port of the webhook")
  .action(async (str, options) => {
    const { url, route, port } = options.opts();
    if (!url) {
      console.error("URL is required");
      process.exit(1);
    }
    if (!route) {
      console.error("Route is required");
      process.exit(1);
    }
    if (!port) {
      console.error("Port is required");
      process.exit(1);
    }

    try {
      await subscribToWebhook(url, route, port);
    } catch (error) {
      console.error("Error subscribing to webhook:", error);
      process.exit(1);
    }
  });

console.log(figlet.textSync("Localhook"));

program.parse(process.argv);
