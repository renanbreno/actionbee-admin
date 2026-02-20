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
 * Formata CNPJ para exibição: 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
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
 * Aplica máscara de CPF/CNPJ durante a digitação
 * Alterna automaticamente entre CPF e CNPJ dependendo da quantidade de dígitos
 */
export function maskDocument(value: string): string {
  const digits = value.replace(/\D/g, "");

  // Até 11 dígitos = CPF, acima disso = CNPJ
  if (digits.length <= 11) {
    return formatCPF(digits.slice(0, 11));
  } else {
    return formatCNPJ(digits.slice(0, 14));
  }
}

/**
 * Formata documento (CPF ou CNPJ) para exibição
 * Detecta automaticamente pelo tamanho
 */
export function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return formatCPF(digits);
  }

  if (digits.length === 14) {
    return formatCNPJ(digits);
  }

  // Se não está completo, tenta formatar como CPF ou CNPJ
  return maskDocument(value);
}

/**
 * Aplica máscara de CPF durante a digitação
 * @deprecated Use maskDocument instead
 */
export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return formatCPF(digits);
}

/**
 * Aplica máscara de CNPJ durante a digitação
 * @deprecated Use maskDocument instead
 */
export function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return formatCNPJ(digits);
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
 * @deprecated Use unmaskDocument instead
 */
export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Remove formatação do CNPJ (deixa apenas números)
 * @deprecated Use unmaskDocument instead
 */
export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Remove formatação do documento (CPF ou CNPJ) - deixa apenas números
 */
export function unmaskDocument(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Remove formatação do telefone (deixa apenas números)
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Retorna o tipo de documento baseado no número de dígitos
 */
export function getDocumentType(value: string): "cpf" | "cnpj" | null {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return null;
  if (digits.length <= 11) return "cpf";
  return "cnpj";
}
