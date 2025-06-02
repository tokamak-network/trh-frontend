import { FormInput } from "@/components/ui/FormInput";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export function ConfigurationStep() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { setValue } = useFormContext();

  const handleAdvancedToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAdvanced(e.target.checked);
    if (!e.target.checked) {
      // Reset to default values when disabling advanced mode
      setValue("l2BlockTime", "2");
      setValue("batchSubmissionFrequency", "1440");
      setValue("outputRootFrequency", "240");
      setValue("challengePeriod", "12");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">L2 Configuration</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            name="l1RpcUrl"
            label="L1 RPC URL"
            type="url"
            required
            placeholder="https://..."
            tooltip="The RPC endpoint for the L1 network"
          />

          <FormInput
            name="l1BeaconUrl"
            label="L1 Beacon URL"
            type="url"
            required
            placeholder="https://..."
            tooltip="The beacon endpoint for the L1 network"
          />
        </div>

        <div className="border-t pt-6">
          <label className="flex items-center space-x-2 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={handleAdvancedToggle}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Would you like to perform advanced configurations?
            </span>
          </label>

          {showAdvanced ? (
            <div className="grid grid-cols-2 gap-6">
              <FormInput
                name="l2BlockTime"
                label="L2 Block Time"
                type="number"
                required
                min={1}
                tooltip="Block time in seconds for the L2 network. Default: 2 seconds"
              />

              <FormInput
                name="batchSubmissionFrequency"
                label="Batch Submission Frequency"
                type="number"
                required
                min={12}
                step={12}
                tooltip="How often batches should be submitted (in L1 blocks). Default: 120 blocks ≈ 1440 seconds. Must be a multiple of 12"
              />

              <FormInput
                name="outputRootFrequency"
                label="Output Root Frequency"
                type="number"
                required
                min={2}
                step={2}
                tooltip="How often output roots should be generated (in L2 blocks). Default: 120 blocks ≈ 240 seconds. Must be a multiple of 2"
              />

              <FormInput
                name="challengePeriod"
                label="Challenge Period"
                type="number"
                required
                min={1}
                tooltip="The period during which outputs can be challenged (in seconds). Default: 12 seconds"
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Using default values:</p>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• L2 Block Time: 2 seconds</li>
                <li>
                  • Batch Submission Frequency: 1440 seconds (120 L1 blocks)
                </li>
                <li>• Output Root Frequency: 240 seconds (120 L2 blocks)</li>
                <li>• Challenge Period: 12 seconds</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
