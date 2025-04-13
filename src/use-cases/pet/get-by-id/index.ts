import { IPetRepository } from "@/repositories/pet.repository";
import { LoggerType } from "@/utils/logger";
import { ErrorPetNotFound } from "../errors";
import { Pet } from "database/entities/Pet";

interface GetPetByIdUseCaseRequest {
  id: string;
}

interface GetPetByIdUseCaseResponse {
  pet: Pet;
}
export class GetPetByIdUseCase {
  constructor(
    private readonly petRepository: IPetRepository,
    private readonly logger: LoggerType,
  ) {}

  async execute({
    id,
  }: GetPetByIdUseCaseRequest): Promise<GetPetByIdUseCaseResponse> {
    this.logger("Pet").info({
      message: `Start get pet by id`,
      id,
      folder: "Get Pet By Id UseCase",
    });
    const pet = await this.petRepository.getById(id);
    if (!pet) {
      this.logger("Pet").info({
        message: `Pet not found`,
        id,
        folder: "Get Pet By Id UseCase",
      });
      throw new ErrorPetNotFound();
    }

    this.logger("Pet").info({
      message: `Pet found`,
      id,
      folder: "Get Pet By Id UseCase",
    });

    return { pet };
  }
}
