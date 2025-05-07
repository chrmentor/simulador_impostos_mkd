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
    const whatsappBtn = document.getElementById('whatsappBtn');

    const formatarMoeda = (input) => {
        if (!input.value || input.value === '') {
            input.value = 'R$ 0,00';
        }
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value === '') {
                e.target.value = 'R$ 0,00';
                return;
            }
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            e.target.value = `R$ ${value}`;
        });
        input.addEventListener('blur', function(e) {
            if (!e.target.value || e.target.value === '' || e.target.value.includes('NaN')) {
                e.target.value = 'R$ 0,00';
            }
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (
                    (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) ||
                    (e.key === 'Backspace' && e.target.selectionStart === 4 && e.target.value.length === 4) ||
                    (e.key === 'Delete' && e.target.selectionStart === 3 && e.target.selectionEnd === e.target.value.length)
                ) {
                    e.preventDefault();
                    e.target.value = 'R$ 0,00';
                }
            }
        });
    };

    const camposMoeda = document.querySelectorAll('#faturamentoMensal, #faturamentoAnual, #despesasMensais');
    camposMoeda.forEach(formatarMoeda);
    camposMoeda.forEach(campo => {
        if (!campo.value || campo.value === '' || campo.value.includes('NaN')) {
            campo.value = 'R$ 0,00';
        }
    });

    const atualizarProgresso = (stepNumber) => {
        const percent = ((stepNumber - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${percent}%`;
        steps.forEach((step, idx) => {
            step.classList.remove('active', 'completed');
            if (idx + 1 < stepNumber) {
                step.classList.add('completed');
            } else if (idx + 1 === stepNumber) {
                step.classList.add('active');
            }
        });
    };

    const mostrarEtapa = (stepNumber) => {
        formSteps.forEach((step, idx) => {
            step.style.display = (idx + 1 === stepNumber) ? 'block' : 'none';
            if (idx + 1 === stepNumber) {
                step.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                step.classList.remove('animate__animated', 'animate__fadeIn');
            }
        });
        atualizarProgresso(stepNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const validarEtapa = (stepNumber) => {
        const currentStep = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            let errorMsg = field.parentElement.querySelector('.error-message');
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    field.parentElement.appendChild(errorMsg);
                }
                errorMsg.textContent = 'Este campo é obrigatório';
            } else {
                field.classList.remove('invalid');
                if (errorMsg) errorMsg.remove();
            }
        });
        if (stepNumber === 4) {
            const radioSim = document.getElementById('contabilidadeSim');
            const radioNao = document.getElementById('contabilidadeNao');
            const radioGroup = radioSim.closest('.radio-group');
            let errorMsgRadio = radioGroup.parentElement.querySelector('.error-message-radio');
            if (!radioSim.checked && !radioNao.checked) {
                isValid = false;
                if (!errorMsgRadio) {
                    errorMsgRadio = document.createElement('div');
                    errorMsgRadio.className = 'error-message error-message-radio';
                    radioGroup.parentElement.appendChild(errorMsgRadio);
                }
                errorMsgRadio.textContent = 'Selecione uma opção';
                radioGroup.classList.add('invalid-radio');
            } else {
                if (errorMsgRadio) errorMsgRadio.remove();
                radioGroup.classList.remove('invalid-radio');
            }
            const despesasMensais = document.getElementById('despesasMensais');
            let errorMsgDespesas = despesasMensais.parentElement.querySelector('.error-message');
            if (despesasMensais) {
                const valor = parseFloat(despesasMensais.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
                if (valor <= 0 && despesasMensais.value !== 'R$ 0,00') { // Permite R$ 0,00 mas não negativo ou zero digitado
                    isValid = false;
                    despesasMensais.classList.add('invalid');
                    if (!errorMsgDespesas) {
                        errorMsgDespesas = document.createElement('div');
                        errorMsgDespesas.className = 'error-message';
                        despesasMensais.parentElement.appendChild(errorMsgDespesas);
                    }
                    errorMsgDespesas.textContent = 'As despesas mensais devem ser R$ 0,00 ou maior';
                } else {
                    if(errorMsgDespesas && errorMsgDespesas.textContent === 'As despesas mensais devem ser R$ 0,00 ou maior') errorMsgDespesas.remove();
                }
            }
        }
        if (stepNumber === 3) {
            const faturamentoMensal = document.getElementById('faturamentoMensal');
            let errorMsgFaturamento = faturamentoMensal.parentElement.querySelector('.error-message');
            if (faturamentoMensal) {
                const valor = parseFloat(faturamentoMensal.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
                if (valor <= 0) {
                    isValid = false;
                    faturamentoMensal.classList.add('invalid');
                    if (!errorMsgFaturamento) {
                        errorMsgFaturamento = document.createElement('div');
                        errorMsgFaturamento.className = 'error-message';
                        faturamentoMensal.parentElement.appendChild(errorMsgFaturamento);
                    }
                    errorMsgFaturamento.textContent = 'O faturamento mensal deve ser maior que zero';
                } else {
                     if(errorMsgFaturamento && errorMsgFaturamento.textContent === 'O faturamento mensal deve ser maior que zero') errorMsgFaturamento.remove();
                }
            }
        }
        if (stepNumber === 5) {
            const whatsappField = document.getElementById('whatsapp');
            const emailField = document.getElementById('email');
            let errorMsgWhatsapp = whatsappField.parentElement.querySelector('.error-message');
            let errorMsgEmail = emailField.parentElement.querySelector('.error-message');
            if (whatsappField && (!whatsappField.value.trim() || whatsappField.value.trim().length < 10)) {
                isValid = false;
                whatsappField.classList.add('invalid');
                if (!errorMsgWhatsapp) {
                    errorMsgWhatsapp = document.createElement('div');
                    errorMsgWhatsapp.className = 'error-message';
                    whatsappField.parentElement.appendChild(errorMsgWhatsapp);
                }
                errorMsgWhatsapp.textContent = whatsappField.value.trim() ? 'Formato de WhatsApp inválido' : 'WhatsApp é obrigatório';
            } else {
                if(errorMsgWhatsapp) errorMsgWhatsapp.remove();
            }
            if (emailField) {
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.classList.add('invalid');
                    if (!errorMsgEmail) {
                        errorMsgEmail = document.createElement('div');
                        errorMsgEmail.className = 'error-message';
                        emailField.parentElement.appendChild(errorMsgEmail);
                    }
                    errorMsgEmail.textContent = emailField.value.trim() ? 'Formato de e-mail inválido' : 'E-mail é obrigatório';
                } else {
                     if(errorMsgEmail) errorMsgEmail.remove();
                }
            }
        }
        return isValid;
    };

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            const nextStep = currentStep + 1;
            if (validarEtapa(currentStep)) {
                mostrarEtapa(nextStep);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').id.replace('step', ''));
            const prevStep = currentStep - 1;
            mostrarEtapa(prevStep);
        });
    });

    calcularBtn.addEventListener('click', function() {
        if (validarEtapa(5)) {
            const loadingBox = document.createElement('div');
            loadingBox.className = 'loading-box';
            loadingBox.innerHTML = '<div class="loader"></div><div>Calculando impostos...</div>';
            document.body.appendChild(loadingBox);
            if (!document.getElementById('loader-animation')) {
                const style = document.createElement('style');
                style.id = 'loader-animation';
                style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .loader { width: 40px; height: 40px; border: 3px solid #F3F4F6; border-radius: 50%; border-top: 3px solid #6366F1; margin: 0 auto 15px auto; animation: spin 1s linear infinite; } .loading-box { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); z-index: 9999; text-align: center; font-size: 16px; color: #333; }`;
                document.head.appendChild(style);
            }

            const dados = {
                nome: document.getElementById('nome').value,
                whatsapp: document.getElementById('whatsapp').value,
                email: document.getElementById('email').value,
                tipoNegocio: document.getElementById('tipoNegocio').value,
                faturamentoMensal: parseFloat(document.getElementById('faturamentoMensal').value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')), 
                faturamentoAnual: parseFloat(document.getElementById('faturamentoAnual').value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')), 
                despesasMensais: parseFloat(document.getElementById('despesasMensais').value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')), 
                possuiContabilidade: document.getElementById('contabilidadeSim').checked
            };

            setTimeout(() => {
                try {
                    const resultados = calcularImpostos(dados);
                    try {
                        document.getElementById('resultadoNome').textContent = dados.nome;
                        document.getElementById('resultadoTipoNegocio').textContent = document.getElementById('tipoNegocio').options[document.getElementById('tipoNegocio').selectedIndex].text;
                        document.getElementById('resultadoFaturamento').textContent = `R$ ${dados.faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        document.getElementById('simplesNacionalValor').textContent = resultados.simplesNacional === Infinity ? 'Não aplicável' : `R$ ${resultados.simplesNacional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        document.getElementById('lucroPresumidoValor').textContent = resultados.lucroPresumido === Infinity ? 'Não aplicável' : `R$ ${resultados.lucroPresumido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        document.getElementById('lucroRealValor').textContent = resultados.lucroReal === Infinity ? 'Não aplicável' : `R$ ${resultados.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        resultadosModal.style.display = "block";
                        closeModal.onclick = function() {
                            resultadosModal.style.display = "none";
                        }
                        fecharBtn.onclick = function() {
                            resultadosModal.style.display = "none";
                        }
                        if (whatsappBtn) {
                            whatsappBtn.onclick = function() {
                                const nomeUsuario = dados.nome;
                                const tipoNegocioSelect = document.getElementById('tipoNegocio');
                                const tipoNegocioTexto = tipoNegocioSelect.options[tipoNegocioSelect.selectedIndex].text;
                                const numeroWhatsapp = "5544999275821";
                                let mensagem = `Olá! Sou ${nomeUsuario} e meu tipo de negócio é ${tipoNegocioTexto}. Gostaria de receber meu relatório do simulador.`;
                                mensagem = encodeURIComponent(mensagem);
                                const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;
                                window.open(urlWhatsapp, '_blank');
                            };
                        }
                    } catch (e_dom) {
                        if (loadingBox) {
                            loadingBox.innerHTML = `<div>Erro ao mostrar resultados: ${e_dom.message}</div>`;
                        }
                        console.error("Erro DOM:", e_dom);
                        // Não retorne aqui, permita que o loadingBox seja removido
                    }
                } catch (e_calc) {
                    if (loadingBox) {
                        loadingBox.innerHTML = `<div>Erro no cálculo: ${e_calc.message}</div>`;
                    }
                    console.error("Erro Cálculo:", e_calc);
                     // Não retorne aqui, permita que o loadingBox seja removido
                }
                // Garante que o loadingBox seja removido mesmo se houver erro
                if (loadingBox && loadingBox.parentNode) {
                    loadingBox.parentNode.removeChild(loadingBox);
                }
            }, 2000);
        }
    });

    mostrarEtapa(1);
});

function calcularImpostos(dados) {
    let simplesNacional = 0;
    let lucroPresumido = 0;
    let lucroReal = 0;
    const faturamentoAnual = dados.faturamentoMensal * 12; // Usar faturamento mensal para cálculo anual, não o RBT12 diretamente para alíquotas.
                                                        // O RBT12 (dados.faturamentoAnual) é para enquadramento da faixa do Simples.

    // Simples Nacional - Alíquotas baseadas no faturamentoAnual (RBT12)
    if (dados.faturamentoAnual <= 180000) {
        simplesNacional = dados.faturamentoMensal * 0.06;
    } else if (dados.faturamentoAnual <= 360000) {
        simplesNacional = dados.faturamentoMensal * 0.112;
    } else if (dados.faturamentoAnual <= 720000) {
        simplesNacional = dados.faturamentoMensal * 0.135;
    } else if (dados.faturamentoAnual <= 1800000) {
        simplesNacional = dados.faturamentoMensal * 0.169; 
    } else if (dados.faturamentoAnual <= 3600000) {
        simplesNacional = dados.faturamentoMensal * 0.21;
    } else if (dados.faturamentoAnual <= 4800000) {
        simplesNacional = dados.faturamentoMensal * 0.33; // Fator R pode influenciar aqui, simplificado
    } else {
        simplesNacional = Infinity; // Excedeu o limite do Simples Nacional
    }

    // Lucro Presumido
    let presuncaoLucro = 0.08; // Default para afiliado e outros (considerando como comissão/venda)
    if (dados.tipoNegocio === 'infoprodutos' || dados.tipoNegocio === 'coaching' || dados.tipoNegocio === 'servicos') {
        presuncaoLucro = 0.32; // Serviços em geral, cursos, coaching
    }
    // Para 'afiliado', se for intermediação de negócios, a presunção é 32%. Se for comissão (representação comercial), pode ser 8% ou 16% (para receita bruta até 120k/ano) ou 32% (acima de 120k/ano).
    // Simplificando para 8% para afiliados, mas é um ponto de atenção.

    const lucroPresumidoBase = dados.faturamentoMensal * presuncaoLucro;
    const irpjPresumido = lucroPresumidoBase * 0.15;
    const csllPresumido = lucroPresumidoBase * 0.09;
    const pisPresumido = dados.faturamentoMensal * 0.0065;
    const cofinsPresumido = dados.faturamentoMensal * 0.03;
    let issPresumido = dados.faturamentoMensal * 0.05; // Alíquota máxima de ISS, pode variar de 2% a 5%
    // Se tipoNegocio for 'infoprodutos' (venda de curso é serviço) ou 'coaching' ou 'servicos', incide ISS.
    // Se for 'afiliado' (comissão), geralmente incide ISS.
    // Se for 'outro' e for venda de mercadoria, não incide ISS, mas ICMS (não coberto aqui).
    // Mantendo ISS para todos os casos por simplificação, já que o foco são serviços digitais.
    lucroPresumido = irpjPresumido + csllPresumido + pisPresumido + cofinsPresumido + issPresumido;

    // Lucro Real
    const lucroRealBase = dados.faturamentoMensal - dados.despesasMensais;
    if (lucroRealBase > 0) {
        const irpjReal = lucroRealBase * 0.15;
        const csllReal = lucroRealBase * 0.09;
        // Adicional de IRPJ: 10% sobre o lucro que exceder R$ 20.000,00 no mês
        let adicionalIrpjReal = 0;
        if (lucroRealBase > 20000) {
            adicionalIrpjReal = (lucroRealBase - 20000) * 0.10;
        }
        const pisReal = dados.faturamentoMensal * 0.0165; // Não cumulativo, sobre faturamento
        const cofinsReal = dados.faturamentoMensal * 0.076; // Não cumulativo, sobre faturamento
        let issReal = dados.faturamentoMensal * 0.05; // Similar ao Lucro Presumido para ISS
        lucroReal = irpjReal + csllReal + adicionalIrpjReal + pisReal + cofinsReal + issReal;
    } else {
        // Mesmo com prejuízo, PIS e COFINS (não cumulativos) incidem sobre o faturamento.
        // ISS também incide sobre o faturamento.
        lucroReal = (dados.faturamentoMensal * 0.0165) + (dados.faturamentoMensal * 0.076) + (dados.faturamentoMensal * 0.05);
    }
    
    // Ajuste para IRPF se não tiver contabilidade (muito simplificado)
    // No Lucro Presumido, se não houver contabilidade regular para provar que o lucro distribuído é isento,
    // a isenção é limitada ao valor da base de cálculo do IRPJ presumido, deduzido do IRPJ.
    // No Lucro Real, a distribuição de lucros é geralmente isenta se apurada em balanço.
    // Esta simulação foca nos impostos da PJ.

    return {
        simplesNacional: simplesNacional,
        lucroPresumido: lucroPresumido,
        lucroReal: lucroReal
    };
}

