-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "postnom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "dateNaissance" TEXT NOT NULL,
    "lieuNaissance" TEXT NOT NULL,
    "nationalite" TEXT NOT NULL,
    "adresseActuelle" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "telephoneSecondaire" TEXT,
    "email" TEXT NOT NULL,
    "niveauEtudes" TEXT NOT NULL,
    "professionActuelle" TEXT NOT NULL,
    "situationMatrimoniale" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,
    "filiere" TEXT NOT NULL,
    "filiereAutre" TEXT,
    "engagement" BOOLEAN NOT NULL DEFAULT false,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "commentaire" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");
