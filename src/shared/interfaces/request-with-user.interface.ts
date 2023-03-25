import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    username: string;
    id: string;
    tempPassword: string;
  };
}
