import { MigrationInterface, QueryRunner } from "typeorm";

export class AdaptPet1739872402574 implements MigrationInterface {
  name = "AdaptPet1739872402574";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_eb47de4994e3d954687734778bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" RENAME COLUMN "organizationIdId" TO "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_a730d8e90af7ecf1b7ae6c53e6f" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_a730d8e90af7ecf1b7ae6c53e6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" RENAME COLUMN "organizationId" TO "organizationIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_eb47de4994e3d954687734778bf" FOREIGN KEY ("organizationIdId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
