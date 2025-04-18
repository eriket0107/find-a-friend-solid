import { logger, LoggerType } from "@/utils/logger";
import { randomUUID } from "crypto";
import { dataSource } from "database/data-source";
import { Organization } from "database/entities/Organization";
import { Pet } from "database/entities/Pet";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Repository } from "typeorm";
import { execSync } from "child_process";

class PetSeeder {
  private petRepository: Repository<Pet>;
  private organizationRepository: Repository<Organization>;
  private logger: LoggerType;

  constructor(
    petRepository: Repository<Pet>,
    organizationRepository: Repository<Organization>,
    logger: LoggerType,
  ) {
    this.petRepository = petRepository;
    this.organizationRepository = organizationRepository;
    this.logger = logger;
  }

  private async seedPets() {
    const startTime = Date.now();
    const pets: Pet[] = [];

    try {
      console.log("🔄 [Seed_Pets] Initializing database connection...");
      this.logger("Seed_Pets").info({
        message: "Starting DB connection...",
        folder: "Scripts",
      });

      await dataSource.initialize();

      // Get all organizations to associate pets with
      const organizations = await this.organizationRepository.find();

      if (!organizations.length) {
        console.log(
          "🔄 [Seed_Pets] No organizations found. Running the organization seed.",
        );
        this.logger("Seed_Pets").info({
          message: "Running the organization seed.",
          folder: "Seed Script",
        });
        execSync("yarn seed:organizations");
        return;
      } else {
        this.logger("Seed_Pets").info({
          message: "Organizations found. Continuing with pet seed.",
          folder: "Seed Script",
        });
        console.log(
          "🔄 [Seed_Pets] Organizations found. Continuing with pet seed.",
        );
      }

      // Create 5 pets per organization
      for (const organization of organizations) {
        for (let i = 0; i < 5; i++) {
          const gender = faker.helpers.arrayElement(["M", "F"]);
          const age = faker.number.int({ min: 1, max: 15 }).toString();
          const breed = faker.helpers.arrayElement([
            "Labrador",
            "Golden Retriever",
            "German Shepherd",
            "French Bulldog",
            "Poodle",
            "Beagle",
            "Bulldog",
            "Husky",
            "Chihuahua",
            "Yorkshire Terrier",
            "Persian Cat",
            "Siamese Cat",
            "Maine Coon",
            "British Shorthair",
            "Sphynx",
            "Ragdoll",
            "Bengal",
            "Abyssinian",
            "Scottish Fold",
            "Russian Blue",
          ]);

          const traits = faker.helpers.arrayElements(
            [
              "Friendly",
              "Energetic",
              "Calm",
              "Playful",
              "Shy",
              "Outgoing",
              "Intelligent",
              "Loyal",
              "Affectionate",
              "Independent",
              "Good with kids",
              "Good with other pets",
              "Needs training",
              "Well-trained",
              "Loves to cuddle",
              "Loves to play fetch",
              "Loves to swim",
              "Loves to run",
              "Loves to dig",
              "Loves to bark",
            ],
            { min: 2, max: 5 },
          );

          const data: Partial<Pet> = {
            id: randomUUID(),
            name: faker.person.firstName(),
            description: faker.lorem.paragraph(),
            gender,
            age,
            breed,
            traits,
            isAdopted: faker.datatype.boolean({ probability: 0.2 }), // 20% chance of being adopted
            organization,
          };

          const pet: Pet = this.petRepository.create(data);
          pets.push(pet);

          this.logger("Seed_Pets").info({
            message: `Seeded pet with ID: ${pet.id}`,
            folder: "Scripts",
            petId: pet.id,
            name: pet.name,
            organizationId: organization.id,
          });
        }
      }

      await this.petRepository.save(pets);

      const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

      this.logger("Seed_Pets").info({
        message: "✅ Successfully seeded pets",
        folder: "Seed UseCase",
        totalSeeded: pets.length,
        executionTime: `${executionTime}s`,
      });

      console.log(
        `✅ [Seed_Pets] Successfully seeded ${pets.length} pets in ${executionTime}s.`,
      );
      await dataSource.destroy();
      console.log("📴 [Seed_Pets] Database connection closed.");
      process.exit(0);
    } catch (error) {
      console.error("❌ [Seed_Pets] Error seeding pets:", error);

      this.logger("Seed_Pets").error({
        message: "❌ Error occurred while seeding pets",
        error: (error as Error).message || (error as Error),
        stack: (error as Error).stack || "No stack trace",
        folder: "Seed UseCase",
      });
      this.logger("Seed_Pets").info({
        message: "Closing DB connection...",
        folder: "Seed UseCase",
      });

      await dataSource.destroy();
      console.log("📴 [Seed_Pets] Database connection closed.");
      process.exit(1);
    }
  }

  public static async run() {
    const seeder = new PetSeeder(
      dataSource.getRepository(Pet),
      dataSource.getRepository(Organization),
      logger,
    );
    await seeder.seedPets();
  }
}

PetSeeder.run();
