/**
 * Cálculos tributários para o Simulador de Impostos
 * Este arquivo contém as funções para calcular os impostos nos diferentes regimes tributários
 */

// Função principal para calcular impostos nos três regimes
function calcularImpostos(dados) {
    const simples = calcularSimplesNacional(dados);
    const presumido = calcularLucroPresumido(dados);
    const real = calcularLucroReal(dados); // Adicionada a chamada para calcularLucroReal

    return {
        simplesNacional: simples.valorMensal, // Retorna o valor mensal diretamente
        lucroPresumido: presumido.valorMensal, // Retorna o valor mensal diretamente
        lucroReal: real // Retorna o valor mensal diretamente (ou Infinity)
    };
}

// Cálculo do Simples Nacional
function calcularSimplesNacional(dados) {
    let aliquota = 0;
    let valorMensal = 0;
    let descricaoAdicional = "";
    let valorINSS = 0;
    let anexoUtilizado = "";
    
    if (dados.tipoNegocio === 'afiliado') {
        const proLaboreNecessario = dados.faturamentoMensal * 0.28;
        valorINSS = proLaboreNecessario * 0.11;
        anexoUtilizado = "Anexo III (com Fator R ≥ 28%)";
        
        if (dados.faturamentoAnual <= 180000) {
            aliquota = 6.0;
        } else if (dados.faturamentoAnual <= 360000) {
            aliquota = 11.2;
        } else if (dados.faturamentoAnual <= 720000) {
            aliquota = 13.5;
        } else if (dados.faturamentoAnual <= 1800000) {
            aliquota = 16.0;
        } else if (dados.faturamentoAnual <= 3600000) {
            aliquota = 21.0;
        } else {
            aliquota = 33.0;
        }
        
        const valorSimples = (dados.faturamentoMensal * aliquota) / 100;
        valorMensal = valorSimples + valorINSS;
        descricaoAdicional = `Aplicando estratégia do Fator R: Migração do Anexo V (15,5%+) para o ${anexoUtilizado} (${aliquota.toFixed(1)}%) + INSS sobre pró-labore de R$ ${proLaboreNecessario.toFixed(2)} (28% do faturamento)`;
    } else {
        anexoUtilizado = "Anexo III";
        if (dados.faturamentoAnual <= 180000) {
            aliquota = 6.0;
        } else if (dados.faturamentoAnual <= 360000) {
            aliquota = 11.2;
        } else if (dados.faturamentoAnual <= 720000) {
            aliquota = 13.5;
        } else if (dados.faturamentoAnual <= 1800000) {
            aliquota = 16.0;
        } else if (dados.faturamentoAnual <= 3600000) {
            aliquota = 21.0;
        } else {
            aliquota = 33.0;
        }
        
        if (dados.tipoNegocio === 'infoprodutos' || dados.tipoNegocio === 'servicos') {
            // No original, havia uma redução fictícia. Mantendo para consistência se essa era a intenção.
            // aliquota = aliquota * 0.7; 
        }
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
    const presuncaoLucro = 0.32;
    const baseCalculoIRCSLL = dados.faturamentoMensal * presuncaoLucro;
    let valorIR = baseCalculoIRCSLL * 0.15;
    
    if (baseCalculoIRCSLL > 20000) {
        valorIR += (baseCalculoIRCSLL - 20000) * 0.10;
    }
    
    const valorCSLL = baseCalculoIRCSLL * 0.09;
    const valorPIS = dados.faturamentoMensal * 0.0065;
    const valorCOFINS = dados.faturamentoMensal * 0.03;
    const valorISS = dados.faturamentoMensal * 0.03; // Assumindo ISS de 3% para serviços digitais
    
    const valorMensal = valorIR + valorCSLL + valorPIS + valorCOFINS + valorISS;
    const aliquotaEfetiva = (valorMensal / dados.faturamentoMensal) * 100;
    
    return {
        aliquota: aliquotaEfetiva,
        valorMensal: valorMensal
    };
}

// Cálculo do Lucro Real (Placeholder/Simplificado)
function calcularLucroReal(dados) {
    // Este é um placeholder. O cálculo real do Lucro Real é complexo.
    // Considerar despesas é crucial para o Lucro Real.
    let lucroApurado = dados.faturamentoMensal - dados.despesasMensais;

    if (lucroApurado <= 0) {
        return Infinity; // Se não há lucro, ou prejuízo, não há IRPJ/CSLL sobre lucro.
    }

    // IRPJ: 15% sobre o lucro apurado
    let irpj = lucroApurado * 0.15;
    // Adicional de IRPJ: 10% sobre o lucro que exceder R$ 20.000/mês
    if (lucroApurado > 20000) {
        irpj += (lucroApurado - 20000) * 0.10;
    }

    // CSLL: 9% sobre o lucro apurado
    const csll = lucroApurado * 0.09;

    // PIS e COFINS no Lucro Real são não-cumulativos.
    // PIS: 1,65% sobre o faturamento, permitindo créditos.
    // COFINS: 7,6% sobre o faturamento, permitindo créditos.
    // Para simplificar, aplicaremos sobre o faturamento bruto sem considerar créditos.
    const pis = dados.faturamentoMensal * 0.0165;
    const cofins = dados.faturamentoMensal * 0.076;
    
    // ISS - pode variar, usando 3% como no presumido
    const valorISS = dados.faturamentoMensal * 0.03;

    // Total mensal estimado
    return irpj + csll + pis + cofins + valorISS;
}


// Cálculo do IRPF (Pessoa Física) - Mantido caso seja usado em outra parte, mas não no modal principal de PJ.
function calcularIRPF(dados) {
    let baseCalculo = dados.faturamentoMensal;
    if (dados.possuiContabilidade) {
        baseCalculo = Math.max(0, dados.faturamentoMensal - dados.despesasMensais);
    }
    
    let valorIR = 0;
    let aliquotaEfetiva = 0;
    
    if (baseCalculo <= 2112.00) {
        valorIR = 0;
        aliquotaEfetiva = 0;
    } else if (baseCalculo <= 2826.65) {
        valorIR = (baseCalculo * 0.075) - 158.40;
    } else if (baseCalculo <= 3751.05) {
        valorIR = (baseCalculo * 0.15) - 370.40;
    } else if (baseCalculo <= 4664.68) {
        valorIR = (baseCalculo * 0.225) - 651.73;
    } else {
        valorIR = (baseCalculo * 0.275) - 884.96;
    }
    if (dados.faturamentoMensal > 0) { // Evitar divisão por zero
        aliquotaEfetiva = (valorIR / dados.faturamentoMensal) * 100;
    } else {
        aliquotaEfetiva = 0;
    }
    
    const tetoINSS = 7507.49; 
    const baseINSS = Math.min(dados.faturamentoMensal, tetoINSS);
    const valorINSS = baseINSS * 0.11;
    const valorMensal = valorIR + valorINSS;
    
    return {
        aliquota: aliquotaEfetiva,
        valorMensal: valorMensal
    };
}

// Função para simular diferentes cenários (não diretamente usada no modal, mas pode ser útil)
function simularCenarios(dados) {
    const cenarios = [];
    cenarios.push({
        nome: "Cenário Atual",
        faturamentoMensal: dados.faturamentoMensal,
        resultados: calcularImpostos(dados) // calcularImpostos agora retorna os valores diretos
    });
    
    const dadosAumento = {...dados};
    dadosAumento.faturamentoMensal = dados.faturamentoMensal * 1.2;
    dadosAumento.faturamentoAnual = dados.faturamentoAnual * 1.2;
    cenarios.push({
        nome: "Aumento de 20% no Faturamento",
        faturamentoMensal: dadosAumento.faturamentoMensal,
        resultados: calcularImpostos(dadosAumento)
    });
    
    const dadosReducao = {...dados};
    dadosReducao.despesasMensais = dados.despesasMensais * 0.8;
    cenarios.push({
        nome: "Redução de 20% nas Despesas",
        faturamentoMensal: dados.faturamentoMensal,
        resultados: calcularImpostos(dadosReducao)
    });
    
    return cenarios;
}

