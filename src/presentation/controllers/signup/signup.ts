import { InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./signup-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const account = await this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
