/**
 * Cálculo correto do Lucro Presumido para prestadores de serviço (infoprodutores e afiliados)
 * 
 * Para prestadores de serviço no regime de Lucro Presumido:
 * 1. Alíquota de presunção: 32% sobre o faturamento para IRPJ e CSLL
 * 2. IRPJ: 15% sobre o lucro presumido + adicional de 10% sobre o que exceder R$ 20.000/mês
 * 3. CSLL: 9% sobre o lucro presumido
 * 4. PIS: 0,65% sobre o faturamento bruto
 * 5. COFINS: 3% sobre o faturamento bruto
 * 6. ISS: 3% sobre o faturamento bruto (para serviços digitais)
 */

// Função para calcular o Lucro Presumido com ISS de 3%
function calcularLucroPresumido(dados) {
  // Presunção de lucro para serviços: 32%
  const presuncaoLucro = 0.32;
  
  // Base de cálculo para IR e CSLL
  const baseCalculoIRCSLL = dados.faturamentoMensal * presuncaoLucro;
  
  // Cálculo do IRPJ - 15% sobre o lucro presumido
  let valorIR = baseCalculoIRCSLL * 0.15;
  
  // Adicional de IRPJ (10% sobre o que exceder R$ 20.000/mês)
  if (baseCalculoIRCSLL > 20000) {
      valorIR += (baseCalculoIRCSLL - 20000) * 0.10;
  }
  
  // Cálculo da CSLL - 9% sobre o lucro presumido
  const valorCSLL = baseCalculoIRCSLL * 0.09;
  
  // Cálculo do PIS - 0,65% sobre faturamento bruto
  const valorPIS = dados.faturamentoMensal * 0.0065;
  
  // Cálculo da COFINS - 3% sobre faturamento bruto
  const valorCOFINS = dados.faturamentoMensal * 0.03;
  
  // Cálculo do ISS - 3% sobre faturamento bruto (para serviços digitais)
  const valorISS = dados.faturamentoMensal * 0.03;
  
  // Total mensal (incluindo ISS para serviços digitais)
  const valorMensal = valorIR + valorCSLL + valorPIS + valorCOFINS + valorISS;
  
  // Alíquota efetiva
  const aliquotaEfetiva = (valorMensal / dados.faturamentoMensal) * 100;
  
  return {
      aliquota: aliquotaEfetiva,
      valorMensal: valorMensal
  };
}
