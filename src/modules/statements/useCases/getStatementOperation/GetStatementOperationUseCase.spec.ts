import {
  OperationType,
  Statement,
} from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUseUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  let user: User;
  let statement: Statement;

  beforeAll(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    user = await createUseUseCase.execute({
      name: "gustavo",
      email: "gustavo@gmail.com",
      password: "123",
    });

    statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "salário",
    });
  });

  it("should be able to get the statement operation", async () => {
    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(operation).toHaveProperty("id");
  });

  it("should not be able to get the statement operation for a nonexistent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id: statement.id!,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a nonexistent statement operation", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
