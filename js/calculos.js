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

    if (dados.tipoNegocio === 'afiliadobr') {
        anexoUtilizado = "Anexo III (com Fator R ≥ 28,01%)";
        const proLaborePercentual = 0.2801;
        const proLaboreNecessario = dados.faturamentoMensal * proLaborePercentual;
        valorINSS = proLaboreNecessario * 0.11;

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
            aliquota = 33.0; // Acima do limite do Simples
        }
        
        const valorSimplesDAS = (dados.faturamentoMensal * aliquota) / 100;
        valorMensal = valorSimplesDAS + valorINSS;
        // A descricaoAdicional específica para este caso será montada no relatorios.js

    } else if (dados.tipoNegocio === 'afiliadoext') {
        anexoUtilizado = "Anexo III (com Fator R ≥ 28%)";
        descricaoAdicional = `Aplicando estratégia do Fator R: Migração para Anexo III.`;
        const proLaborePercentual = 0.28; 
        const proLaboreNecessario = dados.faturamentoMensal * proLaborePercentual;
        valorINSS = proLaboreNecessario * 0.11;

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
        const valorSimplesDAS = (dados.faturamentoMensal * aliquota) / 100;
        valorMensal = valorSimplesDAS + valorINSS;

    } else if (dados.tipoNegocio === 'infoprodutos' || dados.tipoNegocio === 'coaching' || dados.tipoNegocio === 'servicos' || dados.tipoNegocio === 'socialmedia' || dados.tipoNegocio === 'adsense') { // Adsense adicionado aqui para Anexo III
        anexoUtilizado = "Anexo III";
        if (dados.tipoNegocio === 'adsense') {
            // Para Adsense, mesmo no Anexo III, podemos querer uma descrição específica ou manter a geral.
            // Por enquanto, usará a mesma lógica de alíquota do Anexo III dos outros.
        }
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
        valorMensal = (dados.faturamentoMensal * aliquota) / 100;

    } else { // Removido o bloco específico do Adsense que o colocava no Anexo V
        // Fallback para tipo de negócio não reconhecido ou não tratado
        console.warn("Simples Nacional: Tipo de negócio não tratado ou desconhecido:", dados.tipoNegocio);
        aliquota = 0;
        valorMensal = 0;
    }
    
    return {
        aliquota: aliquota, // Alíquota base do DAS do anexo correspondente
        valorMensal: valorMensal, // Valor final (pode incluir INSS para Fator R)
        descricaoAdicional: descricaoAdicional, // Descrição para Fator R (exceto afiliadobr, tratado no relatório)
        valorINSS: valorINSS, // Valor do INSS calculado (para Fator R)
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
    const valorISS = dados.faturamentoMensal * 0.03; // Considerando ISS fixo de 3% para simplificação
    const valorMensal = valorIR + valorCSLL + valorPIS + valorCOFINS + valorISS;
    const aliquotaEfetiva = (valorMensal / dados.faturamentoMensal) * 100;
    return {
        aliquota: aliquotaEfetiva,
        valorMensal: valorMensal
    };
}

// Cálculo do IRPF (Pessoa Física)
function calcularIRPF(dados) {
    let baseCalculo = dados.faturamentoMensal;
    if (dados.possuiContabilidade) {
        baseCalculo = Math.max(0, dados.faturamentoMensal - dados.despesasMensais);
    }
    let valorIR = 0;
    let aliquotaEfetiva = 0;
    if (baseCalculo <= 2259.20) { // Faixa de isenção IRPF 2024/2025 (Exemplo, verificar tabela vigente)
        valorIR = 0;
    } else if (baseCalculo <= 2826.65) {
        valorIR = (baseCalculo * 0.075) - 169.44;
    } else if (baseCalculo <= 3751.05) {
        valorIR = (baseCalculo * 0.15) - 381.44;
    } else if (baseCalculo <= 4664.68) {
        valorIR = (baseCalculo * 0.225) - 662.77;
    } else {
        valorIR = (baseCalculo * 0.275) - 896.00;
    }

    if (dados.faturamentoMensal > 0 && valorIR > 0) {
        aliquotaEfetiva = (valorIR / dados.faturamentoMensal) * 100;
    } else {
        aliquotaEfetiva = 0;
    }
    
    const tetoINSS = 7786.02; // Teto INSS 2024 (Exemplo, verificar valor vigente)
    const baseINSS = Math.min(dados.faturamentoMensal, tetoINSS);
    const valorINSS = baseINSS * 0.11; // Contribuição INSS autônomo simplificada (11% sobre rendimento até o teto)
    
    const valorMensalTotal = valorIR + valorINSS;
    
    return {
        aliquota: Math.max(0, aliquotaEfetiva),
        valorMensal: valorMensalTotal
    };
}

