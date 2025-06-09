import { ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";

interface StackInformationProps {
  stack: ThanosStack;
}

export function StackInformation({ stack }: StackInformationProps) {
  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{stack.config.chainName}</h1>
          <p className="text-gray-600 mt-1">Stack Details</p>
        </div>
        <StatusBadge status={stack.status as Status} />
      </div>

      {/* Status Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Status Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Network</p>
            <p className="font-medium">{stack.network}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <StatusBadge status={stack.status as Status} />
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Metadata</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-gray-600">L2 RPC URL</p>
            <p className="font-medium break-all">
              <a
                href={stack.metadata.l2_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {stack.metadata.l2_url}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
