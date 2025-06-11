import { useState } from "react";
import { Plugin, PluginType } from "@/lib/types/plugin";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { ExplorerPluginForm, ExplorerFormData } from "./ExplorerPluginForm";
import { Modal } from "./Modal";
import { ConfirmModal } from "./ui/ConfirmModal";
import { ChevronDown, Settings } from "lucide-react";

interface PluginsSectionProps {
  plugins: Plugin[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreatePlugin: (type: PluginType, config?: any) => Promise<void>;
  isCreatingPlugin: boolean;
}

interface PluginOption {
  type: PluginType;
  label: string;
  isInstalled: (plugins: Plugin[]) => boolean;
  onClick: () => void;
}

interface PluginItemProps {
  plugin: Plugin;
  onViewConfig: (plugin: Plugin) => void;
}

function PluginItem({ plugin, onViewConfig }: PluginItemProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">{plugin.type}</h3>
            <StatusBadge status={plugin.status as Status} />
          </div>
          <p className="text-gray-600 mt-2">
            URL:{" "}
            <a href={plugin.info.url} target="_blank" rel="noopener noreferrer">
              {plugin.info.url}
            </a>
          </p>
        </div>
        <button
          onClick={() => onViewConfig(plugin)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="View Configuration"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function PluginsSection({
  plugins,
  onCreatePlugin,
  isCreatingPlugin,
}: PluginsSectionProps) {
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [showBridgeConfirmModal, setShowBridgeConfirmModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPluginForConfig, setSelectedPluginForConfig] =
    useState<Plugin | null>(null);

  const handleExplorerFormSubmit = async (formData: ExplorerFormData) => {
    await onCreatePlugin("block-explorer", {
      url: `https://explorer.thanos.network`,
      databaseUsername: formData.databaseUsername,
      databasePassword: formData.databasePassword,
      coinMarketCapKey: formData.coinMarketCapKey,
      walletConnectId: formData.walletConnectId,
    });
    setShowExplorerModal(false);
  };

  const handleBridgeConfirm = async () => {
    await onCreatePlugin("bridge");
    setShowBridgeConfirmModal(false);
  };

  const handleViewConfig = (plugin: Plugin) => {
    setSelectedPluginForConfig(plugin);
  };

  const pluginOptions: PluginOption[] = [
    {
      type: "bridge",
      label: "Thanos Bridge",
      isInstalled: (plugins) => plugins.some((p) => p.type === "bridge"),
      onClick: () => setShowBridgeConfirmModal(true),
    },
    {
      type: "block-explorer",
      label: "Thanos Explorer",
      isInstalled: (plugins) =>
        plugins.some((p) => p.type === "block-explorer"),
      onClick: () => setShowExplorerModal(true),
    },
    // Add new plugin types here in the future
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Plugins</h2>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isCreatingPlugin}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Add Plugin
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border">
              {pluginOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    setShowDropdown(false);
                    option.onClick();
                  }}
                  disabled={isCreatingPlugin || option.isInstalled(plugins)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  {option.label}
                  {option.isInstalled(plugins) && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Installed)
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showExplorerModal}
        onClose={() => setShowExplorerModal(false)}
        title="Configure Explorer Plugin"
      >
        <ExplorerPluginForm
          onSubmit={handleExplorerFormSubmit}
          isLoading={isCreatingPlugin}
        />
      </Modal>

      <ConfirmModal
        isOpen={showBridgeConfirmModal}
        onClose={() => setShowBridgeConfirmModal(false)}
        onConfirm={handleBridgeConfirm}
        title="Add Bridge Plugin"
        message="Are you sure you want to add the Bridge plugin? This will create a new bridge instance for your stack."
        confirmText="Add Bridge"
        isLoading={isCreatingPlugin}
      />

      <Modal
        isOpen={!!selectedPluginForConfig}
        onClose={() => setSelectedPluginForConfig(null)}
        title={`${selectedPluginForConfig?.type} Configuration`}
      >
        <div className="p-4">
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(selectedPluginForConfig?.config, null, 2)}
          </pre>
        </div>
      </Modal>

      <div className="grid gap-4">
        {plugins.length === 0 ? (
          <p className="text-gray-600">No plugins installed</p>
        ) : (
          plugins.map((plugin) => (
            <PluginItem
              key={plugin.id}
              plugin={plugin}
              onViewConfig={handleViewConfig}
            />
          ))
        )}
      </div>
    </section>
  );
}
