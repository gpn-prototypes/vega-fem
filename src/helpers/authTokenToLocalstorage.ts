import { config } from '@/config.public';
import { serviceConfig } from '@/helpers/service-config';

type AuthHeader = {
  Authorization: string;
};

export const authHeader = (): AuthHeader => {
  const token = serviceConfig.identityToken || config.authToken;

  return { Authorization: `Bearer ${token}` };
};
