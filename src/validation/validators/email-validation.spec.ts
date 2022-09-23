import { InvalidParamError } from "../../presentation/errors/invalid-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { EmailValidation } from "./email-validation";

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe("Email Validation", () => {
  test("Should return an error if EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const error = sut.validate({ email: "any@email.com" });

    expect(error).toEqual(new InvalidParamError("email"));
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({ email: "any@email.com" });

    expect(isValidSpy).toHaveBeenCalledWith("any@email.com");
  });

  test("Should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
