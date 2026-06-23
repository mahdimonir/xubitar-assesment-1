import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { formatPreorderDate } from "@/lib/date";
import { FilterTabs } from "@/components/preorder/FilterTabs";
import { SortDropdown } from "@/components/preorder/SortDropdown";
import { PreorderTable } from "@/components/preorder/PreorderTable";
import { Pagination } from "@/components/preorder/Pagination";

const queryParamsSchema = z.object({
  status: z.enum(["all", "active", "inactive"]).catch("all"),
  sortBy: z.enum(["name", "createdAt", "startsAt", "endsAt"]).catch("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).catch("desc"),
  page: z.coerce.number().int().min(1).catch(1),
});

interface PageProps {
  searchParams: Promise<{
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const parsed = queryParamsSchema.parse(resolvedParams);

  const limit = 8;
  const skip = (parsed.page - 1) * limit;

  const where: Prisma.PreorderWhereInput = {};
  if (parsed.status === "active") {
    where.active = true;
  } else if (parsed.status === "inactive") {
    where.active = false;
  }

  const orderBy = { [parsed.sortBy]: parsed.sortOrder };

  const [preorders, totalCount] = await prisma.$transaction([
    prisma.preorder.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.preorder.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;
  if (parsed.page > totalPages) {
    redirect(`/?status=${parsed.status}&sortBy=${parsed.sortBy}&sortOrder=${parsed.sortOrder}&page=${totalPages}`);
  }

  const serializedPreorders = preorders.map((p) => ({
    id: p.id,
    name: p.name,
    products: p.products,
    preorderWhen: p.preorderWhen,
    startsAt: formatPreorderDate(p.startsAt),
    endsAt: p.endsAt ? formatPreorderDate(p.endsAt) : null,
    active: p.active,
  }));

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 md:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 select-none">
          Preorders
        </h1>
        <Link
          href="/preorder/create"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-sm select-none"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Preorder
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <FilterTabs />
          <SortDropdown />
        </div>

        <PreorderTable preorders={serializedPreorders} />

        <Pagination totalItems={totalCount} itemsPerPage={limit} />
      </div>
    </main>
  );
}
