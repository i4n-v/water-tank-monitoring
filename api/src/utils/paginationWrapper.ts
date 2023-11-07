interface IWrapper<T> {
  totalPages?: number;
  totalItems?: number;
  current?: number;
  limit?: number;
  items?: T[];
}

interface IFindAndCountAllObject<T> {
  count: number;
  rows: T[];
}

function paginationWrapper<T>(
  findAndCountAllObject: IFindAndCountAllObject<T>,
  page: number,
  limit: number
) {
  const wrapper: IWrapper<T> = {};
  const count = Number(findAndCountAllObject.count);

  wrapper.totalPages = Math.ceil(count / limit);
  wrapper.totalItems = count;
  wrapper.current = page;
  wrapper.limit = limit;
  wrapper.items = findAndCountAllObject.rows;

  return wrapper;
}

export default paginationWrapper;
