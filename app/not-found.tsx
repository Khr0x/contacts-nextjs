"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { HomeIcon, ArrowLeftIcon } from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon
          icon={ArrowLeftIcon}
          strokeWidth={1.5}
          className="h-12 w-12 text-muted-foreground"
        />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Página no encontrada. La ruta que buscas no existe.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <HugeiconsIcon
              icon={HomeIcon}
              strokeWidth={2}
              className="mr-2 h-4 w-4"
            />
            Inicio
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <HugeiconsIcon
            icon={ArrowLeftIcon}
            strokeWidth={2}
            className="mr-2 h-4 w-4"
          />
          Volver atrás
        </Button>
      </div>
    </div>
  );
}
