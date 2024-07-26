/** 判断对象上指定的key是否存在 */
export function hasKey<O extends object>(
  obj: O,
  key: keyof any,
): key is keyof O {
  return Object.hasOwn(obj, key);
}

/** 判断对象上指定的多个key是否存在 */
export function hasKeys<O extends object>(
  obj: O,
  keys: Array<keyof any>,
): keys is Array<keyof O> {
  return keys.every((key) => hasKey(obj, key));
}
