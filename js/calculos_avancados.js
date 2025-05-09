/**
 * Cálculos tributários avançados para o Simulador de Impostos
 * Este arquivo contém funções detalhadas para calcular impostos nos diferentes regimes tributários
 */

// Constantes e tabelas tributárias
const TABELAS = {
    // Tabela do Simples Nacional - Anexo III (Serviços)
    simplesNacional: [
        { limite: 180000, aliquota: 6.0, deducao: 0 },
        { limite: 360000, aliquota: 11.2, deducao: 9360 },
        { limite: 720000, aliquota: 13.5, deducao: 17640 },
        { limite: 1800000, aliquota: 16.0, deducao: 35640 },
        { limite: 3600000, aliquota: 21.0, deducao: 125640 },
        { limite: 4800000, aliquota: 33.0, deducao: 648000 }
    ],
    
    // Tabela do IRPF 2023
    irpf: [
        { limite: 2112.00, aliquota: 0, deducao: 0 },
        { limite: 2826.65, aliquota: 7.5, deducao: 158.40 },
        { limite: 3751.05, aliquota: 15, deducao: 370.40 },
        { limite: 4664.68, aliquota: 22.5, deducao: 651.73 },
        { limite: Infinity, aliquota: 27.5, deducao: 884.96 }
    ],
    
    // Alíquotas do Lucro Presumido
    lucroPresumido: {
        presuncaoServicos: 0.32,
        presuncaoComercio: 0.08,
        ir: 0.15,
        csll: 0.09,
        pis: 0.0065,
        cofins: 0.03,
        iss: 0.03, // Corrigido de 0.05 para 0.03 (3%)
        adicionalIR: { limite: 20000, aliquota: 0.10 }
    },
    
    // Alíquotas do INSS
    inss: {
        aliquota: 0.11,
        teto: 7507.49
    }
};

// Função principal para calcular impostos nos três regimes
function calcularImpostos(dados) {
    // Validar e normalizar dados de entrada
    const dadosNormalizados = normalizarDados(dados);
    
    return {
        simplesNacional: calcularSimplesNacional(dadosNormalizados),
        lucroPresumido: calcularLucroPresumido(dadosNormalizados),
        irpf: calcularIRPF(dadosNormalizados)
    };
}

// Normalizar e validar dados de entrada
function normalizarDados(dados) {
    // Criar cópia para não modificar o objeto original
    const dadosNormalizados = { ...dados };
    
    // Converter strings para números se necessário
    if (typeof dadosNormalizados.faturamentoMensal === 'string') {
        dadosNormalizados.faturamentoMensal = parseFloat(
            dadosNormalizados.faturamentoMensal.replace(/[^\d,.-]/g, '').replace(',', '.')
        );
    }
    
    if (typeof dadosNormalizados.faturamentoAnual === 'string') {
        dadosNormalizados.faturamentoAnual = parseFloat(
            dadosNormalizados.faturamentoAnual.replace(/[^\d,.-]/g, '').replace(',', '.')
        );
    }
    
    if (typeof dadosNormalizados.despesasMensais === 'string') {
        dadosNormalizados.despesasMensais = parseFloat(
            dadosNormalizados.despesasMensais.replace(/[^\d,.-]/g, '').replace(',', '.')
        );
    }
    
    // Garantir valores mínimos para evitar erros de cálculo
    dadosNormalizados.faturamentoMensal = Math.max(0, dadosNormalizados.faturamentoMensal || 0);
    dadosNormalizados.faturamentoAnual = Math.max(0, dadosNormalizados.faturamentoAnual || 0);
    dadosNormalizados.despesasMensais = Math.max(0, dadosNormalizados.despesasMensais || 0);
    
    // Se o faturamento anual não for informado, estimar com base no mensal
    if (dadosNormalizados.faturamentoAnual === 0 && dadosNormalizados.faturamentoMensal > 0) {
        dadosNormalizados.faturamentoAnual = dadosNormalizados.faturamentoMensal * 12;
    }
    
    // Se o faturamento mensal não for informado, estimar com base no anual
    if (dadosNormalizados.faturamentoMensal === 0 && dadosNormalizados.faturamentoAnual > 0) {
        dadosNormalizados.faturamentoMensal = dadosNormalizados.faturamentoAnual / 12;
    }
    
    return dadosNormalizados;
}

// Cálculo do Simples Nacional
function calcularSimplesNacional(dados) {
    // Verificar se está dentro do limite do Simples Nacional
    if (dados.faturamentoAnual > 4800000) {
        return {
            aliquota: 33.0,
            valorMensal: dados.faturamentoMensal * 0.33,
            detalhes: {
                mensagem: "Faturamento acima do limite do Simples Nacional (R$ 4.800.000,00)",
                faixaRBT12: "Acima do limite",
                aliquotaEfetiva: 33.0,
                aliquotaNominal: 33.0,
                valorDeducao: 0
            }
        };
    }
    
    // Encontrar a faixa de faturamento
    let faixa = TABELAS.simplesNacional.find(f => dados.faturamentoAnual <= f.limite);
    
    // Se não encontrar faixa (improvável com a estrutura atual), usar a última
    if (!faixa) {
        faixa = TABELAS.simplesNacional[TABELAS.simplesNacional.length - 1];
    }
    
    // Calcular alíquota efetiva
    // Fórmula: (RBT12 × Aliq – PD) ÷ RBT12
    const aliquotaEfetiva = ((dados.faturamentoAnual * (faixa.aliquota / 100) - faixa.deducao) / dados.faturamentoAnual) * 100;
    
    // Ajustar alíquota para infoprodutos e serviços digitais
    let aliquotaAjustada = aliquotaEfetiva;
    if (dados.tipoNegocio === 'infoprodutos' || dados.tipoNegocio === 'servicos') {
        // Redução fictícia para demonstração - na prática, depende da legislação específica
        aliquotaAjustada = aliquotaEfetiva * 0.9;
    }
    
    // Calcular valor mensal
    const valorMensal = (dados.faturamentoMensal * aliquotaAjustada) / 100;
    
    return {
        aliquota: aliquotaAjustada,
        valorMensal: valorMensal,
        detalhes: {
            mensagem: `Faixa de faturamento: até R$ ${faixa.limite.toLocaleString('pt-BR')}`,
            faixaRBT12: `Até R$ ${faixa.limite.toLocaleString('pt-BR')}`,
            aliquotaEfetiva: aliquotaEfetiva,
            aliquotaNominal: faixa.aliquota,
            valorDeducao: faixa.deducao
        }
    };
}

// Cálculo do Lucro Presumido
function calcularLucroPresumido(dados) {
    // Definir percentual de presunção com base no tipo de negócio
    let percentualPresuncao = TABELAS.lucroPresumido.presuncaoServicos; // Padrão para serviços
    
    if (dados.tipoNegocio === 'comercio' || dados.tipoNegocio === 'afiliado') {
        percentualPresuncao = TABELAS.lucroPresumido.presuncaoComercio;
    }
    
    // Base de cálculo para IR e CSLL
    const baseCalculoIRCSLL = dados.faturamentoMensal * percentualPresuncao;
    
    // Cálculo do IR
    let valorIR = baseCalculoIRCSLL * TABELAS.lucroPresumido.ir;
    
    // Adicional de IR - CORRIGIDO: Aplicar apenas se a base de cálculo mensal ultrapassar o limite
    // Não usamos mais o cálculo trimestral para evitar a discrepância na alíquota efetiva
    if (baseCalculoIRCSLL > TABELAS.lucroPresumido.adicionalIR.limite) {
        const excedente = baseCalculoIRCSLL - TABELAS.lucroPresumido.adicionalIR.limite;
        valorIR += excedente * TABELAS.lucroPresumido.adicionalIR.aliquota;
    }
    
    // Cálculo dos demais tributos
    const valorCSLL = baseCalculoIRCSLL * TABELAS.lucroPresumido.csll;
    const valorPIS = dados.faturamentoMensal * TABELAS.lucroPresumido.pis;
    const valorCOFINS = dados.faturamentoMensal * TABELAS.lucroPresumido.cofins;
    
    // ISS varia conforme o município e tipo de serviço
    // Usando valor médio para simplificar
    let valorISS = 0;
    if (dados.tipoNegocio !== 'comercio' && dados.tipoNegocio !== 'afiliado') {
        valorISS = dados.faturamentoMensal * TABELAS.lucroPresumido.iss;
    }
    
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

// Cálculo do IRPF (Pessoa Física)
function calcularIRPF(dados) {
    // Dedução de despesas
    let baseCalculo = dados.faturamentoMensal;
    
    // Se possui contabilidade/livro caixa, pode deduzir despesas
    if (dados.possuiContabilidade) {
        baseCalculo = Math.max(0, dados.faturamentoMensal - dados.despesasMensais);
    }
    
    // Encontrar a faixa de IR
    const faixaIR = TABELAS.irpf.find(f => baseCalculo <= f.limite);
    
    // Calcular IR
    const valorIR = (baseCalculo * faixaIR.aliquota / 100) - faixaIR.deducao;
    
    // Calcular INSS
    const baseINSS = Math.min(dados.faturamentoMensal, TABELAS.inss.teto);
    const valorINSS = baseINSS * TABELAS.inss.aliquota;
    
    // Total mensal
    const valorMensal = Math.max(0, valorIR) + valorINSS;
    
    // Alíquota efetiva
    const aliquotaEfetiva = dados.faturamentoMensal > 0 ? (valorMensal / dados.faturamentoMensal) * 100 : 0;
    
    return {
        aliquota: aliquotaEfetiva,
        valorMensal: valorMensal,
        detalhes: {
            baseCalculo: baseCalculo,
            faixaIR: `Até R$ ${faixaIR.limite.toLocaleString('pt-BR')}`,
            aliquotaIR: faixaIR.aliquota,
            valorIR: Math.max(0, valorIR),
            valorINSS: valorINSS,
            deducaoDespesas: dados.possuiContabilidade ? Math.min(dados.despesasMensais, dados.faturamentoMensal) : 0,
            aliquotaEfetiva: aliquotaEfetiva
        }
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
    
    // Cenário com mudança de tipo de negócio (se aplicável)
    if (dados.tipoNegocio !== 'afiliado') {
        const dadosMudanca = {...dados};
        dadosMudanca.tipoNegocio = 'afiliado';
        
        cenarios.push({
            nome: "Mudança para Afiliado",
            faturamentoMensal: dados.faturamentoMensal,
            resultados: calcularImpostos(dadosMudanca)
        });
    }
    
    return cenarios;
}

// Função para gerar recomendações personalizadas
function gerarRecomendacoes(dados, resultados) {
    const recomendacoes = [];
    
    // Determinar o regime mais vantajoso
    let regimeRecomendado = '';
    let menorValor = Infinity;
    
    if (resultados.simplesNacional.valorMensal < menorValor) {
        menorValor = resultados.simplesNacional.valorMensal;
        regimeRecomendado = 'simplesNacional';
    }
    
    if (resultados.lucroPresumido.valorMensal < menorValor) {
        menorValor = resultados.lucroPresumido.valorMensal;
        regimeRecomendado = 'lucroPresumido';
    }
    
    if (resultados.irpf.valorMensal < menorValor) {
        menorValor = resultados.irpf.valorMensal;
        regimeRecomendado = 'irpf';
    }
    
    // Recomendação principal
    recomendacoes.push({
        tipo: 'principal',
        texto: `Com base nos dados fornecidos, o regime tributário mais vantajoso para você é o ${regimeRecomendado === 'simplesNacional' ? 'Simples Nacional' : regimeRecomendado === 'lucroPresumido' ? 'Lucro Presumido' : 'IRPF (Pessoa Física)'}.`
    });
    
    // Recomendações específicas por regime
    if (regimeRecomendado === 'simplesNacional') {
        recomendacoes.push({
            tipo: 'acao',
            texto: 'Considere abrir uma empresa ME ou EPP e optar pelo Simples Nacional.'
        });
        
        if (dados.faturamentoAnual > 3600000) {
            recomendacoes.push({
                tipo: 'alerta',
                texto: 'Atenção: seu faturamento está próximo do limite do Simples Nacional. Considere planejar para uma eventual transição de regime.'
            });
        }
    } else if (regimeRecomendado === 'lucroPresumido') {
        recomendacoes.push({
            tipo: 'acao',
            texto: 'Considere abrir uma empresa e optar pelo Lucro Presumido. Este regime é mais complexo e requer um contador.'
        });
        
        recomendacoes.push({
            tipo: 'dica',
            texto: 'No Lucro Presumido, é importante manter um controle rigoroso das obrigações acessórias e datas de pagamento dos tributos.'
        });
    } else if (regimeRecomendado === 'irpf') {
        if (!dados.possuiContabilidade) {
            recomendacoes.push({
                tipo: 'acao',
                texto: 'Considere manter um Livro Caixa para registrar suas despesas e deduzi-las do Imposto de Renda.'
            });
        }
        
        recomendacoes.push({
            tipo: 'dica',
            texto: 'Como Pessoa Física, é importante emitir recibos para todos os serviços prestados e declarar corretamente no Imposto de Renda anual.'
        });
    }
    
    // Recomendações gerais
    if (dados.despesasMensais > 0 && dados.despesasMensais / dados.faturamentoMensal > 0.3) {
        recomendacoes.push({
            tipo: 'dica',
            texto: 'Suas despesas representam uma parcela significativa do seu faturamento. Considere revisar seus custos para aumentar sua margem de lucro.'
        });
    }
    
    if (dados.faturamentoMensal < 5000) {
        recomendacoes.push({
            tipo: 'dica',
            texto: 'Com seu atual nível de faturamento, o custo de manutenção de uma empresa pode não compensar. Avalie cuidadosamente antes de formalizar.'
        });
    }
    
    return recomendacoes;
}

// Exportar funções para uso no script principal
if (typeof module !== 'undefined') {
    module.exports = {
        calcularImpostos,
        simularCenarios,
        gerarRecomendacoes
    };
}
