import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUseUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  let user: User;

  beforeAll(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    user = await createUseUseCase.execute({
      name: "gustavo",
      email: "gustavo@gmail.com",
      password: "123",
    });
  });

  it("should be able to deposit money", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "salário",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to withdraw money", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 200,
      description: "gasolina",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a statement for a nonexistent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "12345",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "salário",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw more than the balance", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 20000,
        description: "saque",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
