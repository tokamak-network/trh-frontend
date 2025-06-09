import { Status, DeploymentStatus } from "@/lib/types/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status | DeploymentStatus;
  className?: string;
}

const formatStatus = (status: Status | DeploymentStatus): string => {
  if (["Deployed", "Completed"].includes(status)) {
    return "Active";
  }
  return status;
};

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

const getDotColor = (status: Status | DeploymentStatus): string => {
  // Success states
  if (["Deployed", "Completed"].includes(status)) {
    return "bg-green-500";
  }

  // In-progress states
  if (["Pending", "Deploying", "Updating", "InProgress"].includes(status)) {
    return "bg-blue-500";
  }

  // Warning states
  if (["Terminating", "Stopped"].includes(status)) {
    return "bg-yellow-500";
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
    return "bg-red-500";
  }

  // Unknown/default state
  return "bg-gray-500";
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1.5",
        getStatusColor(status),
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", getDotColor(status))} />
      {formatStatus(status)}
    </span>
  );
}
