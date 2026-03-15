"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { OrderFormPage } from "@/components/orders/order-form-page";
import { useOrderDetail } from "@/contexts/orders/presentation/hooks/use-order-detail";

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: order, isLoading, isError } = useOrderDetail(id ?? null);

  useEffect(() => {
    if (!isLoading && (isError || (!order && !isLoading))) {
      router.replace("/dashboard/orders");
    }
  }, [isLoading, isError, order, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return <OrderFormPage mode="edit" initialData={order} orderId={id} />;
}
