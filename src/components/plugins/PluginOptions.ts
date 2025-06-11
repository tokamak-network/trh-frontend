import { PluginOption } from "./types";

export const createPluginOptions = (
  onBridgeClick: () => void,
  onExplorerClick: () => void
): PluginOption[] => [
  {
    type: "bridge",
    label: "Thanos Bridge",
    isInstalled: (plugins) => plugins.some((p) => p.type === "bridge"),
    onClick: onBridgeClick,
  },
  {
    type: "block-explorer",
    label: "Thanos Explorer",
    isInstalled: (plugins) => plugins.some((p) => p.type === "block-explorer"),
    onClick: onExplorerClick,
  },
  // Add new plugin types here in the future
];
