import { PreorderForm } from "@/components/preorder/PreorderForm";

export default function CreatePreorderPage() {
  return (
    <main className="max-w-4xl mx-auto py-10 bg-[#f7f8fa] min-h-screen">
      <PreorderForm mode="create" />
    </main>
  );
}
