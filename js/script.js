document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const progressBar = document.getElementById('progress');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadosModal = document.getElementById('resultadosModal');
    const closeModal = document.getElementById('closeModal'); // Botão 'X' no cabeçalho do modal
    const fecharBtn = document.getElementById('fecharBtn'); // Botão 'Fechar' no rodapé do modal
    // const whatsappBtn = document.getElementById('whatsappBtn'); // Removido pois o novo modal usa um link direto

    // Adiciona os event listeners para fechar o modal AQUI, fora do calcularBtn
    if (resultadosModal) {
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                resultadosModal.style.display = "none";
            });
        }
        if (fecharBtn) {
            fecharBtn.addEventListener('click', function() {
                resultadosModal.style.display = "none";
            });
        }
        // Opcional: Fechar o modal se clicar fora dele
        window.addEventListener('click', function(event) {
            if (event.target == resultadosModal) {
                resultadosModal.style.display = "none";
            }
        });
    }

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
        if (progressBar) progressBar.style.width = `${percent}%`;
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
        if (!currentStep) return false; 
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
            if (radioSim && radioNao) {
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
            }
            const despesasMensais = document.getElementById('despesasMensais');
            if (despesasMensais) {
                let errorMsgDespesas = despesasMensais.parentElement.querySelector('.error-message');
                const valorText = despesasMensais.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
                const valor = parseFloat(valorText);
                if (isNaN(valor) || (valor < 0 && despesasMensais.value !== 'R$ 0,00')) { 
                    isValid = false;
                    despesasMensais.classList.add('invalid');
                    if (!errorMsgDespesas) {
                        errorMsgDespesas = document.createElement('div');
                        errorMsgDespesas.className = 'error-message';
                        despesasMensais.parentElement.appendChild(errorMsgDespesas);
                    }
                    errorMsgDespesas.textContent = 'As despesas mensais devem ser R$ 0,00 ou maior.';
                } else {
                    if(errorMsgDespesas && errorMsgDespesas.textContent === 'As despesas mensais devem ser R$ 0,00 ou maior.') errorMsgDespesas.remove();
                }
            }
        }
        if (stepNumber === 3) {
            const faturamentoMensal = document.getElementById('faturamentoMensal');
            if (faturamentoMensal) {
                let errorMsgFaturamento = faturamentoMensal.parentElement.querySelector('.error-message');
                const valorText = faturamentoMensal.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
                const valor = parseFloat(valorText);
                if (isNaN(valor) || valor <= 0) {
                    isValid = false;
                    faturamentoMensal.classList.add('invalid');
                    if (!errorMsgFaturamento) {
                        errorMsgFaturamento = document.createElement('div');
                        errorMsgFaturamento.className = 'error-message';
                        faturamentoMensal.parentElement.appendChild(errorMsgFaturamento);
                    }
                    errorMsgFaturamento.textContent = 'O faturamento mensal deve ser maior que zero.';
                } else {
                     if(errorMsgFaturamento && errorMsgFaturamento.textContent === 'O faturamento mensal deve ser maior que zero.') errorMsgFaturamento.remove();
                }
            }
        }
        if (stepNumber === 5) {
            const whatsappField = document.getElementById('whatsapp');
            const emailField = document.getElementById('email');
            if (whatsappField) {
                let errorMsgWhatsapp = whatsappField.parentElement.querySelector('.error-message');
                if (!whatsappField.value.trim() || whatsappField.value.trim().length < 10) {
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
            }
            if (emailField) {
                let errorMsgEmail = emailField.parentElement.querySelector('.error-message');
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
            const currentStepNum = parseInt(this.closest('.form-step').id.replace('step', ''));
            if (validarEtapa(currentStepNum)) {
                mostrarEtapa(currentStepNum + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStepNum = parseInt(this.closest('.form-step').id.replace('step', ''));
            mostrarEtapa(currentStepNum - 1);
        });
    });

    if (calcularBtn) {
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
                    possuiContabilidade: document.getElementById('contabilidadeSim') ? document.getElementById('contabilidadeSim').checked : false
                };

                setTimeout(() => {
                    let resultados;
                    try {
                        resultados = calcularImpostos(dados);

                        if (typeof resultados === 'undefined' || resultados === null) {
                            console.error("O objeto 'resultados' retornou indefinido ou nulo de calcularImpostos.");
                            if(document.getElementById('simplesNacionalValor')) document.getElementById('simplesNacionalValor').textContent = 'Erro no cálculo';
                            if(document.getElementById('lucroPresumidoValor')) document.getElementById('lucroPresumidoValor').textContent = 'Erro no cálculo';
                            if(document.getElementById('lucroRealValor')) document.getElementById('lucroRealValor').textContent = 'Erro no cálculo';
                            if (resultadosModal) resultadosModal.style.display = "block"; 
                            if (loadingBox && loadingBox.parentNode) loadingBox.parentNode.removeChild(loadingBox);
                            return; 
                        }
                        
                        // Preencher dados do usuário no relatório
                        if(document.getElementById('reportUserName')) document.getElementById('reportUserName').textContent = dados.nome;
                        const dataAtual = new Date();
                        if(document.getElementById('reportDate')) document.getElementById('reportDate').textContent = dataAtual.toLocaleDateString('pt-BR');

                        const formatarResultadoDisplay = (valor) => {
                            if (typeof valor === 'number' && !isNaN(valor) && valor !== Infinity) {
                                return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            }
                            return 'Não aplicável';
                        };
                        
                        const formatarAliquotaDisplay = (valor) => {
                            if (typeof valor === 'number' && !isNaN(valor) && valor !== Infinity) {
                                return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
                            }
                            return 'N/A';
                        };

                        if(document.getElementById('simplesNacionalValor')) document.getElementById('simplesNacionalValor').textContent = formatarResultadoDisplay(resultados.simplesNacional.valor);
                        if(document.getElementById('simplesNacionalAliquota')) document.getElementById('simplesNacionalAliquota').textContent = formatarAliquotaDisplay(resultados.simplesNacional.aliquotaEfetiva);
                        
                        if(document.getElementById('lucroPresumidoValor')) document.getElementById('lucroPresumidoValor').textContent = formatarResultadoDisplay(resultados.lucroPresumido.valor);
                        if(document.getElementById('lucroPresumidoAliquota')) document.getElementById('lucroPresumidoAliquota').textContent = formatarAliquotaDisplay(resultados.lucroPresumido.aliquotaEfetiva);

                        if(document.getElementById('lucroRealValor')) document.getElementById('lucroRealValor').textContent = formatarResultadoDisplay(resultados.lucroReal.valor);
                        if(document.getElementById('lucroRealAliquota')) document.getElementById('lucroRealAliquota').textContent = formatarAliquotaDisplay(resultados.lucroReal.aliquotaEfetiva);

                        // Lógica para recomendação e economia potencial
                        const valoresValidos = [
                            { nome: 'Simples Nacional', valor: resultados.simplesNacional.valor, idBadge: 'badgeSimplesNacional', idCard: 'cardSimplesNacional' },
                            { nome: 'Lucro Presumido', valor: resultados.lucroPresumido.valor, idBadge: 'badgeLucroPresumido', idCard: 'cardLucroPresumido' },
                            { nome: 'Lucro Real', valor: resultados.lucroReal.valor, idBadge: 'badgeLucroReal', idCard: 'cardLucroReal' }
                        ].filter(r => typeof r.valor === 'number' && !isNaN(r.valor) && r.valor !== Infinity);

                        // Resetar badges e classes de recomendação
                        document.querySelectorAll('.recommendation-badge').forEach(b => b.style.display = 'none');
                        document.querySelectorAll('.regime-card').forEach(c => c.classList.remove('recommended-card'));

                        if (valoresValidos.length > 0) {
                            valoresValidos.sort((a, b) => a.valor - b.valor);
                            const recomendado = valoresValidos[0];
                            if(document.getElementById(recomendado.idBadge)) document.getElementById(recomendado.idBadge).style.display = 'block';
                            if(document.getElementById(recomendado.idCard)) document.getElementById(recomendado.idCard).classList.add('recommended-card'); // Adicionar classe para possível estilo extra

                            if (valoresValidos.length > 1) {
                                const menosVantajoso = valoresValidos[valoresValidos.length - 1];
                                const economia = menosVantajoso.valor - recomendado.valor;
                                if (economia > 0) {
                                    if(document.getElementById('economiaPotencialValor')) document.getElementById('economiaPotencialValor').textContent = `R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    if(document.getElementById('economyPotentialSection')) document.getElementById('economyPotentialSection').style.display = 'block';
                                } else {
                                    if(document.getElementById('economyPotentialSection')) document.getElementById('economyPotentialSection').style.display = 'none';
                                }
                            } else {
                                if(document.getElementById('economyPotentialSection')) document.getElementById('economyPotentialSection').style.display = 'none';
                            }
                        } else {
                            if(document.getElementById('economyPotentialSection')) document.getElementById('economyPotentialSection').style.display = 'none';
                        }

                        if (resultadosModal) {
                           resultadosModal.style.display = "block";
                        } else {
                           console.error("Elemento resultadosModal não encontrado no DOM.");
                        }
                        
                        // Os listeners de fechar modal foram movidos para o início do script (DOMContentLoaded)

                    } catch (e_dom) {
                        if (loadingBox) {
                            loadingBox.innerHTML = `<div>Erro ao mostrar resultados: ${e_dom.message}</div>`;
                        }
                        console.error("Erro DOM ao tentar exibir resultados:", e_dom);
                    }
                } catch (e_calc) {
                    if (loadingBox) {
                        loadingBox.innerHTML = `<div>Erro no cálculo geral: ${e_calc.message}</div>`;
                    }
                    console.error("Erro na chamada de calcularImpostos ou lógica primária:", e_calc);
                }
                if (loadingBox && loadingBox.parentNode) {
                    loadingBox.parentNode.removeChild(loadingBox);
                }
            }, 2000);
        }
    });
}

    mostrarEtapa(1);
});

