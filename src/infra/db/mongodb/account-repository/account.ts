import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/update-access-token-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { mongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: result.insertedId });

    return mongoHelper.map<AccountModel>(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne<AccountModel>({ email });

    return account && mongoHelper.map<AccountModel>(account);
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await mongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      { _id: mongoHelper.toId(id) },
      { $set: { accessToken } }
    );
  }
}
