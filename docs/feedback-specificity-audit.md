# Auditoria de especificidade do feedback

Data da auditoria: 2026-07-21. A verificação percorreu todas as definições exportadas em `CHALLENGES` sem incluir solução ou código-modelo no contexto pedagógico.

Todos os desafios possuem enunciado, objetivo, conceitos, critérios, erros comuns, erros prováveis e perguntas orientadoras. Assim, todos podem gerar pergunta específica e ação concreta pelo prompt e pelo fallback parametrizado. Nenhum desafio bloqueia o sistema; se a tentativa não fornecer evidência suficiente, o fallback mantém confiança baixa.

| challengeId | competência | dados disponíveis | dados ausentes | pergunta específica | ação concreta | recomendação |
| --- | --- | --- | --- | --- | --- | --- |
| cci01-custo-viagem | representacao | completo | nenhum | sim | sim | manter critérios de validação de consumo |
| cci01-materiais-oficina | representacao | completo | nenhum | sim | sim | manter critérios de quantidade e custo |
| desafio1_condicionais_basico | condicionais | completo | nenhum | sim | sim | manter casos-limite explícitos |
| desafio2_condicionais_paridade | condicionais | completo | nenhum | sim | sim | manter operadores e caso zero |
| desafio3_emprestimo_salario | condicionais | completo | nenhum | sim | sim | manter variável de decisão identificável |
| desafio4_divisivel_3_ou_5 | condicionais | completo | nenhum | sim | sim | manter operadores de resto nos critérios |
| desafio5_ordem_crescente_tres_numeros | condicionais | completo | nenhum | sim | sim | manter comparações entre valores |
| desafio6_triangulo_classificacao | condicionais | completo | nenhum | sim | sim | manter casos de igualdade e validade |
| desafio_lacos_contar_1_ten | lacos | completo | nenhum | sim | sim | manter limite e atualização do contador |
| desafio_lacos_somar_n | lacos | completo | nenhum | sim | sim | manter acumulador e limite |
| lacos_contar_pares_ate_n | lacos | completo | nenhum | sim | sim | manter teste de paridade e contador |
| lacos_media_cinco_numeros | lacos | completo | nenhum | sim | sim | manter leitura e acumulador |
| lacos_maior_dez_numeros | lacos | completo | nenhum | sim | sim | manter comparação e atualização do maior |
| lacos_validar_senha_tres_tentativas | lacos | completo | nenhum | sim | sim | manter tentativas e condição de parada |
| desafio_vetores_maior_valor | vetores | completo | nenhum | sim | sim | manter índice, comparação e maior valor |
| desafio_vetores_contar_pares | vetores | completo | nenhum | sim | sim | manter valor acessado e contador |
| vetores_media_seis_valores | vetores | completo | nenhum | sim | sim | manter seis leituras e cálculo da média |
| vetores_maiores_que_dez | vetores | completo | nenhum | sim | sim | manter valor versus índice |
| vetores_menor_e_posicao | vetores | completo | nenhum | sim | sim | manter menor valor e posição |
| vetores_positivos_negativos_zeros | vetores | completo | nenhum | sim | sim | manter três contadores e caso zero |
| desafio_matrizes_soma_2x2 | matrizes | completo | nenhum | sim | sim | manter dois índices e soma |
| desafio_matrizes_diagonal_principal | matrizes | completo | nenhum | sim | sim | manter igualdade entre índices |
| matrizes_soma_primeira_linha | matrizes | completo | nenhum | sim | sim | manter limite da coluna e linha zero |
| matrizes_contar_pares | matrizes | completo | nenhum | sim | sim | manter acesso por dois índices |
| matrizes_maior_valor | matrizes | completo | nenhum | sim | sim | manter comparação em toda a matriz |
| matrizes_soma_diagonal_principal | matrizes | completo | nenhum | sim | sim | manter critério `i == j` |
| funcoes_maior_tres_numeros | funcoes | completo | nenhum | sim | sim | manter parâmetros, retorno e chamada |
| funcoes_media_dois_numeros | funcoes | completo | nenhum | sim | sim | manter argumentos e retorno real |
| funcoes_distancia_entre_pontos | funcoes | completo | nenhum | sim | sim | manter parâmetros e expressão de distância |

## Lacunas futuras

O catálogo atual não possui desafios de structs, recursão ou arquivos. O avaliador e o fallback reconhecem essas referências quando aparecerem em metadados e evidência, mas novos desafios dessas competências devem manter ao menos um critério essencial e um erro comum que nomeiem a estrutura, operação ou requisito prioritário.
