import { Scale } from "lucide-react";
import Link from "next/link";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import { UnifiedLoginForm } from "@/components/forms/form-login-unified";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Fondo de estrellas */}
      <StarsBackground className="absolute inset-0 z-0" />

      {/* Contenido principal */}
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center text-white font-medium">
          <div className="bg-white text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Scale className="size-4 text-blue-600" />
          </div>
          LexFirm
        </Link>
        <UnifiedLoginForm />
      </div>
    </div>
  );
}