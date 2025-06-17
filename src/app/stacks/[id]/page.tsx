"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  thanosService,
  ThanosStack,
  ThanosDeployment,
} from "@/lib/services/thanos-service";
import { pluginService } from "@/lib/services/plugin-service";
import { Plugin, PluginType } from "@/lib/types/plugin";
import { showToast } from "@/lib/utils/toast";
import { StackInformation } from "@/components/StackInformation";
import { PluginsSection } from "@/components/plugins/PluginsSection";
import { DeploymentSteps } from "@/components/DeploymentSteps";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Modal } from "@/components/Modal";
import {
  UpdateStackForm,
  UpdateStackFormData,
} from "@/components/UpdateStackForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StackDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [stack, setStack] = useState<ThanosStack | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [deployments, setDeployments] = useState<ThanosDeployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPlugin, setIsCreatingPlugin] = useState(false);
  const [isUninstallingPlugin, setIsUninstallingPlugin] = useState(false);
  const [isDestroyingStack, setIsDestroyingStack] = useState(false);
  const [isResumingStack, setIsResumingStack] = useState(false);
  const [showDestroyConfirm, setShowDestroyConfirm] = useState(false);
  const [showResumeConfirm, setShowResumeConfirm] = useState(false);
  const [isStoppingStack, setIsStoppingStack] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdatingStack, setIsUpdatingStack] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stackData, pluginsData, deploymentsData] = await Promise.all([
          thanosService.getThanosStack(id),
          pluginService.getPlugins(id),
          thanosService.getDeployments(id),
        ]);
        setStack(stackData);
        setPlugins(pluginsData);
        setDeployments(deploymentsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch stack details"
        );
        showToast.error("Failed to fetch stack details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreatePlugin = async (type: PluginType, config?: any) => {
    if (!stack) return;

    try {
      setIsCreatingPlugin(true);
      await pluginService.createPlugin(stack.id, type, config || {});
      showToast.success(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } plugin started to install!`
      );
    } catch (err) {
      console.error(err);
      showToast.error(`Failed to create ${type} plugin`);
    } finally {
      setIsCreatingPlugin(false);
    }
  };

  const handleUninstallPlugin = async (plugin: Plugin) => {
    if (!stack) return;

    try {
      setIsUninstallingPlugin(true);
      await pluginService.deletePlugin(stack.id, plugin.type as PluginType);
      showToast.success(`${plugin.type} started to uninstall!`);
    } catch (err) {
      console.error(err);
      showToast.error(`Failed to uninstall ${plugin.type}`);
    } finally {
      setIsUninstallingPlugin(false);
    }
  };

  const handleDestroyStack = async () => {
    if (!stack) return;
    setShowDestroyConfirm(true);
  };

  const handleConfirmDestroy = async () => {
    if (!stack) return;

    try {
      setIsDestroyingStack(true);
      await thanosService.deleteStack(stack.id);
      showToast.success("Stack deletion initiated!");
      // Redirect to home page after successful deletion
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      showToast.error("Failed to destroy stack");
    } finally {
      setIsDestroyingStack(false);
      setShowDestroyConfirm(false);
    }
  };

  const handleResumeStack = async () => {
    if (!stack) return;
    setShowResumeConfirm(true);
  };

  const handleConfirmResume = async () => {
    if (!stack) return;

    try {
      setIsResumingStack(true);
      await thanosService.resumeStack(stack.id);
      showToast.success("Stack resume initiated!");
    } catch (err) {
      console.error(err);
      showToast.error("Failed to resume stack");
    } finally {
      setIsResumingStack(false);
      setShowResumeConfirm(false);
    }
  };

  const handleStopStack = async () => {
    if (!stack) return;
    setShowStopConfirm(true);
  };

  const handleConfirmStop = async () => {
    if (!stack) return;

    try {
      setIsStoppingStack(true);
      await thanosService.stopStack(stack.id);
      showToast.success("Stack stop initiated!");
    } catch (err) {
      console.error(err);
      showToast.error("Failed to stop stack");
    } finally {
      setIsStoppingStack(false);
      setShowStopConfirm(false);
    }
  };

  const handleUpdateStack = async () => {
    if (!stack) return;
    setShowUpdateModal(true);
  };

  const handleUpdateStackSubmit = async (formData: UpdateStackFormData) => {
    if (!stack) return;

    try {
      setIsUpdatingStack(true);
      await thanosService.updateStack(stack.id, formData);
      showToast.success("Stack update initiated!");
      setShowUpdateModal(false);
      // Refresh stack data to get updated status
      const updatedStack = await thanosService.getThanosStack(id);
      setStack(updatedStack);
    } catch (err) {
      console.error(err);
      showToast.error("Failed to update stack");
    } finally {
      setIsUpdatingStack(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !stack) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">{error || "Stack not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/home"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stacks
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid gap-8">
          <StackInformation
            stack={stack}
            onDestroyStack={handleDestroyStack}
            onResumeStack={handleResumeStack}
            onStopStack={handleStopStack}
            onUpdateStack={handleUpdateStack}
            isDestroyingStack={isDestroyingStack}
            isResumingStack={isResumingStack}
            isStoppingStack={isStoppingStack}
            isUpdatingStack={isUpdatingStack}
          />
          <DeploymentSteps deployments={deployments} />
          <PluginsSection
            plugins={plugins}
            onCreatePlugin={handleCreatePlugin}
            onUninstallPlugin={handleUninstallPlugin}
            isCreatingPlugin={isCreatingPlugin}
            isUninstallingPlugin={isUninstallingPlugin}
            isUpdatingStack={isUpdatingStack}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDestroyConfirm}
        onClose={() => setShowDestroyConfirm(false)}
        onConfirm={handleConfirmDestroy}
        title="Destroy Stack"
        message="Are you sure you want to destroy this stack? This action cannot be undone and will remove all associated resources."
        confirmText="Destroy Stack"
        confirmButtonClassName="bg-red-600 hover:bg-red-700"
        isLoading={isDestroyingStack}
      />

      <ConfirmModal
        isOpen={showResumeConfirm}
        onClose={() => setShowResumeConfirm(false)}
        onConfirm={handleConfirmResume}
        title="Resume Stack"
        message="Are you sure you want to resume this stack? This will redeploy all stack resources."
        confirmText="Resume Stack"
        isLoading={isResumingStack}
      />

      <ConfirmModal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        onConfirm={handleConfirmStop}
        title="Stop Stack"
        message="Are you sure you want to stop this stack? This will halt the deployment process."
        confirmText="Stop Stack"
        confirmButtonClassName="bg-yellow-600 hover:bg-yellow-700"
        isLoading={isStoppingStack}
      />

      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Stack Configuration"
      >
        <UpdateStackForm
          onSubmit={handleUpdateStackSubmit}
          isLoading={isUpdatingStack}
          currentL1RpcUrl={stack?.config.l1RpcUrl}
          currentL1BeaconUrl={stack?.config.l1BeaconUrl}
        />
      </Modal>
    </div>
  );
}
