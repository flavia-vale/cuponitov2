"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-9xl font-black text-muted/30">404</div>
      <h1 className="text-3xl font-bold text-foreground">Página não encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        Ops! O cupom que você estava procurando ou esta página parece ter expirado ou mudado de lugar.
      </p>
      <Link to="/">
        <Button className="gap-2 rounded-full font-bold shadow-lg">
          <Home className="h-4 w-4" /> Voltar ao Início
        </Button>
      </Link>
    </div>
  );
}