import { FeathersError, convert } from '@feathersjs/errors';

import { ServiceResult } from '../declarations';

export const makeResult = (
  type: string, detail: any,
): Promise<ServiceResult> => {
  return Promise.resolve({ type, ok: true, detail });
};

export const makeError = (
  type: string,
  code: number,
  message: string,
  data: any = null,
): Promise<FeathersError> => {
  return Promise.reject(convert({ name: code, message, data }));
};

export const toArray = (map: Map<any, any>) => Array.from(map.values());
