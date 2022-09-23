import {
  badRequest,
  serverError,
  noContent,
} from "../../../../../presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  AddSurvey,
} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);

      if (error) return badRequest(error);

      const { question, answers } = request.body;

      await this.addSurvey.add({
        question,
        answers,
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
