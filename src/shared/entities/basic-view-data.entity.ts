import { ViewColumn } from 'typeorm';

export abstract class BasicViewData {
  @ViewColumn()
    active?: boolean;

  @ViewColumn()
    deleted?: boolean;

  @ViewColumn()
    createdAt?: Date;

  @ViewColumn()
    createdBy?: string;

  @ViewColumn()
    updatedAt?: Date;

  @ViewColumn()
    updatedBy?: string;
}
