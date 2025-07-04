import { useState } from "react";
import { Info } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "./ui/FormInput";
import { ConfirmModal } from "./ui/ConfirmModal";

interface CandidateRegistryPluginFormProps {
  onSubmit: (formData: CandidateRegistryFormData) => Promise<void>;
  isLoading: boolean;
}

export interface CandidateRegistryFormData {
  amount: number;
  memo: string;
  nameInfo: string;
}

export function CandidateRegistryPluginForm({
  onSubmit,
  isLoading,
}: CandidateRegistryPluginFormProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<CandidateRegistryFormData | null>(null);

  const methods = useForm<CandidateRegistryFormData>({
    defaultValues: {
      amount: 0,
      memo: "",
      nameInfo: "",
    },
  });

  const handleSubmit = async (data: CandidateRegistryFormData) => {
    // Convert amount from string to number
    const formData: CandidateRegistryFormData = {
      ...data,
      amount: parseFloat(String(data.amount)) || 0,
    };
    setFormDataToSubmit(formData);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmInstall = async () => {
    if (formDataToSubmit) {
      await onSubmit(formDataToSubmit);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  DAO Candidate Registration Configuration
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Configure the DAO candidate registration plugin with the
                  required information for candidate registration.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Registration Details
              </h3>
              <div className="grid gap-4">
                <FormInput
                  name="amount"
                  label="Amount"
                  type="number"
                  placeholder="e.g. 1000.1"
                  required
                  min={0}
                  step={0.1}
                  tooltip="Registration amount in tokens"
                />

                <FormInput
                  name="memo"
                  label="Memo"
                  placeholder="Enter memo"
                  required
                  tooltip="Additional information or memo for the registration"
                />

                <FormInput
                  name="nameInfo"
                  label="Name Information"
                  placeholder="Enter name information"
                  required
                  tooltip="Name or identifier information for the candidate"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Install Candidate Registry
            </button>
          </div>
        </form>
      </FormProvider>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmInstall}
        title="Install Candidate Registry Plugin"
        message="Are you sure you want to install the Candidate Registry plugin with the provided configuration? This action cannot be undone."
        confirmText="Install"
        isLoading={isLoading}
      />
    </>
  );
}
