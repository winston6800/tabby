-- Create tables for users and profiles
CREATE TABLE "users" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL,
  "discord_id" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

CREATE TABLE "profiles" (
  "user_id" INTEGER NOT NULL PRIMARY KEY,
  "display_name" TEXT NOT NULL,
  "avatar_url" TEXT,
  "bio" TEXT,
  CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
