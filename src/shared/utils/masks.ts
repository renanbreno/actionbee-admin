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

/**
 * Aplica máscara de moeda (BRL) durante a digitação
 * Formato: R$ 0,00
 *
 * @param value - Valor para mascarar (string com números ou formatado)
 * @returns Valor formatado como moeda brasileira
 *
 * @example
 * maskCurrency("10") → "R$ 10,00"
 * maskCurrency("1000") → "R$ 1.000,00"
 * maskCurrency("10,50") → "R$ 10,50"
 * maskCurrency("R$ 10,00") → "R$ 10,00"
 */
export function maskCurrency(value: string): string {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, "");

  // Se não tem dígitos, retorna vazio
  if (digits.length === 0) return "";

  // Converte para centavos (últimos 2 dígitos são os centavos)
  const numericValue = Number(digits) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

/**
 * Remove máscara de moeda (retorna apenas os centavos como número)
 *
 * @param value - Valor formatado como moeda brasileira
 * @returns Valor numérico em centavos
 *
 * @example
 * unmaskCurrency("R$ 10,00") → 1000
 * unmaskCurrency("R$ 1.000,50") → 100050
 * unmaskCurrency("") → 0
 */
export function unmaskCurrency(value: string): number {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, "");

  // Se não tem dígitos, retorna 0
  if (digits.length === 0) return 0;

  return Number(digits);
}

/**
 * Formata valor numérico como moeda brasileira para exibição
 *
 * @param value - Valor numérico em reais
 * @returns String formatada como moeda brasileira
 *
 * @example
 * formatCurrency(10) → "R$ 10,00"
 * formatCurrency(1000.5) → "R$ 1.000,50"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Converte valor formatado como moeda para valor numérico em reais
 *
 * @param value - Valor formatado como moeda brasileira
 * @returns Valor numérico em reais
 *
 * @example
 * currencyToNumber("R$ 10,00") → 10
 * currencyToNumber("R$ 1.000,50") → 1000.5
 */
export function currencyToNumber(value: string): number {
  return unmaskCurrency(value) / 100;
}

/**
 * Rich text utilities for Tiptap JSON serialization
 */

export interface RichTextContent {
  type: string;
  content?: Array<RichTextContent | { text: string; type?: "text" }>;
  attrs?: Record<string, unknown>;
  text?: string;
}

/**
 * Validates if a string is valid JSON
 */
export function isValidJson(value: string): boolean {
  if (!value || value.trim() === "") return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes rich text content for storage
 * - Ensures valid JSON structure
 * - Handles edge cases like empty content
 * - Returns null for truly empty content
 */
export function normalizeRichText(value: string | null | undefined): string | null {
  if (!value || value.trim() === "") return null;

  // If it's already valid JSON, keep it
  if (isValidJson(value)) {
    const parsed = JSON.parse(value);
    // Check if it has actual content
    if (isEmptyRichText(parsed)) {
      return null;
    }
    return value;
  }

  // If it's plain text, convert to Tiptap JSON format
  if (value.trim()) {
    const json: RichTextContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: value,
            },
          ],
        },
      ],
    };
    return JSON.stringify(json);
  }

  return null;
}

/**
 * Checks if rich text JSON has actual content
 */
export function isEmptyRichText(content: RichTextContent | unknown): boolean {
  if (!content || typeof content !== "object") return true;

  const json = content as RichTextContent;

  // Empty doc
  if (json.type === "doc" && (!json.content || json.content.length === 0)) {
    return true;
  }

  // Check for empty paragraphs
  if (json.content) {
    let hasText = false;
    for (const node of json.content) {
      if (typeof node === "object") {
        if ("text" in node && node.text && node.text.trim() !== "") {
          hasText = true;
          break;
        }
        if ("content" in node && node.content && node.content.length > 0) {
          for (const child of node.content) {
            if (typeof child === "object" && "text" in child && child.text && child.text.trim() !== "") {
              hasText = true;
              break;
            }
          }
        }
      }
    }
    return !hasText;
  }

  return true;
}

/**
 * Converts rich text JSON to plain text for previews
 */
export function richTextToPlainText(jsonString: string | null | undefined): string {
  if (!jsonString) return "";

  try {
    const parsed = JSON.parse(jsonString) as RichTextContent;
    return extractTextFromNode(parsed);
  } catch {
    // If not valid JSON, return as-is
    return jsonString;
  }
}

function extractTextFromNode(node: RichTextContent | unknown): string {
  if (!node || typeof node !== "object") return "";

  const n = node as RichTextContent;

  if (n.text) {
    return n.text;
  }

  if (n.content && Array.isArray(n.content)) {
    return n.content.map((child) => extractTextFromNode(child)).join("");
  }

  return "";
}
