"use client";

import { useEffect, useState } from "react";
import { thanosService, ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { showToast } from "@/lib/utils/toast";
import { Loader } from "lucide-react";

interface DeploymentConfigDetailProps {
  id: string;
}

export function DeploymentConfigDetail({ id }: DeploymentConfigDetailProps) {
  const [stack, setStack] = useState<ThanosStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStack = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await thanosService.getThanosStack(id);
        setStack(data);
      } catch (err) {
        const errorMessage = "Failed to fetch deployment configuration";
        setError(errorMessage);
        showToast.error(errorMessage);
        console.error("Error fetching deployment configuration:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStack();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !stack) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">
          {error || "Deployment configuration not found"}
        </p>
        <p className="text-red-500 mt-2">
          Please try refreshing the page or check if the stack ID is correct.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{stack.config.chainName}</h1>
          <p className="text-gray-600 mt-1">Deployment Configuration</p>
        </div>
        <StatusBadge status={stack.status as Status} />
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Deployment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Network</p>
              <p className="font-medium">{stack.network}</p>
            </div>
            <div>
              <p className="text-gray-600">Deployment Path</p>
              <p className="font-medium">{stack.deployment_path}</p>
            </div>
            <div>
              <p className="text-gray-600">AWS Region</p>
              <p className="font-medium">{stack.config.awsRegion}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium">{stack.status}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Network Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">L1 RPC URL</p>
              <p className="font-medium break-all">{stack.config.l1RpcUrl}</p>
            </div>
            <div>
              <p className="text-gray-600">L1 Beacon URL</p>
              <p className="font-medium break-all">
                {stack.config.l1BeaconUrl}
              </p>
            </div>
            <div>
              <p className="text-gray-600">L2 Block Time</p>
              <p className="font-medium">{stack.config.l2BlockTime}s</p>
            </div>
            <div>
              <p className="text-gray-600">Challenge Period</p>
              <p className="font-medium">{stack.config.challengePeriod}</p>
            </div>
            <div>
              <p className="text-gray-600">Output Root Frequency</p>
              <p className="font-medium">{stack.config.outputRootFrequency}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Service Accounts</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Admin Account</p>
              <p className="font-medium break-all bg-gray-50 p-2 rounded">
                {stack.config.adminAccount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Proposer Account</p>
              <p className="font-medium break-all bg-gray-50 p-2 rounded">
                {stack.config.proposerAccount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Batcher Account</p>
              <p className="font-medium break-all bg-gray-50 p-2 rounded">
                {stack.config.batcherAccount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sequencer Account</p>
              <p className="font-medium break-all bg-gray-50 p-2 rounded">
                {stack.config.sequencerAccount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
