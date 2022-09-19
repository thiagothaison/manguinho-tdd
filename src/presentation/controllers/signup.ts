import { InvalidParamError, MissingParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(request: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(request.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return serverError();
    }
  }
}
