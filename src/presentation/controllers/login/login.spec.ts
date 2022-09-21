import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helper";
import { EmailValidator } from "../../protocols/email-validator";
import { HttpRequest } from "../signup/signup-protocols";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any@email.com",
    password: "anypassword",
  },
});

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
  const sut = new LoginController(emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe("Login Controller", () => {
  test("Should return 400 if email is not provided", async () => {
    const { sut } = makeSut();
    const {
      body: { password },
    } = makeFakeRequest();

    const httpRequest = {
      body: { password },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if password is not provided", async () => {
    const { sut } = makeSut();
    const {
      body: { email },
    } = makeFakeRequest();

    const httpRequest = {
      body: { email },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
});
