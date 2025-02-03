import { Organization } from "database/entities/Organization";
import { IOrganizationRepository } from "../organization.repository";
import { dataSource } from "database/data-source";
import { Repository } from "typeorm";

export class OrganizationTypeOrmRepository implements IOrganizationRepository {
  private repository: Repository<Organization>
  constructor() {
    this.repository = dataSource.getRepository(Organization);
  }
  async create(data: Organization): Promise<Organization> {
    return await this.repository.save(data);
  }
  async findByEmail(email: string): Promise<Organization | null> {
    return await this.repository.findOne({ where: { email } });
  }
}
