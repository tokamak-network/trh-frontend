import { useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "./ui/FormInput";
import { ConfirmModal } from "./ui/ConfirmModal";

interface ExplorerPluginFormProps {
  onSubmit: (formData: ExplorerFormData) => Promise<void>;
  isLoading: boolean;
}

export interface ExplorerFormData {
  dbUsername: string;
  dbPassword: string;
  coinMarketCapKey: string;
  walletConnectId: string;
}

export function ExplorerPluginForm({
  onSubmit,
  isLoading,
}: ExplorerPluginFormProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<ExplorerFormData | null>(null);

  const methods = useForm<ExplorerFormData>({
    defaultValues: {
      dbUsername: "",
      dbPassword: "",
      coinMarketCapKey: "",
      walletConnectId: "",
    },
  });

  const handleSubmit = async (data: ExplorerFormData) => {
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
                  Explorer Plugin Configuration
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Please provide the required credentials and API keys to set up
                  your block explorer. Make sure to keep these credentials
                  secure.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Database Credentials Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Database Credentials
              </h3>
              <div className="grid gap-4">
                <FormInput
                  name="dbUsername"
                  label="Database Username"
                  placeholder="e.g. victor_thanos_db"
                  required
                  tooltip="Used for storing chain data"
                />

                <FormInput
                  name="dbPassword"
                  label="Database Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  tooltip="Secure password for database access"
                />
              </div>
            </div>

            {/* API Keys Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                API Keys
              </h3>
              <div className="grid gap-4">
                <div>
                  <FormInput
                    name="coinMarketCapKey"
                    label="CoinMarketCap API Key"
                    placeholder="e.g. c291ce7b-60f0-4e63-8908-e07b04e900b4"
                    required
                    tooltip="Required for price data integration"
                  />
                  <div className="mt-1 flex items-center">
                    <Link
                      href="https://coinmarketcap.com/api/"
                      target="_blank"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Get API Key
                    </Link>
                  </div>
                </div>

                <div>
                  <FormInput
                    name="walletConnectId"
                    label="WalletConnect Project ID"
                    placeholder="e.g. 881053b0dbae8bdf9ba4b67cf6ef9e70"
                    required
                    tooltip="Required for wallet integration"
                  />
                  <div className="mt-1 flex items-center">
                    <Link
                      href="https://cloud.walletconnect.com/"
                      target="_blank"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Get Project ID
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Install Explorer
            </button>
          </div>
        </form>
      </FormProvider>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmInstall}
        title="Install Explorer Plugin"
        message="Are you sure you want to install the Explorer plugin with the provided configuration? This action cannot be undone."
        confirmText="Install"
        isLoading={isLoading}
      />
    </>
  );
}
