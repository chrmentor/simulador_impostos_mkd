/**
 * Validações e feedback visual para o Simulador de Impostos
 * Este arquivo contém funções para validar entradas e fornecer feedback visual ao usuário
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const camposObrigatorios = document.querySelectorAll('[required]');
    const camposMoeda = document.querySelectorAll('#faturamentoMensal, #faturamentoAnual, #despesasMensais');
    const tipoNegocio = document.getElementById('tipoNegocio');
    const opcoesContabilidade = document.querySelectorAll('input[name="contabilidade"]');
    
    // Adicionar tooltips informativos
    adicionarTooltips();
    
    // Adicionar validações em tempo real
    adicionarValidacoes();
    
    // Adicionar formatação de moeda
    adicionarFormatacaoMoeda();
    
    // Adicionar validação de formulário completo
    adicionarValidacaoFormulario();
    
    // Adicionar feedback visual para campos
    adicionarFeedbackVisual();
});

// Função para adicionar tooltips informativos
function adicionarTooltips() {
    // Definir conteúdo dos tooltips
    const tooltips = {
        'nome': 'Seu nome será usado apenas para personalizar o relatório.',
        'whatsapp': 'Seu número de WhatsApp com DDD para contato.',
        'email': 'Seu e-mail para envio do relatório completo.',
        'tipoNegocio': 'O tipo de negócio influencia na classificação fiscal e pode afetar as alíquotas aplicáveis.',
        'faturamentoMensal': 'Informe o valor médio mensal que você recebe com sua atividade.',
        'faturamentoAnual': 'Receita Bruta Total dos últimos 12 meses (RBT12). Este valor é essencial para calcular corretamente sua alíquota no Simples Nacional.',
        'despesasMensais': 'Inclua todas as despesas relacionadas à sua atividade (hospedagem, marketing, software, etc).',
        'contabilidade': 'Esta informação afeta como as despesas são consideradas no cálculo do IRPF.'
    };
    
    // Adicionar tooltips aos campos
    Object.keys(tooltips).forEach(campo => {
        const elemento = document.getElementById(campo) || document.querySelector(`[name="${campo}"]`);
        if (!elemento) return;
        
        // Encontrar o label associado
        let label;
        if (elemento.id) {
            label = document.querySelector(`label[for="${elemento.id}"]`);
        } else {
            // Para radio buttons, pegar o label do grupo
            label = document.querySelector(`label:has(input[name="${campo}"])`);
        }
        
        if (!label) {
            // Se não encontrar label específico, procurar o label mais próximo
            label = elemento.closest('.form-group').querySelector('label');
        }
        
        if (label) {
            // Criar tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'info-tooltip';
            tooltip.innerHTML = `<i class="fas fa-info-circle"></i><span class="tooltip-content">${tooltips[campo]}</span>`;
            
            // Adicionar tooltip após o label
            label.appendChild(tooltip);
        }
    });
}

// Função para adicionar validações em tempo real
function adicionarValidacoes() {
    // Validar campos obrigatórios
    document.querySelectorAll('[required]').forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            // Remover mensagem de erro se o campo for preenchido
            if (this.value.trim()) {
                this.classList.remove('invalid');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
    });
    
    // Validar valores monetários
    document.querySelectorAll('#faturamentoMensal, #faturamentoAnual, #despesasMensais').forEach(campo => {
        campo.addEventListener('blur', function() {
            validarValorMonetario(this);
        });
    });
    
    // Validar formato de WhatsApp
    const campoWhatsApp = document.getElementById('whatsapp');
    if (campoWhatsApp) {
        campoWhatsApp.addEventListener('blur', function() {
            validarWhatsApp(this);
        });
        
        // Aplicar máscara de formatação para WhatsApp
        campoWhatsApp.addEventListener('input', function(e) {
            aplicarMascaraWhatsApp(this);
        });
    }
    
    // Validar formato de email
    const campoEmail = document.getElementById('email');
    if (campoEmail) {
        campoEmail.addEventListener('blur', function() {
            validarEmail(this);
        });
    };
    
    // Validar relação entre faturamento mensal e anual
    const faturamentoMensal = document.getElementById('faturamentoMensal');
    const faturamentoAnual = document.getElementById('faturamentoAnual');
    
// Função para validar formato de WhatsApp
function validarWhatsApp(campo) {
    const valor = campo.value.trim();
    
    // Remover qualquer formatação existente para validar apenas os números
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Verificar se está vazio
    if (!valor) {
        mostrarErro(campo, 'Este campo é obrigatório');
        return false;
    }
    
    // Verificar se tem o formato correto (com DDD - 11 ou 10 dígitos)
    if (apenasNumeros.length < 10 || apenasNumeros.length > 11) {
        mostrarErro(campo, 'Formato inválido. Informe o DDD + número');
        return false;
    }
    
    // Validação passou
    campo.classList.remove('invalid');
    const errorMsg = campo.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
    return true;
}

// Função para aplicar máscara de formatação ao WhatsApp
function aplicarMascaraWhatsApp(campo) {
    let valor = campo.value.replace(/\D/g, '');
    
    if (valor.length > 0) {
        // Formatar como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (valor.length <= 2) {
            valor = `(${valor}`;
        } else if (valor.length <= 6) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
        } else if (valor.length <= 10) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 6)}-${valor.substring(6)}`;
        } else {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7, 11)}`;
        }
    }
    
    campo.value = valor;
}

// Função para validar formato de email
function validarEmail(campo) {
    const valor = campo.value.trim();
    
    // Verificar se está vazio
    if (!valor) {
        mostrarErro(campo, 'Este campo é obrigatório');
        return false;
    }
    
    // Expressão regular para validar email
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!regexEmail.test(valor)) {
        mostrarErro(campo, 'Formato de e-mail inválido');
        return false;
    }
    
    // Validação passou
    campo.classList.remove('invalid');
    const errorMsg = campo.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
    return true;
}
    
    if (faturamentoMensal && faturamentoAnual) {
        faturamentoAnual.addEventListener('blur', function() {
            validarRelacaoFaturamento(faturamentoMensal, faturamentoAnual);
        });
        
        faturamentoMensal.addEventListener('blur', function() {
            validarRelacaoFaturamento(faturamentoMensal, faturamentoAnual);
        });
    }
    
    // Validar seleção de tipo de negócio
    const tipoNegocio = document.getElementById('tipoNegocio');
    if (tipoNegocio) {
        tipoNegocio.addEventListener('change', function() {
            validarSelect(this);
        });
    }
    
    // Validar seleção de opção de contabilidade
    document.querySelectorAll('input[name="contabilidade"]').forEach(radio => {
        radio.addEventListener('change', function() {
            validarRadioGroup('contabilidade');
        });
    });
}

// Função para validar um campo individual
function validarCampo(campo) {
    // Verificar se o campo está vazio
    if (!campo.value.trim()) {
        mostrarErro(campo, 'Este campo é obrigatório');
        return false;
    }
    
    // Validações específicas por tipo de campo
    if (campo.id === 'nome') {
        if (campo.value.trim().length < 3) {
            mostrarErro(campo, 'O nome deve ter pelo menos 3 caracteres');
            return false;
        }
    }
    
    // Se passou por todas as validações
    removerErro(campo);
    mostrarSucesso(campo);
    return true;
}

// Função para validar um campo select
function validarSelect(campo) {
    // Verificar se uma opção válida foi selecionada
    if (!campo.value || campo.value === "" || campo.selectedIndex === 0) {
        mostrarErro(campo, 'Selecione uma opção');
        return false;
    }
    
    // Se passou por todas as validações
    removerErro(campo);
    mostrarSucesso(campo);
    return true;
}

// Função para validar um grupo de radio buttons
function validarRadioGroup(nomeCampo) {
    const radios = document.querySelectorAll(`input[name="${nomeCampo}"]`);
    let selecionado = false;
    
    // Verificar se algum radio está selecionado
    radios.forEach(radio => {
        if (radio.checked) {
            selecionado = true;
        }
    });
    
    if (!selecionado) {
        // Mostrar erro no primeiro radio do grupo
        mostrarErro(radios[0], 'Selecione uma opção');
        return false;
    }
    
    // Se algum radio está selecionado, remover erro
    removerErro(radios[0]);
    return true;
}

// Função para validar valores monetários
function validarValorMonetario(campo) {
    // Verificar se o campo está vazio
    if (!campo.value.trim()) {
        mostrarErro(campo, 'Este campo é obrigatório');
        return false;
    }
    
    // Extrair apenas os números
    const valor = extrairNumeroDeFormatoMoeda(campo.value);
    
    // Verificar se é um número válido e maior que zero
    if (isNaN(valor) || valor <= 0) {
        mostrarErro(campo, campo.id === 'faturamentoMensal' ? 'O faturamento mensal deve ser maior que zero' : 'Informe um valor monetário válido');
        return false;
    }
    
    // Se passou por todas as validações
    removerErro(campo);
    mostrarSucesso(campo);
    return true;
}

// Função para validar a relação entre faturamento mensal e anual
function validarRelacaoFaturamento(campoMensal, campoAnual) {
    // Extrair valores
    const valorMensal = extrairNumeroDeFormatoMoeda(campoMensal.value);
    const valorAnual = extrairNumeroDeFormatoMoeda(campoAnual.value);
    
    // Verificar se ambos os campos têm valores
    if (isNaN(valorMensal) || isNaN(valorAnual)) return;
    
    // Verificar se o valor anual é pelo menos igual ao mensal
    if (valorAnual < valorMensal) {
        mostrarErro(campoAnual, 'O faturamento anual deve ser pelo menos igual ao mensal');
        return false;
    }
    
    // Verificar se o valor anual é coerente com o mensal (não mais que 12x)
    if (valorAnual > valorMensal * 12 * 1.2) { // Permitir uma margem de 20%
        mostrarAviso(campoAnual, 'O faturamento anual parece muito alto em relação ao mensal');
    } else if (valorAnual < valorMensal * 6 && valorMensal > 0) {
        mostrarAviso(campoAnual, 'O faturamento anual parece muito baixo em relação ao mensal');
    } else {
        removerAviso(campoAnual);
    }
    
    return true;
}

// Função para adicionar formatação de moeda
function adicionarFormatacaoMoeda() {
    document.querySelectorAll('#faturamentoMensal, #faturamentoAnual, #despesasMensais').forEach(campo => {
        campo.addEventListener('input', function(e) {
            formatarCampoMoeda(this);
        });
        
        // Formatar valor inicial se existir
        if (campo.value) {
            formatarCampoMoeda(campo);
        }
    });
}

// Função para formatar campo como moeda
function formatarCampoMoeda(campo) {
    // Remover tudo que não for dígito
    let valor = campo.value.replace(/\D/g, '');
    
    // Converter para número e formatar
    valor = (parseInt(valor) / 100).toFixed(2);
    
    // Formatar com separadores de milhar e decimal
    valor = valor.replace('.', ',');
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    
    // Atualizar o valor do campo
    campo.value = `R$ ${valor}`;
}

// Função para extrair número de um formato de moeda
function extrairNumeroDeFormatoMoeda(valor) {
    if (!valor) return NaN;
    
    // Remover símbolo de moeda e espaços
    valor = valor.replace('R$', '').trim();
    
    // Substituir pontos por nada (remover separador de milhar)
    valor = valor.replace(/\./g, '');
    
    // Substituir vírgula por ponto (converter separador decimal)
    valor = valor.replace(',', '.');
    
    // Converter para número
    return parseFloat(valor);
}

// Função para adicionar validação do formulário completo
function adicionarValidacaoFormulario() {
    // Validar ao clicar nos botões de avançar
    document.querySelectorAll('.next-btn').forEach(botao => {
        botao.addEventListener('click', function(e) {
            // Prevenir o comportamento padrão inicialmente
            e.preventDefault();
            
            const etapaAtual = parseInt(this.getAttribute('data-next')) - 1;
            const formStep = document.getElementById(`step${etapaAtual}`);
            
            // Validar todos os campos da etapa atual
            const camposEtapa = formStep.querySelectorAll('[required]');
            let etapaValida = true;
            
            camposEtapa.forEach(campo => {
                if (!validarCampo(campo)) {
                    etapaValida = false;
                }
            });
            
            // Validações específicas por etapa
            if (etapaAtual === 1) { // Etapa de nome
                const nome = document.getElementById('nome');
                if (!validarCampo(nome)) {
                    etapaValida = false;
                }
            }
            
            if (etapaAtual === 2) { // Etapa de tipo de negócio
                const tipoNegocio = document.getElementById('tipoNegocio');
                if (!validarSelect(tipoNegocio)) {
                    etapaValida = false;
                }
            }
            
            if (etapaAtual === 3) { // Etapa de faturamento
                const faturamentoMensal = document.getElementById('faturamentoMensal');
                const faturamentoAnual = document.getElementById('faturamentoAnual');
                
                if (!validarValorMonetario(faturamentoMensal)) {
                    etapaValida = false;
                }
                
                if (!validarValorMonetario(faturamentoAnual)) {
                    etapaValida = false;
                }
                
                if (etapaValida && !validarRelacaoFaturamento(faturamentoMensal, faturamentoAnual)) {
                    etapaValida = false;
                }
            }
            
            if (etapaAtual === 4) { // Etapa de despesas
                const despesasMensais = document.getElementById('despesasMensais');
                
                if (!validarValorMonetario(despesasMensais)) {
                    etapaValida = false;
                }
                
                // Verificar se alguma opção de contabilidade foi selecionada
                if (!validarRadioGroup('contabilidade')) {
                    etapaValida = false;
                }
            }
            
            // Se a etapa não for válida, impedir o avanço
            if (!etapaValida) {
                // Mostrar notificação de erro
                mostrarNotificacao('Por favor, preencha todos os campos obrigatórios antes de continuar.', 'error');
                
                // Animar campos com erro
                document.querySelectorAll('.invalid').forEach(campo => {
                    campo.classList.add('animate-shake');
                    setTimeout(() => {
                        campo.classList.remove('animate-shake');
                    }, 500);
                });
                
                // Focar no primeiro campo com erro
                const primeiroCampoComErro = formStep.querySelector('.invalid');
                if (primeiroCampoComErro) {
                    primeiroCampoComErro.focus();
                }
                
                return false;
            }
            
            // Se tudo estiver válido, permitir o avanço
            const proximaEtapa = document.getElementById(`step${etapaAtual + 1}`);
            if (proximaEtapa) {
                // Esconder etapa atual
                formStep.style.display = 'none';
                
                // Mostrar próxima etapa
                proximaEtapa.style.display = 'block';
                
                // Atualizar barra de progresso
                atualizarBarraProgresso(etapaAtual + 1);
            }
        });
    });
    
    // Validar ao clicar no botão de calcular
    document.getElementById('calcularBtn').addEventListener('click', function(e) {
        // Prevenir o comportamento padrão inicialmente
        e.preventDefault();
        
        const etapa4 = document.getElementById('step4');
        
        // Validar todos os campos da etapa 4
        const camposEtapa = etapa4.querySelectorAll('[required]');
        let etapaValida = true;
        
        camposEtapa.forEach(campo => {
            if (!validarCampo(campo)) {
                etapaValida = false;
            }
        });
        
        // Validar despesas
        const despesasMensais = document.getElementById('despesasMensais');
        if (!validarValorMonetario(despesasMensais)) {
            etapaValida = false;
        }
        
        // Verificar se alguma opção de contabilidade foi selecionada
        if (!validarRadioGroup('contabilidade')) {
            etapaValida = false;
        }
        
        // Se a etapa não for válida, impedir o cálculo
        if (!etapaValida) {
            // Mostrar notificação de erro
            mostrarNotificacao('Por favor, preencha todos os campos obrigatórios antes de calcular.', 'error');
            
            // Animar campos com erro
            document.querySelectorAll('.invalid').forEach(campo => {
                campo.classList.add('animate-shake');
                setTimeout(() => {
                    campo.classList.remove('animate-shake');
                }, 500);
            });
            
            // Focar no primeiro campo com erro
            const primeiroCampoComErro = etapa4.querySelector('.invalid');
            if (primeiroCampoComErro) {
                primeiroCampoComErro.focus();
            }
            
            return false;
        }
        
        // Se tudo estiver válido, mostrar loader e prosseguir com o cálculo
        mostrarLoader('Calculando impostos...');
        
        // Coletar dados do formulário
        const dados = coletarDadosFormulario();
        
        // Calcular resultados
        const resultados = calcularImpostos(dados);
        
        // Aguardar 2 segundos antes de mostrar os resultados
        setTimeout(() => {
            // Esconder o loader
            esconderLoader();
            
            // Mostrar resultados
            // mostrarResultados(dados, resultados); // Comentado para evitar erro, pois script.js já faz isso
            
            // Mostrar modal
            const resultadosModal = document.getElementById('resultadosModal');
            if (resultadosModal) {
                resultadosModal.style.display = 'flex';
            }
        }, 2000);
    });
}

// Função para atualizar a barra de progresso
function atualizarBarraProgresso(etapa) {
    const progresso = document.getElementById('progress');
    const steps = document.querySelectorAll('.step');
    
    if (progresso && steps.length > 0) {
        // Calcular largura do progresso
        const larguraProgresso = ((etapa - 1) / (steps.length - 1)) * 100;
        progresso.style.width = `${larguraProgresso}%`;
        
        // Atualizar classes dos steps
        steps.forEach((step, index) => {
            if (index < etapa) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
    const nome = document.getElementById('nome').value;
    const tipoNegocio = document.getElementById('tipoNegocio').value;
    const faturamentoMensal = extrairNumeroDeFormatoMoeda(document.getElementById('faturamentoMensal').value);
    const faturamentoAnual = extrairNumeroDeFormatoMoeda(document.getElementById('faturamentoAnual').value);
    const despesasMensais = extrairNumeroDeFormatoMoeda(document.getElementById('despesasMensais').value);
    const possuiContabilidade = document.getElementById('contabilidadeSim').checked;
    
    return {
        nome,
        tipoNegocio,
        faturamentoMensal,
        faturamentoAnual,
        despesasMensais,
        possuiContabilidade
    };
}

// Função para adicionar feedback visual para campos
function adicionarFeedbackVisual() {
    // Adicionar ícones de sucesso/erro aos campos
    document.querySelectorAll('input, select').forEach(campo => {
        campo.addEventListener('blur', function() {
            if (this.classList.contains('invalid')) {
                // Já tem erro, não fazer nada
            } else if (this.value.trim()) {
                mostrarSucesso(this);
            }
        });
    });
}

// Função para mostrar mensagem de erro
function mostrarErro(campo, mensagem) {
    // Adicionar classe de erro
    campo.classList.add('invalid');
    campo.classList.remove('valid');
    
    // Remover mensagem de erro existente
    const erroExistente = campo.parentElement.querySelector('.error-message');
    if (erroExistente) erroExistente.remove();
    
    // Remover mensagem de sucesso existente
    const sucessoExistente = campo.parentElement.querySelector('.success-message');
    if (sucessoExistente) sucessoExistente.remove();
    
    // Criar e adicionar mensagem de erro
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensagem}`;
    
    // Adicionar após o campo ou seu container
    if (campo.type === 'radio') {
        // Para radio buttons, adicionar após o grupo
        const radioGroup = campo.closest('.radio-group');
        if (radioGroup) {
            radioGroup.appendChild(errorMsg);
        } else {
            campo.parentElement.appendChild(errorMsg);
        }
    } else {
        // Para outros campos, adicionar após o container do input
        const inputContainer = campo.closest('.input-icon') || campo.parentElement;
        inputContainer.appendChild(errorMsg);
    }
}

// Função para mostrar mensagem de aviso
function mostrarAviso(campo, mensagem) {
    // Remover mensagem de aviso existente
    const avisoExistente = campo.parentElement.querySelector('.warning-message');
    if (avisoExistente) avisoExistente.remove();
    
    // Criar e adicionar mensagem de aviso
    const warningMsg = document.createElement('div');
    warningMsg.className = 'warning-message';
    warningMsg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensagem}`;
    
    // Adicionar após o campo ou seu container
    const inputContainer = campo.closest('.input-icon') || campo.parentElement;
    inputContainer.appendChild(warningMsg);
}

// Função para remover mensagem de aviso
function removerAviso(campo) {
    const avisoExistente = campo.parentElement.querySelector('.warning-message');
    if (avisoExistente) avisoExistente.remove();
}

// Função para remover mensagem de erro
function removerErro(campo) {
    campo.classList.remove('invalid');
    
    const erroExistente = campo.parentElement.querySelector('.error-message');
    if (erroExistente) erroExistente.remove();
}

// Função para mostrar indicador de sucesso
function mostrarSucesso(campo) {
    // Não mostrar sucesso para campos de radio
    if (campo.type === 'radio') return;
    
    campo.classList.add('valid');
    
    // Verificar se já existe ícone de sucesso
    const inputContainer = campo.closest('.input-icon');
    if (!inputContainer) return;
    
    const sucessoExistente = inputContainer.querySelector('.success-icon');
    if (!sucessoExistente) {
        const successIcon = document.createElement('span');
        successIcon.className = 'success-icon';
        successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        inputContainer.appendChild(successIcon);
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo) {
    // Função mantida apenas para notificações de erro
    // Não mostrar notificações de sucesso
    if (tipo === 'success') return;
    
    // Remover notificações existentes
    const notificacoesExistentes = document.querySelectorAll('.notification');
    notificacoesExistentes.forEach(notif => {
        notif.remove();
    });
    
    // Criar nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notification notification-${tipo}`;
    
    // Definir ícone com base no tipo
    let icone = 'info-circle';
    if (tipo === 'error') icone = 'exclamation-circle';
    if (tipo === 'warning') icone = 'exclamation-triangle';
    
    notificacao.innerHTML = `<i class="fas fa-${icone}"></i> ${mensagem}`;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(notificacao);
    
    // Posicionar no topo da página
    notificacao.style.position = 'fixed';
    notificacao.style.top = '20px';
    notificacao.style.left = '50%';
    notificacao.style.transform = 'translateX(-50%)';
    notificacao.style.zIndex = '9999';
    notificacao.style.minWidth = '300px';
    
    // Animar entrada
    notificacao.style.animation = 'slideInFromTop 0.5s ease forwards';
    
    // Remover após alguns segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideInFromTop 0.5s ease forwards reverse';
        setTimeout(() => {
            notificacao.remove();
        }, 500);
    }, 3000);
}

// Função para mostrar loader
function mostrarLoader(mensagem) {
    // Remover loader existente
    const loaderExistente = document.querySelector('.loader-overlay');
    if (loaderExistente) loaderExistente.remove();
    
    // Criar overlay de loader
    const loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'loader-overlay';
    loaderOverlay.id = 'loaderOverlay';
    
    // Estilizar overlay
    loaderOverlay.style.position = 'fixed';
    loaderOverlay.style.top = '0';
    loaderOverlay.style.left = '0';
    loaderOverlay.style.width = '100%';
    loaderOverlay.style.height = '100%';
    loaderOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loaderOverlay.style.display = 'flex';
    loaderOverlay.style.justifyContent = 'center';
    loaderOverlay.style.alignItems = 'center';
    loaderOverlay.style.zIndex = '9999';
    
    // Criar conteúdo do loader
    const loaderContent = document.createElement('div');
    loaderContent.className = 'loader-content';
    loaderContent.style.backgroundColor = 'white';
    loaderContent.style.padding = '30px';
    loaderContent.style.borderRadius = '10px';
    loaderContent.style.textAlign = 'center';
    loaderContent.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    
    // Criar spinner
    const spinner = document.createElement('div');
    spinner.className = 'loader';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.margin = '0 auto 15px auto';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // Adicionar mensagem
    const mensagemElement = document.createElement('div');
    mensagemElement.textContent = mensagem || 'Carregando...';
    mensagemElement.style.fontSize = '1.1rem';
    mensagemElement.style.color = '#333';
    
    // Montar estrutura
    loaderContent.appendChild(spinner);
    loaderContent.appendChild(mensagemElement);
    loaderOverlay.appendChild(loaderContent);
    
    // Adicionar ao corpo do documento
    document.body.appendChild(loaderOverlay);
    
    // Adicionar keyframe para animação de spin se não existir
    if (!document.getElementById('loader-keyframes')) {
        const style = document.createElement('style');
        style.id = 'loader-keyframes';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Função para esconder loader
function esconderLoader() {
    const loaderExistente = document.querySelector('.loader-overlay');
    if (loaderExistente) {
        // Animar saída
        loaderExistente.style.opacity = '0';
        loaderExistente.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            loaderExistente.remove();
        }, 300);
    }
}
