# LocalHook CLI

CLI tool for managing local webhooks

## Getting Started

First, you will have to install `localhook` cli

```bash
npm i -g localhook
```

Once installed, verify the installation by running the following command.

```bash
localhook --version
```

## Usage

You can use localhook CLI to create new webhooks or tunneling the webhook to your local route.

### Creating Webhooks

To create a new webhook, run the following command

```bash
localhook new
```

It will output you a new webhook details.

```
[3:40:49 PM] ✔ New webhook created: https://lhook.xyz/BYGwTpBz1DAiGYg
[3:40:49 PM] ℹ You can use the webhook by running the following command:

 ╭───────────────────────────────────────────────────────────────────╮
 │  lhook -u https://lhook.xyz/BYGwTpBz1DAiGYg -r <route> -p <port>  │
 ╰───────────────────────────────────────────────────────────────────╯
```

Once this step is done, we are good to subscribe to the webhook now.

### Subscribe to the Webhook

We can subscribe to the webhook by simply running the `localhook` command.

```bash
localhook -u webhook_url -r local_route -p port_number
```

For example, to tunnel the request coming from the webhook to your local route, open a new terminal and run the following command.

```bash
localhook -u https://lhook.xyz/BYGwTpBz1DAiGYg -r /payments/hooks -p 5001
```

```bash
ℹ Forwarding https://lhook.xyz/BYGwTpBz1DAiGYg to http://localhost:5001/payments/hooks
✔ Connected to https://lhook.xyz/BYGwTpBz1DAiGYg  
```

Once you run this command, all requests that you will receive on `https://lhook.xyz/BYGwTpBz1DAiGYg` will be routed to your local route.