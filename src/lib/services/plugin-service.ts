import { Plugin, CreatePluginRequest } from "../types/plugin";
import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

// Mock data for development
const mockPlugins: Plugin[] = [
  {
    id: "1",
    type: "bridge",
    name: "Thanos Bridge",
    status: "Active",
    stackId: "stack-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      url: "https://bridge.thanos.example.com",
      apiKey: "mock-api-key-1",
    },
  },
  {
    id: "2",
    type: "explorer",
    name: "Thanos Explorer",
    status: "Active",
    stackId: "stack-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      url: "https://explorer.thanos.example.com",
      apiKey: "mock-api-key-2",
    },
  },
];

export const pluginService = {
  /**
   * Get all plugins for a stack
   */
  getPlugins: async (stackId: string): Promise<Plugin[]> => {
    // Mock implementation
    return mockPlugins.filter((plugin) => plugin.stackId === stackId);

    // Real implementation would be:
    // const response = await apiClient.get(`${API_ENDPOINTS.PLUGINS}/${stackId}`);
    // return response.data.plugins;
  },

  /**
   * Create a new plugin for a stack
   */
  createPlugin: async (
    stackId: string,
    data: CreatePluginRequest
  ): Promise<Plugin> => {
    // Mock implementation
    const newPlugin: Plugin = {
      id: Math.random().toString(36).substr(2, 9),
      type: data.type,
      name: data.name,
      status: "Active",
      stackId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: data.config,
    };
    mockPlugins.push(newPlugin);
    return newPlugin;

    // Real implementation would be:
    // const response = await apiClient.post(`${API_ENDPOINTS.PLUGINS}/${stackId}`, data);
    // return response.data.plugin;
  },
};
