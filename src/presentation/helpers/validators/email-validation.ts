/* istanbul ignore file */
import { EmailValidator } from "../../controllers/signup/signup-protocols";
import { InvalidParamError } from "../../errors";
import { Validation } from "./validation";

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
