import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./ui/FormInput";
import { Info } from "lucide-react";

const updateStackSchema = z.object({
  l1RpcUrl: z.string().url("Please enter a valid L1 RPC URL"),
  l1BeaconUrl: z.string().url("Please enter a valid L1 Beacon URL"),
});

export type UpdateStackFormData = z.infer<typeof updateStackSchema>;

interface UpdateStackFormProps {
  onSubmit: (formData: UpdateStackFormData) => Promise<void>;
  isLoading: boolean;
  currentL1RpcUrl?: string;
  currentL1BeaconUrl?: string;
}

export function UpdateStackForm({
  onSubmit,
  isLoading,
  currentL1RpcUrl,
  currentL1BeaconUrl,
}: UpdateStackFormProps) {
  const methods = useForm<UpdateStackFormData>({
    resolver: zodResolver(updateStackSchema),
    defaultValues: {
      l1RpcUrl: currentL1RpcUrl || "",
      l1BeaconUrl: currentL1BeaconUrl || "",
    },
  });

  const handleSubmit = async (data: UpdateStackFormData) => {
    await onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Update Stack Configuration
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Update the L1 RPC URL and L1 Beacon URL for your stack. These
                changes will be applied to your active stack.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <FormInput
            name="l1RpcUrl"
            label="L1 RPC URL"
            placeholder="https://your-l1-rpc-endpoint.com"
            required
            tooltip="The RPC endpoint for the L1 blockchain"
          />

          <FormInput
            name="l1BeaconUrl"
            label="L1 Beacon URL"
            placeholder="https://your-l1-beacon-endpoint.com"
            required
            tooltip="The beacon endpoint for the L1 blockchain"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Stack"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
