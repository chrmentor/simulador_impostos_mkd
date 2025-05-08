/*
 * Cálculos tributários para o Simulador de Impostos
 * Este arquivo contém as funções para calcular os impostos nos diferentes regimes tributários
 */

// Função principal para calcular impostos nos três regimes
function calcularImpostos(dados) {
    const simples = calcularSimplesNacional(dados);
    const presumido = calcularLucroPresumido(dados);
    const realCalculado = calcularLucroReal(dados); 

    // Montar o objeto para Lucro Real conforme esperado pelo script.js
    let lucroRealResultado = {
        valor: realCalculado, // Pode ser Infinity
        aliquotaEfetiva: (typeof realCalculado === 'number' && realCalculado !== Infinity && dados.faturamentoMensal > 0) ? (realCalculado / dados.faturamentoMensal) * 100 : Infinity
    };

    return {
        simplesNacional: simples, // Retorna o objeto completo de calcularSimplesNacional
        lucroPresumido: presumido, // Retorna o objeto completo de calcularLucroPresumido
        lucroReal: lucroRealResultado // Retorna o objeto formatado para Lucro Real
    };
}

// Cálculo do Simples Nacional
function calcularSimplesNacional(dados) {
    let aliquotaEfetiva = 0; // Renomeado de aliquota para aliquotaEfetiva para consistência
    let valorMensal = 0;
    // let descricaoAdicional = ""; // Comentado pois não usado no modal atual
    // let valorINSS = 0; // Comentado pois não usado no modal atual
    // let anexoUtilizado = ""; // Comentado pois não usado no modal atual
    
    // Lógica simplificada para afiliados e outros, focando no retorno de aliquotaEfetiva e valor
    if (dados.tipoNegocio === 'afiliado') {
        // Exemplo de lógica para afiliado (pode precisar de ajuste Fator R)
        const proLaboreNecessario = dados.faturamentoMensal * 0.28;
        const valorINSSAfiliado = proLaboreNecessario * 0.11;
        // anexoUtilizado = "Anexo III (com Fator R ≥ 28%)";
        
        if (dados.faturamentoAnual <= 180000) {
            aliquotaEfetiva = 6.0;
        } else if (dados.faturamentoAnual <= 360000) {
            aliquotaEfetiva = 11.2;
        } else if (dados.faturamentoAnual <= 720000) {
            aliquotaEfetiva = 13.5;
        } else if (dados.faturamentoAnual <= 1800000) {
            aliquotaEfetiva = 16.0;
        } else if (dados.faturamentoAnual <= 3600000) {
            aliquotaEfetiva = 21.0;
        } else {
            aliquotaEfetiva = 21.0; // Ajustado
        }
        
        const valorSimples = (dados.faturamentoMensal * aliquotaEfetiva) / 100;
        valorMensal = valorSimples + valorINSSAfiliado;
    } else { // Para outros tipos de negócio (infoprodutos, servicos, etc.)
        // anexoUtilizado = "Anexo III"; 
        if (dados.faturamentoAnual <= 180000) {
            aliquotaEfetiva = 6.0;
        } else if (dados.faturamentoAnual <= 360000) {
            aliquotaEfetiva = 11.2;
        } else if (dados.faturamentoAnual <= 720000) {
            aliquotaEfetiva = 13.5;
        } else if (dados.faturamentoAnual <= 1800000) {
            aliquotaEfetiva = 16.0;
        } else if (dados.faturamentoAnual <= 3600000) {
            aliquotaEfetiva = 21.0;
        } else {
            aliquotaEfetiva = 21.0; // Ajustado
        }
        valorMensal = (dados.faturamentoMensal * aliquotaEfetiva) / 100;
    }
    
    return {
        aliquotaEfetiva: aliquotaEfetiva,
        valor: valorMensal
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
    let valorISS = dados.faturamentoMensal * 0.03;
    
    const valorTotalMensal = valorIR + valorCSLL + valorPIS + valorCOFINS + valorISS;
    let aliquotaEfetivaTotal = 0;
    if (dados.faturamentoMensal > 0) {
         aliquotaEfetivaTotal = (valorTotalMensal / dados.faturamentoMensal) * 100;
    }
   
    return {
        aliquotaEfetiva: aliquotaEfetivaTotal,
        valor: valorTotalMensal
    };
}

// Cálculo do Lucro Real (Placeholder/Simplificado)
function calcularLucroReal(dados) {
    // Este é um placeholder. O cálculo real do Lucro Real é complexo.
    // Considerar despesas é crucial para o Lucro Real.
    let lucroApurado = dados.faturamentoMensal - dados.despesasMensais;

    if (lucroApurado <= 0) {
        return Infinity; 
    }

    let irpj = lucroApurado * 0.15;
    if (lucroApurado > 20000) {
        irpj += (lucroApurado - 20000) * 0.10;
    }
    const csll = lucroApurado * 0.09;
    const pis = dados.faturamentoMensal * 0.0165;
    const cofins = dados.faturamentoMensal * 0.076;
    const valorISS = dados.faturamentoMensal * 0.03;

    return irpj + csll + pis + cofins + valorISS;
}

