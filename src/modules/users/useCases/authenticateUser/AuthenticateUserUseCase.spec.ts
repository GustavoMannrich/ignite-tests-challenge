import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUseUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("User Authentication", () => {
  beforeAll(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );

    await createUseUseCase.execute({
      name: "gustavo",
      email: "gustavo@gmail.com",
      password: "123",
    });
  });

  it("Should be able to authenticate an user", async () => {
    const authentication = await authenticateUserUseCase.execute({
      email: "gustavo@gmail.com",
      password: "123",
    });

    expect(authentication).toHaveProperty("token");
  });

  it("Should not be able to authenticate an user with a wrong email", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "teste@gmail.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate an user with a wrong password", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "gustavo@gmail.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
