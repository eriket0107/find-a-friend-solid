import { IPetRepository } from "@/repositories/pet.repository";
import { Organization } from "database/entities/Organization";
import { Pet } from "database/entities/Pet";
import { ErrorPetListCityIsRequired } from "../errors";
import { LoggerType } from "@/utils/logger";

interface ListPetUseCaseRequest {
  where?: Partial<Pet>;
  order?: Record<string, "ASC" | "DESC">;
  take?: number;
  skip?: number;
  filter?: Record<keyof Pet, string>;
  organizationCity: string;
}

interface ListPetUseCaseResponse {
  pets: Pet[];
}

export class ListPetUseCase {
  constructor(
    private readonly repository: IPetRepository,
    private readonly logger: LoggerType,
  ) {}

  async execute({
    where,
    order,
    take,
    skip,
    filter,
    organizationCity,
  }: ListPetUseCaseRequest): Promise<ListPetUseCaseResponse> {
    this.logger("Pet").info({
      message: `Executing ListPetUseCase`,
      parameters: { where, order, take, skip, filter, organizationCity },
      folder: "List Pet UseCase",
    });

    if (!organizationCity) {
      this.logger("Pet").error({
        message: `organizationCity is required`,
        folder: "List Pet UseCase",
      });
      throw new ErrorPetListCityIsRequired();
    }

    this.logger("Pet").info({
      message: `Adding organization city to the where clause`,
      organizationCity,
      folder: "List Pet UseCase",
    });

    where = {
      ...where,
      organization: {
        city: organizationCity,
      } as Organization,
    };

    this.logger("Pet").info({
      message: `Fetching pets from the repository`,
      folder: "List Pet UseCase",
    });

    const pets = await this.repository.list({
      where,
      order,
      take,
      skip,
      filter,
    });

    this.logger("Pet").info({
      message: `Pets fetched successfully`,
      petCount: pets.length,
      folder: "List Pet UseCase",
    });

    return { pets };
  }
}
