import { Collection } from "mongodb";

import { mongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

let accountCollection: Collection;

const makeFakeAccount = () => ({
  name: "any name",
  email: "any@email.com",
  password: "any_password",
});

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test("Should return an account on add success", async () => {
    const sut = makeSut();
    const account = await sut.add(makeFakeAccount());

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any name");
    expect(account.email).toBe("any@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return an account on loadByEmail success", async () => {
    const sut = makeSut();
    await accountCollection.insertOne(makeFakeAccount());

    const account = await sut.loadByEmail("any@email.com");

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any name");
    expect(account.email).toBe("any@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return null if loadByEmail fails", async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail("any@email.com");

    expect(account).toBeFalsy();
  });
});
