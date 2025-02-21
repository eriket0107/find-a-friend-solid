import { IPetRepository } from "@/repositories/pet.repository";
import { LoggerType } from "@/utils/logger";
import { ErrorPetNotFound } from "../errors";

interface DeletePetUseCaseRequest {
  id: string;
}

export class DeletePetByIdUseCase {
  constructor(
    private readonly petRepository: IPetRepository,
    private readonly logger: LoggerType,
  ) { }

  async execute({ id }: DeletePetUseCaseRequest): Promise<void> {
    this.logger("Pet").info({
      message: `Start delete pet`,
      id,
      folder: "Delete Pet UseCase",
    });

    const pet = await this.petRepository.getById(id);
    if (!pet) {
      this.logger("Pet").info({
        message: `Pet not found`,
        id,
        folder: "Delete Pet UseCase",
      });
      throw new ErrorPetNotFound();
    }

    await this.petRepository.delete(id);

    this.logger("Pet").info({
      message: `Pet deleted`,
      id,
      folder: "Delete Pet UseCase",
    });
  }
}
