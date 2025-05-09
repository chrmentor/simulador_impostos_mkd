document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const progressBar = document.getElementById('progress');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadosModal = document.getElementById('resultadosModal');
    const closeModal = document.getElementById('closeModal');
    const fecharBtn = document.getElementById('fecharBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Formatação de valores monetários
    const formatarMoeda = (input) => {
        // Definir valor inicial como R$ 0,00
        if (!input.value || input.value === '') {
            input.value = 'R$ 0,00';
        }
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Se o campo estiver vazio após remover caracteres não numéricos, definir como zero
            if (value === '') {
                e.target.value = 'R$ 0,00';
                return;
            }
            
            // Converter para número e formatar
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            e.target.value = `R$ ${value}`;
        });
        
        // Adicionar evento para quando o campo perder o foco
        input.addEventListener('blur', function(e) {
            // Se o campo estiver vazio ou contiver NaN, definir como R$ 0,00
            if (!e.target.value || e.target.value === '' || e.target.value.includes('NaN')) {
                e.target.value = 'R$ 0,00';
            }
        });
        
        // Adicionar evento para quando o campo for limpo (delete ou backspace)
        input.addEventListener('keydown', function(e) {
            // Se pressionar delete, backspace ou ctrl+A seguido de delete/backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Verificar se todo o conteúdo está selecionado ou se o campo ficará vazio
                if (
                    (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) ||
                    (e.key === 'Backspace' && e.target.selectionStart === 4) ||
                    (e.key === 'Delete' && e.target.selectionStart === e.target.value.length - 4)
                ) {
                    // Impedir o comportamento padrão
                    e.preventDefault();
                    // Definir como R$ 0,00
                    e.target.value = 'R$ 0,00';
                }
            }
        });
    };
    
    // Aplicar formatação aos campos monetários
    const camposMoeda = document.querySelectorAll('#faturamentoMensal, #faturamentoAnual, #despesasMensais');
    camposMoeda.forEach(formatarMoeda);
    
    // Inicializar campos monetários com R$ 0,00
    camposMoeda.forEach(campo => {
        if (!campo.value || campo.value === '' || campo.value.includes('NaN')) {
            campo.value = 'R$ 0,00';
        }
    });
    
    // Atualizar barra de progresso
    const atualizarProgresso = (stepNumber) => {
        const percent = ((stepNumber - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${percent}%`;
        
        steps.forEach((step, idx) => {
            if (idx + 1 < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (idx + 1 === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    };
    
    // Mostrar etapa específica
    const mostrarEtapa = (stepNumber) => {
        formSteps.forEach((step, idx) => {
            if (idx + 1 === stepNumber) {
                step.style.display = 'block';
                step.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                step.style.display = 'none';
            }
        });
        
        atualizarProgresso(stepNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Validar campos da etapa atual
    const validarEtapa = (stepNumber) => {
        const currentStep = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;
        
        // Validar campos com atributo required
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                
                // Adicionar mensagem de erro se não existir
                let errorMsg = field.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Este campo é obrigatório';
                    field.parentElement.appendChild(errorMsg);
                }
            } else {
                field.classList.remove('invalid');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        // Validação específica para botões de rádio na etapa 4
        if (stepNumber === 4) {
            const radioSim = document.getElementById('contabilidadeSim');
            const radioNao = document.getElementById('contabilidadeNao');
            const radioGroup = radioSim.closest('.radio-group');
            
            if (!radioSim.checked && !radioNao.checked) {
                isValid = false;
                
                // Adicionar mensagem de erro se não existir
                let errorMsg = radioGroup.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Selecione uma opção';
                    radioGroup.parentElement.appendChild(errorMsg);
                }
                
                // Adicionar estilo de erro ao grupo de rádio
                radioGroup.classList.add('invalid-radio');
            } else {
                // Remover mensagem de erro se existir
                const errorMsg = radioGroup.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
                
                // Remover estilo de erro
                radioGroup.classList.remove('invalid-radio');
            }
            
            // Validação específica para o campo de despesas mensais na etapa 4
            const despesasMensais = document.getElementById('despesasMensais');
            if (despesasMensais) {
                const valor = parseFloat(despesasMensais.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
                
                if (valor <= 0) {
                    isValid = false;
                    despesasMensais.classList.add('invalid');
                    
                    // Adicionar mensagem de erro se não existir
                    let errorMsg = despesasMensais.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'As despesas mensais devem ser maiores que zero';
                        despesasMensais.parentElement.appendChild(errorMsg);
                    } else {
                        errorMsg.textContent = 'As despesas mensais devem ser maiores que zero';
                    }
                }
            }
        }
        
        // Validação específica para os campos de faturamento na etapa 3
        if (stepNumber === 3) {
            // Validação para faturamentoMensal
            const faturamentoMensal = document.getElementById('faturamentoMensal');
            if (faturamentoMensal) {
                const inputIconMensal = faturamentoMensal.closest('.input-icon');
                if (inputIconMensal && inputIconMensal.parentElement) {
                    let errorMsgMensal = inputIconMensal.parentElement.querySelector('.error-message-mensal');
                    if (errorMsgMensal) {
                        errorMsgMensal.remove();
                    }
                }
                faturamentoMensal.classList.remove('invalid');

                const valorMensal = parseFloat(faturamentoMensal.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
                
                if (valorMensal <= 0) {
                    isValid = false;
                    faturamentoMensal.classList.add('invalid');
                    
                    const errorMsgMensalElement = document.createElement('div');
                    errorMsgMensalElement.className = 'error-message error-message-mensal';
                    errorMsgMensalElement.textContent = 'O faturamento mensal deve ser maior que zero.';
                    if (inputIconMensal && inputIconMensal.parentElement) {
                        inputIconMensal.parentElement.insertBefore(errorMsgMensalElement, inputIconMensal.nextSibling);
                    }
                }
            }

            // Validação para faturamentoAnual (RBT12)
            const faturamentoAnual = document.getElementById('faturamentoAnual');
            if (faturamentoAnual) {
                const inputIconAnual = faturamentoAnual.closest('.input-icon');
                if (inputIconAnual && inputIconAnual.parentElement) {
                    let errorMsgAnual = inputIconAnual.parentElement.querySelector('.error-message-anual');
                    if (errorMsgAnual) {
                        errorMsgAnual.remove();
                    }
                }
                faturamentoAnual.classList.remove('invalid');

                const valorAnual = parseFloat(faturamentoAnual.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

                if (valorAnual <= 0) {
                    isValid = false;
                    faturamentoAnual.classList.add('invalid');

                    const errorMsgAnualElement = document.createElement('div');
                    errorMsgAnualElement.className = 'error-message error-message-anual';
                    errorMsgAnualElement.textContent = 'O RBT12 (faturamento dos últimos 12 meses) deve ser maior que zero.';
                     if (inputIconAnual && inputIconAnual.parentElement) {
                        inputIconAnual.parentElement.insertBefore(errorMsgAnualElement, inputIconAnual.nextSibling);
                    }
                }
            }
        }
        
        // Validação específica para os campos de WhatsApp e e-mail na etapa 5
        if (stepNumber === 5) {
            const whatsapp = document.getElementById('whatsapp');
            const email = document.getElementById('email');
            
            // Validar WhatsApp
            if (whatsapp && (!whatsapp.value.trim() || whatsapp.value.trim().length < 10)) {
                isValid = false;
                whatsapp.classList.add('invalid');
                
                // Adicionar mensagem de erro se não existir
                let errorMsg = whatsapp.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = whatsapp.value.trim() ? 'Formato de WhatsApp inválido' : 'WhatsApp é obrigatório';
                    whatsapp.parentElement.appendChild(errorMsg);
                } else {
                    errorMsg.textContent = whatsapp.value.trim() ? 'Formato de WhatsApp inválido' : 'WhatsApp é obrigatório';
                }
            }
            
            // Validar e-mail
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                    isValid = false;
                    email.classList.add('invalid');
                    
                    // Adicionar mensagem de erro se não existir
                    let errorMsg = email.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = email.value.trim() ? 'Formato de e-mail inválido' : 'E-mail é obrigatório';
                        email.parentElement.appendChild(errorMsg);
                    } else {
                        errorMsg.textContent = email.value.trim() ? 'Formato de e-mail inválido' : 'E-mail é obrigatório';
                    }
                }
            }
        }
        
        return isValid;
    };
    
    // Event listeners para botões de navegação
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-next')) - 1;
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validarEtapa(currentStep)) {
                mostrarEtapa(nextStep);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            mostrarEtapa(prevStep);
        });
    });
    
    // Calcular e mostrar resultados
    calcularBtn.addEventListener('click', function() {
        // Validar campos obrigatórios na etapa 5 antes de prosseguir
        if (validarEtapa(5)) {
            // Criar e mostrar o box "Calculando impostos..."
            const loadingBox = document.createElement('div');
            loadingBox.className = 'loading-box';
            loadingBox.style.position = 'fixed';
            loadingBox.style.top = '50%';
            loadingBox.style.left = '50%';
            loadingBox.style.transform = 'translate(-50%, -50%)';
            loadingBox.style.backgroundColor = 'white';
            loadingBox.style.padding = '30px';
            loadingBox.style.borderRadius = '10px';
            loadingBox.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            loadingBox.style.zIndex = '9999';
            loadingBox.style.textAlign = 'center';
            
            const loader = document.createElement('div');
            loader.className = 'loader';
            loader.style.width = '40px';
            loader.style.height = '40px';
            loader.style.border = '3px solid #F3F4F6';
            loader.style.borderRadius = '50%';
            loader.style.borderTop = '3px solid #6366F1';
            loader.style.margin = '0 auto 15px auto';
            loader.style.animation = 'spin 1s linear infinite';
            
            const loadingText = document.createElement('div');
            loadingText.textContent = 'Calculando impostos...';
            loadingText.style.fontSize = '16px';
            loadingText.style.color = '#333';
            
            loadingBox.appendChild(loader);
            loadingBox.appendChild(loadingText);
            document.body.appendChild(loadingBox);
            
            // Adicionar keyframes para animação do loader se ainda não existir
            if (!document.getElementById('loader-animation')) {
                const style = document.createElement('style');
                style.id = 'loader-animation';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Coletar dados do formulário
            const dados = {
                nome: document.getElementById('nome').value,
                whatsapp: document.getElementById('whatsapp').value,
                email: document.getElementById('email').value,
                tipoNegocio: document.getElementById('tipoNegocio').value,
                faturamentoMensal: parseFloat(document.getElementById('faturamentoMensal').value.replace('R$ ', '').replace('.', '').replace(',', '.')),
                faturamentoAnual: parseFloat(document.getElementById('faturamentoAnual').value.replace('R$ ', '').replace('.', '').replace(',', '.')),
                despesasMensais: parseFloat(document.getElementById('despesasMensais').value.replace('R$ ', '').replace('.', '').replace(',', '.')),
                possuiContabilidade: document.getElementById('contabilidadeSim').checked
            };
            
            // Simular um pequeno atraso para mostrar o loading
            setTimeout(() => {
                // Calcular impostos (função definida em calculos.js)
                const resultados = calcularImpostos(dados);
                
                // Renderizar resultados
                renderizarResultados(dados, resultados);
                
                // Enviar dados por email usando EmailJS
                enviarDadosPorEmail(dados);
                
                // Remover o box de loading
                document.body.removeChild(loadingBox);
                
                // Mostrar modal
                resultadosModal.style.display = 'flex';
            }, 1000);
        } else {
            // Rolar para o primeiro erro
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Função para enviar dados por email usando EmailJS
        function enviarDadosPorEmail(dados) {
            // Obter data e hora atual formatadas
            const dataAtual = new Date();
            const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
            const horaFormatada = dataAtual.toLocaleTimeString('pt-BR');
            
            // Preparar os parâmetros para o template
            const templateParams = {
                nome: dados.nome,
                whatsapp: dados.whatsapp,
                email: dados.email,
                tipoNegocio: dados.tipoNegocio,
                faturamentoMensal: `R$ ${dados.faturamentoMensal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`,
                faturamentoAnual: `R$ ${dados.faturamentoAnual.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`,
                despesasMensais: `R$ ${dados.despesasMensais.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`,
                possuiContabilidade: dados.possuiContabilidade ? 'Sim' : 'Não',
                data: dataFormatada,
                hora: horaFormatada
            };
            
            // Criar elemento de notificação
            const notificacao = document.createElement('div');
            notificacao.className = 'email-notification';
            notificacao.style.position = 'fixed';
            notificacao.style.bottom = '20px';
            notificacao.style.right = '20px';
            notificacao.style.padding = '15px 20px';
            notificacao.style.borderRadius = '5px';
            notificacao.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
            notificacao.style.zIndex = '9999';
            notificacao.style.transition = 'all 0.3s ease';
            
            // Enviar email usando EmailJS
            emailjs.send('service_ej7aspa', 'template_63ibyys', templateParams)
                .then(function(response) {
                    console.log('Email enviado com sucesso!', response.status, response.text);
                    
                    // Notificação de sucesso (removida a pedido do usuário)
                    /*
                    notificacao.style.backgroundColor = '#4CAF50';
                    notificacao.style.color = 'white';
                    notificacao.innerHTML = '<i class="fas fa-check-circle"></i> Lead registrado com sucesso!';
                    document.body.appendChild(notificacao);
                    
                    // Remover notificação após 5 segundos
                    setTimeout(() => {
                        notificacao.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(notificacao);
                        }, 300);
                    }, 5000);
                    */
                }, function(error) {
                    console.error('Falha ao enviar email:', error);
                    
                    // Notificação de erro
                    notificacao.style.backgroundColor = '#F44336';
                    notificacao.style.color = 'white';
                    notificacao.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao registrar lead. Tente novamente.';
                    document.body.appendChild(notificacao);
                    
                    // Remover notificação após 5 segundos
                    setTimeout(() => {
                        notificacao.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(notificacao);
                        }, 300);
                    }, 5000);
                });
        }
    });
    
    // Fechar modal
    closeModal.addEventListener('click', function() {
        resultadosModal.style.display = 'none';
    });
    
    fecharBtn.addEventListener('click', function() {
        resultadosModal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === resultadosModal) {
            resultadosModal.style.display = 'none';
        }
    });
    
    // Download do relatório em PDF
    downloadBtn.addEventListener('click', function() {
        const elementToExport = document.getElementById('resultadosContainer');
        const fileName = `Relatorio_Tributario_${new Date().toISOString().slice(0, 10)}.pdf`;
        
        html2canvas(elementToExport).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(fileName);
        });
    });
    
    // Iniciar na primeira etapa
    mostrarEtapa(1);
});
