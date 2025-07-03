import { PluginOption } from "./types";

export const createPluginOptions = (
  onBridgeClick: () => void,
  onExplorerClick: () => void,
  onMonitoringClick: () => void,
  onCandidateRegistryClick: () => void
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
  {
    type: "monitoring",
    label: "Monitoring",
    isInstalled: (plugins) => plugins.some((p) => p.type === "monitoring"),
    onClick: onMonitoringClick,
  },
  {
    type: "candidate-registry",
    label: "DAO Candidate Registry",
    isInstalled: (plugins) =>
      plugins.some((p) => p.type === "candidate-registry"),
    onClick: onCandidateRegistryClick,
  },
  // Add new plugin types here in the future
];
