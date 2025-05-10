// lib/api/axios-service.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { registerAllWebhooks } from '@/server/pabbly/webhook-config';

// Interface for webhook configuration
export interface WebhookConfig {
  url: string;
  token?: string;
  tokenType?: "Bearer" | "Basic" | "Custom";
  headers?: Record<string, string>;
  timeout?: number;
}

// Global API configuration
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
    response?: (
      response: AxiosResponse
    ) => AxiosResponse | Promise<AxiosResponse>;
  };
}

class AxiosService {
  private static instance: AxiosService;
  private axiosInstance: AxiosInstance;
  private webhooks: Map<string, WebhookConfig> = new Map();

  private constructor(config?: ApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: config?.baseURL,
      timeout: config?.timeout || 30000, // 30 seconds default timeout
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
    });

    // Request interceptor for adding headers, tokens, etc.
    this.axiosInstance.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig) => {
        // Apply custom request interceptor if provided
        if (config?.interceptors?.request) {
          return config.interceptors.request(reqConfig);
        }
        return reqConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling errors globally
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Apply custom response interceptor if provided
        if (config?.interceptors?.response) {
          return config.interceptors.response(response);
        }
        return response;
      },
      (error) => {
        // Log errors or handle specific HTTP status codes
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(config?: ApiConfig): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService(config);
    }
    return AxiosService.instance;
  }

  public registerWebhook(name: string, config: WebhookConfig): void {
    this.webhooks.set(name, config);
  }

  public getWebhookConfig(name: string): WebhookConfig | undefined {
    return this.webhooks.get(name);
  }

  /**
   * Update a registered webhook configuration
   */
  public updateWebhookConfig(
    name: string,
    config: Partial<WebhookConfig>
  ): void {
    const existingConfig = this.webhooks.get(name);
    if (existingConfig) {
      this.webhooks.set(name, { ...existingConfig, ...config });
    }
  }

  /**
   * Send data to a registered webhook
   */
  public async sendToWebhook<T = any>(
    webhookName: string,
    data: any,
    additionalConfig?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const webhookConfig = this.webhooks.get(webhookName);

    if (!webhookConfig) {
      throw new Error(`Webhook "${webhookName}" not registered`);
    }

    const requestConfig: AxiosRequestConfig = {
      url: webhookConfig.url,
      method: "POST",
      data,
      headers: { ...webhookConfig.headers },
      timeout: webhookConfig.timeout || 30000,
      ...additionalConfig,
    };

    // Add authentication token if provided
    if (webhookConfig.token) {
      switch (webhookConfig.tokenType) {
        case "Bearer":
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${webhookConfig.token}`,
          };
          break;
        case "Basic":
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Basic ${webhookConfig.token}`,
          };
          break;
        case "Custom":
          // For custom implementations, assume the token is added to headers in the webhook config
          break;
        default:
          // Default to Bearer if not specified
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${webhookConfig.token}`,
          };
      }
    }

    return this.request<T>(requestConfig);
  }

  /**
   * Generic request method
   */
  public async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>(config);
  }

  /**
   * Helper methods for common HTTP methods
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}


export const initializeAxiosService = (config?: ApiConfig): AxiosService => {
  const instance = AxiosService.getInstance(config);
  
  // Register all configured webhooks
  registerAllWebhooks(instance);
  
  return instance;
};

// Export a singleton instance
export const axiosService = initializeAxiosService();

// Export type for request/response data
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};