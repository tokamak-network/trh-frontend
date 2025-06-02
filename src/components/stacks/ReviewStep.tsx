import { useFormContext } from "react-hook-form";
import { useState } from "react";

interface ReviewSectionProps {
  title: string;
  fields: { key: string; label: string; type?: "password" }[];
}

function ReviewSection({ title, fields }: ReviewSectionProps) {
  const { watch } = useFormContext();
  const values = watch();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {fields.map(({ key, label, type }) => (
          <div key={key} className="flex flex-col">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-medium break-all">
              {type === "password" ? "••••••••" : values[key] || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewStep() {
  const [isDeploying, setIsDeploying] = useState(false);
  const { handleSubmit } = useFormContext();

  const onDeploy = async (data: any) => {
    try {
      setIsDeploying(true);
      // Your deployment logic here
      console.log("Deploying stack with data:", data);
    } catch (error) {
      console.error("Deployment failed:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Review Configuration</h2>

      <ReviewSection
        title="Network Configuration"
        fields={[
          { key: "network", label: "Network" },
          { key: "chainName", label: "Chain Name" },
        ]}
      />

      <ReviewSection
        title="L2 Configuration"
        fields={[
          { key: "l1RpcUrl", label: "L1 RPC URL" },
          { key: "l1BeaconUrl", label: "L1 Beacon URL" },
          { key: "l2BlockTime", label: "L2 Block Time" },
          {
            key: "batchSubmissionFrequency",
            label: "Batch Submission Frequency",
          },
          { key: "outputRootFrequency", label: "Output Root Frequency" },
          { key: "challengePeriod", label: "Challenge Period" },
        ]}
      />

      <ReviewSection
        title="Account Configuration"
        fields={[
          { key: "adminAccount", label: "Admin Account" },
          { key: "proposerAccount", label: "Proposer Account" },
          { key: "batcherAccount", label: "Batcher Account" },
          { key: "sequencerAccount", label: "Sequencer Account" },
        ]}
      />

      <ReviewSection
        title="AWS Configuration"
        fields={[
          { key: "awsRegion", label: "AWS Region" },
          { key: "awsAccessKey", label: "AWS Access Key" },
          {
            key: "awsSecretAccessKey",
            label: "AWS Secret Access Key",
            type: "password",
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Please review all configuration carefully before deploying. Once
            deployed, some settings cannot be changed without redeploying the
            stack.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit(onDeploy)}
            disabled={isDeploying}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
          >
            {isDeploying ? "Deploying..." : "Deploy Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
