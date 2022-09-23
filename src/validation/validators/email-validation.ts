/* istanbul ignore file */
import { EmailValidator } from "../../presentation/controllers/signup/signup-controller-protocols";
import { InvalidParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols/validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: unknown): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
