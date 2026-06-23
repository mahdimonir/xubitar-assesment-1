"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { preorderFormSchema, PreorderFormValues } from "@/lib/validations";
import { formatDatabaseError } from "@/lib/errors";

export async function createPreorderAction(data: PreorderFormValues) {
  try {
    const { name, products, preorderWhen, startsAt, endsAt, active } = preorderFormSchema.parse(data);

    await prisma.preorder.create({
      data: {
        name,
        products,
        preorderWhen,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        active,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to create preorder:", error);
    if (error instanceof ZodError) {
      const message = error.errors.map((err) => err.message).join(", ");
      return { success: false, error: message };
    }
    const message = formatDatabaseError(error, "Failed to create preorder.");
    return { success: false, error: message };
  }
}

export async function updatePreorderAction(id: string, data: PreorderFormValues) {
  try {
    const { name, products, preorderWhen, startsAt, endsAt, active } = preorderFormSchema.parse(data);

    await prisma.preorder.update({
      where: { id },
      data: {
        name,
        products,
        preorderWhen,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        active,
      },
    });

    revalidatePath("/");
    revalidatePath(`/preorder/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update preorder:", error);
    if (error instanceof ZodError) {
      const message = error.errors.map((err) => err.message).join(", ");
      return { success: false, error: message };
    }
    const message = formatDatabaseError(error, "Failed to update preorder.");
    return { success: false, error: message };
  }
}

export async function togglePreorderStatusAction(id: string, active: boolean) {
  try {
    await prisma.preorder.update({
      where: { id },
      data: { active },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to toggle preorder status:", error);
    const message = formatDatabaseError(error, "Failed to update status.");
    return { success: false, error: message };
  }
}

export async function deletePreorderAction(id: string) {
  try {
    await prisma.preorder.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete preorder:", error);
    const message = formatDatabaseError(error, "Failed to delete preorder.");
    return { success: false, error: message };
  }
}
