import { AddSurveyModel } from "domain/use-cases/add-survey";

import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { mongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await mongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }
}
