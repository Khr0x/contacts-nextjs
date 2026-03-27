"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleIcon, UserIcon } from "@hugeicons/core-free-icons";
import { contactSchema, type ContactFormData } from "@/lib/auth/domain/schemas";
import { useActiveOrganization } from "@/lib/auth/auth-client";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  tenant_id: string;
}

const initialContacts: Contact[] = [

];

export default function ContactsPage() {
  const [contacts, setContacts] = React.useState<Contact[]>(initialContacts);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { data: org } = useActiveOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  React.useEffect(() => {
    if (!org?.id) return;

    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts`, {
        credentials: "include",
      })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContacts(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [org?.id]);

  const onSubmit = async (data: ContactFormData) => {
    if (!org?.id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email || "",
          phone: data.phone || "",
          tenant_id: org.id,
        }),
      });

      if (res.ok) {
        reset();
        setIsSheetOpen(false);
        // Volver a consultar la lista
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setContacts(data);
            }
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            {contacts.length} contacto{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>
          <HugeiconsIcon icon={CircleIcon} strokeWidth={2} className="mr-2" />
          Nuevo contacto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HugeiconsIcon
              icon={UserIcon}
              strokeWidth={1.5}
              className="h-12 w-12 text-muted-foreground mb-4"
            />
            <p className="text-muted-foreground text-center">
              No hay contactos registrados.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsSheetOpen(true)}
            >
              Agregar tu primer contacto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <HugeiconsIcon
                    icon={UserIcon}
                    strokeWidth={2}
                    className="h-5 w-5 text-primary"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contact.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.email}
                  </p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-6">
          <SheetHeader>
            <SheetTitle>Nuevo contacto</SheetTitle>
            <SheetDescription>
              Completa los datos del contacto
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nombre completo"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+52 55 1234 5678"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar contacto</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}