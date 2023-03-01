import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUseUseCase: CreateUserUseCase;
let showUserProfile: ShowUserProfileUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeAll(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUseUseCase = new CreateUserUseCase(inMemoryUserRepository);
    showUserProfile = new ShowUserProfileUseCase(inMemoryUserRepository);
  });

  it("Should be able to show the user profile", async () => {
    const user = await createUseUseCase.execute({
      name: "gustavo",
      email: "gustavo@gmail.com",
      password: "123",
    });

    const profile = await showUserProfile.execute(user.id as string);

    expect(profile).toEqual(user);
  });

  it("Should not be able to show a nonexistent profile", async () => {
    expect(async () => {
      await showUserProfile.execute("12345");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
