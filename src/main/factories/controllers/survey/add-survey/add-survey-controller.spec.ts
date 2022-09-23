import { badRequest } from "../../../../../presentation/helpers/http/http-helper";
import { AddSurveyController } from "./add-survey-controller";
import { HttpRequest, Validation } from "./add-survey-controller-protocols";

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
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

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);

  return { sut, validationStub };
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
});
