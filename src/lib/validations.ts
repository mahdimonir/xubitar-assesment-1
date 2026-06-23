import { z } from "zod";

export const preorderFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  products: z.coerce.number().int().min(1, "Products must be at least 1"),
  preorderWhen: z.enum(["out-of-stock", "regardless-of-stock"]),
  startsAt: z.string().min(1, "Starts At date is required"),
  endsAt: z.string().nullable().optional(),
  active: z.boolean().default(true),
}).refine((data) => {
  if (data.startsAt && data.endsAt) {
    const start = new Date(data.startsAt);
    const end = new Date(data.endsAt);
    return end > start;
  }
  return true;
}, {
  message: "Ends At date must be after Starts At date",
  path: ["endsAt"],
});

export type PreorderFormValues = z.infer<typeof preorderFormSchema>;
