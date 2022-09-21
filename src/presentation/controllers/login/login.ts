import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, ok } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../signup/signup-protocols";

export class LoginController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return new Promise((resolve) => resolve(ok({ foo: "bar" })));
  }
}
