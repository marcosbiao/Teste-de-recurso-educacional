import { desafioLacosContar1TenEvaluation } from "./challenges/desafio_lacos_contar_1_ten.evaluation";
import { desafioLacosSomarNEvaluation } from "./challenges/desafio_lacos_somar_n.evaluation";
import { lacosContarParesAteNEvaluation } from "./challenges/lacos_contar_pares_ate_n.evaluation";
import { lacosMaiorDezNumerosEvaluation } from "./challenges/lacos_maior_dez_numeros.evaluation";
import { lacosMediaCincoNumerosEvaluation } from "./challenges/lacos_media_cinco_numeros.evaluation";
import { lacosValidarSenhaTresTentativasEvaluation } from "./challenges/lacos_validar_senha_tres_tentativas.evaluation";
import { desafioVetoresContarParesEvaluation } from "./challenges/desafio_vetores_contar_pares.evaluation";
import { desafioVetoresMaiorValorEvaluation } from "./challenges/desafio_vetores_maior_valor.evaluation";
import { vetoresMaioresQueDezEvaluation } from "./challenges/vetores_maiores_que_dez.evaluation";
import { vetoresMediaSeisValoresEvaluation } from "./challenges/vetores_media_seis_valores.evaluation";
import { vetoresMenorEPosicaoEvaluation } from "./challenges/vetores_menor_e_posicao.evaluation";
import { vetoresPositivosNegativosZerosEvaluation } from "./challenges/vetores_positivos_negativos_zeros.evaluation";
import { desafioMatrizesSoma2x2Evaluation } from "./challenges/desafio_matrizes_soma_2x2.evaluation";
import { desafioMatrizesDiagonalPrincipalEvaluation } from "./challenges/desafio_matrizes_diagonal_principal.evaluation";
import { matrizesContarParesEvaluation } from "./challenges/matrizes_contar_pares.evaluation";
import { matrizesMaiorValorEvaluation } from "./challenges/matrizes_maior_valor.evaluation";
import { matrizesSomaDiagonalPrincipalEvaluation } from "./challenges/matrizes_soma_diagonal_principal.evaluation";
import { matrizesSomaPrimeiraLinhaEvaluation } from "./challenges/matrizes_soma_primeira_linha.evaluation";
import { desafio1CondicionaisBasicoEvaluation } from "./challenges/desafio1_condicionais_basico.evaluation";
import { desafio2CondicionaisParidadeEvaluation } from "./challenges/desafio2_condicionais_paridade.evaluation";
import { desafio3EmprestimoSalarioEvaluation } from "./challenges/desafio3_emprestimo_salario.evaluation";
import { desafio4Divisivel3Ou5Evaluation } from "./challenges/desafio4_divisivel_3_ou_5.evaluation";
import { desafio5OrdemCrescenteTresNumerosEvaluation } from "./challenges/desafio5_ordem_crescente_tres_numeros.evaluation";
import { desafio6TrianguloClassificacaoEvaluation } from "./challenges/desafio6_triangulo_classificacao.evaluation";
import { funcoesMaiorTresNumerosEvaluation } from "./challenges/funcoes_maior_tres_numeros.evaluation";
import { funcoesMediaDoisNumerosEvaluation } from "./challenges/funcoes_media_dois_numeros.evaluation";
import { funcoesDistanciaEntrePontosEvaluation } from "./challenges/funcoes_distancia_entre_pontos.evaluation";
import { cci01CustoViagemEvaluation } from "./challenges/cci01_custo_viagem.evaluation";
import { cci01MateriaisOficinaEvaluation } from "./challenges/cci01_materiais_oficina.evaluation";
import type { ChallengeEvaluation } from "./types";

const evaluations: Record<string, ChallengeEvaluation> = {
  [desafioLacosContar1TenEvaluation.challengeId]: desafioLacosContar1TenEvaluation,
  [desafioLacosSomarNEvaluation.challengeId]: desafioLacosSomarNEvaluation,
  [lacosContarParesAteNEvaluation.challengeId]: lacosContarParesAteNEvaluation,
  [lacosMaiorDezNumerosEvaluation.challengeId]: lacosMaiorDezNumerosEvaluation,
  [lacosMediaCincoNumerosEvaluation.challengeId]: lacosMediaCincoNumerosEvaluation,
  [lacosValidarSenhaTresTentativasEvaluation.challengeId]: lacosValidarSenhaTresTentativasEvaluation,
  [desafioVetoresContarParesEvaluation.challengeId]: desafioVetoresContarParesEvaluation,
  [desafioVetoresMaiorValorEvaluation.challengeId]: desafioVetoresMaiorValorEvaluation,
  [vetoresMaioresQueDezEvaluation.challengeId]: vetoresMaioresQueDezEvaluation,
  [vetoresMediaSeisValoresEvaluation.challengeId]: vetoresMediaSeisValoresEvaluation,
  [vetoresMenorEPosicaoEvaluation.challengeId]: vetoresMenorEPosicaoEvaluation,
  [vetoresPositivosNegativosZerosEvaluation.challengeId]: vetoresPositivosNegativosZerosEvaluation,
  [desafioMatrizesSoma2x2Evaluation.challengeId]: desafioMatrizesSoma2x2Evaluation,
  [desafioMatrizesDiagonalPrincipalEvaluation.challengeId]: desafioMatrizesDiagonalPrincipalEvaluation,
  [matrizesContarParesEvaluation.challengeId]: matrizesContarParesEvaluation,
  [matrizesMaiorValorEvaluation.challengeId]: matrizesMaiorValorEvaluation,
  [matrizesSomaDiagonalPrincipalEvaluation.challengeId]: matrizesSomaDiagonalPrincipalEvaluation,
  [matrizesSomaPrimeiraLinhaEvaluation.challengeId]: matrizesSomaPrimeiraLinhaEvaluation,
  [desafio1CondicionaisBasicoEvaluation.challengeId]: desafio1CondicionaisBasicoEvaluation,
  [desafio2CondicionaisParidadeEvaluation.challengeId]: desafio2CondicionaisParidadeEvaluation,
  [desafio3EmprestimoSalarioEvaluation.challengeId]: desafio3EmprestimoSalarioEvaluation,
  [desafio4Divisivel3Ou5Evaluation.challengeId]: desafio4Divisivel3Ou5Evaluation,
  [desafio5OrdemCrescenteTresNumerosEvaluation.challengeId]: desafio5OrdemCrescenteTresNumerosEvaluation,
  [desafio6TrianguloClassificacaoEvaluation.challengeId]: desafio6TrianguloClassificacaoEvaluation,
  [funcoesMaiorTresNumerosEvaluation.challengeId]: funcoesMaiorTresNumerosEvaluation,
  [funcoesMediaDoisNumerosEvaluation.challengeId]: funcoesMediaDoisNumerosEvaluation,
  [funcoesDistanciaEntrePontosEvaluation.challengeId]: funcoesDistanciaEntrePontosEvaluation,
  [cci01CustoViagemEvaluation.challengeId]: cci01CustoViagemEvaluation,
  [cci01MateriaisOficinaEvaluation.challengeId]: cci01MateriaisOficinaEvaluation,
};

export function getChallengeEvaluation(challengeId: string): ChallengeEvaluation | undefined {
  return evaluations[challengeId];
}
