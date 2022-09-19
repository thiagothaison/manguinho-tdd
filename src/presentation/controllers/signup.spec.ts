import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { ServerError } from "../errors/server-error";
import { EmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        email: "any@email.com",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "any name",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "any name",
        email: "any@email.com",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no password confirmation is provided", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "any name",
        email: "any@email.com",
        password: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const request = {
      body: {
        name: "any name",
        email: "any_invalid_email.com",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const email = "any@email.com";
    const request = {
      body: {
        name: "any name",
        email,
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    sut.handle(request);

    expect(isValidSpy).toHaveBeenCalledWith(email);
  });

  test("Should return 500 if EmailValidator throws", () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error();
      }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    const request = {
      body: {
        name: "any name",
        email: "any@email.com",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });
});
