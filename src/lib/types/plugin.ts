export type PluginType = "bridge" | "block-explorer";

export interface Plugin {
  id: string;
  name: PluginType;
  status: string;
  stackId: string;
  config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  info: {
    url: string;
  };
  logPath?: string;
}

export interface CreatePluginRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
