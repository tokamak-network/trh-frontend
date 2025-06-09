"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { thanosService, ThanosStack } from "@/lib/services/thanos-service";
import { pluginService } from "@/lib/services/plugin-service";
import { Plugin, PluginType } from "@/lib/types/plugin";
import { showToast } from "@/lib/utils/toast";
import { StackInformation } from "@/components/StackInformation";
import { PluginsSection } from "@/components/PluginsSection";

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

  const handleCreatePlugin = async (type: PluginType, config?: any) => {
    if (!stack) return;

    try {
      setIsCreatingPlugin(true);
      const newPlugin = await pluginService.createPlugin(stack.id, {
        type,
        name: `Thanos ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        config: config || {
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
        <div className="grid gap-8">
          <StackInformation stack={stack} />
          <PluginsSection
            plugins={plugins}
            onCreatePlugin={handleCreatePlugin}
            isCreatingPlugin={isCreatingPlugin}
          />
        </div>
      </div>
    </div>
  );
}
