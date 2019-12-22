export const keysToLowerCase = (obj: any) => {
  const newObj = {}
  Object.keys(obj).forEach((key: string) => {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
}

export const valuesToLowerCase = (obj: any) => {
  const newObj = {}
  Object.keys(obj).forEach((key: string) => {
    newObj[key] = obj[key].toLowerCase();
  });
  return newObj;
}
