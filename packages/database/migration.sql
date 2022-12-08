-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "nickname" VARCHAR(64) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "links" JSONB NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "url" VARCHAR(256) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "url" VARCHAR(256) NOT NULL,
    "index" INTEGER NOT NULL,
    "icon" VARCHAR(256),
    "banner" VARCHAR(256),
    "description" VARCHAR(512) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTags" (
    "id" UUID NOT NULL,
    "tagsId" UUID NOT NULL,
    "documentsId" UUID NOT NULL,

    CONSTRAINT "DocumentTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documentauthors" (
    "id" UUID NOT NULL,
    "documentsId" UUID NOT NULL,
    "authorsId" UUID NOT NULL,

    CONSTRAINT "Documentauthors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "url" VARCHAR(256) NOT NULL,
    "content" TEXT NOT NULL,
    "banner" VARCHAR(256),
    "icon" VARCHAR(256),
    "description" VARCHAR(512) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "index" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,
    "categoriesId" UUID NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authors_nickname_key" ON "authors"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "authors_email_key" ON "authors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_url_key" ON "Tags"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_url_key" ON "Categories"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_url_key" ON "Documents"("url");

-- AddForeignKey
ALTER TABLE "DocumentTags" ADD CONSTRAINT "DocumentTags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTags" ADD CONSTRAINT "DocumentTags_documentsId_fkey" FOREIGN KEY ("documentsId") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentauthors" ADD CONSTRAINT "Documentauthors_documentsId_fkey" FOREIGN KEY ("documentsId") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentauthors" ADD CONSTRAINT "Documentauthors_authorsId_fkey" FOREIGN KEY ("authorsId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
