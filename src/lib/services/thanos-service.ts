import { apiClient } from "../api-client";
import { API_ENDPOINTS } from "../api-config";

export interface ApiResponse {
  message: string;
  status: string;
}

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

export interface ThanosStackMetadata {
  l2_url: string;
  bridge_url?: string;
  block_explorer_url?: string;
}

export interface ThanosStack {
  id: string;
  name: string;
  network: string;
  config: ThanosStackConfig;
  deployment_path: string;
  status: string;
  metadata: ThanosStackMetadata;
}

export interface GetAllThanosStacksResponse extends ApiResponse {
  data: {
    stacks: ThanosStack[];
  };
}

export interface GetThanosStackResponse extends ApiResponse {
  data: {
    stack: ThanosStack;
  };
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

export interface CreateStackResponse extends ApiResponse {
  data: {
    stack: ThanosStack;
  };
}

export interface ThanosDeployment {
  id: string;
  stack_id: string;
  step: number;
  status: string;
  log_path: string;
  config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface GetDeploymentsResponse extends ApiResponse {
  data: {
    deployments: ThanosDeployment[];
  };
}

export interface UpdateStackRequest {
  l1RpcUrl: string;
  l1BeaconUrl: string;
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
    return response.data.data.stacks;
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
    return response.data.data.stack;
  },

  /**
   * Creates a new Thanos stack
   * @param data The stack configuration data
   * @returns Promise<ThanosStack>
   */
  createStack: async (data: CreateStackRequest): Promise<ThanosStack> => {
    console.log(data);
    const response = await apiClient.post<CreateStackResponse>(
      API_ENDPOINTS.THANOS_STACKS,
      data
    );
    return response.data.data.stack;
  },

  /**
   * Deletes a Thanos stack by ID
   * @param id The ID of the stack to delete
   * @returns Promise<void>
   */
  deleteStack: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.THANOS_STACKS}/${id}`);
  },

  /**
   * Resumes a terminated Thanos stack by ID
   * @param id The ID of the stack to resume
   * @returns Promise<void>
   */
  resumeStack: async (id: string): Promise<void> => {
    await apiClient.post<CreateStackResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${id}/resume`
    );
  },

  /**
   * Fetches deployments for a Thanos stack by ID
   * @param id The ID of the stack
   * @returns Promise<ThanosDeployment[]>
   */
  getDeployments: async (id: string): Promise<ThanosDeployment[]> => {
    const response = await apiClient.get<GetDeploymentsResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${id}/deployments`
    );
    return response.data.data.deployments;
  },

  /**
   * Stops a deploying stack by ID
   * @param id The ID of the stack to stop
   * @returns Promise<void>
   */
  stopStack: async (id: string): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.THANOS_STACKS}/${id}/stop`);
  },

  /**
   * Updates a Thanos stack by ID
   * @param id The ID of the stack to update
   * @param data The update data containing l1RpcUrl and l1BeaconUrl
   * @returns Promise<ThanosStack>
   */
  updateStack: async (
    id: string,
    data: UpdateStackRequest
  ): Promise<ThanosStack> => {
    const response = await apiClient.put<CreateStackResponse>(
      `${API_ENDPOINTS.THANOS_STACKS}/${id}`,
      data
    );
    return response.data.data.stack;
  },
};
