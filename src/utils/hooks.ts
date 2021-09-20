import { HookContext, Service } from '@feathersjs/feathers';

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
