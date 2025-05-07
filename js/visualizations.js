/**
 * Visualizações e gráficos para o Simulador de Impostos
 * Este arquivo contém funções para criar e atualizar visualizações gráficas dos resultados
 */

// Função para criar gráfico de barras comparativo
function criarGraficoBarras(resultados) {
    const container = document.getElementById('graficoBarras');
    if (!container) return;
    
    // Limpar conteúdo anterior
    container.innerHTML = '';
    
    // Formatar valores monetários
    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    
    // Encontrar o valor máximo para calcular porcentagens
    const valorMaximo = Math.max(
        resultados.simplesNacional.valorMensal,
        resultados.lucroPresumido.valorMensal,
        resultados.irpf.valorMensal
    );
    
    // Criar HTML para o gráfico de barras
    const html = `
        <div class="bar-chart">
            <div class="bar-item">
                <div class="bar-label">
                    <span class="bar-name">Simples Nacional</span>
                    <span class="bar-value">${formatarValor(resultados.simplesNacional.valorMensal)}</span>
                </div>
                <div class="bar-container">
                    <div class="bar-fill bar-fill-simples" style="width: ${(resultados.simplesNacional.valorMensal / valorMaximo) * 100}%"></div>
                </div>
            </div>
            
            <div class="bar-item">
                <div class="bar-label">
                    <span class="bar-name">Lucro Presumido</span>
                    <span class="bar-value">${formatarValor(resultados.lucroPresumido.valorMensal)}</span>
                </div>
                <div class="bar-container">
                    <div class="bar-fill bar-fill-lucro" style="width: ${(resultados.lucroPresumido.valorMensal / valorMaximo) * 100}%"></div>
                </div>
            </div>
            
            <div class="bar-item">
                <div class="bar-label">
                    <span class="bar-name">IRPF (Pessoa Física)</span>
                    <span class="bar-value">${formatarValor(resultados.irpf.valorMensal)}</span>
                </div>
                <div class="bar-container">
                    <div class="bar-fill bar-fill-irpf" style="width: ${(resultados.irpf.valorMensal / valorMaximo) * 100}%"></div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Função para criar gráfico de pizza
function criarGraficoPizza(resultados) {
    const container = document.getElementById('graficoPizza');
    if (!container) return;
    
    // Limpar conteúdo anterior
    container.innerHTML = '';
    
    // Calcular total para porcentagens
    const total = resultados.simplesNacional.valorMensal + resultados.lucroPresumido.valorMensal + resultados.irpf.valorMensal;
    
    // Calcular porcentagens
    const porcentagemSimples = (resultados.simplesNacional.valorMensal / total) * 100;
    const porcentagemLucro = (resultados.lucroPresumido.valorMensal / total) * 100;
    const porcentagemIRPF = (resultados.irpf.valorMensal / total) * 100;
    
    // Criar HTML para o gráfico de pizza
    const html = `
        <div class="pie-chart-container">
            <div class="pie-chart" style="background: conic-gradient(
                #10B981 0% ${porcentagemSimples}%, 
                #F59E0B ${porcentagemSimples}% ${porcentagemSimples + porcentagemLucro}%, 
                #6366F1 ${porcentagemSimples + porcentagemLucro}% 100%
            )"></div>
            
            <div class="pie-legend">
                <div class="legend-item">
                    <div class="legend-color legend-color-simples"></div>
                    <span class="legend-text">Simples Nacional (${porcentagemSimples.toFixed(1)}%)</span>
                </div>
                
                <div class="legend-item">
                    <div class="legend-color legend-color-lucro"></div>
                    <span class="legend-text">Lucro Presumido (${porcentagemLucro.toFixed(1)}%)</span>
                </div>
                
                <div class="legend-item">
                    <div class="legend-color legend-color-irpf"></div>
                    <span class="legend-text">IRPF (${porcentagemIRPF.toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Função para criar tabela comparativa detalhada
function criarTabelaComparativa(resultados, dados) {
    const container = document.getElementById('tabelaComparativa');
    if (!container) return;
    
    // Limpar conteúdo anterior
    container.innerHTML = '';
    
    // Formatar valores monetários
    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    
    // Calcular valores anuais
    const simplesAnual = resultados.simplesNacional.valorMensal * 12;
    const lucroAnual = resultados.lucroPresumido.valorMensal * 12;
    const irpfAnual = resultados.irpf.valorMensal * 12;
    
    // Calcular percentuais sobre faturamento
    const percSimples = (resultados.simplesNacional.valorMensal / dados.faturamentoMensal) * 100;
    const percLucro = (resultados.lucroPresumido.valorMensal / dados.faturamentoMensal) * 100;
    const percIRPF = (resultados.irpf.valorMensal / dados.faturamentoMensal) * 100;
    
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
    
    // Criar HTML para a tabela comparativa
    const html = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Critério</th>
                    <th>Simples Nacional</th>
                    <th>Lucro Presumido</th>
                    <th>IRPF (Pessoa Física)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Valor Mensal</td>
                    <td class="${regimeRecomendado === 'simplesNacional' ? 'highlight' : ''}">${formatarValor(resultados.simplesNacional.valorMensal)}</td>
                    <td class="${regimeRecomendado === 'lucroPresumido' ? 'highlight' : ''}">${formatarValor(resultados.lucroPresumido.valorMensal)}</td>
                    <td class="${regimeRecomendado === 'irpf' ? 'highlight' : ''}">${formatarValor(resultados.irpf.valorMensal)}</td>
                </tr>
                <tr>
                    <td>Valor Anual</td>
                    <td class="${regimeRecomendado === 'simplesNacional' ? 'highlight' : ''}">${formatarValor(simplesAnual)}</td>
                    <td class="${regimeRecomendado === 'lucroPresumido' ? 'highlight' : ''}">${formatarValor(lucroAnual)}</td>
                    <td class="${regimeRecomendado === 'irpf' ? 'highlight' : ''}">${formatarValor(irpfAnual)}</td>
                </tr>
                <tr>
                    <td>Alíquota Efetiva</td>
                    <td>${resultados.simplesNacional.aliquota.toFixed(2)}%</td>
                    <td>${resultados.lucroPresumido.aliquota.toFixed(2)}%</td>
                    <td>${resultados.irpf.aliquota.toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>% do Faturamento</td>
                    <td>${percSimples.toFixed(2)}%</td>
                    <td>${percLucro.toFixed(2)}%</td>
                    <td>${percIRPF.toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Complexidade</td>
                    <td>Média</td>
                    <td>Alta</td>
                    <td>Baixa</td>
                </tr>
                <tr>
                    <td>Obrigações Acessórias</td>
                    <td>Simplificadas</td>
                    <td>Complexas</td>
                    <td>Mínimas</td>
                </tr>
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Função para criar cards de métricas
function criarMetricas(resultados, dados) {
    const container = document.getElementById('metricas');
    if (!container) return;
    
    // Limpar conteúdo anterior
    container.innerHTML = '';
    
    // Formatar valores monetários
    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    
    // Determinar o regime mais vantajoso
    let regimeRecomendado = '';
    let menorValor = Infinity;
    
    if (resultados.simplesNacional.valorMensal < menorValor) {
        menorValor = resultados.simplesNacional.valorMensal;
        regimeRecomendado = 'Simples Nacional';
    }
    
    if (resultados.lucroPresumido.valorMensal < menorValor) {
        menorValor = resultados.lucroPresumido.valorMensal;
        regimeRecomendado = 'Lucro Presumido';
    }
    
    if (resultados.irpf.valorMensal < menorValor) {
        menorValor = resultados.irpf.valorMensal;
        regimeRecomendado = 'IRPF';
    }
    
    // Calcular economia anual
    const maiorValor = Math.max(
        resultados.simplesNacional.valorMensal,
        resultados.lucroPresumido.valorMensal,
        resultados.irpf.valorMensal
    );
    
    const economiaAnual = (maiorValor - menorValor) * 12;
    
    // Criar HTML para os cards de métricas
    const html = `
        <div class="metrics-container">
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-star icon-gradient"></i>
                </div>
                <div class="metric-value">${regimeRecomendado}</div>
                <div class="metric-label">Regime Recomendado</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-piggy-bank icon-gradient"></i>
                </div>
                <div class="metric-value">${formatarValor(economiaAnual)}</div>
                <div class="metric-label">Economia Anual</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-percentage icon-gradient"></i>
                </div>
                <div class="metric-value">${menorValor > 0 ? ((maiorValor / menorValor - 1) * 100).toFixed(1) + '%' : '0%'}</div>
                <div class="metric-label">Diferença Percentual</div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Função principal para renderizar todas as visualizações
function renderizarVisualizacoes(dados, resultados) {
    // Adicionar elementos de visualização ao container de resultados
    const container = document.getElementById('resultadosContainer');
    
    // Verificar se os elementos já existem, caso contrário, criá-los
    if (!document.getElementById('metricas')) {
        const metricasDiv = document.createElement('div');
        metricasDiv.id = 'metricas';
        container.appendChild(metricasDiv);
    }
    
    if (!document.getElementById('graficoBarras')) {
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';
        chartWrapper.innerHTML = `
            <div class="chart-title">Comparação de Impostos Mensais</div>
            <div class="chart-description">Visualização comparativa dos valores mensais a pagar em cada regime tributário.</div>
            <div id="graficoBarras"></div>
        `;
        container.appendChild(chartWrapper);
    }
    
    if (!document.getElementById('tabelaComparativa')) {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'detailed-comparison';
        tableWrapper.innerHTML = `
            <div class="comparison-title">Análise Comparativa Detalhada</div>
            <div id="tabelaComparativa"></div>
        `;
        container.appendChild(tableWrapper);
    }
    
    if (!document.getElementById('graficoPizza')) {
        const pieWrapper = document.createElement('div');
        pieWrapper.className = 'chart-wrapper';
        pieWrapper.innerHTML = `
            <div class="chart-title">Distribuição Proporcional dos Impostos</div>
            <div class="chart-description">Proporção relativa dos valores a pagar em cada regime tributário.</div>
            <div id="graficoPizza"></div>
        `;
        container.appendChild(pieWrapper);
    }
    
    // Renderizar cada visualização
    criarMetricas(resultados, dados);
    criarGraficoBarras(resultados);
    criarTabelaComparativa(resultados, dados);
    criarGraficoPizza(resultados);
}
