export type Status =
  | "Pending"
  | "Deployed"
  | "Deploying"
  | "Updating"
  | "Terminating"
  | "Terminated"
  | "FailedToDeploy"
  | "FailedToUpdate"
  | "FailedToTerminate"
  | "Unknown";

export type DeploymentStatus =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Stopped"
  | "Completed"
  | "Unknown";
