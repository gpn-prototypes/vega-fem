import { config } from '@/config.public';
import { serviceConfig } from '@/helpers/sevice-config';

type AuthHeader = {
  Authorization: string;
};

export const authHeader = (): AuthHeader => {
  const token = serviceConfig.identityToken || config.authToken;

  return { Authorization: `Bearer ${token}` };
};
