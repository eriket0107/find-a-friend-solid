import { logger, LoggerType } from "@/utils/logger";
import { randomUUID } from "crypto";
import { dataSource } from "database/data-source";
import { Organization } from "database/entities/Organization";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Repository } from "typeorm";

class OrganizationSeeder {
  private organizationRepository;
  private logger;

  constructor(
    organizationRepository: Repository<Organization>,
    logger: LoggerType,
  ) {
    this.organizationRepository = organizationRepository;
    this.logger = logger;
  }

  private async seedOrganizations() {
    const startTime = Date.now();
    const organizations: Organization[] = [];

    try {
      console.log("🔄 [Seed_Organization] Initializing database connection...");
      this.logger("Seed_Organization").info({
        message: "Starting DB connection...",
        folder: "Scripts",
        count: 10,
      });

      const organizationRepository = this.organizationRepository;
      await dataSource.initialize();

      for (let i = 0; i < 10; i++) {
        const data: Organization = {
          id: randomUUID(),
          email: faker.internet.email(),
          password_hash: randomUUID(),
          name: faker.company.name(),
          cnpj: faker.string.numeric(14),
          whatsapp: faker.phone.number(),
          cep: faker.location.zipCode(),
          city: faker.location.city(),
          state: faker.location.state(),
          street: faker.location.streetAddress(),
          country: "Brazil",
        };

        const organization: Organization = organizationRepository.create(data);

        organizations.push(organization);

        this.logger("Seed_Organization").info({
          message: `Seeded organization with ID: ${organization.id}`,
          folder: "Scripts",
          organizationId: organization.id,
          email: organization.email,
        });
      }

      await organizationRepository.save(organizations);

      const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

      this.logger("Seed_Organization").info({
        message: "✅ Successfully seeded organizations",
        folder: "Seed UseCase",
        totalSeeded: organizations.length,
        executionTime: `${executionTime}s`,
      });

      console.log(
        `✅ [Seed_Organization] Successfully seeded ${organizations.length} organizations in ${executionTime}s.`,
      );
    } catch (error) {
      console.error(
        "❌ [Seed_Organization] Error seeding organizations:",
        error,
      );

      this.logger("Seed_Organization").error({
        message: "❌ Error occurred while seeding organizations",
        error: (error as Error).message || (error as Error),
        stack: (error as Error).stack || "No stack trace",
        folder: "Seed UseCase",
      });
    } finally {
      this.logger("Seed_Organization").info({
        message: "Closing DB connection...",
        folder: "Seed UseCase",
      });

      await dataSource.destroy();

      console.log("📴 [Seed_Organization] Database connection closed.");
    }
  }

  public static async run() {
    const seeder = new OrganizationSeeder(
      dataSource.getRepository(Organization),
      logger,
    );
    await seeder.seedOrganizations();
  }
}

OrganizationSeeder.run();
