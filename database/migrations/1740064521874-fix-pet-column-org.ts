import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPetColumnOrg1740064521874 implements MigrationInterface {
  name = "FixPetColumnOrg1740064521874";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_a730d8e90af7ecf1b7ae6c53e6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" RENAME COLUMN "organizationId" TO "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_96d6cf7e3d0db689ae1dfaddb7b" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_96d6cf7e3d0db689ae1dfaddb7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" RENAME COLUMN "organization_id" TO "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_a730d8e90af7ecf1b7ae6c53e6f" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
