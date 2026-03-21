/**
 * Valida se um e-mail tem formato válido
 * @param email - E-mail a ser validado
 * @returns true se o e-mail é válido, false caso contrário
 *
 * @example
 * validateEmail("test@example.com") → true
 * validateEmail("invalid") → false
 * validateEmail("test@") → false
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  // Regex robusto para validação de e-mail
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email.trim());
}

/**
 * Valida se um telefone brasileiro é válido
 * Fixo: 10 dígitos (DDD + 8 dígitos, primeiro dígito do número entre 2-5)
 * Celular: 11 dígitos (DDD + 9 + 8 dígitos)
 * @param value - Telefone com ou sem máscara
 * @returns true se o telefone é válido ou vazio, false caso contrário
 *
 * @example
 * validatePhone("(85) 99677-9170") → true (celular, 11 dígitos)
 * validatePhone("(85) 99677-917") → false (celular incompleto, 10 dígitos mas começa com 9)
 * validatePhone("(85) 3232-1234") → true (fixo, 10 dígitos)
 * validatePhone("") → true
 * validatePhone(undefined) → true
 */
export function validatePhone(value: string | undefined): boolean {
  if (!value) return true;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return true;

  // DDD (2 dígitos) + número
  if (digits.length < 10 || digits.length > 11) return false;

  const numberPart = digits.slice(2); // Remove o DDD

  // Se o número começa com 9, é celular e deve ter 9 dígitos (total 11)
  if (numberPart.startsWith("9")) {
    return digits.length === 11;
  }

  // Fixo: 8 dígitos (total 10)
  return digits.length === 10;
}

/**
 * Valida se um CPF é válido segundo o algoritmo oficial
 * @param cpf - CPF com ou sem máscara
 * @returns true se o CPF é válido, false caso contrário
 *
 * @example
 * validateCPF("123.456.789-09") → false
 * validateCPF("529.982.247-25") → true
 * validateCPF("52998224725") → true
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, "");

  // CPF deve ter 11 dígitos
  if (cleaned.length !== 11) return false;

  // Não pode ser todos os mesmos dígitos
  if (/^(\d)\1+$/.test(cleaned)) return false;

  // Valida dígitos verificadores
  let sum = 0;
  let remainder;

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
}

/**
 * Valida se um CNPJ é válido segundo o algoritmo oficial
 * @param cnpj - CNPJ com ou sem máscara
 * @returns true se o CNPJ é válido, false caso contrário
 *
 * @example
 * validateCNPJ("12.345.678/0001-90") → false
 * validateCNPJ("11.444.777/0001-61") → true
 * validateCNPJ("11444777000161") → true
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, "");

  // CNPJ deve ter 14 dígitos
  if (cleaned.length !== 14) return false;

  // Não pode ser todos os mesmos dígitos
  if (/^(\d)\1+$/.test(cleaned)) return false;

  // Valida primeiro dígito verificador (13ª posição)
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i];
  }

  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleaned.charAt(12)) !== digit1) return false;

  // Valida segundo dígito verificador (14ª posição)
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i];
  }

  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return parseInt(cleaned.charAt(13)) === digit2;
}

/**
 * Valida se um documento (CPF ou CNPJ) é válido
 * Detecta automaticamente o tipo de documento
 * @param document - Documento com ou sem máscara
 * @returns true se o documento é válido, false caso contrário
 *
 * @example
 * validateDocument("529.982.247-25") → true
 * validateDocument("11.444.777/0001-61") → true
 * validateDocument("123.456.789-09") → false
 */
/**
 * Valida se uma data no formato dd/mm/aaaa é válida
 * Aceita string vazia ou undefined (campo opcional)
 * @param value - Data no formato dd/mm/aaaa
 * @returns true se a data é válida ou vazia, false caso contrário
 *
 * @example
 * validateBirthDate("15/05/2000") → true
 * validateBirthDate("31/02/2000") → false
 * validateBirthDate("12") → false
 * validateBirthDate("") → true
 * validateBirthDate(undefined) → true
 */
export function validateBirthDate(value: string | undefined): boolean {
  if (!value) return true;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return true;

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, day, month, year] = match;
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > new Date().getFullYear()) return false;

  // Valida se a data realmente existe (ex: 31/02 não existe)
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function validateDocument(document: string): boolean {
  const cleaned = document.replace(/\D/g, "");

  // Detecta tipo pelo número de dígitos
  if (cleaned.length === 11) {
    return validateCPF(cleaned);
  }

  if (cleaned.length === 14) {
    return validateCNPJ(cleaned);
  }

  return false;
}
