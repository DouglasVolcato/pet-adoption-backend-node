import { UserEntityType } from "../entities/user-entity-type";

export namespace CreateUserUseCase {
  export interface Service {
    execute(input: Input): Output;
  }
  export type Input = {
    name: string;
    email: string;
    password: string;
  };
  export type Output = Promise<UserEntityType | Error>;
}
