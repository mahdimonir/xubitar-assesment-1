import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PreorderForm } from "@/components/preorder/PreorderForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdatePreorderPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const preorder = await prisma.preorder.findUnique({
    where: { id },
  });

  if (!preorder) {
    notFound();
  }

  const serializedPreorder = {
    name: preorder.name,
    products: preorder.products,
    preorderWhen: preorder.preorderWhen as "out-of-stock" | "regardless-of-stock",
    startsAt: preorder.startsAt.toISOString(),
    endsAt: preorder.endsAt ? preorder.endsAt.toISOString() : null,
    active: preorder.active,
  };

  return (
    <main className="max-w-4xl mx-auto py-10 bg-[#f7f8fa] min-h-screen">
      <PreorderForm mode="edit" id={id} initialData={serializedPreorder} />
    </main>
  );
}
