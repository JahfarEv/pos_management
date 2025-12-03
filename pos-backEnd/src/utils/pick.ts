export const pick = (obj: Record<string, any>, keys: string[]) =>
  keys.reduce<Record<string, any>>((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});
