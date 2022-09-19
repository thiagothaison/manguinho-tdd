import { MissingParamError } from "../errors/missing-param-error";
import { SignUpController } from "./signup";

const makeSut = (): SignUpController => {
  return new SignUpController();
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const sut = makeSut();
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
    const sut = makeSut();
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
    const sut = makeSut();
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
    const sut = makeSut();
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
});
