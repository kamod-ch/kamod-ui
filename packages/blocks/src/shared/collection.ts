export const groupBy = <T, K extends string>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Record<K, T[]> => {
  const groups = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keyOf(item);
    const bucket = groups[key];
    if (bucket) bucket.push(item);
    else groups[key] = [item];
  }
  return groups;
};
