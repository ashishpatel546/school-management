"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1709123456789 = void 0;
class InitialMigration1709123456789 {
    constructor() {
        this.name = 'InitialMigration1709123456789';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "classes" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "grade" integer NOT NULL,
        "section" varchar NOT NULL,
        "baseFee" decimal(10,2) NOT NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "mobileNumber" varchar UNIQUE NOT NULL,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "role" varchar CHECK( role IN ('student', 'parent', 'teacher', 'admin', 'super_admin') ) NOT NULL,
        "isFirstLogin" boolean NOT NULL DEFAULT (1),
        "isActive" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "classId" varchar,
        CONSTRAINT "FK_users_classes" FOREIGN KEY ("classId") REFERENCES "classes" ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "subjects" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "code" varchar NOT NULL,
        "description" varchar
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "exams" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "date" datetime NOT NULL,
        "description" varchar,
        "classId" varchar,
        "subjectId" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_exams_classes" FOREIGN KEY ("classId") REFERENCES "classes" ("id"),
        CONSTRAINT "FK_exams_subjects" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "fees" (
        "id" varchar PRIMARY KEY NOT NULL,
        "amount" float NOT NULL,
        "extraCurriculumFee" float NOT NULL DEFAULT (0),
        "totalAmount" float NOT NULL,
        "status" varchar CHECK( status IN ('pending', 'paid', 'overdue') ) NOT NULL DEFAULT ('pending'),
        "dueDate" datetime NOT NULL,
        "paidDate" datetime,
        "studentId" varchar,
        "classId" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_fees_users" FOREIGN KEY ("studentId") REFERENCES "users" ("id"),
        CONSTRAINT "FK_fees_classes" FOREIGN KEY ("classId") REFERENCES "classes" ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "attendance" (
        "id" varchar PRIMARY KEY NOT NULL,
        "date" date NOT NULL,
        "present" boolean NOT NULL DEFAULT (0),
        "studentId" varchar,
        "classId" varchar,
        "markedById" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_attendance_users_student" FOREIGN KEY ("studentId") REFERENCES "users" ("id"),
        CONSTRAINT "FK_attendance_classes" FOREIGN KEY ("classId") REFERENCES "classes" ("id"),
        CONSTRAINT "FK_attendance_users_teacher" FOREIGN KEY ("markedById") REFERENCES "users" ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "extra_curriculum" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "fee" decimal(10,2) NOT NULL,
        "description" varchar
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "classes_teachers" (
        "classesId" varchar NOT NULL,
        "usersId" varchar NOT NULL,
        PRIMARY KEY ("classesId", "usersId"),
        CONSTRAINT "FK_classes_teachers_classes" FOREIGN KEY ("classesId") REFERENCES "classes" ("id"),
        CONSTRAINT "FK_classes_teachers_users" FOREIGN KEY ("usersId") REFERENCES "users" ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "subjects_classes" (
        "subjectsId" varchar NOT NULL,
        "classesId" varchar NOT NULL,
        PRIMARY KEY ("subjectsId", "classesId"),
        CONSTRAINT "FK_subjects_classes_subjects" FOREIGN KEY ("subjectsId") REFERENCES "subjects" ("id"),
        CONSTRAINT "FK_subjects_classes_classes" FOREIGN KEY ("classesId") REFERENCES "classes" ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "extra_curriculum_students" (
        "extraCurriculumId" varchar NOT NULL,
        "usersId" varchar NOT NULL,
        PRIMARY KEY ("extraCurriculumId", "usersId"),
        CONSTRAINT "FK_extra_curriculum_students_extra" FOREIGN KEY ("extraCurriculumId") REFERENCES "extra_curriculum" ("id"),
        CONSTRAINT "FK_extra_curriculum_students_users" FOREIGN KEY ("usersId") REFERENCES "users" ("id")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "extra_curriculum_students"`);
        await queryRunner.query(`DROP TABLE "subjects_classes"`);
        await queryRunner.query(`DROP TABLE "classes_teachers"`);
        await queryRunner.query(`DROP TABLE "extra_curriculum"`);
        await queryRunner.query(`DROP TABLE "attendance"`);
        await queryRunner.query(`DROP TABLE "fees"`);
        await queryRunner.query(`DROP TABLE "exams"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1709123456789 = InitialMigration1709123456789;
//# sourceMappingURL=1709123456789-InitialMigration.js.map