import {MigrationInterface, QueryRunner} from "typeorm";

export class MoreModels1639366930619 implements MigrationInterface {
    name = 'MoreModels1639366930619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "games" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "name" varchar NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "text" varchar NOT NULL, "hint" varchar NOT NULL, "index" integer NOT NULL, "gameId" integer)`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "text" varchar NOT NULL, "index" integer NOT NULL, "correct" boolean NOT NULL, "questionId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "username", "email") SELECT "id", "username", "email" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_games" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "name" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_7ba31d25ad376fbcb7f8a20a8db" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_games"("id", "createdAt", "updatedAt", "name", "ownerId") SELECT "id", "createdAt", "updatedAt", "name", "ownerId" FROM "games"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`ALTER TABLE "temporary_games" RENAME TO "games"`);
        await queryRunner.query(`CREATE TABLE "temporary_question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "text" varchar NOT NULL, "hint" varchar NOT NULL, "index" integer NOT NULL, "gameId" integer, CONSTRAINT "FK_80c7fd5c83ca68cfbf33c0daf6c" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_question"("id", "createdAt", "updatedAt", "text", "hint", "index", "gameId") SELECT "id", "createdAt", "updatedAt", "text", "hint", "index", "gameId" FROM "question"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`ALTER TABLE "temporary_question" RENAME TO "question"`);
        await queryRunner.query(`CREATE TABLE "temporary_answer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "text" varchar NOT NULL, "index" integer NOT NULL, "correct" boolean NOT NULL, "questionId" integer, CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_answer"("id", "createdAt", "updatedAt", "text", "index", "correct", "questionId") SELECT "id", "createdAt", "updatedAt", "text", "index", "correct", "questionId" FROM "answer"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`ALTER TABLE "temporary_answer" RENAME TO "answer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" RENAME TO "temporary_answer"`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "text" varchar NOT NULL, "index" integer NOT NULL, "correct" boolean NOT NULL, "questionId" integer)`);
        await queryRunner.query(`INSERT INTO "answer"("id", "createdAt", "updatedAt", "text", "index", "correct", "questionId") SELECT "id", "createdAt", "updatedAt", "text", "index", "correct", "questionId" FROM "temporary_answer"`);
        await queryRunner.query(`DROP TABLE "temporary_answer"`);
        await queryRunner.query(`ALTER TABLE "question" RENAME TO "temporary_question"`);
        await queryRunner.query(`CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "text" varchar NOT NULL, "hint" varchar NOT NULL, "index" integer NOT NULL, "gameId" integer)`);
        await queryRunner.query(`INSERT INTO "question"("id", "createdAt", "updatedAt", "text", "hint", "index", "gameId") SELECT "id", "createdAt", "updatedAt", "text", "hint", "index", "gameId" FROM "temporary_question"`);
        await queryRunner.query(`DROP TABLE "temporary_question"`);
        await queryRunner.query(`ALTER TABLE "games" RENAME TO "temporary_games"`);
        await queryRunner.query(`CREATE TABLE "games" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "name" varchar NOT NULL, "ownerId" integer)`);
        await queryRunner.query(`INSERT INTO "games"("id", "createdAt", "updatedAt", "name", "ownerId") SELECT "id", "createdAt", "updatedAt", "name", "ownerId" FROM "temporary_games"`);
        await queryRunner.query(`DROP TABLE "temporary_games"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "users"("id", "username", "email") SELECT "id", "username", "email" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "games"`);
    }

}
