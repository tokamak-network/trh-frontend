import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface ThanosStackConfig {
  network: string;
  l1RpcUrl: string;
  awsRegion: string;
  chainName: string;
  l1BeaconUrl: string;
  l2BlockTime: number;
  adminAccount: string;
  awsAccessKey: string;
  batcherAccount: string;
  deploymentPath: string;
  challengePeriod: number;
  proposerAccount: string;
  sequencerAccount: string;
  awsSecretAccessKey: string;
  outputRootFrequency: number;
  batchSubmissionFrequency: number;
}

export interface ThanosStack {
  id: string;
  name: string;
  network: string;
  config: ThanosStackConfig;
  deployment_path: string;
  status: string;
}

export interface GetAllThanosStacksResponse {
  stacks: ThanosStack[];
}

export interface GetThanosStackResponse {
  stack: ThanosStack;
}

export interface CreateStackRequest {
  network: string;
  l1RpcUrl: string;
  l1BeaconUrl: string;
  l2BlockTime: number;
  batchSubmissionFrequency: number;
  outputRootFrequency: number;
  challengePeriod: number;
  adminAccount: string;
  sequencerAccount: string;
  batcherAccount: string;
  proposerAccount: string;
  awsAccessKey: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  chainName: string;
  deploymentPath?: string;
}

export interface CreateStackResponse {
  stack: ThanosStack;
}

export const thanosService = {
  /**
   * Fetches all Thanos stacks from the API
   * @returns Promise<ThanosStack[]>
   */
  getThanosStacks: async (): Promise<ThanosStack[]> => {
    const response = await apiClient.get<GetAllThanosStacksResponse>(
      API_ENDPOINTS.THANOS_STACKS
    );
    return response.data.stacks;
  },

  /**
   * Fetches a single Thanos stack by ID
   * @param id The ID of the stack to fetch
   * @returns Promise<ThanosStack>
   */
  getThanosStack: async (id: string): Promise<ThanosStack> => {
    const response = await apiClient.get<GetThanosStackResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${id}`
    );
    return response.data.stack;
  },

  /**
   * Creates a new Thanos stack
   * @param data The stack configuration data
   * @returns Promise<ThanosStack>
   */
  createStack: async (data: CreateStackRequest): Promise<ThanosStack> => {
    const response = await apiClient.post<CreateStackResponse>(
      API_ENDPOINTS.THANOS_STACKS,
      data
    );
    return response.data.stack;
  },
};
