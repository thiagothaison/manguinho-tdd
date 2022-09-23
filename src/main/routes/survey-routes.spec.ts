import { Collection } from "mongodb";
import request from "supertest";

import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

let surveyCollection: Collection;

const makeFakeSurvey = () => ({
  question: "any question",
  answers: [
    {
      image: "any image",
      answer: "any answer",
    },
  ],
});

describe("Survey Routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("Should return 200 on survey success", async () => {
      await request(app)
        .post("/api/surveys")
        .send(makeFakeSurvey())
        .expect(204);
    });
  });
});
