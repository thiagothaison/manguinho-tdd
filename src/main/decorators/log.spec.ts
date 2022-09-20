import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { AccountModel } from "../../domain/models/account";
import { ok, serverError } from "../../presentation/helpers/http-helper";
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";

  return serverError(fakeError);
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any@email.com",
    name: "any name",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "Valid Name",
  email: "valid@email.com",
  password: "valid_password",
});

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
