-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('ADMIN', 'USER', 'MOVER');

-- CreateEnum
CREATE TYPE "order_type" AS ENUM ('ONE_MAN_TRUCK', 'TWO_MEN_TRUCK', 'TWO_MEN_MEDIUM_TRUCK', 'ONE_MAN_LARGE_TRUCK');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PLACED', 'CANCELLED', 'QUEUED', 'IN_PROGRESS', 'COMPLETED', 'UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "order_desc" AS ENUM ('PIANO', 'BILLIARD_TABLE', 'OTHERS');

-- CreateEnum
CREATE TYPE "vehicle_type" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "payment_mode" AS ENUM ('ONLINE', 'CASH', 'PENDING', 'ACCOUNT');

-- CreateEnum
CREATE TYPE "vehicle_approval_status" AS ENUM ('APPROVED', 'UNAPPROVED');

-- CreateEnum
CREATE TYPE "order_time_slots" AS ENUM ('6AM-10AM', '10AM-1PM', '1PM-4PM');

-- CreateTable
CREATE TABLE "users" (
    "name" VARCHAR,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR,
    "authToken" VARCHAR,
    "googleAuthToken" VARCHAR,
    "user_type" "user_type" NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "email_verification_code" INTEGER,
    "email_verification_status" BOOLEAN NOT NULL DEFAULT false,
    "phone_verification_code" INTEGER,
    "phone_verification_status" BOOLEAN NOT NULL DEFAULT false,
    "password_reset_code" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_token" VARCHAR,
    "pfp_public_id" TEXT,
    "pfp_public_url" TEXT,
    "address" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "type" "order_type" NOT NULL,
    "userEmail" VARCHAR NOT NULL,
    "moverEmail" VARCHAR,
    "final_payment_amount" TEXT,
    "final_order_value" TEXT,
    "payment_cleared" BOOLEAN DEFAULT false,
    "order_status" "order_status" NOT NULL DEFAULT 'PLACED',
    "payment_status" "payment_status",
    "final_payment_id" TEXT,
    "pickup_address" TEXT NOT NULL,
    "destination_address" TEXT NOT NULL,
    "pickup_address_long" TEXT NOT NULL,
    "pickup_address_lat" TEXT NOT NULL,
    "destination_address_long" TEXT NOT NULL,
    "destination_address_lat" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "order_time" "order_time_slots" NOT NULL,
    "order_desc" "order_desc" NOT NULL,
    "packingAndMoving" BOOLEAN DEFAULT false,
    "dismantlingAndReassembling" BOOLEAN DEFAULT false,
    "order_addintional_info" VARCHAR,
    "order_completed" BOOLEAN NOT NULL DEFAULT false,
    "vehicleId" TEXT,
    "order_start_time" TIMESTAMP(3),
    "order_break_time_start" TIMESTAMP(3),
    "ordre_break_time_end" TIMESTAMP(3),
    "orderBreakAllowed" INTEGER DEFAULT 30,
    "order_start_otp" TEXT,
    "order_completion_time" TIMESTAMP(3),
    "order_completion_otp" TEXT,
    "order_completion_timeSpan" TEXT,
    "rating" TEXT,
    "review" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tolls" JSONB[],

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "junkremovaljobs" (
    "orderId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "junkRemovedDetails" JSONB,
    "signatureId" TEXT,
    "jobOtp" INTEGER,

    CONSTRAINT "junkremovaljobs_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "unsafejobconsent" (
    "orderId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "signatureId" TEXT,
    "unsafeJobConsentOtp" INTEGER,

    CONSTRAINT "unsafejobconsent_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "orderImages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "orderImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderexpenses" (
    "orderId" UUID NOT NULL,
    "junkRemoval" INTEGER,
    "movingCost" INTEGER,
    "tollExpense" INTEGER,
    "discountApplied" INTEGER,
    "otherCharges" JSONB,

    CONSTRAINT "orderexpenses_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "vehicle_number" TEXT NOT NULL,
    "vehicle_type" "vehicle_type" NOT NULL,
    "moverEmail" TEXT NOT NULL,
    "approved" "vehicle_approval_status",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("vehicle_number")
);

-- CreateTable
CREATE TABLE "movers" (
    "moverEmail" VARCHAR NOT NULL,
    "document_verification_status" BOOLEAN NOT NULL DEFAULT false,
    "mover_earnings" DOUBLE PRECISION,
    "mover_cash" DOUBLE PRECISION,
    "last_cashout_date" TIMESTAMP(3),
    "companyEmail" VARCHAR,
    "profitShare" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastOrderCompleted" TIMESTAMP(3),
    "licnese_public_id" TEXT,
    "vehicle_reg_public_id" TEXT,
    "insurance_public_id" TEXT,

    CONSTRAINT "movers_pkey" PRIMARY KEY ("moverEmail")
);

-- CreateTable
CREATE TABLE "company" (
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "person_name" TEXT NOT NULL,
    "tax_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "mode" "payment_mode" NOT NULL,
    "userEmail" TEXT NOT NULL,
    "orderId" UUID NOT NULL,
    "couponId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discountcoupons" (
    "id" UUID NOT NULL,
    "offer" INTEGER NOT NULL,
    "code" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discountcoupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_orderId_key" ON "invoices"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_phone_key" ON "company"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_moverEmail_fkey" FOREIGN KEY ("moverEmail") REFERENCES "movers"("moverEmail") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("vehicle_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "junkremovaljobs" ADD CONSTRAINT "junkremovaljobs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unsafejobconsent" ADD CONSTRAINT "unsafejobconsent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderImages" ADD CONSTRAINT "orderImages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderexpenses" ADD CONSTRAINT "orderexpenses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_moverEmail_fkey" FOREIGN KEY ("moverEmail") REFERENCES "movers"("moverEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movers" ADD CONSTRAINT "movers_moverEmail_fkey" FOREIGN KEY ("moverEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movers" ADD CONSTRAINT "movers_companyEmail_fkey" FOREIGN KEY ("companyEmail") REFERENCES "company"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "discountcoupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
