import { ResourcesConfig } from "aws-amplify";

export const AWS_REGION = import.meta.env.VITE_AWS_REGION;
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const AWS_CONFIG: ResourcesConfig = {
  Auth: {
    Cognito: {
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
      allowGuestAccess: true,
    },
  },
};
