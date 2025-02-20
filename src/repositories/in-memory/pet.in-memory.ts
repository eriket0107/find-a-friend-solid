import { Pet } from "database/entities/Pet";
import { IPetRepository } from "../pet.repository";

export class PetInMemoryRepository implements IPetRepository {
  private repository: Pet[] = [];

  async create(data: Pet): Promise<Pet> {
    this.repository.push(data);
    return data;
  }

  async getById(id: string): Promise<Pet | null> {
    const pet = this.repository.find((data) => data.id === id);

    if (!pet) return null;

    return pet;
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Partial<Pet>;
  }): Promise<Pet | null> {
    const petToUpdate = this.repository.find((data) => data.id === id);

    if (!petToUpdate) return null;

    Object.assign(petToUpdate, data);

    return petToUpdate;
  }

  async delete(id: string): Promise<void> {
    const petToDelete = this.repository.find((data) => data.id === id);

    if (!petToDelete) return;

    this.repository = this.repository.filter((data) => data.id !== id);
  }
  async listByOrganization(id: string): Promise<Pet[]> {
    return this.repository.filter((data) => data.id === id);
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
    let results = this.repository;

    if (filter) {
      results = results.filter((pet) => {
        return Object.entries(filter).every(([key, value]) => {
          const petValue = pet[key as keyof Pet];
          if (typeof petValue === "string" && typeof value === "string") {
            return petValue.toLowerCase().includes(value.toLowerCase());
          }
          return petValue === value;
        });
      });
    }

    if (where) {
      results = results.filter((pet) => {
        return Object.entries(where).every(([key, value]) => {
          return pet[key as keyof Pet] === value;
        });
      });
    }

    if (order) {
      results = results.sort((a, b) => {
        for (const [key, direction] of Object.entries(order)) {
          const aValue = a[key as keyof Pet];
          const bValue = b[key as keyof Pet];

          if (aValue && bValue) {
            if (aValue < bValue) return direction === "ASC" ? -1 : 1;
            if (aValue > bValue) return direction === "ASC" ? 1 : -1;
          }
        }

        return 0;
      });
    }

    const start = skip;
    const end = skip + limit;

    return results.slice(start, end);
  }
}
