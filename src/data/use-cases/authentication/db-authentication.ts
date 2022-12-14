import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email
    );

    if (!account) return null;

    const isMatch = await this.hashCompare.compare(
      authentication.password,
      account.password
    );

    if (!isMatch) return null;

    const token = await this.encrypter.encrypt(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(account.id, token);

    return token;
  }
}
