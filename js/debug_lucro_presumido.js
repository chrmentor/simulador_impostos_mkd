/**
 * Arquivo de depuração para o cálculo do Lucro Presumido
 * 
 * Este arquivo substitui a função de cálculo do Lucro Presumido no arquivo calculos_avancados.js
 * para corrigir a alíquota do ISS de 5% para 3%.
 */

// Correção para o cálculo do Lucro Presumido em calculos_avancados.js
function calcularLucroPresumido(dados) {
    // Definir percentual de presunção com base no tipo de negócio
    let percentualPresuncao = 0.32; // Padrão para serviços (infoprodutores e afiliados)
    
    if (dados.tipoNegocio === 'comercio') {
        percentualPresuncao = 0.08;
    }
    
    // Base de cálculo para IR e CSLL
    const baseCalculoIRCSLL = dados.faturamentoMensal * percentualPresuncao;
    
    // Cálculo do IR
    let valorIR = baseCalculoIRCSLL * 0.15;
    
    // Adicional de IR se a base de cálculo mensal ultrapassar o limite
    if (baseCalculoIRCSLL > 20000) {
        const excedente = baseCalculoIRCSLL - 20000;
        valorIR += excedente * 0.10;
    }
    
    // Cálculo dos demais tributos
    const valorCSLL = baseCalculoIRCSLL * 0.09;
    const valorPIS = dados.faturamentoMensal * 0.0065;
    const valorCOFINS = dados.faturamentoMensal * 0.03;
    
    // ISS com alíquota corrigida de 3% (era 5% anteriormente)
    let valorISS = dados.faturamentoMensal * 0.03;
    
    // Total mensal
    const valorMensal = valorIR + valorCSLL + valorPIS + valorCOFINS + valorISS;
    
    // Alíquota efetiva
    const aliquotaEfetiva = (valorMensal / dados.faturamentoMensal) * 100;
    
    return {
        aliquota: aliquotaEfetiva,
        valorMensal: valorMensal,
        detalhes: {
            percentualPresuncao: percentualPresuncao * 100,
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

// Exemplo de uso para verificação
function testarCalculo() {
    const dados = {
        faturamentoMensal: 50000,
        tipoNegocio: 'infoprodutos'
    };
    
    const resultado = calcularLucroPresumido(dados);
    
    console.log("=== TESTE DE CÁLCULO DO LUCRO PRESUMIDO CORRIGIDO ===");
    console.log(`Faturamento mensal: R$ ${dados.faturamentoMensal.toFixed(2)}`);
    console.log(`Base de cálculo (32%): R$ ${resultado.detalhes.baseCalculo.toFixed(2)}`);
    console.log(`IRPJ: R$ ${resultado.detalhes.ir.toFixed(2)}`);
    console.log(`CSLL: R$ ${resultado.detalhes.csll.toFixed(2)}`);
    console.log(`PIS: R$ ${resultado.detalhes.pis.toFixed(2)}`);
    console.log(`COFINS: R$ ${resultado.detalhes.cofins.toFixed(2)}`);
    console.log(`ISS (corrigido para 3%): R$ ${resultado.detalhes.iss.toFixed(2)}`);
    console.log(`Total de impostos: R$ ${resultado.valorMensal.toFixed(2)}`);
    console.log(`Alíquota efetiva: ${resultado.aliquota.toFixed(2)}%`);
    
    // Verificação da alíquota esperada
    const aliquotaEsperada = 14.33;
    console.log(`\nAlíquota esperada: ${aliquotaEsperada}%`);
    console.log(`Diferença: ${(resultado.aliquota - aliquotaEsperada).toFixed(2)}%`);
    console.log(`Resultado: ${Math.abs(resultado.aliquota - aliquotaEsperada) < 0.01 ? 'CORRETO' : 'INCORRETO'}`);
}

// Executar teste se este arquivo for executado diretamente
if (typeof require !== 'undefined' && require.main === module) {
    testarCalculo();
}
