export const makeResult = (type: string, detail: any) => {
  return { type, ok: true, detail };
};

export const makeError = (type: string, code: number, message: string, detail?: any) => {
  return { type, ok: false, error: { code, message }, detail };
};
