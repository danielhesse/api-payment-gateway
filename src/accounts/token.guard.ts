import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccountStorageService } from './account-storage/account-storage.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private accountsStorage: AccountStorageService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.['x-token'] as string;

    if (token) {
      try {
        await this.accountsStorage.setBy(token);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }

    return false;
  }
}
