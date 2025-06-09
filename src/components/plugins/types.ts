import { Plugin, PluginType } from "@/lib/types/plugin";

export interface PluginOption {
  type: PluginType;
  label: string;
  isInstalled: (plugins: Plugin[]) => boolean;
  onClick: () => void;
}

export interface PluginItemProps {
  plugin: Plugin;
  onViewConfig: (plugin: Plugin) => void;
  onUninstall: (plugin: Plugin) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInstall?: (type: PluginType, config?: any) => void;
}
