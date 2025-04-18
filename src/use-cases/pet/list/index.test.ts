import { ListPetUseCase } from ".";
import { PetInMemoryRepository } from "@/repositories/in-memory/pet.in-memory";
import { LoggerType } from "@/utils/logger";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorPetListCityIsRequired } from "../errors";

let sut: ListPetUseCase;
let petRepository: PetInMemoryRepository;

const logger = vi.fn(() => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  silent: vi.fn(),
})) as unknown as LoggerType;

describe("List Pet UseCase", () => {
  beforeEach(() => {
    petRepository = new PetInMemoryRepository();
    sut = new ListPetUseCase(petRepository, logger);
  });

  it("should be able to list pets by organization city", async () => {
    for (let i = 0; i < 10; i++) {
      await petRepository.create({
        id: `pet-id-${i}`,
        name: "John Doe",
        age: "1",
        breed: "Labrador",
        description: "This is a test pet",
        gender: "M",
        traits: ["Teste"],
        isAdopted: i % 2 === 0 ? true : false,
        organization: {
          id: "1",
          name: "John Doe",
          street: "123 Main St",
          whatsapp: "1234567890",
          cnpj: "1234567890",
          email: "john.doe@example.com",
          cep: "1234567890",
          city: i % 3 === 0 ? "São Paulo" : "Rio de Janeiro",
          state: i % 3 === 0 ? "SP" : "RJ",
          country: "Brazil",
        },
      });
    }

    const { pets } = await sut.execute({
      organizationCity: "Rio de Janeiro",
    });
    console.log(pets);
    expect(pets).toHaveLength(6);
    expect(pets[0].id).toBe("pet-id-1");
  });

  it("should throw an error if organization city is not provided", async () => {
    await expect(sut.execute({ organizationCity: "" })).rejects.be.instanceOf(
      ErrorPetListCityIsRequired,
    );
  });

  it("should return an empty list if no pets match the organization city", async () => {
    const { pets } = await sut.execute({ organizationCity: "Rio de Janeiro" });
    expect(pets).toHaveLength(0);
  });
});
