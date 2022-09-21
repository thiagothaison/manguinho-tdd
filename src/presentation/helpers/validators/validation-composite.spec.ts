import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { Validation } from "../../protocols/validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: unknown): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
};

describe("Validation Composite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError("field"));
  });

  test("Should return the fist error if more than one validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new InvalidParamError("field"));
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({});

    expect(error).toEqual(new InvalidParamError("field"));
  });

  test("Should not return if validation succeeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({});

    expect(error).toBeFalsy();
  });
});
