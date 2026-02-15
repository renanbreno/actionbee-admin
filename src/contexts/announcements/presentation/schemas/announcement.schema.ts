import { z } from "zod";

export const createAnnouncementSchema = z
  .object({
    message: z
      .string()
      .min(3, "Mensagem deve ter pelo menos 3 caracteres")
      .max(500, "Mensagem não pode ter mais de 500 caracteres"),
    type: z.enum(["promotion", "warning", "info"], {
      message: "Selecione o tipo do anúncio",
    }),
    startsAt: z.date({ message: "Selecione a data de início" }),
    endsAt: z.date().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.endsAt && data.startsAt) {
        return data.endsAt.getTime() > data.startsAt.getTime();
      }
      return true;
    },
    {
      message: "Data de término deve ser posterior à data de início",
      path: ["endsAt"],
    },
  );

export type CreateAnnouncementFormValues = z.infer<typeof createAnnouncementSchema>;
