import { useState } from "react";
import { Info } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "./ui/FormInput";
import { ConfirmModal } from "./ui/ConfirmModal";

interface MonitoringPluginFormProps {
  onSubmit: (formData: MonitoringFormData) => Promise<void>;
  isLoading: boolean;
}

export interface MonitoringFormData {
  grafanaPassword: string;
}

export function MonitoringPluginForm({
  onSubmit,
  isLoading,
}: MonitoringPluginFormProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<MonitoringFormData | null>(null);

  const methods = useForm<MonitoringFormData>({
    defaultValues: {
      grafanaPassword: "",
    },
  });

  const handleSubmit = async (data: MonitoringFormData) => {
    setFormDataToSubmit(data);
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
                  Monitoring Plugin Configuration
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Configure the monitoring plugin with Grafana credentials. This
                  will set up monitoring and alerting for your stack.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Grafana Configuration
              </h3>
              <div className="grid gap-4">
                <FormInput
                  name="grafanaPassword"
                  label="Grafana Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  tooltip="Password for Grafana admin user"
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
              Install Monitoring
            </button>
          </div>
        </form>
      </FormProvider>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmInstall}
        title="Install Monitoring Plugin"
        message="Are you sure you want to install the Monitoring plugin with the provided configuration? This action cannot be undone."
        confirmText="Install"
        isLoading={isLoading}
      />
    </>
  );
}
