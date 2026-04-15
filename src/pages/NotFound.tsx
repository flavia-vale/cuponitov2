"use client";

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User tried to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <p className="mb-8 text-xl text-muted-foreground">Ops! Página não encontrada.</p>
      <Link to="/">
        <Button className="rounded-full px-8 font-bold">Voltar ao Início</Button>
      </Link>
    </div>
  );
};

export default NotFound;