import { ServiceResult } from '../declarations';

export const makeResult = (type: string, detail: any): ServiceResult => {
  return { type, ok: true, detail };
};

export const makeError = (
  type: string,
  code: number,
  message: string,
  detail?: any
): ServiceResult => {
  return { type, ok: false, error: { code, message }, detail };
};
