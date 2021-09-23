import { HookContext, Service } from '@feathersjs/feathers';
import { GeneralError } from '@feathersjs/errors';

export const emit = async (
  service: Service<any>,
  result: Promise<any>,
  context: HookContext,
) => {
  if (!result) return;
  const { type, detail } = await result;
  service.emit(type, { type, ...detail, context });
};

export const transmit = (context: HookContext) => {
  const { service, result } = context;
  [].concat(result).forEach(result => emit(service, result, context));
};

export const error = (context: HookContext) => {
  const { error } = context;

  if (!error) return context;
  if (!error.code) {
    context.error = new GeneralError('Server error');
    return context;
  }
  if (error.code === 404 || process.env.NODE_ENV === 'production') {
    error.stack = null;
  }
  return context;
};