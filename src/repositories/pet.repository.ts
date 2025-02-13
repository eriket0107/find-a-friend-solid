import { Pet } from "database/entities/Pet";

export interface IPetRepository {
  getById(id: string): Promise<Pet | null>;
  create(data: Pet): Promise<Pet>;
  update({ id, data }: { id: string; data: Partial<Pet> }): Promise<Pet | null>;
  delete(id: string): Promise<void>;
  listByOrganization(organizationId: string): Promise<Pet[]>;
  list({
    where,
    order,
    take,
    skip,
    filter,
  }: {
    where?: Partial<Pet>;
    order?: Record<string, "ASC" | "DESC">;
    take?: number;
    skip?: number;
    filter?: Record<keyof Pet, string>;
  }): Promise<Pet[]>;
}
