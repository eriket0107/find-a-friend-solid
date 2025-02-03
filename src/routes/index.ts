import { app } from '@/app';
import { organizationRoutes } from './organization.route';

export const routes = () => {
  app.register(organizationRoutes);
};