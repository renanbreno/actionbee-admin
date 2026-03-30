export const PipelineType = {
  B2B: "B2B",
  B2C: "B2C",
} as const;
export type PipelineType = (typeof PipelineType)[keyof typeof PipelineType];

export const DealSource = {
  ECOMMERCE: "ECOMMERCE",
  LEAD_CAPTURE: "LEAD_CAPTURE",
  MANUAL: "MANUAL",
  REFERRAL: "REFERRAL",
} as const;
export type DealSource = (typeof DealSource)[keyof typeof DealSource];

export const InteractionType = {
  CALL: "CALL",
  EMAIL: "EMAIL",
  MEETING: "MEETING",
  NOTE: "NOTE",
  WHATSAPP: "WHATSAPP",
} as const;
export type InteractionType = (typeof InteractionType)[keyof typeof InteractionType];

export const TaskType = {
  FOLLOW_UP: "FOLLOW_UP",
  CALL: "CALL",
  EMAIL: "EMAIL",
  MEETING: "MEETING",
} as const;
export type TaskType = (typeof TaskType)[keyof typeof TaskType];

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
