export default function querySerializer(query: any) {
  const exceptionValues = [null, 0, false].filter(
    (value) => (query.nullable === true && value === null) || (!query.nullable && value !== null),
  );
  delete query.nullable;

  const queryParams = new URLSearchParams();

  if (query instanceof Object) {
    const queryEntries = Object.entries(query);

    queryEntries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (exceptionValues.includes(item) || Boolean(item)) {
            queryParams.append(key, String(item));
          }
        });
      } else if (exceptionValues.includes(value as any) || Boolean(value)) {
        queryParams.append(key, String(value));
      }
    });
  }

  return queryParams;
}
