import {
  badRequest,
  serverError,
  noContent,
} from "../../../helpers/http/http-helper";
import { AddSurveyController } from "./add-survey-controller";
import {
  HttpRequest,
  Validation,
  AddSurvey,
  AddSurveyModel,
} from "./add-survey-controller-protocols";

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any question",
    answers: [
      {
        image: "any image",
        answer: "any answer",
      },
    ],
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: unknown): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAddSurveyStub = () => {
  class AddSurveyStub implements AddSurvey {
    async add(survey: AddSurveyModel): Promise<void> {
      return null;
    }
  }

  return new AddSurveyStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurveyStub();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return { sut, validationStub, addSurveyStub };
};

describe("Add Survey", () => {
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const request = makeFakeRequest();

    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request.body);
  });

  test("Should return 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const request = makeFakeRequest();

    const response = await sut.handle(request);

    expect(response).toEqual(badRequest(new Error()));
  });

  test("Should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    const request = makeFakeRequest();

    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith(request.body);
  });

  test("Should returns 500 if AddSurvey use case throw", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest
      .spyOn(addSurveyStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  test("Should returns 204 on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(noContent());
  });
});
