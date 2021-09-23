import { HookContext, Service } from '@feathersjs/feathers';
import { GeneralError } from '@feathersjs/errors';

export const emit = (
  service: Service<any>,
  event: any,
  context: HookContext,
) => {
  if (!event) return;

  const { type, ok, detail, error } = event;

  service.emit(
    ok ? type : 'error',
    ok ? { type, ...detail, context } : { type, ...error, context },
  );
};

export const transmit = (context: HookContext) => {
  const { service, result } = context;
  [].concat(result).forEach(event => emit(service, event, context));
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