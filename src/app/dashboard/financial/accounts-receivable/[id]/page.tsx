"use client";

import { use } from "react";
import { ReceivableDetailPage } from "@/contexts/financial/presentation/components/receivable-detail-page";

export default function ReceivableDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReceivableDetailPage receivableId={id} />;
}
