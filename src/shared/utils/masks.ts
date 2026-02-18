/**
 * Formata CPF para exibição: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Formata telefone para exibição: (00) 00000-0000 ou (00) 0000-0000
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  // Verifica se é telefone de 8 ou 9 dígitos (com DDD)
  const hasNineDigits = digits.length === 11 || digits.length === 10;
  if (hasNineDigits) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Aplica máscara de CPF durante a digitação
 */
export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return formatCPF(digits);
}

/**
 * Aplica máscara de telefone durante a digitação
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return formatPhone(digits);
}

/**
 * Remove formatação do CPF (deixa apenas números)
 */
export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Remove formatação do telefone (deixa apenas números)
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "");
}
