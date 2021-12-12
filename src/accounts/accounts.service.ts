import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmptyResultError } from 'sequelize';
import { Op } from 'sequelize';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
  ) { }

  create(createAccountDto: CreateAccountDto) {
    return this.accountModel.create(createAccountDto);
  }

  findAll() {
    return this.accountModel.findAll();
  }

  findOne(idOrToken: string) {
    return this.accountModel.findOne({
      where: {
        [Op.or]: {
          id: idOrToken,
          token: idOrToken,
        },
      },
      rejectOnEmpty: new EmptyResultError(
        `Account with ID/token ${idOrToken} not found!`,
      ),
    });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const order = await this.findOne(id);
    return order.update(updateAccountDto);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return order.destroy();
  }
}
