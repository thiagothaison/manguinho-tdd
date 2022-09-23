import { AccountModel } from "../../../domain/models/account";
import { AddAccountModel } from "../../../domain/use-cases/add-account";
import { DbAddAccount } from "./db-add-account";
import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "Valid Name",
  email: "valid@email.com",
  password: "valid_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid name",
  email: "valid@email.com",
  password: "valid_password",
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountRepositoryStub();
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed-password"));
    }
  }

  return new HasherStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(null));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAddAccount UseCase", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");

    await sut.add(makeFakeAccountData());

    expect(hashSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();

    await sut.add(makeFakeAccountData());

    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed-password",
    });
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccount());

    await expect(account).toHaveProperty("id");
  });

  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      "loadByEmail"
    );
    await sut.add(makeFakeAccount());

    expect(loadByEmailSpy).toHaveBeenCalledWith("valid@email.com");
  });

  test("Should return null if LoadAccountByEmailRepository not returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeAccount()))
      );
    const account = await sut.add(makeFakeAccount());

    expect(account).toBeFalsy();
  });
});
