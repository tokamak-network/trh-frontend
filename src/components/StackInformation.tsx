import { ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { Trash2, RefreshCw, Square, Settings } from "lucide-react";

interface StackInformationProps {
  stack: ThanosStack;
  onDestroyStack: () => void;
  onResumeStack: () => void;
  onStopStack: () => void;
  onUpdateStack: () => void;
  isDestroyingStack: boolean;
  isResumingStack: boolean;
  isStoppingStack: boolean;
  isUpdatingStack: boolean;
}

export function StackInformation({
  stack,
  onDestroyStack,
  onResumeStack,
  onStopStack,
  onUpdateStack,
  isDestroyingStack,
  isResumingStack,
  isStoppingStack,
  isUpdatingStack,
}: StackInformationProps) {
  const canResume =
    stack.status === "Terminated" ||
    stack.status === "FailedToDeploy" ||
    stack.status === "Stopped";
  const isDeployed = stack.status === "Deployed";
  const isTerminating = stack.status === "Terminating";
  const isDeploying = stack.status === "Deploying";
  const isActive = stack.status === "Active";
  const isUpdating = stack.status === "Updating";
  const canUpdate = isActive || isDeployed;

  const renderActionButton = () => {
    if (isDeploying) {
      return (
        <button
          onClick={onStopStack}
          disabled={isStoppingStack}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="w-4 h-4" />
          {isStoppingStack ? "Stopping..." : "Stop Stack"}
        </button>
      );
    }

    if (canResume) {
      return (
        <button
          onClick={onResumeStack}
          disabled={isResumingStack}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${isResumingStack ? "animate-spin" : ""}`}
          />
          {isResumingStack ? "Resuming..." : "Resume Stack"}
        </button>
      );
    }

    if (canUpdate) {
      return (
        <div className="flex gap-2">
          <button
            onClick={onUpdateStack}
            disabled={isUpdatingStack || isUpdating}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings className="w-4 h-4" />
            {isUpdatingStack || isUpdating ? "Updating..." : "Update"}
          </button>
          <button
            onClick={onDestroyStack}
            disabled={
              isDestroyingStack ||
              isTerminating ||
              isUpdatingStack ||
              isUpdating
            }
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDestroyingStack ? "Destroying..." : "Destroy"}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={onDestroyStack}
        disabled={isDestroyingStack || isTerminating}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
        {isDestroyingStack ? "Destroying..." : "Destroy Stack"}
      </button>
    );
  };

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{stack.config.chainName}</h1>
          <p className="text-gray-600 mt-1">Stack Details</p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={stack.status as Status} />
          {renderActionButton()}
        </div>
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
              {stack.metadata ? (
                <a
                  href={stack.metadata.l2_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {stack.metadata.l2_url}
                </a>
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
