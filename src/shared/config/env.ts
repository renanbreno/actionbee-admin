export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
} as const;
