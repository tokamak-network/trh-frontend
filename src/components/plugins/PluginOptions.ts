import { PluginOption } from "./types";

export const createPluginOptions = (
  onBridgeClick: () => void,
  onExplorerClick: () => void
): PluginOption[] => [
  {
    type: "bridge",
    label: "Thanos Bridge",
    isInstalled: (plugins) => plugins.some((p) => p.name === "bridge"),
    onClick: onBridgeClick,
  },
  {
    type: "block-explorer",
    label: "Thanos Explorer",
    isInstalled: (plugins) => plugins.some((p) => p.name === "block-explorer"),
    onClick: onExplorerClick,
  },
  // Add new plugin types here in the future
];
