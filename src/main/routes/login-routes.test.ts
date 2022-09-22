import { Collection } from "mongodb";
import request from "supertest";

import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

let accountCollection: Collection;

const makeFakeAccount = () => ({
  name: "Fake Name",
  email: "fake@email.com",
  password: "fakePassword!@",
  passwordConfirmation: "fakePassword!@",
});

describe("Login Routes", () => {
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

  describe("POST /signup", () => {
    test("Should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send(makeFakeAccount())
        .expect(200);
    });
  });

  describe("POST /login", () => {
    test("Should return 200 on login", async () => {
      const fakeAccount = makeFakeAccount();

      await request(app).post("/api/signup").send(fakeAccount);

      await request(app)
        .post("/api/login")
        .send({
          email: fakeAccount.email,
          password: fakeAccount.password,
        })
        .expect(200);
    });
  });
});
