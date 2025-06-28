import { Plugin, CreatePluginRequest, PluginType } from "../types/plugin";
import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../api-config";
import { ApiResponse } from "./thanos-service";

export interface GetPluginsResponse extends ApiResponse {
  data: {
    integrations: Plugin[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreatePluginResponse extends ApiResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DeletePluginResponse extends ApiResponse {}

class PluginService {
  /**
   * Get all plugins for a stack
   */
  async getPlugins(stackId: string): Promise<Plugin[]> {
    const response = await apiClient.get<GetPluginsResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${stackId}/integrations`
    );
    return response.data.data.integrations;
  }

  /**
   * Create a new plugin for a stack
   */
  async createPlugin(
    stackId: string,
    type: PluginType,
    data?: CreatePluginRequest
  ): Promise<void> {
    await apiClient.post<CreatePluginResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${stackId}/integrations/${type}`,
      data
    );
  }

  async deletePlugin(stackId: string, type: PluginType): Promise<void> {
    await apiClient.delete<DeletePluginResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${stackId}/integrations/${type}`
    );
  }
}

export const pluginService = new PluginService();
