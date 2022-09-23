import { AddSurveyController } from "../../../../../presentation/controllers/survey/add-survey/add-survey-controller";
import { Controller } from "../../../../../presentation/protocols/controller";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbAddSurvey } from "../../../use-cases/survey/db-add-survey-factory";
import { makeAddSurveyValidation } from "./add-survey-validation-factory";

export const makeSurveyController = (): Controller => {
  const loginController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );

  return makeLogControllerDecorator(loginController);
};
