/**
 * Cálculos tributários para o Simulador de Impostos
 * Este arquivo contém as funções para calcular os impostos nos diferentes regimes tributários
 */

// Função principal para calcular impostos nos três regimes
function calcularImpostos(dados) {
    return {
        simplesNacional: calcularSimplesNacional(dados),
        lucroPresumido: calcularLucroPresumido(dados),
        irpf: calcularIRPF(dados)
    };
}

// Cálculo do Simples Nacional
function calcularSimplesNacional(dados) {
    let aliquota = 0;
    let valorMensal = 0;
    let descricaoAdicional = "";
    let valorINSS = 0;
    let anexoUtilizado = "";
    
    // Verificar se é afiliado (intermediador de serviço, sujeito ao Anexo V)
    if (dados.tipoNegocio === 'afiliado') {
        // Calcular o valor do pró-labore necessário para atingir o Fator R
        const proLaboreNecessario = dados.faturamentoMensal * 0.28; // 28% do faturamento
        valorINSS = proLaboreNecessario * 0.11; // 11% de INSS sobre o pró-labore
        
        // Com Fator R >= 28%, utiliza-se o Anexo III em vez do Anexo V
        // Determinar a faixa de faturamento e alíquota correspondente para o Anexo III
        anexoUtilizado = "Anexo III (com Fator R ≥ 28%)";
        
        if (dados.faturamentoAnual <= 180000) {
            aliquota = 6.0; // 6% para faturamento até R$ 180.000,00
        } else if (dados.faturamentoAnual <= 360000) {
            aliquota = 11.2; // 11,2% para faturamento até R$ 360.000,00
        } else if (dados.faturamentoAnual <= 720000) {
            aliquota = 13.5; // 13,5% para faturamento até R$ 720.000,00
        } else if (dados.faturamentoAnual <= 1800000) {
            aliquota = 16.0; // 16% para faturamento até R$ 1.800.000,00
        } else if (dados.faturamentoAnual <= 3600000) {
            aliquota = 21.0; // 21% para faturamento até R$ 3.600.000,00
        } else {
            aliquota = 33.0; // Acima do limite do Simples, consideramos uma alíquota alta
        }
        
        // Valor mensal a pagar (Simples Nacional + INSS do pró-labore)
        const valorSimples = (dados.faturamentoMensal * aliquota) / 100;
        valorMensal = valorSimples + valorINSS;
        
        // Descrição adicional para explicar o Fator R
        descricaoAdicional = `Aplicando estratégia do Fator R: Migração do Anexo V (15,5%+) para o ${anexoUtilizado} (${aliquota.toFixed(1)}%) + INSS sobre pró-labore de R$ ${proLaboreNecessario.toFixed(2)} (28% do faturamento)`;
    } else {
        // Para outros tipos de negócio, manter o cálculo original
        // Determinar a faixa de faturamento e alíquota correspondente
        // Anexo III do Simples Nacional (serviços)
        anexoUtilizado = "Anexo III";
        
        if (dados.faturamentoAnual <= 180000) {
            aliquota = 6.0; // 6% para faturamento até R$ 180.000,00
        } else if (dados.faturamentoAnual <= 360000) {
            aliquota = 11.2; // 11,2% para faturamento até R$ 360.000,00
        } else if (dados.faturamentoAnual <= 720000) {
            aliquota = 13.5; // 13,5% para faturamento até R$ 720.000,00
        } else if (dados.faturamentoAnual <= 1800000) {
            aliquota = 16.0; // 16% para faturamento até R$ 1.800.000,00
        } else if (dados.faturamentoAnual <= 3600000) {
            aliquota = 21.0; // 21% para faturamento até R$ 3.600.000,00
        } else {
            aliquota = 33.0; // Acima do limite do Simples, consideramos uma alíquota alta
        }
        
        // Para infoprodutos e serviços digitais, usamos uma alíquota reduzida
        if (dados.tipoNegocio === 'infoprodutos' || dados.tipoNegocio === 'servicos' || dados.tipoNegocio === 'coaching' || dados.tipoNegocio === 'adsense' || dados.tipoNegocio === 'socialmedia') {
            aliquota = aliquota * 0.7; // Redução fictícia para demonstração
        }
        
        // Cálculo do valor mensal a pagar
        valorMensal = (dados.faturamentoMensal * aliquota) / 100;
    }
    
    return {
        aliquota: aliquota,
        valorMensal: valorMensal,
        descricaoAdicional: descricaoAdicional,
        valorINSS: valorINSS,
        anexoUtilizado: anexoUtilizado
    };
}

// Cálculo do Lucro Presumido
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

// Cálculo do IRPF (Pessoa Física)
function calcularIRPF(dados) {
    // Dedução de despesas
    let baseCalculo = dados.faturamentoMensal;
    
    // Se possui contabilidade/livro caixa, pode deduzir despesas
    if (dados.possuiContabilidade) {
        baseCalculo = Math.max(0, dados.faturamentoMensal - dados.despesasMensais);
    }
    
    // Tabela progressiva do IRPF (valores de 2023)
    let valorIR = 0;
    let aliquotaEfetiva = 0;
    
    if (baseCalculo <= 2112.00) {
        // Isento
        valorIR = 0;
        aliquotaEfetiva = 0;
    } else if (baseCalculo <= 2826.65) {
        // 7,5%
        valorIR = (baseCalculo * 0.075) - 158.40;
        aliquotaEfetiva = (valorIR / dados.faturamentoMensal) * 100;
    } else if (baseCalculo <= 3751.05) {
        // 15%
        valorIR = (baseCalculo * 0.15) - 370.40;
        aliquotaEfetiva = (valorIR / dados.faturamentoMensal) * 100;
    } else if (baseCalculo <= 4664.68) {
        // 22,5%
        valorIR = (baseCalculo * 0.225) - 651.73;
        aliquotaEfetiva = (valorIR / dados.faturamentoMensal) * 100;
    } else {
        // 27,5%
        valorIR = (baseCalculo * 0.275) - 884.96;
        aliquotaEfetiva = (valorIR / dados.faturamentoMensal) * 100;
    }
    
    // Adicionar INSS (11% até o teto)
    const tetoINSS = 7507.49; // Teto do INSS em 2023
    const baseINSS = Math.min(dados.faturamentoMensal, tetoINSS);
    const valorINSS = baseINSS * 0.11;
    
    // Total mensal
    const valorMensal = valorIR + valorINSS;
    
    return {
        aliquota: aliquotaEfetiva,
        valorMensal: valorMensal
    };
}

// Função para simular diferentes cenários
function simularCenarios(dados) {
    const cenarios = [];
    
    // Cenário atual
    cenarios.push({
        nome: "Cenário Atual",
        faturamentoMensal: dados.faturamentoMensal,
        resultados: calcularImpostos(dados)
    });
    
    // Cenário com aumento de 20% no faturamento
    const dadosAumento = {...dados};
    dadosAumento.faturamentoMensal = dados.faturamentoMensal * 1.2;
    dadosAumento.faturamentoAnual = dados.faturamentoAnual * 1.2;
    
    cenarios.push({
        nome: "Aumento de 20% no Faturamento",
        faturamentoMensal: dadosAumento.faturamentoMensal,
        resultados: calcularImpostos(dadosAumento)
    });
    
    // Cenário com redução de 20% nas despesas
    const dadosReducao = {...dados};
    dadosReducao.despesasMensais = dados.despesasMensais * 0.8;
    
    cenarios.push({
        nome: "Redução de 20% nas Despesas",
        faturamentoMensal: dados.faturamentoMensal,
        resultados: calcularImpostos(dadosReducao)
    });
    
    return cenarios;
}
