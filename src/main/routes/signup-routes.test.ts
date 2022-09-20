import request from "supertest";

import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Fake Name",
        email: "fake@email.com",
        password: "fakePassword!@",
        passwordConfirmation: "fakePassword!@",
      })
      .expect(200);
  });
});
