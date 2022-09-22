import { ConflictError } from "../../errors/conflict-error";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../helpers/http/http-helper";
import {
  AddAccount,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./signup-controller-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request.body;

      const account = await this.addAccount.add({ name, email, password });

      if (!account) {
        return forbidden(new ConflictError("email"));
      }

      const token = await this.authentication.auth({ email, password });

      return ok({ token });
    } catch (error) {
      return serverError(error);
    }
  }
}
