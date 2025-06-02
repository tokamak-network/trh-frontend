import { Status, DeploymentStatus } from "@/lib/types/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status | DeploymentStatus;
  className?: string;
}

const getStatusColor = (status: Status | DeploymentStatus): string => {
  // Success states
  if (["Deployed", "Completed"].includes(status)) {
    return "bg-green-100 text-green-800";
  }

  // In-progress states
  if (["Pending", "Deploying", "Updating", "InProgress"].includes(status)) {
    return "bg-blue-100 text-blue-800";
  }

  // Warning states
  if (["Terminating", "Stopped"].includes(status)) {
    return "bg-yellow-100 text-yellow-800";
  }

  // Error states
  if (
    [
      "FailedToDeploy",
      "FailedToUpdate",
      "FailedToTerminate",
      "Failed",
    ].includes(status)
  ) {
    return "bg-red-100 text-red-800";
  }

  // Unknown/default state
  return "bg-gray-100 text-gray-800";
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
}
