-- CreateIndex
CREATE INDEX "Preorder_active_createdAt_idx" ON "Preorder"("active", "createdAt");

-- CreateIndex
CREATE INDEX "Preorder_name_idx" ON "Preorder"("name");

-- CreateIndex
CREATE INDEX "Preorder_startsAt_idx" ON "Preorder"("startsAt");

-- CreateIndex
CREATE INDEX "Preorder_endsAt_idx" ON "Preorder"("endsAt");
