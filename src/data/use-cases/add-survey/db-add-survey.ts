import { AddSurveyModel } from "domain/use-cases/add-survey";

import { AddSurvey, AddSurveyRepository } from "./db-add-survey-protocols";

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(survey: AddSurveyModel): Promise<void> {
    console.log("survey", survey);
    await this.addSurveyRepository.add(survey);
  }
}
