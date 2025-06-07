import figlet from "figlet";
import { program } from "commander";
import { subscribToWebhook } from "./subscribe";

program
  .version("0.0.1")
  .description("Localhook is a tool for creating and managing localwebhooks")
  //   .option("-h, --help", "output usage information")
  .option("-u, --url <url>", "The url of the webhook")
  .option("-r, --route <route>", "The route of the webhook")
  .option("-p, --port <port>", "The port of the webhook")
  .parse(process.argv)
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

program
  .command("new")
  .description("Create a new webhook")
  .action(() => {
    console.log("Creating a new webhook");
  });

program.parse(process.argv);
