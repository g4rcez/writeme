-- CreateTable
CREATE TABLE "Authors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "nickname" VARCHAR(64) NOT NULL,
    "email" VARCHAR(256) NOT NULL,

    CONSTRAINT "Authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "url" VARCHAR(256) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTags" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "tagsId" UUID NOT NULL,

    CONSTRAINT "DocumentTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "url" VARCHAR(256) NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" UUID NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "url" VARCHAR(256) NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "authorId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authors_nickname_key" ON "Authors"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Authors_email_key" ON "Authors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_url_key" ON "Tags"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_url_key" ON "Categories"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_url_key" ON "Documents"("url");

-- AddForeignKey
ALTER TABLE "DocumentTags" ADD CONSTRAINT "DocumentTags_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTags" ADD CONSTRAINT "DocumentTags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
