export function generateValidCNPJ(): string {
  // Gera os primeiros 12 dígitos aleatoriamente
  let cnpj = `${Math.floor(10000000 + Math.random() * 89999999)}0001`;

  const calcCheckDigit = (base: string, factors: number[]): number => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * factors[i];
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  // Calcula o primeiro dígito verificador
  const firstCheckDigit = calcCheckDigit(
    cnpj,
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  cnpj += firstCheckDigit;

  // Calcula o segundo dígito verificador
  const secondCheckDigit = calcCheckDigit(
    cnpj,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  cnpj += secondCheckDigit;

  return cnpj;
}
