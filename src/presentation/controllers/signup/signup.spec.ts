import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import { SignUpController } from "./signup";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
} from "./signup-protocols";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: "valid_id",
        ...account,
      };

      return fakeAccount;
    }
  }

  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return { sut, emailValidatorStub, addAccountStub };
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

  test("Should return 400 if password confirmation fails", () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: "any name",
        email: "any@email.com",
        password: "anypassword",
        passwordConfirmation: "any_password",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new InvalidParamError("passwordConfirmation")
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
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });

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

  test("Should return 500 if AddAccount throws", () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementation(() => {
      throw new Error();
    });

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

  test("Should call AddAccount with correct values", () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");

    const request = {
      body: {
        name: "any name",
        email: "any@email.com",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };

    sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any name",
      email: "any@email.com",
      password: "anypassword",
    });
  });

  test("Should return 200 if valid data is provided", () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: "any name",
        email: "any@email.com",
        password: "anypassword",
        passwordConfirmation: "anypassword",
      },
    };
    const response = sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: "valid_id",
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    });
  });
});
