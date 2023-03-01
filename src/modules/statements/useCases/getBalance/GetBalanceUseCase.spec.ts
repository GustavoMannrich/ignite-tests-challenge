import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUseUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

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
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );

    user = await createUseUseCase.execute({
      name: "gustavo",
      email: "gustavo@gmail.com",
      password: "123",
    });
  });

  it("should be able to get an user balance", async () => {
    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "salário",
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 200,
      description: "gasolina",
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(balance.balance).toEqual(800);
  });

  it("should be not able to get an nonexistent user balance", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "12345" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
