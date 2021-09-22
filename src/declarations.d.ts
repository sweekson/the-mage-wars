import { Application as ExpressFeathers } from '@feathersjs/express';

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>;

export interface ServiceError {
  code: number;
  message: string;
}

export interface ServiceResult {
  type: string;
  ok: boolean;
  detail?: any;
  error?: ServiceError;
}
