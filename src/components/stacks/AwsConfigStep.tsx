import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { Eye, EyeOff } from "lucide-react";

export function AwsConfigStep() {
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">AWS Configuration</h2>
      <div className="grid gap-6">
        <FormInput
          name="awsRegion"
          label="AWS Region"
          required
          defaultValue="ap-northeast-1"
          placeholder="e.g., ap-northeast-1"
          tooltip="The AWS region where resources will be deployed"
        />

        <FormInput
          name="awsAccessKey"
          label="AWS Access Key"
          required
          tooltip="Your AWS access key ID"
        />

        <div className="relative">
          <FormInput
            name="awsSecretAccessKey"
            label="AWS Secret Access Key"
            type={showSecretKey ? "text" : "password"}
            required
            tooltip="Your AWS secret access key"
          />
          <button
            type="button"
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showSecretKey ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
