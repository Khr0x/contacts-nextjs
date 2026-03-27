"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/lib/auth/domain/schemas";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations, isPending, refetch } = authClient.useListOrganizations();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    mode: "onChange",
  });

  const name = watch("name");

  useEffect(() => {
    if (name) {
      const generated = generateSlug(name);
      setValue("slug", generated);
    }
  }, [name, setValue]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setIsSubmitting(true);
    try {
      const session = await authClient.getSession();
      await authClient.organization.create({
        name: data.name,
        slug: data.slug,
        metadata: data.metadata,
        userId: session.data?.user.id || "",
      });
      reset();
      setIsSheetOpen(false);
      refetch();
    } catch (error) {
      console.error("Organization creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Organizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las organizaciones de tus contactos.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-muted-foreground">Cargando organizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Organizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las organizaciones de tus contactos.
          </p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nueva organización
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-sans">Nueva organización</SheetTitle>
            <SheetDescription >
              Ingresa los datos para crear tu organización
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
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
              <Label htmlFor="slug" className="text-sm font-medium text-zinc-700">
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
              <Label htmlFor="metadata.description" className="text-sm font-medium text-zinc-700">
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

            <SheetFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear organización"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {!organizations || organizations.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
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
                className="text-primary"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay organizaciones</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Crea una organización para empezar a agrupar tus contactos.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => {
            const isActive = activeOrganization?.id === org.id;
            return (
              <div
                key={org.id}
                className={`rounded-lg border bg-card p-6 text-card-foreground shadow-sm flex flex-col gap-4 ${isActive ? "border-primary ring-2 ring-primary/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{org.name}</h3>
                    {org.slug && (
                      <p className="text-sm text-muted-foreground">{org.slug}</p>
                    )}
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Activa
                    </span>
                  )}
                </div>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={isActive}
                  onClick={async () => {
                    await authClient.organization.setActive({
                      organizationId: org.id,
                      organizationSlug: org.slug || undefined,
                    });
                    router.push("/");
                  }}
                >
                  {isActive ? "Organización activa" : "Usar organización"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
