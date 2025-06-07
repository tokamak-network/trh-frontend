"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { thanosService, ThanosStack } from "@/lib/services/thanos-service";
import { pluginService } from "@/lib/services/plugin-service";
import { Plugin, PluginType } from "@/lib/types/plugin";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { showToast } from "@/lib/utils/toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StackDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [stack, setStack] = useState<ThanosStack | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPlugin, setIsCreatingPlugin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stackData, pluginsData] = await Promise.all([
          thanosService.getThanosStack(id),
          pluginService.getPlugins(id),
        ]);
        setStack(stackData);
        setPlugins(pluginsData);
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

  const handleCreatePlugin = async (type: PluginType) => {
    if (!stack) return;

    try {
      setIsCreatingPlugin(true);
      const newPlugin = await pluginService.createPlugin(stack.id, {
        type,
        name: `Thanos ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        config: {
          url: `https://${type}.thanos.example.com`,
          apiKey: `mock-api-key-${Math.random().toString(36).substr(2, 9)}`,
        },
      });
      setPlugins([...plugins, newPlugin]);
      showToast.success(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } plugin created successfully!`
      );
    } catch (err) {
      showToast.error(`Failed to create ${type} plugin`);
    } finally {
      setIsCreatingPlugin(false);
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
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{stack.config.chainName}</h1>
            <p className="text-gray-600 mt-1">Stack Details</p>
          </div>
          <StatusBadge status={stack.status as Status} />
        </div>

        <div className="grid gap-8">
          {/* Stack Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Stack Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Network</p>
                <p className="font-medium">{stack.network}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium">{stack.status}</p>
              </div>
              <div>
                <p className="text-gray-600">RPC URL</p>
                <p className="font-medium break-all">{stack.config.l1RpcUrl}</p>
              </div>
              <div>
                <p className="text-gray-600">Batcher URL</p>
                <p className="font-medium break-all">
                  https://batcher.{stack.config.chainName.toLowerCase()}
                  .thanos.network
                </p>
              </div>
              <div>
                <p className="text-gray-600">Proposer URL</p>
                <p className="font-medium break-all">
                  https://proposer.{stack.config.chainName.toLowerCase()}
                  .thanos.network
                </p>
              </div>
            </div>
          </section>

          {/* Plugins */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Plugins</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreatePlugin("bridge")}
                  disabled={
                    isCreatingPlugin || plugins.some((p) => p.type === "bridge")
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Bridge
                </button>
                <button
                  onClick={() => handleCreatePlugin("explorer")}
                  disabled={
                    isCreatingPlugin ||
                    plugins.some((p) => p.type === "explorer")
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Explorer
                </button>
              </div>
            </div>

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
                        <p className="text-gray-600 mt-2">
                          URL: {plugin.config.url}
                        </p>
                      </div>
                      <StatusBadge status={plugin.status as Status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
