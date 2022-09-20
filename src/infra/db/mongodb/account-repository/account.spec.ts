import { mongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test("Should return an account on success", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "any name",
      email: "any@email.com",
      password: "any_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any name");
    expect(account.email).toBe("any@email.com");
    expect(account.password).toBe("any_password");
  });
});
