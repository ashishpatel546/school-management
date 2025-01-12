import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegistrationAndRollNumber1709123456790 implements MigrationInterface {
    name = 'AddRegistrationAndRollNumber1709123456790';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create temporary table with new schema
        await queryRunner.query(`
            CREATE TABLE "users_new" (
                "id" varchar PRIMARY KEY,
                "mobileNumber" varchar NOT NULL,
                "password" varchar NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "role" varchar NOT NULL,
                "isFirstLogin" boolean NOT NULL DEFAULT (1),
                "isActive" boolean NOT NULL DEFAULT (1),
                "registrationNumber" varchar NOT NULL UNIQUE,
                "rollNumber" varchar,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

        // Copy data from old table to new table
        await queryRunner.query(`
            INSERT INTO "users_new" ("id", "mobileNumber", "password", "firstName", "lastName", "role", "isFirstLogin", "isActive", "registrationNumber", "createdAt", "updatedAt")
            SELECT "id", "mobileNumber", "password", "firstName", "lastName", "role", "isFirstLogin", "isActive", "id" as "registrationNumber", "createdAt", "updatedAt"
            FROM "users"
        `);

        // Drop old table
        await queryRunner.query(`DROP TABLE "users"`);

        // Rename new table to original name
        await queryRunner.query(`ALTER TABLE "users_new" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create temporary table without new columns
        await queryRunner.query(`
            CREATE TABLE "users_old" (
                "id" varchar PRIMARY KEY,
                "mobileNumber" varchar NOT NULL,
                "password" varchar NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "role" varchar NOT NULL,
                "isFirstLogin" boolean NOT NULL DEFAULT (1),
                "isActive" boolean NOT NULL DEFAULT (1),
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

        // Copy data excluding new columns
        await queryRunner.query(`
            INSERT INTO "users_old" ("id", "mobileNumber", "password", "firstName", "lastName", "role", "isFirstLogin", "isActive", "createdAt", "updatedAt")
            SELECT "id", "mobileNumber", "password", "firstName", "lastName", "role", "isFirstLogin", "isActive", "createdAt", "updatedAt"
            FROM "users"
        `);

        // Drop new table
        await queryRunner.query(`DROP TABLE "users"`);

        // Rename old table to original name
        await queryRunner.query(`ALTER TABLE "users_old" RENAME TO "users"`);
    }
}
