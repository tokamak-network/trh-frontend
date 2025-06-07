export type PluginType = "bridge" | "explorer";

export interface Plugin {
  id: string;
  type: PluginType;
  name: string;
  status: string;
  stackId: string;
  createdAt: string;
  updatedAt: string;
  config: {
    url?: string;
    apiKey?: string;
    [key: string]: any;
  };
}

export interface CreatePluginRequest {
  type: PluginType;
  name: string;
  config: {
    [key: string]: any;
  };
}
