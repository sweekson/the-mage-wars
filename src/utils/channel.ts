import { HookContext } from '@feathersjs/feathers';

export const filterReceiver = (channel: string, { app, result }: HookContext) => {
  const receivers: string[] = [].concat(result.receiver).filter(x => !!x);
  const filter = (connection: any) => receivers.includes(connection.user._id);
  return receivers.length ? app.channel(channel).filter(filter) : app.channel(channel);
};
