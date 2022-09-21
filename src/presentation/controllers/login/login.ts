import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, ok } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from "./login-protocols";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const { email } = request.body;

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return badRequest(new InvalidParamError("email"));
    }

    return new Promise((resolve) => resolve(ok({ foo: "bar" })));
  }
}
