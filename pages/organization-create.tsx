"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/lib/auth/domain/schemas";
import { authClient } from "@/lib/auth/auth-client";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    mode: "onChange",
  });

  const name = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const generated = generateSlug(name);
      setValue("slug", generated);
    }
  }, [name, setValue]);

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setIsSubmitting(true);
    try {
      const session = await authClient.getSession();
      await authClient.organization.create({
        name: data.name,
        slug: data.slug,
        metadata: data.metadata,
        userId: session.data?.user.id || ""
      });

      router.push("/");
    } catch (error) {
      console.error("Organization creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <Image
          src="/images/login-bg.webp"
          alt="Background"
          fill
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-white text-2xl font-bold tracking-tight">
              CONTACTOS
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-white text-4xl font-semibold leading-tight">
              Crea tu organización
            </h2>
            <p className="text-white/70 text-lg">
              Define el nombre y slug de tu organización para comenzar a
              gestionar tus contactos.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <span>Creado por</span>
            <span className="font-medium text-white">Cristian Méndez</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Nueva organización
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa los datos para crear tu organización
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-zinc-700"
              >
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Mi organización"
                autoComplete="off"
                {...register("name")}
                className="w-full px-4 py-2 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="slug"
                className="text-sm font-medium text-zinc-700"
              >
                Slug{" "}
                <span className="text-muted-foreground font-normal">
                  (se genera automáticamente)
                </span>
              </Label>
              <Input
                id="slug"
                type="text"
                placeholder="mi-organizacion"
                autoComplete="off"
                readOnly
                {...register("slug")}
                className="w-full px-4 py-2 border-zinc-300 bg-zinc-50 text-zinc-600"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="metadata.description"
                className="text-sm font-medium text-zinc-700"
              >
                Descripción{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Textarea
                id="metadata.description"
                placeholder="describe tu organización"
                rows={3}
                {...register("metadata.description")}
                className="w-full px-4 py-2 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 resize-none"
              />
              {errors.metadata?.description && (
                <p className="text-sm text-red-500">
                  {errors.metadata.description.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5"
            >
              {isSubmitting ? "Creando..." : "Crear organización"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              Omitir por ahora
            </Link>
          </p>
        </div>

        <span className="absolute bottom-8 right-8 text-xs text-muted-foreground">
          v1.0.0
        </span>
      </div>
    </div>
  );
}