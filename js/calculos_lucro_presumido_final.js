/**
 * Cálculo correto do Lucro Presumido para o Simulador de Impostos
 * Este arquivo contém a implementação correta do cálculo do Lucro Presumido
 * com alíquota de ISS de 3% e sem adicional de IRPJ para bases mensais abaixo de R$ 20.000,00
 */

// Função para calcular o Lucro Presumido corretamente
function calcularLucroPresumidoCorreto(dados) {
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
        valorMensal: valorMensal,
        detalhes: {
            percentualPresuncao: presuncaoLucro * 100,
            baseCalculo: baseCalculoIRCSLL,
            ir: valorIR,
            csll: valorCSLL,
            pis: valorPIS,
            cofins: valorCOFINS,
            iss: valorISS,
            aliquotaEfetiva: aliquotaEfetiva
        }
    };
}

// Sobrescrever a função original de cálculo do Lucro Presumido
// Esta função será chamada pelo script principal
const calcularLucroPresumidoOriginal = calcularLucroPresumido;
calcularLucroPresumido = function(dados) {
    return calcularLucroPresumidoCorreto(dados);
};

// Sobrescrever a função principal de cálculo de impostos
// para garantir que use a versão correta do cálculo do Lucro Presumido
const calcularImpostosOriginal = calcularImpostos;
calcularImpostos = function(dados) {
    return {
        simplesNacional: calcularSimplesNacional(dados),
        lucroPresumido: calcularLucroPresumidoCorreto(dados),
        irpf: calcularIRPF(dados)
    };
};

console.log("Cálculo do Lucro Presumido corrigido carregado com sucesso!");
