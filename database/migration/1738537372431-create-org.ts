import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrg1738537372431 implements MigrationInterface {
    name = 'CreateOrg1738537372431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "org" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "cnpj" bigint NOT NULL, "whatsapp" bigint NOT NULL, "cep" bigint NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(255) NOT NULL, CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "org"`);
    }

}
