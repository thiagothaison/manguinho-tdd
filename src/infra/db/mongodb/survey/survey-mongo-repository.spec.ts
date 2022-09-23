import { Collection } from "mongodb";

import { mongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";

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

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe("Survey Mongo Repository", () => {
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

  test("Should add a survey on success", async () => {
    const sut = makeSut();
    await sut.add(makeFakeSurvey());

    const survey = await surveyCollection.findOne({ question: "any question" });
    expect(survey).toBeTruthy();
  });
});
