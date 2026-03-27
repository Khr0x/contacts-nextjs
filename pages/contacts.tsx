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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleIcon, UserIcon, EditIcon, DeleteIcon } from "@hugeicons/core-free-icons";
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
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);
  const [deleteContactId, setDeleteContactId] = React.useState<string | null>(null);
  const { data: org } = useActiveOrganization();
  const [showOrgAlert, setShowOrgAlert] = React.useState(false);

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
    if (!org?.id) {
      setShowOrgAlert(true);
      setIsLoading(false);
      return;
    }

    setShowOrgAlert(false);
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

  const onUpdateSubmit = async (data: ContactFormData) => {
    if (!editingContact?.id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts/${editingContact.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email || "",
          phone: data.phone || "",
        }),
      });

      if (res.ok) {
        reset();
        setIsSheetOpen(false);
        setEditingContact(null);
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
      console.error("Error updating contact:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteContactId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts/${deleteContactId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setDeleteContactId(null);
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
      console.error("Error deleting contact:", error);
    }
  };

  const openEditSheet = (contact: Contact) => {
    setEditingContact(contact);
    reset({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setIsSheetOpen(true);
  };

  const openNewSheet = () => {
    setEditingContact(null);
    reset({ name: "", email: "", phone: "" });
    setIsSheetOpen(true);
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
        <Button onClick={openNewSheet}>
          <HugeiconsIcon icon={CircleIcon} strokeWidth={2} className="mr-2" />
          Nuevo contacto
        </Button>
      </div>

      {showOrgAlert && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex flex-col items-center justify-center py-8 px-6">
            <p className="text-amber-800 font-medium text-center mb-3">
              Primero necesitas crear tu primera organización
            </p>
            <Button
              onClick={() => window.location.href = "/organizations"}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Crear organización
            </Button>
          </CardContent>
        </Card>
      )}

      {!showOrgAlert && !isLoading && contacts.length === 0 && (
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
              onClick={openNewSheet}
            >
              Agregar tu primer contacto
            </Button>
          </CardContent>
        </Card>
      )}

      {!showOrgAlert && !isLoading && contacts.length > 0 && (
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
                <div className="flex gap-1">
                  <Button size="icon-xs" variant="ghost" onClick={() => openEditSheet(contact)}>
                    <HugeiconsIcon icon={EditIcon} strokeWidth={2} className="h-4 w-4" />
                  </Button>
                  <Button size="icon-xs" variant="ghost" onClick={() => setDeleteContactId(contact.id)}>
                    <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!showOrgAlert && isLoading && (
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
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-6">
          <SheetHeader>
            <SheetTitle>{editingContact ? "Editar contacto" : "Nuevo contacto"}</SheetTitle>
            <SheetDescription>
              {editingContact ? "Actualiza los datos del contacto" : "Completa los datos del contacto"}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(editingContact ? onUpdateSubmit : onSubmit)} className="space-y-4 mt-4">
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
              <Button type="button" variant="outline" onClick={() => { setIsSheetOpen(false); setEditingContact(null); }}>
                Cancelar
              </Button>
              <Button type="submit">{editingContact ? "Actualizar contacto" : "Guardar contacto"}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteContactId} onOpenChange={() => setDeleteContactId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contacto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El contacto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteContactId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}