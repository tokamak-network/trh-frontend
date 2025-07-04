"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { thanosService } from "@/lib/services/thanos-service";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NetworkStep } from "@/components/stacks/NetworkStep";
import { ConfigurationStep } from "@/components/stacks/ConfigurationStep";
import { AccountsStep } from "@/components/stacks/AccountsStep";
import { AwsConfigStep } from "@/components/stacks/AwsConfigStep";
import { CandidateRegistryStep } from "@/components/stacks/CandidateRegistryStep";
import { ReviewStep } from "@/components/stacks/ReviewStep";
import { stepSchemas, validateStep } from "@/lib/validation/stack-validation";
import { showToast } from "@/lib/utils/toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const formSchema = z.object({
  network: z.enum(["Mainnet", "Testnet"]),
  chainName: z
    .string()
    .min(1, "Chain name is required")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9 ]*$/,
      "Chain name must start with a letter and can only contain letters, numbers and spaces"
    ),
  l1RpcUrl: z.string().url("Must be a valid URL"),
  l1BeaconUrl: z.string().url("Must be a valid URL"),
  l2BlockTime: z.string().regex(/^\d+$/, "Must be a number"),
  batchSubmissionFrequency: z.string().regex(/^\d+$/, "Must be a number"),
  outputRootFrequency: z.string().regex(/^\d+$/, "Must be a number"),
  challengePeriod: z.string().regex(/^\d+$/, "Must be a number"),
  adminAccount: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
  sequencerAccount: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
  batcherAccount: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
  proposerAccount: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
  adminPrivateKey: z.string(),
  sequencerPrivateKey: z.string(),
  batcherPrivateKey: z.string(),
  proposerPrivateKey: z.string(),
  awsAccessKey: z.string().min(1, "AWS Access Key is required"),
  awsSecretAccessKey: z.string().min(1, "AWS Secret Access Key is required"),
  awsRegion: z.string().min(1, "AWS Region is required"),
  deploymentPath: z.string().optional(),
  registerCandidate: z.boolean(),
  candidateAmount: z.string().optional(),
  candidateMemo: z.string().optional(),
  candidateNameInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: "network", title: "Network & Chain" },
  { id: "configuration", title: "Configuration" },
  { id: "accounts", title: "Accounts" },
  { id: "aws", title: "AWS Configuration" },
  { id: "candidateRegistry", title: "Candidate Registry" },
  { id: "review", title: "Review" },
] as const;

export default function CreateStackPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(
    null
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      network: "Testnet",
      chainName: "",
      l2BlockTime: "2",
      batchSubmissionFrequency: "1440",
      outputRootFrequency: "240",
      challengePeriod: "12",
      registerCandidate: true,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    setFormDataToSubmit(data);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeploy = async () => {
    if (!formDataToSubmit) return;

    try {
      setIsDeploying(true);
      const request = {
        network: formDataToSubmit.network.toLowerCase(),
        chainName: formDataToSubmit.chainName,
        l1RpcUrl: formDataToSubmit.l1RpcUrl,
        l1BeaconUrl: formDataToSubmit.l1BeaconUrl,
        l2BlockTime: parseInt(formDataToSubmit.l2BlockTime),
        batchSubmissionFrequency: parseInt(
          formDataToSubmit.batchSubmissionFrequency
        ),
        outputRootFrequency: parseInt(formDataToSubmit.outputRootFrequency),
        challengePeriod: parseInt(formDataToSubmit.challengePeriod),
        adminAccount: formDataToSubmit.adminPrivateKey.replace("0x", ""),
        sequencerAccount: formDataToSubmit.sequencerPrivateKey.replace(
          "0x",
          ""
        ),
        batcherAccount: formDataToSubmit.batcherPrivateKey.replace("0x", ""),
        proposerAccount: formDataToSubmit.proposerPrivateKey.replace("0x", ""),
        awsAccessKey: formDataToSubmit.awsAccessKey,
        awsSecretAccessKey: formDataToSubmit.awsSecretAccessKey,
        awsRegion: formDataToSubmit.awsRegion,
        registerCandidate: formDataToSubmit.registerCandidate,
        ...(formDataToSubmit.registerCandidate && {
          registerCandidateParams: {
            amount: parseFloat(formDataToSubmit.candidateAmount || "0"),
            memo: formDataToSubmit.candidateMemo || "",
            nameInfo: formDataToSubmit.candidateNameInfo || "",
          },
        }),
      };

      await thanosService.createStack(request);
      showToast.success("Stack created successfully!");
      router.push("/home");
    } catch (err) {
      console.error("Error creating stack:", err);
      showToast.error("Failed to create stack. Please try again.");
    } finally {
      setIsDeploying(false);
      setIsConfirmModalOpen(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((current) => current + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    }
  };

  const isStepValid = () => {
    const currentStepId = steps[currentStep].id;
    if (currentStepId === "review") return true;

    const formValues = watch();
    return validateStep(currentStepId as keyof typeof stepSchemas, formValues);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <NetworkStep />;
      case 1:
        return <ConfigurationStep />;
      case 2:
        return <AccountsStep />;
      case 3:
        return <AwsConfigStep />;
      case 4:
        return <CandidateRegistryStep />;
      case 5:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/home"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Deploy New Stack</h1>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`ml-2 text-sm ${
                      index <= currentStep ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        index < currentStep ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-8"
            >
              {renderStep()}

              <div className="flex justify-between">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      Deploy Now
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDeploy}
        title="Deploy Stack"
        message="Are you sure you want to deploy this stack? This action will create resources in your AWS account and cannot be undone."
        confirmText="Deploy"
        isLoading={isDeploying}
      />
    </>
  );
}
