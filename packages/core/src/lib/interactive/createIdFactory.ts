let idCounter = 0;

export const createIdFactory = (prefix: string) => {
  return (explicitId?: string) => {
    if (explicitId) return explicitId;
    idCounter += 1;
    return `${prefix}-${idCounter}`;
  };
};
