// Função para renderizar os resultados
function renderizarResultados(dados, resultados) {
    const container = document.getElementById('resultadosContainer');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    // Formatar valores monetários
    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    
    // Determinar o regime recomendado
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
    
    // Calcular economia
    const maiorValor = Math.max(
        resultados.simplesNacional.valorMensal,
        resultados.lucroPresumido.valorMensal,
        resultados.irpf.valorMensal
    );
    
    const economiaAnual = (maiorValor - menorValor) * 12;
    
    // Verificar se é afiliado para mostrar explicação do Fator R
    const explicacaoFatorR = dados.tipoNegocio === 'afiliado' ? 
        `<div class="fator-r-explicacao">
            <h4><i class="fas fa-lightbulb"></i> Estratégia do Fator R aplicada</h4>
            <p>Como afiliado, você tem acesso a uma estratégia tributária exclusiva que pode reduzir significativamente sua carga tributária no Simples Nacional.</p>
            <div class="fator-r-detalhes">
                <div class="fator-r-item total">
                    <span class="fator-r-label">Total a pagar:</span>
                    <span class="fator-r-valor">${formatarValor(resultados.simplesNacional.valorMensal)}</span>
                </div>
            </div>
            <p class="fator-r-economia">Esta estratégia representa uma <strong>economia significativa</strong> em comparação com a tributação padrão.</p>
            <p class="fator-r-contato">Para saber mais detalhes sobre como implementar esta estratégia em seu negócio, entre em contato com os contadores especialistas da Mentorial Contabilidade.</p>
            <div class="fator-r-cta">
                <a href="https://wa.me/5544997732929" class="cta-button-small" target="_blank">
                    <i class="fab fa-whatsapp"></i> Falar com um especialista
                </a>
            </div>
        </div>` : '';

    // Observação para Outros Serviços Digitais
    const observacaoOutrosServicos = dados.tipoNegocio === 'servicos' ?
        `<div class="observacao-outros-servicos" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; margin-bottom: 20px; border-radius: 4px;">
            <h4 style="color: #b45309; margin-top: 0; margin-bottom: 10px;"><i class="fas fa-info-circle"></i> Atenção para Outros Serviços Digitais:</h4>
            <p style="margin-bottom: 0; color: #78350f;">O cálculo para "Outros Serviços Digitais" considera o <strong>Anexo III como padrão</strong> (Ex: marketing direto, edição de materiais). No entanto, por ser uma categoria ampla, algumas atividades específicas podem se enquadrar no Anexo V (sujeito ao Fator R). Recomendamos fortemente contatar um contador especializado da Mentorial Contabilidade para uma análise precisa do seu caso concreto.</p>
        </div>` : '';

    // Observação para Social Media
    const observacaoSocialMedia = dados.tipoNegocio === 'socialmedia' ?
        `<div class="observacao-social-media" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; margin-bottom: 20px; border-radius: 4px;">
            <h4 style="color: #b45309; margin-top: 0; margin-bottom: 10px;"><i class="fas fa-info-circle"></i> Atenção para Social Media:</h4>
            <p style="margin-bottom: 0; color: #78350f;">O cálculo para "Social Media" considera o <strong>Anexo III como padrão</strong> (foco em atividades operacionais como gestão de posts e marketing direto). Atividades mais estratégicas, de agenciamento ou criação de campanhas complexas podem ter enquadramento diferente (Anexo V, sujeito ao Fator R). Recomendamos fortemente contatar um contador especializado da Mentorial Contabilidade para uma análise precisa do seu caso concreto.</p>
        </div>` : '';

    // Construir HTML dos resultados
    let html = `
        <div class="report-header">
            <div>
                <h3>Relatório Tributário Personalizado</h3>
                <p>Gerado em: ${dataAtual}</p>
                <p>Preparado para: ${dados.nome}</p>
            </div>
            <img src="logo_mentorial.png" alt="Mentorial Contabilidade">
        </div>
        
        <div class="resumo-executivo">
            <h3>Resumo Executivo</h3>
            <p>Com base nos dados fornecidos, realizamos uma análise comparativa dos três principais regimes tributários brasileiros aplicáveis ao seu perfil de infoprodutor/afiliado.</p>
        </div>
        
        <div class="regimes-container">
            <div class="regime-card simples-nacional ${regimeRecomendado === 'simplesNacional' ? 'recomendado' : ''}">
                <div class="regime-titulo">Simples Nacional</div>
                <div class="valor-imposto">${formatarValor(resultados.simplesNacional.valorMensal)}</div>
                <div class="aliquota">Alíquota efetiva: ${resultados.simplesNacional.aliquota.toFixed(2)}% ${dados.tipoNegocio === 'afiliado' ? '+ Prev.FatorR' : ''}</div>
                <div class="regime-descricao">
                    Regime simplificado para micro e pequenas empresas, com tributos unificados em uma única guia.
                    ${dados.tipoNegocio === 'afiliado' ? `<br><strong>Estratégia do Fator R aplicada:</strong> Possibilidade de redução significativa da alíquota inicial.` : ''}
                </div>
            </div>
            
            <div class="regime-card lucro-presumido ${regimeRecomendado === 'lucroPresumido' ? 'recomendado' : ''}">
                <div class="regime-titulo">Lucro Presumido</div>
                <div class="valor-imposto">${formatarValor(resultados.lucroPresumido.valorMensal)}</div>
                <div class="aliquota">Alíquota efetiva: ${resultados.lucroPresumido.aliquota.toFixed(2)}%</div>
                <div class="regime-descricao">Regime que presume uma margem de lucro sobre o faturamento para cálculo dos impostos.</div>
            </div>
            
            <div class="regime-card irpf ${regimeRecomendado === 'irpf' ? 'recomendado' : ''}">
                <div class="regime-titulo">IRPF (Pessoa Física)</div>
                <div class="valor-imposto">${formatarValor(resultados.irpf.valorMensal)}</div>
                <div class="aliquota">Alíquota efetiva: ${resultados.irpf.aliquota.toFixed(2)}%</div>
                <div class="regime-descricao">Tributação como pessoa física, com alíquotas progressivas conforme a renda.</div>
            </div>
        </div>
        
        ${explicacaoFatorR}
        ${observacaoOutrosServicos}
        ${observacaoSocialMedia}
        
        <div class="economia">
            <i class="fas fa-piggy-bank"></i> <strong>Economia potencial:</strong> ${formatarValor(economiaAnual)} anuais em comparação com o regime menos vantajoso.
        </div>
        
        <div class="analise-comparativa">
            <h3>Análise Comparativa</h3>
            <p>Comparativo dos valores a pagar em cada regime tributário com base no seu faturamento.</p>
            
            <!-- Gráfico comparativo -->
            <div class="chart-container">
                <canvas id="graficoComparativo"></canvas>
            </div>
        </div>
        
        <div class="vantagens-desvantagens">
            <h3>Vantagens e Desvantagens de Cada Regime</h3>
            
            <div class="regime-details">
                <h4>Simples Nacional</h4>
                <div class="vantagens-desvantagens-container">
                    <div class="vantagens">
                        <h5><i class="fas fa-check-circle"></i> Vantagens</h5>
                        <ul>
                            <li>Simplificação fiscal: todos os impostos em uma única guia</li>
                            <li>Menor burocracia e obrigações acessórias reduzidas</li>
                            <li>Alíquotas geralmente menores para faturamentos até R$ 180.000/ano</li>
                            <li>Não há incidência de IRPJ e CSLL sobre o lucro</li>
                            <li>Ideal para quem está começando e tem estrutura administrativa limitada</li>
                        </ul>
                    </div>
                    <div class="desvantagens">
                        <h5><i class="fas fa-times-circle"></i> Desvantagens</h5>
                        <ul>
                            <li>Limitação de faturamento anual (R$ 4,8 milhões)</li>
                            <li>Impossibilidade de aproveitar créditos de PIS/COFINS</li>
                            <li>Pode ser desvantajoso para empresas com muitas despesas dedutíveis</li>
                            <li>Alíquotas crescentes conforme o faturamento aumenta</li>
                            <li>Restrições para determinadas atividades</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="regime-details">
                <h4>Lucro Presumido</h4>
                <div class="vantagens-desvantagens-container">
                    <div class="vantagens">
                        <h5><i class="fas fa-check-circle"></i> Vantagens</h5>
                        <ul>
                            <li>Possibilidade de aproveitamento de créditos de PIS/COFINS</li>
                            <li>Vantajoso para empresas com margem de lucro real inferior à presumida</li>
                            <li>Menor carga tributária para faturamentos mais elevados</li>
                            <li>Possibilidade de distribuição de lucros isentos acima da presunção</li>
                            <li>Menos obrigações acessórias que o Lucro Real</li>
                        </ul>
                    </div>
                    <div class="desvantagens">
                        <h5><i class="fas fa-times-circle"></i> Desvantagens</h5>
                        <ul>
                            <li>Maior complexidade contábil comparado ao Simples Nacional</li>
                            <li>Não considera despesas reais para cálculo do IRPJ e CSLL</li>
                            <li>Limitação de faturamento anual (R$ 78 milhões)</li>
                            <li>Tributação em cascata para alguns impostos</li>
                            <li>Pode ser desvantajoso para empresas com alta margem de lucro</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="regime-details">
                <h4>IRPF (Pessoa Física)</h4>
                <div class="vantagens-desvantagens-container">
                    <div class="vantagens">
                        <h5><i class="fas fa-check-circle"></i> Vantagens</h5>
                        <ul>
                            <li>Simplicidade operacional (não precisa abrir empresa)</li>
                            <li>Possibilidade de deduzir despesas pessoais (saúde, educação, etc.)</li>
                            <li>Faixa de isenção para rendimentos baixos</li>
                            <li>Sem custos de manutenção empresarial</li>
                            <li>Ideal para atividades iniciais ou complementares</li>
                        </ul>
                    </div>
                    <div class="desvantagens">
                        <h5><i class="fas fa-times-circle"></i> Desvantagens</h5>
                        <ul>
                            <li>Alíquotas progressivas que podem chegar a 27,5%</li>
                            <li>Limitação para dedução de despesas operacionais</li>
                            <li>Carnê-Leão mensal obrigatório</li>
                            <li>Maior risco de fiscalização para rendimentos elevados</li>
                            <li>Limitações para crescimento e profissionalização do negócio</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="recomendacao-personalizada">
            <h3>Recomendação Personalizada</h3>
            <p>Com base no seu perfil e nos dados fornecidos, o regime tributário mais vantajoso para você é o <strong>${regimeRecomendado === 'simplesNacional' ? 'Simples Nacional' : regimeRecomendado === 'lucroPresumido' ? 'Lucro Presumido' : 'IRPF (Pessoa Física)'}</strong>.</p>
            <p>Esta recomendação considera apenas os aspectos financeiros imediatos. Para uma análise completa, recomendamos considerar também aspectos estratégicos como:</p>
            <ul>
                <li>Projeção de crescimento do seu negócio</li>
                <li>Necessidade de emissão de notas fiscais</li>
                <li>Possibilidade de contratação de funcionários</li>
                <li>Planejamento tributário de longo prazo</li>
            </ul>
        </div>
        
        <div class="call-to-action">
            <h3>Economize tempo e dinheiro com a Mentorial Contabilidade</h3>
            <p>Nossos especialistas podem ajudar você a implementar a melhor estratégia tributária para o seu negócio.</p>
            <p>Entre em contato agora mesmo para uma consultoria personalizada!</p>
            <a href="https://wa.me/5544997732929" class="cta-button" target="_blank">
                <i class="fab fa-whatsapp"></i> Falar com um especialista
            </a>
        </div>
        
        <div class="contact-info">
            <h3>Mentorial Contabilidade</h3>
            <p><i class="fab fa-whatsapp"></i> WhatsApp: (44) 99773-2929</p>
            <p><i class="fas fa-phone"></i> Telefone: (44) 3020-2929</p>
            <p><i class="fas fa-envelope"></i> Email: contato@mentorial.com.br</p>
        </div>
        
        <div class="disclaimer">
            <strong>Disclaimer:</strong> Este relatório contém valores aproximados e foi gerado com base nas informações fornecidas e na legislação vigente na data de sua elaboração. Recomendamos consultar um contador ou especialista tributário antes de tomar decisões definitivas sobre seu regime tributário.
        </div>
        
        <div class="report-footer">
            <p>&copy; 2025 Mentorial Contabilidade | Especialistas em Contabilidade para Infoprodutores e Afiliados</p>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Criar o gráfico comparativo após renderizar o HTML
    criarGraficoComparativo(resultados);
}

// Função para criar o gráfico comparativo
function criarGraficoComparativo(resultados) {
    const ctx = document.getElementById('graficoComparativo').getContext('2d');
    
    // Dados para o gráfico
    const labels = ['Simples Nacional', 'Lucro Presumido', 'IRPF (Pessoa Física)'];
    const valoresMensais = [
        resultados.simplesNacional.valorMensal,
        resultados.lucroPresumido.valorMensal,
        resultados.irpf.valorMensal
    ];
    
    const valoresAnuais = valoresMensais.map(valor => valor * 12);
    
    // Cores para cada regime
    const cores = [
        'rgba(54, 162, 235, 0.7)',  // Azul para Simples Nacional
        'rgba(75, 192, 192, 0.7)',  // Verde para Lucro Presumido
        'rgba(153, 102, 255, 0.7)'  // Roxo para IRPF
    ];
    
    // Encontrar o regime com menor valor (mais vantajoso)
    const menorValorIndex = valoresMensais.indexOf(Math.min(...valoresMensais));
    
    // Destacar o regime mais vantajoso com uma borda mais grossa
    const bordas = cores.map((cor, index) => 
        index === menorValorIndex ? 4 : 1
    );
    
    // Criar o gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    data: valoresMensais,
                    backgroundColor: cores,
                    borderColor: cores.map(cor => cor.replace('0.7', '1')),
                    borderWidth: bordas
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = '';
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Comparativo de Impostos por Regime Tributário',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}
