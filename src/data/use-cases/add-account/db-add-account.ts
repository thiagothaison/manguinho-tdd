import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);

    const accountAlreadyExists =
      await this.loadAccountByEmailRepository.loadByEmail(accountData.email);

    if (accountAlreadyExists) return;

    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    console.log('account', account)

    return account;
  }
}
