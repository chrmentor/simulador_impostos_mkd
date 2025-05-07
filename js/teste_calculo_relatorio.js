/**
 * Script para testar o cálculo correto do Lucro Presumido
 * Este arquivo verifica se a alíquota efetiva está correta para um faturamento de R$ 50.000,00
 * Versão apenas para console - sem exibição visual na página
 */

// Dados de teste
const dadosTeste = {
    nome: "Usuário Teste",
    tipoNegocio: "infoprodutos",
    faturamentoMensal: 50000,
    faturamentoAnual: 600000,
    despesasMensais: 5000,
    possuiContabilidade: true
};

// Função para testar o cálculo do Lucro Presumido
function testarCalculoLucroPresumido() {
    console.log("=== TESTE DO CÁLCULO DO LUCRO PRESUMIDO ===");
    console.log(`Faturamento mensal: R$ ${dadosTeste.faturamentoMensal.toFixed(2)}`);
    
    // Calcular impostos usando a função corrigida
    const resultados = calcularImpostos(dadosTeste);
    const lucroPresumido = resultados.lucroPresumido;
    
    console.log("-------------------------------------------");
    console.log(`Alíquota efetiva calculada: ${lucroPresumido.aliquota.toFixed(2)}%`);
    console.log(`Valor mensal a pagar: R$ ${lucroPresumido.valorMensal.toFixed(2)}`);
    
    // Verificar se a alíquota está correta (14,33%)
    if (Math.abs(lucroPresumido.aliquota - 14.33) < 0.01) {
        console.log("✅ TESTE APROVADO: A alíquota efetiva está correta (14,33%)");
    } else {
        console.log(`❌ TESTE FALHOU: A alíquota efetiva deveria ser 14,33%, mas é ${lucroPresumido.aliquota.toFixed(2)}%`);
    }
    
    // Verificar componentes individuais do cálculo
    if (lucroPresumido.detalhes) {
        console.log("\n=== DETALHES DO CÁLCULO ===");
        console.log(`Base de cálculo (32%): R$ ${lucroPresumido.detalhes.baseCalculo.toFixed(2)}`);
        console.log(`IRPJ: R$ ${lucroPresumido.detalhes.ir.toFixed(2)}`);
        console.log(`CSLL: R$ ${lucroPresumido.detalhes.csll.toFixed(2)}`);
        console.log(`PIS: R$ ${lucroPresumido.detalhes.pis.toFixed(2)}`);
        console.log(`COFINS: R$ ${lucroPresumido.detalhes.cofins.toFixed(2)}`);
        console.log(`ISS: R$ ${lucroPresumido.detalhes.iss.toFixed(2)}`);
    }
    
    return lucroPresumido;
}

// Executar o teste quando a página carregar, mas apenas no console
document.addEventListener('DOMContentLoaded', function() {
    console.log("Executando teste do cálculo do Lucro Presumido...");
    const resultado = testarCalculoLucroPresumido();
    
    // Exibir resultado apenas no console
    console.log("\n=== RESULTADO DO TESTE ===");
    console.log(`Alíquota efetiva: ${resultado.aliquota.toFixed(2)}%`);
    console.log(`Valor mensal: R$ ${resultado.valorMensal.toFixed(2)}`);
    
    // O código que adicionava o elemento visual de teste foi removido
});
