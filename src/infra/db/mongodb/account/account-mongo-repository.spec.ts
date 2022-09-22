import { Collection } from "mongodb";

import { mongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

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

  test("Should update the account accessToken on updateAccessToken success", async () => {
    const sut = makeSut();
    const result = await accountCollection.insertOne(makeFakeAccount());

    const account = await accountCollection.findOne({ _id: result.insertedId });
    expect(account.accessToken).toBeFalsy();

    await sut.updateAccessToken(result.insertedId.toString(), "any-token");
    const accountAfterUpdate = await accountCollection.findOne({
      _id: result.insertedId,
    });

    expect(accountAfterUpdate).toBeTruthy();
    expect(accountAfterUpdate.id).toBe(account.id);
    expect(accountAfterUpdate.name).toBe(account.name);
    expect(accountAfterUpdate.email).toBe(account.email);
    expect(accountAfterUpdate.password).toBe(account.password);
    expect(accountAfterUpdate.accessToken).toBe("any-token");
  });
});
