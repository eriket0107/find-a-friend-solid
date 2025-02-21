import { Pet } from "database/entities/Pet";
import { IPetRepository } from "../pet.repository";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { dataSource } from "database/data-source";

export class PetTypeOrm implements IPetRepository {
  private repository: Repository<Pet>;

  constructor() {
    this.repository = dataSource.getRepository(Pet);
  }

  async getById(id: string): Promise<Pet | null> {
    const pet = await this.repository.findOne({
      where: { id },
      relations: { organization: true },
    });

    if (!pet) return null;

    return pet;
  }

  async create(data: Pet): Promise<Pet> {
    const pet = await this.repository.save(data);
    return pet;
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Partial<Pet>;
  }): Promise<Pet | null> {
    const petToUpdate = await this.repository.findOne({
      where: { id },
    });

    if (!petToUpdate) {
      return null;
    }

    await this.repository.update(id, data);

    return await this.repository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async listByOrganization(organizationId: string): Promise<Pet[]> {
    return await this.repository.find({
      where: { organization: organizationId } as FindOptionsWhere<Pet>,
    });
  }

  async list({
    where,
    order,
    take: limit = 10,
    skip = 0,
    filter = {},
  }: {
    where?: Partial<Pet>;
    order?: Record<string, "ASC" | "DESC">;
    take?: number;
    skip?: number;
    filter?: Partial<Record<keyof Pet, string>>;
  }): Promise<Pet[]> {
    const whereConditions = { ...where };

    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        whereConditions[key as keyof Pet] = ILike(`%${value}%`) as any;
      }
    }

    if (where?.traits && Array.isArray(where.traits)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      whereConditions.traits = ILike(`%${where.traits.join(",")}%`) as any;
    }

    return await this.repository.find({
      where: whereConditions as FindOptionsWhere<Pet>,
      order,
      relations: { organization: true },
      take: limit,
      skip,
    });
  }
}
