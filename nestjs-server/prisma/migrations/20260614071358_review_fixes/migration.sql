/*
  Warnings:

  - You are about to drop the column `content` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `news` table. All the data in the column will be lost.
  - You are about to alter the column `imageUrl` on the `news` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `text` on the `options` table. All the data in the column will be lost.
  - You are about to alter the column `photoUrl` on the `options` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `expires_in` on the `polls` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `polls` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `picture` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `city` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `country` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `instagram` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `telegram` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `twitter` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `vk` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `youtube` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `expires_at` to the `polls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "news" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "contentEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contentRu" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "titleEn" VARCHAR(200) NOT NULL DEFAULT '',
ADD COLUMN     "titleRu" VARCHAR(200) NOT NULL DEFAULT '',
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "options" DROP COLUMN "text",
ADD COLUMN     "textEn" VARCHAR(200) NOT NULL DEFAULT '',
ADD COLUMN     "textRu" VARCHAR(200) NOT NULL DEFAULT '',
ALTER COLUMN "photoUrl" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "polls" DROP COLUMN "expires_in",
DROP COLUMN "question",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "questionEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "questionRu" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descriptionEn" VARCHAR(1000),
ADD COLUMN     "descriptionRu" VARCHAR(1000),
ADD COLUMN     "nameEn" VARCHAR(200) NOT NULL DEFAULT '',
ADD COLUMN     "nameRu" VARCHAR(200) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "displayName",
ADD COLUMN     "display_name" TEXT NOT NULL,
ALTER COLUMN "picture" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "instagram" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "telegram" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "twitter" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "vk" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "youtube" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE INDEX "news_created_at_idx" ON "news"("created_at");

-- CreateIndex
CREATE INDEX "options_poll_id_idx" ON "options"("poll_id");

-- CreateIndex
CREATE INDEX "polls_tournament_id_idx" ON "polls"("tournament_id");

-- CreateIndex
CREATE INDEX "polls_winner_option_id_idx" ON "polls"("winner_option_id");

-- CreateIndex
CREATE INDEX "polls_expires_at_idx" ON "polls"("expires_at");

-- CreateIndex
CREATE INDEX "tournaments_date_idx" ON "tournaments"("date");

-- CreateIndex
CREATE INDEX "tournaments_created_at_idx" ON "tournaments"("created_at");

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_winner_option_id_fkey" FOREIGN KEY ("winner_option_id") REFERENCES "options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
