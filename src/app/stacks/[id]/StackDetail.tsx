"use client";

import { useEffect, useState } from "react";
import { thanosService, ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { showToast } from "@/lib/utils/toast";
import { Loader } from "lucide-react";

interface StackDetailProps {
  id: string;
}

export function StackDetail({ id }: StackDetailProps) {
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
        const errorMessage = "Failed to fetch stack details";
        setError(errorMessage);
        showToast.error(errorMessage);
        console.error("Error fetching stack:", err);
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
        <p className="text-red-600 font-medium">{error || "Stack not found"}</p>
        <p className="text-red-500 mt-2">
          Please try refreshing the page or check if the stack ID is correct.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{stack.config.chainName}</h1>
        <StatusBadge status={stack.status as Status} />
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Network</p>
              <p className="font-medium">{stack.network}</p>
            </div>
            <div>
              <p className="text-gray-600">Deployment Path</p>
              <p className="font-medium">{stack.deployment_path}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">L1 RPC URL</p>
              <p className="font-medium">{stack.config.l1RpcUrl}</p>
            </div>
            <div>
              <p className="text-gray-600">L1 Beacon URL</p>
              <p className="font-medium">{stack.config.l1BeaconUrl}</p>
            </div>
            <div>
              <p className="text-gray-600">AWS Region</p>
              <p className="font-medium">{stack.config.awsRegion}</p>
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
          <h2 className="text-xl font-semibold mb-4">Accounts</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Admin Account</p>
              <p className="font-medium break-all">
                {stack.config.adminAccount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Proposer Account</p>
              <p className="font-medium break-all">
                {stack.config.proposerAccount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Batcher Account</p>
              <p className="font-medium break-all">
                {stack.config.batcherAccount}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sequencer Account</p>
              <p className="font-medium break-all">
                {stack.config.sequencerAccount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
