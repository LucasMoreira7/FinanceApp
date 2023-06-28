/*
  Warnings:

  - You are about to alter the column `date` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `date` on the `CardPurchases` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" TEXT NOT NULL,
    "expenseOrReceipt" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "associatedUserId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transactions_associatedUserId_fkey" FOREIGN KEY ("associatedUserId") REFERENCES "AssociatedUsers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transactions" ("associatedUserId", "category", "createdAt", "date", "description", "expenseOrReceipt", "id", "price", "updatedAt", "userId") SELECT "associatedUserId", "category", "createdAt", "date", "description", "expenseOrReceipt", "id", "price", "updatedAt", "userId" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
CREATE TABLE "new_CardPurchases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchasePrice" TEXT NOT NULL,
    "installments" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "associatedUserId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CardPurchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CardPurchases_associatedUserId_fkey" FOREIGN KEY ("associatedUserId") REFERENCES "AssociatedUsers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CardPurchases_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Cards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardPurchases" ("associatedUserId", "cardId", "category", "createdAt", "date", "description", "id", "installments", "purchasePrice", "updatedAt", "userId") SELECT "associatedUserId", "cardId", "category", "createdAt", "date", "description", "id", "installments", "purchasePrice", "updatedAt", "userId" FROM "CardPurchases";
DROP TABLE "CardPurchases";
ALTER TABLE "new_CardPurchases" RENAME TO "CardPurchases";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
