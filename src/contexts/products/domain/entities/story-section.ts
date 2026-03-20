export interface TextImageData {
  tag?: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePosition: "left" | "right" | "center";
}

export interface ComparisonTableRow {
  label: string;
  leftValue: string;
  rightValue: string;
  leftType: "text" | "boolean";
  rightType: "text" | "boolean";
}

export interface ComparisonTableData {
  title: string;
  subtitle?: string;
  leftImageUrl?: string;
  rightImageUrl?: string;
  rows: ComparisonTableRow[];
}

export interface StatItem {
  value: string;
  description: string;
}

export interface StatisticsData {
  tag?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  stats: StatItem[];
  backgroundColor?: string;
}

export type StorySectionType = "text_image" | "comparison_table" | "statistics";

export interface StorySection {
  id: string;
  type: StorySectionType;
  order: number;
  data: TextImageData | ComparisonTableData | StatisticsData;
}
