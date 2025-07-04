import { z } from "zod";

const networkStepSchema = z.object({
  network: z.enum(["Mainnet", "Testnet"]),
  chainName: z.string().min(1, "Chain name is required"),
});

const configurationStepSchema = z.object({
  l1RpcUrl: z.string().url("Must be a valid URL"),
  l1BeaconUrl: z.string().url("Must be a valid URL"),
  l2BlockTime: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine((val) => parseInt(val) > 0, "Must be greater than 0"),
  batchSubmissionFrequency: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine((val) => parseInt(val) > 0, "Must be greater than 0")
    .refine((val) => parseInt(val) % 12 === 0, "Must be a multiple of 12"),
  outputRootFrequency: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine((val) => parseInt(val) > 0, "Must be greater than 0")
    .refine((val) => parseInt(val) % 2 === 0, "Must be a multiple of 2"),
  challengePeriod: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine((val) => parseInt(val) > 0, "Must be greater than 0"),
});

const accountsStepSchema = z.object({
  adminAccount: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  proposerAccount: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  batcherAccount: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  sequencerAccount: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

const awsStepSchema = z.object({
  awsRegion: z.string().min(1),
  awsAccessKey: z.string().min(1),
  awsSecretAccessKey: z.string().min(1),
  deploymentPath: z.string().optional(),
});

const candidateRegistryStepSchema = z
  .object({
    registerCandidate: z.boolean(),
    candidateAmount: z.string().optional(),
    candidateMemo: z.string().optional(),
    candidateNameInfo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.registerCandidate) {
        return (
          data.candidateAmount && data.candidateMemo && data.candidateNameInfo
        );
      }
      return true;
    },
    {
      message:
        "All candidate registry fields are required when registering candidate",
      path: ["candidateAmount"],
    }
  );

export const stepSchemas = {
  network: networkStepSchema,
  configuration: configurationStepSchema,
  accounts: accountsStepSchema,
  aws: awsStepSchema,
  candidateRegistry: candidateRegistryStepSchema,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateStep(step: keyof typeof stepSchemas, data: any) {
  try {
    stepSchemas[step].parse(data);
    return true;
  } catch {
    return false;
  }
}
