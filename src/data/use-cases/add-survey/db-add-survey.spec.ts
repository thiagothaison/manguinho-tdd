import { DbAddSurvey } from "./db-add-survey";
import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols";

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeFakePayload = (): AddSurveyModel => ({
  question: "any question",
  answers: [
    {
      image: "any image",
      answer: "any answer",
    },
  ],
});

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return null;
    }
  }

  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return { sut, addSurveyRepositoryStub };
};

describe("DbAddSurvey UseCase", () => {
  test("Should call AddSurveyRepository with correct values", () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = makeFakePayload();

    sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});
