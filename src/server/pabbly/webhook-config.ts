import { WebhookConfig } from "@/server/services/axios-service";

export const webhookConfigs: Record<string, WebhookConfig> = {
  pabbly: {
    url:
      process.env.PABBLY_WEBHOOK_URL ||
      "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzMDA0MzI1MjY4NTUzMjUxMzYi_pc",
    timeout: 3000,
  },
};

export const registerAllWebhooks = (axiosService: any) => {
  // Register each webhook configuration
  Object.entries(webhookConfigs).forEach(([name, config]) => {
    // Only register webhooks that have a URL configured
    if (config.url) {
      axiosService.registerWebhook(name, config);
    }
  });
};
