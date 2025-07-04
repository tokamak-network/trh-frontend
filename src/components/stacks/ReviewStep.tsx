import { useFormContext } from "react-hook-form";

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
        {fields.map(({ key, label, type }) => {
          const value = values[key];
          let displayValue = value || "-";

          if (typeof value === "boolean") {
            displayValue = value ? "Yes" : "No";
          } else if (type === "password") {
            displayValue = "••••••••";
          }

          return (
            <div key={key} className="flex flex-col">
              <p className="text-sm text-gray-600">{label}</p>
              <p className="font-medium break-all">{displayValue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewStep() {
  const { watch } = useFormContext();
  const values = watch();
  const registerCandidate = values.registerCandidate;

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

      <ReviewSection
        title="Candidate Registry Plugin"
        fields={[
          { key: "registerCandidate", label: "Install Candidate Registry" },
          ...(registerCandidate
            ? [
                { key: "candidateAmount", label: "Registration Amount" },
                { key: "candidateMemo", label: "Memo" },
                { key: "candidateNameInfo", label: "Name Information" },
              ]
            : []),
        ]}
      />

      <div className="mt-8">
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            Please review all configuration carefully before deploying. Once
            deployed, some settings cannot be changed without redeploying the
            stack.
          </p>
        </div>
      </div>
    </section>
  );
}
