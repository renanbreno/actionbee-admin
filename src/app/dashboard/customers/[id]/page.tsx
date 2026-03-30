"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Customer360Sheet } from "@/contexts/customers/presentation/components/customer-360-sheet";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <Customer360Sheet
      customerId={id}
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}
