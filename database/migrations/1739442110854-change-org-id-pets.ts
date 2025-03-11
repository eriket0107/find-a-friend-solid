import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOrgIdPets1739442110854 implements MigrationInterface {
  name = "ChangeOrgIdPets1739442110854";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" RENAME COLUMN "orgIdId" TO "organizationIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_eb47de4994e3d954687734778bf" FOREIGN KEY ("organizationIdId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_eb47de4994e3d954687734778bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" RENAME COLUMN "organizationIdId" TO "orgIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1" FOREIGN KEY ("orgIdId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
