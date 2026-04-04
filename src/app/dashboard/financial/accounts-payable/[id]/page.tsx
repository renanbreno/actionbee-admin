"use client";

import { use } from "react";
import { PayableDetailPage } from "@/contexts/financial/presentation/components/payable-detail-page";

export default function PayableDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PayableDetailPage payableId={id} />;
}
