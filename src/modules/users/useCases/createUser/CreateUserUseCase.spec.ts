import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUseUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeAll(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to create an user", async () => {
    const user = await createUseUseCase.execute({
      name: "gustavo",
      email: "gustavo@gmail.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not allow two user with the same email", async () => {
    expect(async () => {
      await createUseUseCase.execute({
        name: "gustavo2",
        email: "gustavo@gmail.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
