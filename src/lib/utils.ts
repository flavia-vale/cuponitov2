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

/**
 * Verifica se um cupom está expirado com base na data de validade.
 */
export function isExpired(expiry: string | null): boolean {
  if (!expiry) return false;
  const expiryDate = new Date(expiry);
  // Se a data for inválida, consideramos não expirado para evitar falsos positivos
  if (isNaN(expiryDate.getTime())) return false;
  return expiryDate < new Date();
}

/**
 * Verifica se um cupom é obsoleto (stale).
 * Regra: Atualizado há mais de 6 meses E com 0 usos recentes (usando success_rate como proxy).
 */
export function isStale(updatedAt: string, successRate: number = 0): boolean {
  const updateDate = new Date(updatedAt);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  return updateDate < sixMonthsAgo && successRate === 0;
}

/**
 * Extrai um valor numérico do texto de desconto para fins de ordenação.
 * Ex: "20% OFF" -> 20, "R$ 50" -> 50
 */
export function getDiscountValue(discount: string): number {
  const match = discount.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

/**
 * Ordena cupons por: (1) Mais recentes, (2) Mais usados/sucesso, (3) Maior desconto.
 */
export function sortCoupons(coupons: any[]) {
  return [...coupons].sort((a, b) => {
    // 1. Mais recentes (updated_at)
    const dateA = new Date(a.updated_at || a.created_at).getTime();
    const dateB = new Date(b.updated_at || b.created_at).getTime();
    if (dateB !== dateA) return dateB - dateA;

    // 2. Mais usados (success_rate)
    if (b.success_rate !== a.success_rate) return b.success_rate - a.success_rate;

    // 3. Maior desconto
    const valA = getDiscountValue(a.discount || "");
    const valB = getDiscountValue(b.discount || "");
    return valB - valA;
  });
}