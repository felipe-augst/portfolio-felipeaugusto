import { clsx, type ClassValue } from 'clsx'

// Junta classes condicionais, sem resolver conflito entre utilities: o tailwind-merge custava
// cerca de 8 kB no JS do cliente. Quem passa `className` acrescenta classes e não sobrescreve as
// do componente.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
