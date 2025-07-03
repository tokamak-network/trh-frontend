import { useState } from "react";
import { Plugin, PluginType } from "@/lib/types/plugin";
import { ExplorerPluginForm, ExplorerFormData } from "../ExplorerPluginForm";
import {
  MonitoringPluginForm,
  MonitoringFormData,
} from "../MonitoringPluginForm";
import {
  CandidateRegistryPluginForm,
  CandidateRegistryFormData,
} from "../CandidateRegistryPluginForm";
import { Modal } from "../Modal";
import { ConfirmModal } from "../ui/ConfirmModal";
import { ChevronDown } from "lucide-react";
import { PluginItem } from "./PluginItem";
import { createPluginOptions } from "./PluginOptions";

interface PluginsSectionProps {
  plugins: Plugin[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreatePlugin: (type: PluginType, config?: any) => Promise<void>;
  onUninstallPlugin: (plugin: Plugin) => Promise<void>;
  isCreatingPlugin: boolean;
  isUninstallingPlugin: boolean;
  isUpdatingStack?: boolean;
}

export function PluginsSection({
  plugins,
  onCreatePlugin,
  onUninstallPlugin,
  isCreatingPlugin,
  isUninstallingPlugin,
  isUpdatingStack = false,
}: PluginsSectionProps) {
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [showCandidateRegistryModal, setShowCandidateRegistryModal] =
    useState(false);
  const [showBridgeConfirmModal, setShowBridgeConfirmModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPluginForConfig, setSelectedPluginForConfig] =
    useState<Plugin | null>(null);
  const [pluginToUninstall, setPluginToUninstall] = useState<Plugin | null>(
    null
  );

  const handleExplorerFormSubmit = async (formData: ExplorerFormData) => {
    await onCreatePlugin("block-explorer", {
      databaseUsername: formData.databaseUsername,
      databasePassword: formData.databasePassword,
      coinMarketCapKey: formData.coinMarketCapKey,
      walletConnectId: formData.walletConnectId,
    });
    setShowExplorerModal(false);
  };

  const handleMonitoringFormSubmit = async (formData: MonitoringFormData) => {
    await onCreatePlugin("monitoring", {
      grafanaPassword: formData.grafanaPassword,
    });
    setShowMonitoringModal(false);
  };

  const handleCandidateRegistryFormSubmit = async (
    formData: CandidateRegistryFormData
  ) => {
    await onCreatePlugin("candidate-registry", {
      amount: formData.amount,
      memo: formData.memo,
      nameInfo: formData.nameInfo,
    });
    setShowCandidateRegistryModal(false);
  };

  const handleBridgeConfirm = async () => {
    await onCreatePlugin("bridge");
    setShowBridgeConfirmModal(false);
  };

  const handleViewConfig = (plugin: Plugin) => {
    setSelectedPluginForConfig(plugin);
  };

  const handleUninstall = (plugin: Plugin) => {
    setPluginToUninstall(plugin);
  };

  const handleUninstallConfirm = async () => {
    if (pluginToUninstall) {
      await onUninstallPlugin(pluginToUninstall);
      setPluginToUninstall(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInstall = async (type: PluginType, config?: any) => {
    await onCreatePlugin(type, config);
  };

  const pluginOptions = createPluginOptions(
    () => setShowBridgeConfirmModal(true),
    () => setShowExplorerModal(true),
    () => setShowMonitoringModal(true),
    () => setShowCandidateRegistryModal(true)
  );

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Plugins</h2>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isCreatingPlugin || isUpdatingStack}
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
                  disabled={
                    isCreatingPlugin ||
                    isUpdatingStack ||
                    option.isInstalled(plugins)
                  }
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

      <Modal
        isOpen={showMonitoringModal}
        onClose={() => setShowMonitoringModal(false)}
        title="Configure Monitoring Plugin"
      >
        <MonitoringPluginForm
          onSubmit={handleMonitoringFormSubmit}
          isLoading={isCreatingPlugin}
        />
      </Modal>

      <Modal
        isOpen={showCandidateRegistryModal}
        onClose={() => setShowCandidateRegistryModal(false)}
        title="Configure DAO Candidate Registry Plugin"
      >
        <CandidateRegistryPluginForm
          onSubmit={handleCandidateRegistryFormSubmit}
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
            {JSON.stringify(selectedPluginForConfig?.info, null, 2)}
          </pre>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!pluginToUninstall}
        onClose={() => setPluginToUninstall(null)}
        onConfirm={handleUninstallConfirm}
        title="Uninstall Plugin"
        message={`Are you sure you want to uninstall the ${pluginToUninstall?.type} plugin? This action cannot be undone.`}
        confirmText="Uninstall"
        confirmButtonClassName="bg-red-600 hover:bg-red-700"
        isLoading={isUninstallingPlugin}
      />

      <div className="grid gap-4">
        {plugins.length === 0 ? (
          <p className="text-gray-600">No plugins installed</p>
        ) : (
          plugins.map((plugin) => (
            <PluginItem
              key={plugin.id}
              plugin={plugin}
              onViewConfig={handleViewConfig}
              onUninstall={handleUninstall}
              onInstall={handleInstall}
              isUpdatingStack={isUpdatingStack}
            />
          ))
        )}
      </div>
    </section>
  );
}
