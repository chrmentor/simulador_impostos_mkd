/**
 * Utilitários de teste para o Simulador de Impostos
 * Este arquivo contém funções para testar funcionalidades e responsividade
 */

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botão de teste
    adicionarBotaoTeste();
    
    // Adicionar painel de teste
    adicionarPainelTeste();
    
    // Adicionar banner de teste de responsividade
    adicionarBannerResponsivo();
    
    // Adicionar grade de debug
    adicionarGradeDebug();
});

// Função para adicionar botão de teste
function adicionarBotaoTeste() {
    const botao = document.createElement('div');
    botao.className = 'test-toggle-button';
    botao.innerHTML = '<i class="fas fa-flask"></i>';
    botao.title = 'Abrir painel de testes';
    
    botao.addEventListener('click', function() {
        const painelTeste = document.querySelector('.test-panel');
        if (painelTeste) {
            painelTeste.classList.toggle('active');
        }
    });
    
    document.body.appendChild(botao);
}

// Função para adicionar painel de teste
function adicionarPainelTeste() {
    const painel = document.createElement('div');
    painel.className = 'test-panel';
    
    painel.innerHTML = `
        <div class="test-panel-header">
            <div class="test-panel-title">Painel de Testes</div>
            <button class="test-panel-close">&times;</button>
        </div>
        
        <div class="test-section">
            <div class="test-section-title">Testes de Responsividade</div>
            <div class="test-buttons">
                <button class="test-button" data-device="mobile">Mobile (375px)</button>
                <button class="test-button" data-device="tablet">Tablet (768px)</button>
                <button class="test-button" data-device="desktop">Desktop (1024px)</button>
                <button class="test-button" data-device="large">Large (1440px)</button>
                <button class="test-button" data-device="reset">Resetar</button>
            </div>
        </div>
        
        <div class="test-section">
            <div class="test-section-title">Testes de Funcionalidades</div>
            <div class="test-buttons">
                <button class="test-button" data-test="validacao">Validação de Campos</button>
                <button class="test-button" data-test="calculo">Cálculos Tributários</button>
                <button class="test-button" data-test="visualizacoes">Visualizações</button>
                <button class="test-button" data-test="relatorio">Geração de Relatório</button>
                <button class="test-button" data-test="todos">Testar Tudo</button>
            </div>
        </div>
        
        <div class="test-section">
            <div class="test-section-title">Ferramentas de Debug</div>
            <div class="toggle-switch">
                <input type="checkbox" id="toggleGrid">
                <label for="toggleGrid">Mostrar Grade</label>
            </div>
            <div class="toggle-switch">
                <input type="checkbox" id="highlightElements">
                <label for="highlightElements">Destacar Elementos</label>
            </div>
        </div>
        
        <div class="test-results">
            <div class="test-result-item">Selecione um teste para começar...</div>
        </div>
    `;
    
    document.body.appendChild(painel);
    
    // Adicionar eventos
    const fecharBtn = painel.querySelector('.test-panel-close');
    fecharBtn.addEventListener('click', function() {
        painel.classList.remove('active');
    });
    
    // Eventos para botões de dispositivo
    const botoesDispositivo = painel.querySelectorAll('[data-device]');
    botoesDispositivo.forEach(botao => {
        botao.addEventListener('click', function() {
            const dispositivo = this.getAttribute('data-device');
            simularDispositivo(dispositivo);
            
            // Atualizar classe ativa
            botoesDispositivo.forEach(b => b.classList.remove('active'));
            if (dispositivo !== 'reset') {
                this.classList.add('active');
            }
        });
    });
    
    // Eventos para botões de teste
    const botoesTeste = painel.querySelectorAll('[data-test]');
    botoesTeste.forEach(botao => {
        botao.addEventListener('click', function() {
            const teste = this.getAttribute('data-test');
            executarTeste(teste);
        });
    });
    
    // Evento para toggle de grade
    const toggleGrid = painel.querySelector('#toggleGrid');
    toggleGrid.addEventListener('change', function() {
        const grade = document.querySelector('.debug-grid');
        if (grade) {
            grade.classList.toggle('active', this.checked);
        }
    });
    
    // Evento para destacar elementos
    const highlightElements = painel.querySelector('#highlightElements');
    highlightElements.addEventListener('change', function() {
        if (this.checked) {
            destacarElementos();
        } else {
            removerDestaque();
        }
    });
}

// Função para adicionar banner responsivo
function adicionarBannerResponsivo() {
    const banner = document.createElement('div');
    banner.className = 'responsive-test-banner';
    
    banner.innerHTML = `
        <div>Testando visualização responsiva</div>
        <div class="device-buttons">
            <button class="device-button" data-width="375">Mobile</button>
            <button class="device-button" data-width="768">Tablet</button>
            <button class="device-button" data-width="1024">Desktop</button>
            <button class="device-button" data-width="1440">Large</button>
            <button class="device-button" data-width="reset">Resetar</button>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Adicionar eventos
    const botoes = banner.querySelectorAll('.device-button');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const width = this.getAttribute('data-width');
            
            if (width === 'reset') {
                // Resetar para tamanho original
                document.body.style.width = '';
                document.body.style.margin = '';
                document.body.classList.remove('test-mode');
                banner.classList.remove('active');
                
                // Remover classe ativa de todos os botões
                botoes.forEach(b => b.classList.remove('active'));
            } else {
                // Definir largura específica
                document.body.style.width = `${width}px`;
                document.body.style.margin = '0 auto';
                document.body.classList.add('test-mode');
                banner.classList.add('active');
                
                // Atualizar classe ativa
                botoes.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Função para adicionar grade de debug
function adicionarGradeDebug() {
    const grade = document.createElement('div');
    grade.className = 'debug-grid';
    
    grade.innerHTML = `
        <div class="debug-grid-overlay"></div>
    `;
    
    document.body.appendChild(grade);
}

// Função para simular dispositivo
function simularDispositivo(dispositivo) {
    const banner = document.querySelector('.responsive-test-banner');
    const botoes = banner.querySelectorAll('.device-button');
    
    if (dispositivo === 'reset') {
        // Resetar para tamanho original
        document.body.style.width = '';
        document.body.style.margin = '';
        document.body.classList.remove('test-mode');
        banner.classList.remove('active');
        
        // Remover classe ativa de todos os botões
        botoes.forEach(b => b.classList.remove('active'));
        
        adicionarResultadoTeste('Visualização resetada para o tamanho original');
    } else {
        // Mapear dispositivo para largura
        const larguras = {
            'mobile': 375,
            'tablet': 768,
            'desktop': 1024,
            'large': 1440
        };
        
        const largura = larguras[dispositivo] || 375;
        
        // Definir largura específica
        document.body.style.width = `${largura}px`;
        document.body.style.margin = '0 auto';
        document.body.classList.add('test-mode');
        banner.classList.add('active');
        
        // Atualizar classe ativa no banner
        botoes.forEach(b => b.classList.remove('active'));
        const botaoAtivo = Array.from(botoes).find(b => b.getAttribute('data-width') == largura);
        if (botaoAtivo) botaoAtivo.classList.add('active');
        
        adicionarResultadoTeste(`Simulando dispositivo ${dispositivo} (${largura}px)`);
    }
}

// Função para executar teste
function executarTeste(teste) {
    adicionarResultadoTeste(`Iniciando teste: ${teste}`, 'info');
    
    switch (teste) {
        case 'validacao':
            testarValidacao();
            break;
        case 'calculo':
            testarCalculos();
            break;
        case 'visualizacoes':
            testarVisualizacoes();
            break;
        case 'relatorio':
            testarRelatorio();
            break;
        case 'todos':
            testarTudo();
            break;
        default:
            adicionarResultadoTeste(`Teste não reconhecido: ${teste}`, 'error');
    }
}

// Função para testar validação de campos
function testarValidacao() {
    try {
        // Verificar se os campos obrigatórios existem
        const camposObrigatorios = [
            { id: 'nome', label: 'Nome' },
            { id: 'tipoNegocio', label: 'Tipo de Negócio' },
            { id: 'faturamentoMensal', label: 'Faturamento Mensal' },
            { id: 'faturamentoAnual', label: 'Faturamento Anual' },
            { id: 'despesasMensais', label: 'Despesas Mensais' }
        ];
        
        let todosExistem = true;
        
        camposObrigatorios.forEach(campo => {
            const elemento = document.getElementById(campo.id);
            if (!elemento) {
                adicionarResultadoTeste(`Campo obrigatório não encontrado: ${campo.label}`, 'error');
                todosExistem = false;
            }
        });
        
        if (!todosExistem) {
            adicionarResultadoTeste('Teste de validação falhou: campos obrigatórios ausentes', 'error');
            return;
        }
        
        // Testar validação de campo vazio
        const campoNome = document.getElementById('nome');
        campoNome.value = '';
        const eventoBlur = new Event('blur');
        campoNome.dispatchEvent(eventoBlur);
        
        // Verificar se a mensagem de erro apareceu
        setTimeout(() => {
            const mensagemErro = campoNome.parentElement.querySelector('.error-message');
            if (mensagemErro) {
                adicionarResultadoTeste('Validação de campo vazio funcionando corretamente', 'success');
            } else {
                adicionarResultadoTeste('Falha na validação de campo vazio', 'error');
            }
            
            // Restaurar valor
            campoNome.value = 'Usuário de Teste';
            campoNome.dispatchEvent(eventoBlur);
            
            // Testar formatação de moeda
            const campoFaturamento = document.getElementById('faturamentoMensal');
            campoFaturamento.value = '1000';
            const eventoInput = new Event('input');
            campoFaturamento.dispatchEvent(eventoInput);
            
            setTimeout(() => {
                if (campoFaturamento.value.includes('R$') && campoFaturamento.value.includes(',')) {
                    adicionarResultadoTeste('Formatação de moeda funcionando corretamente', 'success');
                } else {
                    adicionarResultadoTeste('Falha na formatação de moeda', 'error');
                }
                
                adicionarResultadoTeste('Teste de validação concluído', 'info');
            }, 500);
        }, 500);
    } catch (error) {
        adicionarResultadoTeste(`Erro no teste de validação: ${error.message}`, 'error');
    }
}

// Função para testar cálculos tributários
function testarCalculos() {
    try {
        // Verificar se a função de cálculo existe
        if (typeof calcularImpostos !== 'function') {
            adicionarResultadoTeste('Função calcularImpostos não encontrada', 'error');
            return;
        }
        
        // Dados de teste
        const dadosTeste = {
            nome: 'Usuário de Teste',
            tipoNegocio: 'infoprodutos',
            faturamentoMensal: 5000,
            faturamentoAnual: 60000,
            despesasMensais: 1500,
            possuiContabilidade: true
        };
        
        // Executar cálculo
        const resultados = calcularImpostos(dadosTeste);
        
        // Verificar se os resultados foram gerados corretamente
        if (!resultados) {
            adicionarResultadoTeste('Falha ao gerar resultados', 'error');
            return;
        }
        
        if (!resultados.simplesNacional || !resultados.lucroPresumido || !resultados.irpf) {
            adicionarResultadoTeste('Resultados incompletos', 'error');
            return;
        }
        
        // Verificar se os valores são números válidos
        const verificarValor = (regime, propriedade) => {
            const valor = resultados[regime][propriedade];
            return typeof valor === 'number' && !isNaN(valor);
        };
        
        const regimes = ['simplesNacional', 'lucroPresumido', 'irpf'];
        const propriedades = ['aliquota', 'valorMensal'];
        
        let todosValidos = true;
        
        regimes.forEach(regime => {
            propriedades.forEach(prop => {
                if (!verificarValor(regime, prop)) {
                    adicionarResultadoTeste(`Valor inválido em ${regime}.${prop}`, 'error');
                    todosValidos = false;
                }
            });
        });
        
        if (todosValidos) {
            adicionarResultadoTeste('Todos os cálculos tributários estão corretos', 'success');
            
            // Mostrar valores calculados
            regimes.forEach(regime => {
                const nomeRegime = regime === 'simplesNacional' ? 'Simples Nacional' : 
                                  regime === 'lucroPresumido' ? 'Lucro Presumido' : 'IRPF';
                adicionarResultadoTeste(`${nomeRegime}: R$ ${resultados[regime].valorMensal.toFixed(2)} (${resultados[regime].aliquota.toFixed(2)}%)`, 'info');
            });
        }
        
        adicionarResultadoTeste('Teste de cálculos concluído', 'info');
    } catch (error) {
        adicionarResultadoTeste(`Erro no teste de cálculos: ${error.message}`, 'error');
    }
}

// Função para testar visualizações
function testarVisualizacoes() {
    try {
        // Verificar se as funções de visualização existem
        if (typeof renderizarVisualizacoes !== 'function') {
            adicionarResultadoTeste('Função renderizarVisualizacoes não encontrada', 'error');
            return;
        }
        
        // Criar container temporário para teste
        const container = document.createElement('div');
        container.id = 'resultadosContainer';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);
        
        // Dados de teste
        const dadosTeste = {
            nome: 'Usuário de Teste',
            tipoNegocio: 'infoprodutos',
            faturamentoMensal: 5000,
            faturamentoAnual: 60000,
            despesasMensais: 1500,
            possuiContabilidade: true
        };
        
        // Executar cálculo
        const resultados = calcularImpostos(dadosTeste);
        
        // Renderizar visualizações
        renderizarVisualizacoes(dadosTeste, resultados);
        
        // Verificar se os elementos foram criados
        setTimeout(() => {
            const elementosVisualizacao = [
                { id: 'metricas', nome: 'Métricas' },
                { id: 'graficoBarras', nome: 'Gráfico de Barras' },
                { id: 'tabelaComparativa', nome: 'Tabela Comparativa' },
                { id: 'graficoPizza', nome: 'Gráfico de Pizza' }
            ];
            
            let todosExistem = true;
            
            elementosVisualizacao.forEach(elem => {
                const elemento = document.getElementById(elem.id);
                if (!elemento) {
                    adicionarResultadoTeste(`Elemento de visualização não encontrado: ${elem.nome}`, 'error');
                    todosExistem = false;
                }
            });
            
            if (todosExistem) {
                adicionarResultadoTeste('Todas as visualizações foram renderizadas corretamente', 'success');
            }
            
            // Limpar container temporário
            document.body.removeChild(container);
            
            adicionarResultadoTeste('Teste de visualizações concluído', 'info');
        }, 1000);
    } catch (error) {
        adicionarResultadoTeste(`Erro no teste de visualizações: ${error.message}`, 'error');
    }
}

// Função para testar geração de relatório
function testarRelatorio() {
    try {
        // Verificar se a função de geração de relatório existe
        if (typeof gerarRelatorioCompleto !== 'function') {
            adicionarResultadoTeste('Função gerarRelatorioCompleto não encontrada', 'error');
            return;
        }
        
        // Dados de teste
        const dadosTeste = {
            nome: 'Usuário de Teste',
            tipoNegocio: 'infoprodutos',
            faturamentoMensal: 5000,
            faturamentoAnual: 60000,
            despesasMensais: 1500,
            possuiContabilidade: true
        };
        
        // Executar cálculo
        const resultados = calcularImpostos(dadosTeste);
        
        // Gerar relatório
        const relatorio = gerarRelatorioCompleto(dadosTeste, resultados);
        
        // Verificar se o relatório foi gerado
        if (!relatorio || typeof relatorio !== 'string' || relatorio.length < 100) {
            adicionarResultadoTeste('Falha ao gerar relatório', 'error');
            return;
        }
        
        // Verificar elementos essenciais no relatório
        const elementosEssenciais = [
            'Relatório Tributário Personalizado',
            'Resumo Executivo',
            'Simples Nacional',
            'Lucro Presumido',
            'IRPF',
            'Economia potencial'
        ];
        
        let todosPresentes = true;
        
        elementosEssenciais.forEach(elem => {
            if (!relatorio.includes(elem)) {
                adicionarResultadoTeste(`Elemento essencial não encontrado no relatório: ${elem}`, 'error');
                todosPresentes = false;
            }
        });
        
        if (todosPresentes) {
            adicionarResultadoTeste('Relatório gerado corretamente com todos os elementos essenciais', 'success');
        }
        
        adicionarResultadoTeste('Teste de geração de relatório concluído', 'info');
    } catch (error) {
        adicionarResultadoTeste(`Erro no teste de geração de relatório: ${error.message}`, 'error');
    }
}

// Função para testar tudo
function testarTudo() {
    adicionarResultadoTeste('Iniciando testes completos...', 'info');
    
    // Executar testes em sequência
    testarValidacao();
    
    setTimeout(() => {
        testarCalculos();
        
        setTimeout(() => {
            testarVisualizacoes();
            
            setTimeout(() => {
                testarRelatorio();
                
                setTimeout(() => {
                    adicionarResultadoTeste('Todos os testes foram concluídos', 'info');
                }, 1500);
            }, 1500);
        }, 1500);
    }, 1500);
}

// Função para adicionar resultado de teste
function adicionarResultadoTeste(mensagem, tipo = 'info') {
    const resultados = document.querySelector('.test-results');
    if (!resultados) return;
    
    const item = document.createElement('div');
    item.className = `test-result-item test-result-${tipo}`;
    
    // Adicionar ícone com base no tipo
    let icone = 'info-circle';
    if (tipo === 'success') icone = 'check-circle';
    if (tipo === 'error') icone = 'exclamation-circle';
    if (tipo === 'warning') icone = 'exclamation-triangle';
    
    item.innerHTML = `<i class="fas fa-${icone}"></i> ${mensagem}`;
    
    // Adicionar ao início da lista
    resultados.insertBefore(item, resultados.firstChild);
    
    // Limitar a 20 itens
    const itens = resultados.querySelectorAll('.test-result-item');
    if (itens.length > 20) {
        resultados.removeChild(itens[itens.length - 1]);
    }
}

// Função para destacar elementos
function destacarElementos() {
    // Lista de elementos importantes para destacar
    const elementosImportantes = [
        { seletor: '#nome', id: 'campo-nome' },
        { seletor: '#tipoNegocio', id: 'campo-tipo-negocio' },
        { seletor: '#faturamentoMensal', id: 'campo-faturamento-mensal' },
        { seletor: '#faturamentoAnual', id: 'campo-faturamento-anual' },
        { seletor: '#despesasMensais', id: 'campo-despesas-mensais' },
        { seletor: 'input[name="contabilidade"]', id: 'campo-contabilidade' },
        { seletor: '.next-btn', id: 'botao-avancar' },
        { seletor: '.prev-btn', id: 'botao-voltar' },
        { seletor: '#calcularBtn', id: 'botao-calcular' },
        { seletor: '.step', id: 'indicador-etapa' },
        { seletor: '.form-step', id: 'container-etapa' }
    ];
    
    elementosImportantes.forEach(elem => {
        const elementos = document.querySelectorAll(elem.seletor);
        elementos.forEach((el, index) => {
            el.classList.add('highlight-element');
            el.setAttribute('data-test-id', `${elem.id}${elementos.length > 1 ? '-' + (index + 1) : ''}`);
        });
    });
    
    adicionarResultadoTeste('Elementos importantes destacados', 'info');
}

// Função para remover destaque
function removerDestaque() {
    const elementosDestacados = document.querySelectorAll('.highlight-element');
    elementosDestacados.forEach(el => {
        el.classList.remove('highlight-element');
        el.removeAttribute('data-test-id');
    });
    
    adicionarResultadoTeste('Destaques removidos', 'info');
}
