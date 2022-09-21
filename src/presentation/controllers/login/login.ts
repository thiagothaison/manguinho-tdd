import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../signup/signup-protocols";

export class LoginController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) =>
      resolve(badRequest(new MissingParamError("email")))
    );
  }
}
