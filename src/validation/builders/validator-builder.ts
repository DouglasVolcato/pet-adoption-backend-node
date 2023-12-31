import { ValidatorInterface } from "../../presentation/protocols";
import { FieldTypeEnum } from "../protocols";
import {
  EmailValidator,
  FieldTypeValidator,
  MinLengthValidator,
  RequiredFieldValidator,
} from "../validators";

export class ValidatorBuilder {
  private fieldName: string;

  public constructor() {
    this.fieldName = "";
  }

  public of(fieldName: string): typeof this {
    this.fieldName = fieldName;
    return this;
  }

  public isRequired(): ValidatorInterface {
    return new RequiredFieldValidator(this.fieldName);
  }

  public isEmail(): ValidatorInterface {
    return new EmailValidator(this.fieldName);
  }

  public isMinLength(minFieldLength: number): ValidatorInterface {
    return new MinLengthValidator(this.fieldName, minFieldLength);
  }

  public isType(fieldType: FieldTypeEnum): ValidatorInterface {
    return new FieldTypeValidator(this.fieldName, fieldType);
  }
}
