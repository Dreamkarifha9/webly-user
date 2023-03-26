import { CanActivate, ExecutionContext, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
interface IResponseAuth {
  username: string;
  id: string;
  iat: number;
  exp: number;
}
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const isAuthenticated = await this.client
        .send<IResponseAuth, Record<string, string>>('isAuthenticated', {
          jwt: req.headers.authorization?.split(' ')[1], // <token> not bearer
        })
        .pipe(timeout(5000))
        .toPromise();
      this.logger.debug(`isAuthenticated ${JSON.stringify(isAuthenticated)}`);
      if (isAuthenticated && isAuthenticated !== null) {
        req.user = isAuthenticated;

        return true;
      } else {
        return false;
      }
    } catch (err) {
      Logger.error(err);

      console.log('AuthGuard:', err);

      return false;
    }
  }
}
