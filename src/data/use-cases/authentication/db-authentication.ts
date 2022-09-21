import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/use-cases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (!account) return null;

    const isMatch = await this.hashCompare.compare(
      authentication.password,
      account.password
    );

    if (!isMatch) return null;

    return this.tokenGenerator.generate(account.id);
  }
}
