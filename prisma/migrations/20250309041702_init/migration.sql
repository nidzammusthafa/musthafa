-- CreateTable
CREATE TABLE "admin_accounts" (
    "username" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "admin_accounts_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "members" (
    "username" VARCHAR(100) NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "payer" TEXT NOT NULL,
    "payee" TEXT NOT NULL,
    "description" TEXT,
    "adminId" TEXT NOT NULL,
    "memberUsername" VARCHAR(100),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_accounts_email_key" ON "admin_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_accounts_phone_key" ON "admin_accounts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_key" ON "members"("phone");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_accounts"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_memberUsername_fkey" FOREIGN KEY ("memberUsername") REFERENCES "members"("username") ON DELETE SET NULL ON UPDATE CASCADE;
