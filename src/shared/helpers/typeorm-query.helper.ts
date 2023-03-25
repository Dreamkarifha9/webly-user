import _ from 'lodash';
import { ILike } from 'typeorm';
import { EDateFilter } from '../enums/date-filter.enum';
import { EMonthFilter } from '../enums/month-filter.enum';
import { IHash } from '../interfaces/ihash.interface';

export const getCommonQueryForBuilder = (
  table: string,
  deleted: boolean,
  active: boolean
) => {
  const _queries = [`${table}.deleted = :deleted`] as string[];
  const commonParams: IHash<any> = {
    deleted,
  };

  if (active !== null && active !== undefined) {
    _queries.push(`${table}.active = :active`);
    commonParams['active'] = active;
  }
  let commonQueries = _queries.join(' AND ');
  commonQueries = `(${commonQueries})`;
  return { commonQueries, commonParams };
};

export const createOrQueriesForBuilder = (search: string, fields: string[]) => {
  let querySql = null;
  let params = {};
  if (search) {
    const queries = _.map(fields, (field) => {
      return `${field}::text  ILIKE :query`;
    });
    params = {
      query: `%${search}%`,
    };
    querySql = queries.join(' OR ');
    querySql = `(${querySql})`;
  }
  return { querySql, params };
};

export const createOrQueriesForBuilderId = (
  search: string,
  fields: string[],
  searchId: string,
  fieldsId: string[]
) => {
  let querySql = null;
  let params = {};
  let queryIdSql = null;
  let paramsId = {};

  if (search) {
    const queries = _.map(fields, (field) => {
      return `${field}::text ILIKE :query `;
    });
    params = {
      query: `%${search}%`,
    };
    querySql = queries.join(' OR ');
    querySql = `(${querySql})`;
  }
  if (searchId) {
    const queries = _.map(fieldsId, (field) => {
      return `${field} = :queryId`;
    });
    paramsId = {
      queryId: searchId,
    };
    queryIdSql = queries.join(' OR ');
    queryIdSql = `(${queryIdSql})`;
  }
  return { querySql, params, queryIdSql, paramsId };
};

export const createFilterParamsForBuilder = (params: any) => {
  const fields = Object.keys(params);
  const filterSql = _.chain(fields)
    .map((field) => `"${field}"::text ILIKE :${field}`)
    .join(' AND ')
    .value();
  const filterParams = _.transform(params, (r, v, k) => {
    r[k] = `%${v}%`;
  });
  return { filterSql, filterParams };
};

export const createExactMatchFilterParamsForBuilder = (params: any) => {
  const fields = Object.keys(params);
  let filterSql = null;
  let filterParams = null;
  filterSql = _.chain(fields)
    .filter((e) => {
      return e !== null && e !== undefined;
    })
    .map((field) => `"${field}"::text = :${field}`)
    .join(' AND ')
    .value();
  filterParams = _.transform(params, (r, v, k) => {
    r[k] = `${v}`;
  });
  return { filterSql, filterParams };
};

export const createOrQueries = (query: string, fields, commonQuery) => {
  return _.map(fields, (field) => {
    const _q = {};
    _q[field] = ILike(`%${query}%`);
    return { ...commonQuery, ...(query && { ..._q }) };
  });
};

export const createOrderForBuilder = (
  table: string,
  sortBy: string,
  orderBy: string
) => {
  sortBy = sortBy || 'createdAt';
  orderBy = orderBy || 'DESC';
  let _order = {};
  _order[`${table}.${sortBy}`] = orderBy;
  if (sortBy.indexOf(',') !== -1) {
    const fields = sortBy.split(',');
    _order = {};
    _.each(fields, (field) => {
      _order[`${table}.${field}`] = orderBy;
    });
  }

  return _order;
};

export const createOrder = (sortBy: string, orderBy: string) => {
  orderBy = orderBy || 'DESC';
  sortBy = sortBy || 'createdAt';
  const _order = {};
  _order[sortBy] = orderBy;
  return _order;
};

export const calculatePaging = (page: number, size: number) => {
  page = page || 1;
  size = size || 10;
  const limit = size;
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const createLastXDateFilter = (
  field: string,
  dateFilter: EDateFilter
) => {
  let interval = '1 DAY';
  switch (dateFilter) {
    case EDateFilter.LASTWEEK:
      interval = '7 DAYS';
      break;
    case EDateFilter.LASTMONTH:
      interval = '1 MONTH';
      break;
    case EDateFilter.LAST3MONTH:
      interval = '3 MONTHS';
      break;
  }

  return `${field} BETWEEN NOW() - INTERVAL '${interval}' AND NOW()`;
};

export const createMonthlyFilter = (
  field: string,
  selectedYear: string,
  selectedMonth: EMonthFilter
) => {
  const dateFrom = `date_trunc('month', TO_TIMESTAMP('${selectedYear}-${selectedMonth}', 'yyyy-MON'))`;
  const dateTo = `date_trunc('month', TO_TIMESTAMP('${selectedYear}-${selectedMonth}', 'yyyy-MON')) + INTERVAL '1 MONTH - 1 DAY'`;

  return `${field} BETWEEN ${dateFrom} AND ${dateTo}`;
};
