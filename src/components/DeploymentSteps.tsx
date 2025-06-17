import { ThanosDeployment } from "@/lib/services/thanos-service";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface DeploymentStepsProps {
  deployments: ThanosDeployment[];
}

const stepLabels = {
  1: "L1 Smartcontract Deployment",
  2: "Thanos Infra Deployment",
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "Failed":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

export function DeploymentSteps({ deployments }: DeploymentStepsProps) {
  // Create a map of step to deployment for easy lookup
  const deploymentMap = deployments.reduce((acc, deployment) => {
    acc[deployment.step] = deployment;
    return acc;
  }, {} as Record<number, ThanosDeployment>);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Deployment Steps</h2>
      <div className="space-y-4">
        {Object.entries(stepLabels).map(([step, label]) => {
          const deployment = deploymentMap[parseInt(step)];
          const status = deployment?.status || "Pending";

          return (
            <div
              key={step}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <StatusIcon status={status} />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-gray-500">Status: {status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
