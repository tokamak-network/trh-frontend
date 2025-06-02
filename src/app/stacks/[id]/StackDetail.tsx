"use client";

import { useEffect, useState } from "react";
import { thanosService, ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";

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
        const data = await thanosService.getThanosStack(id);
        setStack(data);
      } catch (err) {
        setError("Failed to fetch stack details");
        console.error("Error fetching stack:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStack();
  }, [id]);

  if (loading) {
    return <div>Loading stack details...</div>;
  }

  if (error || !stack) {
    return <div className="text-red-500">{error || "Stack not found"}</div>;
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
