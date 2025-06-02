import { env } from "next-runtime-env";

export const API_BASE_URL =
  env("NEXT_PUBLIC_API_URL") || "http://localhost:8000";

export const API_ENDPOINTS = {
  THANOS_STACKS: "/api/v1/stacks/thanos",
} as const;
