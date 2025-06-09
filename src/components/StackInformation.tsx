import { ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";

interface StackInformationProps {
  stack: ThanosStack;
}

export function StackInformation({ stack }: StackInformationProps) {
  return (
    <section>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{stack.config.chainName}</h1>
          <p className="text-gray-600 mt-1">Stack Details</p>
        </div>
        <StatusBadge status={stack.status as Status} />
      </div>

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
  );
}
