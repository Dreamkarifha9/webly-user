import { v4 } from 'uuid';

export const random = (): string => {
  return v4().toString().replace(/-+/g, '');
};

export * from './typeorm-query.helper';
