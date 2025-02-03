import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustingTables1738589865954 implements MigrationInterface {
    name = 'AdjustingTables1738589865954';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "cnpj" bigint NOT NULL, "whatsapp" bigint NOT NULL, "cep" bigint NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(255) NOT NULL, "street" character varying(255) NOT NULL, "country" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "image_url" character varying(255) NOT NULL, "age" integer NOT NULL, "breed" character varying(255) NOT NULL, "traits" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "orgIdId" integer, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1" FOREIGN KEY ("orgIdId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_d12709e1738f2a05a77ed8865b1"`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
