"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "@/lib/auth/domain/schemas";
import { authClient } from "@/lib/auth/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {

      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        roles: ["user"],
      });

      router.push("/organization-create");

    } catch (error) {
      console.error("Registration error:", error);
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
            <span className="text-white text-2xl font-bold tracking-tight">CONTACTOS</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-white text-4xl font-semibold leading-tight">
              Únete a nosotros
            </h2>
            <p className="text-white/70 text-lg">
              Crea tu cuenta y comienza a gestionar tus contactos de manera fácil y segura.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <span>Creado por</span>
            <span className="font-medium text-white">Cristian Méndez</span>
            <div className="flex items-center gap-3 ml-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Crear cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para registrarte y comenzar a gestionar tus contactos
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                {...register("name")}
                className="w-full px-4 py-2 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                autoComplete="email"
                {...register("email")}
                className="w-full px-4 py-2 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Contraseña
              </Label>
              <PasswordInput
                id="password"
                placeholder="Crea una contraseña"
                autoComplete="new-password"
                {...register("password")}
                className="w-full px-4 py-2 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
                Confirmar contraseña
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              Inicia sesión
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