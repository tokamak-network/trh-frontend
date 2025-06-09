import { useState } from "react";
import { Plugin, PluginType } from "@/lib/types/plugin";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { ExplorerPluginForm, ExplorerFormData } from "./ExplorerPluginForm";
import { Modal } from "./Modal";
import { ConfirmModal } from "./ui/ConfirmModal";

interface PluginsSectionProps {
  plugins: Plugin[];
  onCreatePlugin: (type: PluginType, config?: any) => Promise<void>;
  isCreatingPlugin: boolean;
}

export function PluginsSection({
  plugins,
  onCreatePlugin,
  isCreatingPlugin,
}: PluginsSectionProps) {
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [showBridgeConfirmModal, setShowBridgeConfirmModal] = useState(false);

  const handleExplorerFormSubmit = async (formData: ExplorerFormData) => {
    await onCreatePlugin("explorer", {
      url: `https://explorer.thanos.network`,
      dbUsername: formData.dbUsername,
      dbPassword: formData.dbPassword,
      coinMarketCapKey: formData.coinMarketCapKey,
      walletConnectId: formData.walletConnectId,
    });
    setShowExplorerModal(false);
  };

  const handleBridgeConfirm = async () => {
    await onCreatePlugin("bridge");
    setShowBridgeConfirmModal(false);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Plugins</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBridgeConfirmModal(true)}
            disabled={
              isCreatingPlugin || plugins.some((p) => p.type === "bridge")
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Bridge
          </button>
          <button
            onClick={() => setShowExplorerModal(true)}
            disabled={
              isCreatingPlugin || plugins.some((p) => p.type === "explorer")
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Explorer
          </button>
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

      <div className="grid gap-4">
        {plugins.length === 0 ? (
          <p className="text-gray-600">No plugins installed</p>
        ) : (
          plugins.map((plugin) => (
            <div key={plugin.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{plugin.name}</h3>
                  <p className="text-gray-600">Type: {plugin.type}</p>
                  <p className="text-gray-600 mt-2">URL: {plugin.config.url}</p>
                </div>
                <StatusBadge status={plugin.status as Status} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
