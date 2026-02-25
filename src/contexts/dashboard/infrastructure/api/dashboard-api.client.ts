import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { DashboardMetrics, TopAffiliate, TopAffiliateCategory } from "../../domain/entities/dashboard";

export type DashboardPeriod = "week" | "month" | "custom";

export interface GetDashboardParams {
  period?: DashboardPeriod;
  week?: number; // 1–53
  month?: number; // 1–12
  year?: number;
  from?: string; // ISO date string for custom period
  to?: string; // ISO date string for custom period
  force?: boolean;
}

function getAffiliatePeriod(params?: GetDashboardParams): 'week' | 'month' | 'quarter' | 'year' | 'custom' {
  if (!params?.period || params.period === "custom") return "custom";
  if (params.period === "week") return "week";
  if (params.period === "month") return "month";
  return "custom";
}

function getAffiliateDateRange(params?: GetDashboardParams): { startDate?: string; endDate?: string } {
  if (!params) return {};

  if (params.from && params.to) {
    return { startDate: params.from, endDate: params.to };
  }

  // Se for mês, calcular range do mês
  if (params.period === "month" && params.month && params.year) {
    const lastDay = new Date(params.year, params.month, 0).getDate();
    return {
      startDate: `${params.year}-${String(params.month).padStart(2, '0')}-01`,
      endDate: `${params.year}-${String(params.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
    };
  }

  return {};
}

// Helper para mapear dados de afiliados do backend para o tipo frontend
function mapTopAffiliate(backend: any): TopAffiliate {
  return {
    name: backend.affiliateName ?? backend.name ?? "",
    orders: backend.totalOrders ?? backend.orders ?? 0,
    commissionEarned: backend.totalCommission ?? backend.commissionEarned ?? 0,
    totalGrossRevenue: backend.totalGrossRevenue ?? 0,
    totalNetRevenue: backend.totalNetRevenue ?? 0,
    pendingCommission: backend.pendingCommission ?? 0,
    paidCommission: backend.paidCommission ?? 0,
    avgCommissionRate: backend.avgCommissionRate ?? 0,
  };
}

function mapTopAffiliateCategory(backend: any): TopAffiliateCategory {
  return {
    categoryId: backend.categoryId ?? "",
    categoryName: backend.categoryName ?? "",
    orders: backend.orders ?? backend.totalOrders ?? 0,
    revenue: backend.revenue ?? backend.totalGrossRevenue ?? 0,
    netRevenue: backend.netRevenue ?? backend.totalNetRevenue ?? 0,
    commissionEarned: backend.commissionEarned ?? backend.totalCommission ?? 0,
    grossRevenuePercent: backend.grossRevenuePercent ?? 0,
    netRevenuePercent: backend.netRevenuePercent ?? 0,
  };
}

export const dashboardApiClient = {
  async getMetrics(params?: GetDashboardParams): Promise<DashboardMetrics> {
    const search = new URLSearchParams();
    if (params?.period) search.set("period", params.period);
    if (params?.week) search.set("week", String(params.week));
    if (params?.month) search.set("month", String(params.month));
    if (params?.year) search.set("year", String(params.year));
    if (params?.from) search.set("from", params.from);
    if (params?.to) search.set("to", params.to);
    if (params?.force) search.set("force", "true");
    const qs = search.toString();

    // Buscar dashboard principal
    const mainDashboard = apiFetch<any>(`/admin/dashboard${qs ? `?${qs}` : ""}`);

    // Buscar dados de afiliados
    const affiliatePeriod = getAffiliatePeriod(params);
    const affiliateDateRange = getAffiliateDateRange(params);
    const affiliateSearchParams = new URLSearchParams();
    affiliateSearchParams.set("period", affiliatePeriod);
    if (affiliateDateRange.startDate) affiliateSearchParams.set("startDate", affiliateDateRange.startDate);
    if (affiliateDateRange.endDate) affiliateSearchParams.set("endDate", affiliateDateRange.endDate);

    const affiliateDashboard = apiFetch<any>(`/admin/affiliate-dashboard/bonification?${affiliateSearchParams.toString()}`);

    const [mainData, affiliateData] = await Promise.all([mainDashboard, affiliateDashboard]);

    // topAffiliates vem do endpoint de afiliados (tem dados mais ricos)
    const mappedTopAffiliates = affiliateData.topAffiliates?.map(mapTopAffiliate) ?? [];
    const fallbackTopAffiliates = mainData.affiliates?.topAffiliates?.map(mapTopAffiliate) ?? [];

    // topCategories sempre vem do dashboard principal — único que calcula percentuais de receita
    const topCategories = mainData.affiliates?.topCategories?.map(mapTopAffiliateCategory) ?? [];

    // Mapear topCoupons (couponUsage) do backend para o frontend
    const mappedCouponUsage = affiliateData.topCoupons?.map((c: any) => ({
      code: c.couponCode ?? c.code ?? "",
      usedCount: c.totalOrders ?? c.usedCount ?? 0,
      totalDiscount: c.totalDiscountGiven ?? c.totalDiscount ?? 0,
    })) ?? mainData.affiliates?.couponUsage ?? [];

    // Combinar dados
    return {
      ...mainData,
      affiliates: {
        ...mainData.affiliates,
        totalAffiliates: affiliateData.summary?.totalAffiliates ?? 0,
        totalActiveCoupons: affiliateData.summary?.totalActiveCoupons ?? 0,
        totalOrdersWithCommission: affiliateData.summary?.totalOrdersWithCommission ?? 0,
        totalGrossRevenue: affiliateData.summary?.totalGrossRevenue ?? 0,
        totalNetRevenue: affiliateData.summary?.totalNetRevenue ?? 0,
        totalRevenueGenerated: affiliateData.summary?.totalNetRevenue ?? 0,
        totalCommissionGenerated: affiliateData.summary?.totalCommissionGenerated ?? 0,
        totalCommissionPaid: affiliateData.summary?.totalCommissionPaid ?? 0,
        totalCommissionPending: affiliateData.summary?.totalCommissionPending ?? 0,
        totalCommissionCancelled: affiliateData.summary?.totalCommissionCancelled ?? 0,
        avgCommissionRate: affiliateData.summary?.avgCommissionRate ?? 0,
        commissionByStatus: affiliateData.commissionByStatus ?? [],
        topAffiliates: mappedTopAffiliates.length > 0 ? mappedTopAffiliates : fallbackTopAffiliates,
        topCategories,
        couponUsage: mappedCouponUsage,
        shipmentMetrics: affiliateData.shipmentMetrics ?? [],
        paymentTrend: affiliateData.paymentTrend ?? [],
      },
    };
  },
};
