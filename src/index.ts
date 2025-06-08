#!/usr/bin/env node

import { program } from "commander";
import { subscribToWebhook } from "./subscribe";
import { LHOOK_ENDPOINT } from "./config";
import { newWebhook } from "./new";
import { consola } from "consola";

program
  .name("localhook")
  .description("CLI to create and manage local webhooks")
  .version("0.0.3");

program
  .command("new")
  .description("Create a new webhook")
  .option("-u, --url <url>", "The url of the webhook")
  .action(async (str, options) => {
    const { url = LHOOK_ENDPOINT } = options.opts();
    const webhook = await newWebhook(url);

    consola.info("Please configure the following webhook in your application.");
    consola.success(`New webhook created: ${webhook.url}`);

    console.log();
    consola.info("You can use the webhook by running the following command:");
    consola.success(`localhook -u ${webhook.url} -r <route> -p <port>`);
  });

program
  .description("Localhook is a tool for creating and managing localwebhooks")
  //   .option("-h, --help", "output usage information")
  .option("-u, --url <url>", "The url of the webhook")
  .option("-r, --route <route>", "The route of the webhook")
  .option("-p, --port <port>", "The port of the webhook")
  .action(async (str, options) => {
    const { url, route, port } = options.opts();
    if (!url && !route && !port) {
      consola.error("URL, route, and port are required");
      process.exit(1);
    }

    if (!url) {
      consola.error("URL is required");
      process.exit(1);
    }
    if (!route) {
      consola.error("Route is required");
      process.exit(1);
    }
    if (!port) {
      consola.error("Port is required");
      process.exit(1);
    }

    try {
      await subscribToWebhook(url, route, port);
    } catch (error) {
      consola.error("Error subscribing to webhook:", error);
      process.exit(1);
    }
  });

program.parse(process.argv);
