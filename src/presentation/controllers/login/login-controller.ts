import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation,
} from "./login-controller-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = request.body;

      const token = await this.authentication.auth({ email, password });

      if (!token) {
        return unauthorized();
      }

      return new Promise((resolve) => resolve(ok({ token })));
    } catch (error) {
      return serverError(error);
    }
  }
}
