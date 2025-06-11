import { Plugin, CreatePluginRequest, PluginType } from "../types/plugin";
import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

class PluginService {
  /**
   * Get all plugins for a stack
   */
  async getPlugins(stackId: string): Promise<Plugin[]> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.THANOS_STACKS}/${stackId}/integrations`
    );
    return response.data.integrations;
  }

  /**
   * Create a new plugin for a stack
   */
  async createPlugin(
    stackId: string,
    type: PluginType,
    data?: CreatePluginRequest
  ): Promise<Plugin> {
    console.log(data);
    const response = await apiClient.post(
      `${API_ENDPOINTS.THANOS_STACKS}/${stackId}/integrations/${type}`,
      data
    );
    return response.data;
  }

  async deletePlugin(stackId: string, type: PluginType): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.THANOS_STACKS}/${stackId}/integrations/${type}`
    );
  }
}

export const pluginService = new PluginService();
