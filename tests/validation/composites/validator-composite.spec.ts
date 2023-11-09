import { ValidatorInterface } from "../../../src/presentation/protocols";
import { ValidatorComposite } from "../../../src/validation/composites";
import { makeUserDto } from "../../test-helpers/mocks";
import { ValidatorStub } from "../../test-helpers/stubs";

type SutTypes = {
  sut: ValidatorComposite;
  validatorStub1: ValidatorInterface;
  validatorStub2: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub1 = new ValidatorStub();
  const validatorStub2 = new ValidatorStub();
  const validatorStubs = [validatorStub1, validatorStub2];
  const sut = new ValidatorComposite(validatorStubs);
  return { validatorStub1, validatorStub2, sut };
};

describe("ValidatorComposite", () => {
  it("Validate should call validators with correct values", () => {
    const { sut, validatorStub1, validatorStub2 } = makeSut();
    const validatorStubSpy1 = jest.spyOn(validatorStub1, "validate");
    const validatorStubSpy2 = jest.spyOn(validatorStub2, "validate");
    const data = makeUserDto();
    sut.validate(data);

    expect(validatorStubSpy1).toHaveBeenCalledTimes(1);
    expect(validatorStubSpy1).toHaveBeenCalledWith(data);
    expect(validatorStubSpy2).toHaveBeenCalledTimes(1);
    expect(validatorStubSpy2).toHaveBeenCalledWith(data);
  });

  it("Validate should return an error if a validator returns an error", () => {
    const { sut, validatorStub1 } = makeSut();
    jest
      .spyOn(validatorStub1, "validate")
      .mockReturnValueOnce(new Error("any_error"));
    const error = sut.validate(makeUserDto());

    expect(error).toEqual(new Error("any_error"));
  });

  it("Validate should return undefined", () => {
    const { sut } = makeSut();
    const output = sut.validate(makeUserDto());

    expect(output).toBeUndefined();
  });

  it("Constructor should set the validators property", () => {
    const { sut, validatorStub1, validatorStub2 } = makeSut();

    expect((sut as any).validators).toEqual([validatorStub1, validatorStub2]);
  });
});