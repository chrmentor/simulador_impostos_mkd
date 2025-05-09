/**
 * Teste do cálculo do Lucro Presumido para verificar a alíquota efetiva
 * Este script testa o cálculo com um faturamento de R$ 50.000,00
 */

// Definição das constantes para o teste
const TABELAS = {
    lucroPresumido: {
        presuncaoServicos: 0.32,
        presuncaoComercio: 0.08,
        ir: 0.15,
        csll: 0.09,
        pis: 0.0065,
        cofins: 0.03,
        iss: 0.03, // Alíquota corrigida de 5% para 3%
        adicionalIR: { limite: 20000, aliquota: 0.10 }
    }
};

// Dados de teste
const dadosTeste = {
    faturamentoMensal: 50000,
    tipoNegocio: 'infoprodutos'
};

// Função de teste do cálculo do Lucro Presumido
function testarCalculoLucroPresumido(dados) {
    console.log("=== TESTE DO CÁLCULO DO LUCRO PRESUMIDO ===");
    console.log(`Faturamento mensal: R$ ${dados.faturamentoMensal.toFixed(2)}`);
    console.log(`Tipo de negócio: ${dados.tipoNegocio}`);
    console.log("-------------------------------------------");
    
    // Definir percentual de presunção com base no tipo de negócio
    let percentualPresuncao = TABELAS.lucroPresumido.presuncaoServicos; // Padrão para serviços
    
    if (dados.tipoNegocio === 'comercio' || dados.tipoNegocio === 'afiliado') {
        percentualPresuncao = TABELAS.lucroPresumido.presuncaoComercio;
    }
    
    // Base de cálculo para IR e CSLL
    const baseCalculoIRCSLL = dados.faturamentoMensal * percentualPresuncao;
    console.log(`Base de cálculo (${(percentualPresuncao * 100).toFixed(0)}%): R$ ${baseCalculoIRCSLL.toFixed(2)}`);
    
    // Cálculo do IR
    let valorIR = baseCalculoIRCSLL * TABELAS.lucroPresumido.ir;
    console.log(`IRPJ (${(TABELAS.lucroPresumido.ir * 100).toFixed(0)}%): R$ ${valorIR.toFixed(2)}`);
    
    // Adicional de IR - CORRIGIDO: Não aplicamos o adicional para este exemplo
    // Apenas aplicaríamos se a base de cálculo mensal ultrapassar o limite de R$ 20.000,00
    if (baseCalculoIRCSLL > TABELAS.lucroPresumido.adicionalIR.limite) {
        const excedente = baseCalculoIRCSLL - TABELAS.lucroPresumido.adicionalIR.limite;
        const adicionalIR = excedente * TABELAS.lucroPresumido.adicionalIR.aliquota;
        valorIR += adicionalIR;
        console.log(`Adicional de IRPJ (${(TABELAS.lucroPresumido.adicionalIR.aliquota * 100).toFixed(0)}%): R$ ${adicionalIR.toFixed(2)}`);
    } else {
        console.log(`Adicional de IRPJ: R$ 0.00 (base mensal não excede R$ ${TABELAS.lucroPresumido.adicionalIR.limite.toFixed(2)})`);
    }
    
    // Cálculo dos demais tributos
    const valorCSLL = baseCalculoIRCSLL * TABELAS.lucroPresumido.csll;
    console.log(`CSLL (${(TABELAS.lucroPresumido.csll * 100).toFixed(0)}%): R$ ${valorCSLL.toFixed(2)}`);
    
    const valorPIS = dados.faturamentoMensal * TABELAS.lucroPresumido.pis;
    console.log(`PIS (${(TABELAS.lucroPresumido.pis * 100).toFixed(2)}%): R$ ${valorPIS.toFixed(2)}`);
    
    const valorCOFINS = dados.faturamentoMensal * TABELAS.lucroPresumido.cofins;
    console.log(`COFINS (${(TABELAS.lucroPresumido.cofins * 100).toFixed(0)}%): R$ ${valorCOFINS.toFixed(2)}`);
    
    // ISS varia conforme o município e tipo de serviço
    let valorISS = 0;
    if (dados.tipoNegocio !== 'comercio' && dados.tipoNegocio !== 'afiliado') {
        valorISS = dados.faturamentoMensal * TABELAS.lucroPresumido.iss;
        console.log(`ISS (${(TABELAS.lucroPresumido.iss * 100).toFixed(0)}%): R$ ${valorISS.toFixed(2)}`);
    } else {
        console.log(`ISS: R$ 0.00 (não aplicável para este tipo de negócio)`);
    }
    
    // Total mensal
    const valorMensal = valorIR + valorCSLL + valorPIS + valorCOFINS + valorISS;
    console.log("-------------------------------------------");
    console.log(`Total de impostos: R$ ${valorMensal.toFixed(2)}`);
    
    // Alíquota efetiva
    const aliquotaEfetiva = (valorMensal / dados.faturamentoMensal) * 100;
    console.log(`Alíquota efetiva: ${aliquotaEfetiva.toFixed(2)}%`);
    
    // Verificação da alíquota esperada
    console.log("-------------------------------------------");
    if (Math.abs(aliquotaEfetiva - 14.33) < 0.01) {
        console.log("✅ TESTE APROVADO: A alíquota efetiva está correta (14,33%)");
    } else {
        console.log(`❌ TESTE FALHOU: A alíquota efetiva deveria ser 14,33%, mas é ${aliquotaEfetiva.toFixed(2)}%`);
    }
    
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

// Executar o teste
const resultado = testarCalculoLucroPresumido(dadosTeste);

// Verificação detalhada dos componentes
console.log("\n=== VERIFICAÇÃO DETALHADA DOS COMPONENTES ===");
console.log("Componentes do cálculo para um faturamento de R$ 50.000,00:");
console.log(`1. Base de cálculo (32%): R$ ${(dadosTeste.faturamentoMensal * 0.32).toFixed(2)}`);
console.log(`2. IRPJ (15%): R$ ${(dadosTeste.faturamentoMensal * 0.32 * 0.15).toFixed(2)}`);
console.log(`3. CSLL (9%): R$ ${(dadosTeste.faturamentoMensal * 0.32 * 0.09).toFixed(2)}`);
console.log(`4. PIS (0,65%): R$ ${(dadosTeste.faturamentoMensal * 0.0065).toFixed(2)}`);
console.log(`5. COFINS (3%): R$ ${(dadosTeste.faturamentoMensal * 0.03).toFixed(2)}`);
console.log(`6. ISS (3%): R$ ${(dadosTeste.faturamentoMensal * 0.03).toFixed(2)}`);

// Cálculo manual da alíquota efetiva
const totalManual = (dadosTeste.faturamentoMensal * 0.32 * 0.15) + 
                    (dadosTeste.faturamentoMensal * 0.32 * 0.09) + 
                    (dadosTeste.faturamentoMensal * 0.0065) + 
                    (dadosTeste.faturamentoMensal * 0.03) + 
                    (dadosTeste.faturamentoMensal * 0.03);

console.log(`Total manual: R$ ${totalManual.toFixed(2)}`);
console.log(`Alíquota efetiva manual: ${((totalManual / dadosTeste.faturamentoMensal) * 100).toFixed(2)}%`);

// Verificação final
console.log("\n=== CONCLUSÃO ===");
console.log(`A alíquota efetiva do Lucro Presumido para um faturamento de R$ 50.000,00 é ${resultado.aliquota.toFixed(2)}%`);
console.log(`O valor total de impostos a pagar é R$ ${resultado.valorMensal.toFixed(2)}`);
