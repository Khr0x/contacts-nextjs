import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre debe tener menos de 100 caracteres"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
      .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener menos de 100 caracteres"),
  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(50, "El slug debe tener menos de 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  metadata: z
    .object({
      description: z.string().optional(),
    })
    .optional(),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre debe tener menos de 100 caracteres"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Ingresa un correo electrónico válido" }
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s\-()]{7,}$/.test(val),
      { message: "Ingresa un teléfono válido" }
    ),
});

export type ContactFormData = z.infer<typeof contactSchema>;