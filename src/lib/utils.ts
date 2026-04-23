import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMonthYear() {
  const now = new Date();
  const month = now.toLocaleDateString('pt-BR', { month: 'long' });
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${now.getFullYear()}`;
}

export function isExpired(expiry: string | null): boolean {
  if (!expiry) return false;
  const expiryDate = new Date(expiry);
  if (isNaN(expiryDate.getTime())) return false;
  return expiryDate < new Date();
}

export function isStale(updatedAt: string, successRate: number = 0): boolean {
  const updateDate = new Date(updatedAt);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return updateDate < sixMonthsAgo && successRate === 0;
}

export function getDiscountValue(discount: string): number {
  const match = discount.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export function sortCoupons(coupons: any[]) {
  return [...coupons].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at).getTime();
    const dateB = new Date(b.updated_at || b.created_at).getTime();
    if (dateB !== dateA) return dateB - dateA;
    if (b.success_rate !== a.success_rate) return b.success_rate - a.success_rate;
    const valA = getDiscountValue(a.discount || "");
    const valB = getDiscountValue(b.discount || "");
    return valB - valA;
  });
}

/**
 * Atribui categoria baseada em palavras-chave no título/descrição.
 */
export function autoCategorize(title: string, description: string = ''): string {
  const text = `${title} ${description}`.toLowerCase();
  if (/frete gr[aá]ti|envio gr[aá]ti/.test(text)) return 'Frete Grátis';
  if (/moda|roupa|vest[iu]|fashion|cal[çc]ado|t[êe]nis/.test(text)) return 'Moda';
  if (/tech|eletr[ôo]|notebook|celular|smartphone|tv |ssd|gpu|gamer/.test(text)) return 'Tech';
  if (/delivery|comida|restaurante|ifood|pizza|lanche|burger/.test(text)) return 'Delivery';
  if (/viagem|hotel|passagem|hospedagem|a[eé]reo|turismo/.test(text)) return 'Viagens';
  if (/beleza|cosm[eé]t|maquiagem|perfume|skincare|cabelo/.test(text)) return 'Beleza';
  return 'Geral';
}