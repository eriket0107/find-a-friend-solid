import { MigrationInterface, QueryRunner } from "typeorm";

export class SettingId1738590014817 implements MigrationInterface {
    name = 'SettingId1738590014817';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "orgIdId"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "orgIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1" FOREIGN KEY ("orgIdId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "orgIdId"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "orgIdId" integer`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "PK_472c1f99a32def1b0abb219cd67"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1" FOREIGN KEY ("orgIdId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
