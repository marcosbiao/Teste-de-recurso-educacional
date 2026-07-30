# Auditoria de critérios verificáveis

Data: 2026-07-21. Foram percorridos os 29 desafios de `CHALLENGES`. Todos possuem critérios com `id` estável, permitindo que `criteriaAssessment` use o identificador do catálogo em vez de texto livre.

| challengeId | competência | critérios | IDs | ambíguos/agregados | evidências disponíveis | recomendação |
| --- | --- | ---: | --- | ---: | --- | --- |
| cci01-custo-viagem | representacao | 12 | sim | 0 | critérios, erros comuns e prováveis | manter saída e cálculos separados |
| cci01-materiais-oficina | representacao | 12 | sim | 0 | critérios, erros comuns e prováveis | manter quantidades e custos separados |
| desafio1_condicionais_basico | condicionais | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio2_condicionais_paridade | condicionais | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio3_emprestimo_salario | condicionais | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio4_divisivel_3_ou_5 | condicionais | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio5_ordem_crescente_tres_numeros | condicionais | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio6_triangulo_classificacao | condicionais | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio_lacos_contar_1_ten | lacos | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio_lacos_somar_n | lacos | 5 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| lacos_contar_pares_ate_n | lacos | 5 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| lacos_media_cinco_numeros | lacos | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| lacos_maior_dez_numeros | lacos | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| lacos_validar_senha_tres_tentativas | lacos | 5 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio_vetores_maior_valor | vetores | 5 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio_vetores_contar_pares | vetores | 5 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| vetores_media_seis_valores | vetores | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| vetores_maiores_que_dez | vetores | 6 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| vetores_menor_e_posicao | vetores | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| vetores_positivos_negativos_zeros | vetores | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| desafio_matrizes_soma_2x2 | matrizes | 5 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| desafio_matrizes_diagonal_principal | matrizes | 4 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| matrizes_soma_primeira_linha | matrizes | 5 | sim | 2 | critérios, erros comuns e prováveis | dividir critérios agregados futuros |
| matrizes_contar_pares | matrizes | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| matrizes_maior_valor | matrizes | 5 | sim | 3 | critérios, erros comuns e prováveis | dividir critérios agregados futuros |
| matrizes_soma_diagonal_principal | matrizes | 5 | sim | 1 | critérios, erros comuns e prováveis | dividir critério agregado futuro |
| funcoes_maior_tres_numeros | funcoes | 7 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| funcoes_media_dois_numeros | funcoes | 7 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |
| funcoes_distancia_entre_pontos | funcoes | 7 | sim | 0 | critérios, erros comuns e prováveis | nenhuma |

Critérios “agregados” são descrições longas que podem juntar mais de uma operação; não foram alterados nesta tarefa. O classificador usa `not_verifiable` quando não há um padrão local seguro, portanto esses pontos não bloqueiam análise nem viram prioridade sem evidência.
