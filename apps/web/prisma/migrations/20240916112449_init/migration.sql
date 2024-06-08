-- CreateEnum
CREATE TYPE "Type" AS ENUM ('images', 'predictions', 'experiments');

-- CreateEnum
CREATE TYPE "Images_Data_Type" AS ENUM ('image', 'text');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Arena" (
    "id" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://editor.analyticsvidhya.com/uploads/96804AI_Image_7.PNG',
    "description" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Arena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Activity',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "Type" NOT NULL,
    "userId" TEXT NOT NULL,
    "experimentsId" TEXT,
    "predictionsId" TEXT,
    "imagesId" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity_Monitoring" (
    "id" TEXT NOT NULL,
    "activities" INTEGER NOT NULL DEFAULT 0,
    "iots" INTEGER NOT NULL DEFAULT 0,
    "arenas" INTEGER NOT NULL DEFAULT 0,
    "predictions" INTEGER NOT NULL DEFAULT 0,
    "images" INTEGER NOT NULL DEFAULT 0,
    "experiments" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Activity_Monitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IoT" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interval" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "status" TEXT,
    "location" TEXT,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "arenaId" TEXT,
    "experimentsId" TEXT,

    CONSTRAINT "IoT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "device" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "arenaId" TEXT,

    CONSTRAINT "Experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiments_Data" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "nitrogen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "phosphorus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "potassium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ph" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "moisture" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "humidity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "experimentsId" TEXT NOT NULL,

    CONSTRAINT "Experiments_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Predictions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "arenaId" TEXT,
    "experimentsId" TEXT NOT NULL,

    CONSTRAINT "Predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Predictions_Data" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "predictionsId" TEXT NOT NULL,

    CONSTRAINT "Predictions_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "arenaId" TEXT,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images_Data" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "Images_Data_Type" NOT NULL,
    "image" TEXT,
    "text" TEXT,
    "role" TEXT,
    "imagesId" TEXT NOT NULL,

    CONSTRAINT "Images_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Arena_idx_userId_key" ON "Arena"("idx", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_experimentsId_key" ON "Activity"("experimentsId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_predictionsId_key" ON "Activity"("predictionsId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_imagesId_key" ON "Activity"("imagesId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_idx_userId_key" ON "Activity"("idx", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_Monitoring_userId_key" ON "Activity_Monitoring"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IoT_device_key" ON "IoT"("device");

-- CreateIndex
CREATE UNIQUE INDEX "IoT_experimentsId_key" ON "IoT"("experimentsId");

-- CreateIndex
CREATE UNIQUE INDEX "IoT_device_userId_key" ON "IoT"("device", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Predictions_userId_key" ON "Predictions"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arena" ADD CONSTRAINT "Arena_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_experimentsId_fkey" FOREIGN KEY ("experimentsId") REFERENCES "Experiments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_predictionsId_fkey" FOREIGN KEY ("predictionsId") REFERENCES "Predictions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity_Monitoring" ADD CONSTRAINT "Activity_Monitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IoT" ADD CONSTRAINT "IoT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IoT" ADD CONSTRAINT "IoT_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IoT" ADD CONSTRAINT "IoT_experimentsId_fkey" FOREIGN KEY ("experimentsId") REFERENCES "Experiments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiments" ADD CONSTRAINT "Experiments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiments" ADD CONSTRAINT "Experiments_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiments_Data" ADD CONSTRAINT "Experiments_Data_experimentsId_fkey" FOREIGN KEY ("experimentsId") REFERENCES "Experiments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predictions" ADD CONSTRAINT "Predictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predictions" ADD CONSTRAINT "Predictions_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predictions" ADD CONSTRAINT "Predictions_experimentsId_fkey" FOREIGN KEY ("experimentsId") REFERENCES "Experiments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predictions_Data" ADD CONSTRAINT "Predictions_Data_predictionsId_fkey" FOREIGN KEY ("predictionsId") REFERENCES "Predictions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images_Data" ADD CONSTRAINT "Images_Data_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
