import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest } from "../signup/signup-protocols";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any@email.com",
    password: "anypassword",
  },
});

const makeSut = (): SutTypes => {
  const sut = new LoginController();

  return { sut };
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
});
