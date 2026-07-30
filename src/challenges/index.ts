import type { Challenge } from '../types.ts';
import { desafioCci01CustoViagem } from './c_cci01_custo_viagem.ts';
import { desafioCci01MateriaisOficina } from './c_cci01_materiais_oficina.ts';
import { desafio1 } from './c_condicionais_basico.ts';
import { desafio2 } from './c_condicionais_paridade.ts';
import { desafio3 } from './c_emprestimo_salario.ts';
import { desafio4 } from './c_divisivel_3_ou_5.ts';
import { desafio5 } from './c_ordem_crescente.ts';
import { desafio6 } from './c_triangulo_classificacao.ts';

import { desafioLacos1 } from './c_lacos_contar_1_10.ts';
import { desafioLacos2 } from './c_lacos_somar_n.ts';
import { desafioLacosContarParesAteN } from './c_lacos_contar_pares_ate_n.ts';
import { desafioLacosMediaCincoNumeros } from './c_lacos_media_cinco_numeros.ts';
import { desafioLacosMaiorDezNumeros } from './c_lacos_maior_dez_numeros.ts';
import { desafioLacosValidarSenhaTresTentativas } from './c_lacos_validar_senha_tres_tentativas.ts';

import { desafioVetores1 } from './c_vetores_maior_valor.ts';
import { desafioVetores2 } from './c_vetores_contar_pares.ts';
import { desafioVetoresMediaSeisValores } from './c_vetores_media_seis_valores.ts';
import { desafioVetoresMaioresQueDez } from './c_vetores_maiores_que_dez.ts';
import { desafioVetoresMenorEPosicao } from './c_vetores_menor_e_posicao.ts';
import { desafioVetoresPositivosNegativosZeros } from './c_vetores_positivos_negativos_zeros.ts';

import { desafioMatrizes1 } from './c_matrizes_soma_2x2.ts';
import { desafioMatrizes2 } from './c_matrizes_diagonal_principal.ts';
import { desafioMatrizesSomaPrimeiraLinha } from './c_matrizes_soma_primeira_linha.ts';
import { desafioMatrizesContarPares } from './c_matrizes_contar_pares.ts';
import { desafioMatrizesMaiorValor } from './c_matrizes_maior_valor.ts';
import { desafioMatrizesSomaDiagonalPrincipal } from './c_matrizes_soma_diagonal_principal.ts';

import { desafioFuncoesMaiorTresNumeros } from './c_funcoes_maior_tres_numeros.ts';
import { desafioFuncoesMediaDoisNumeros } from './c_funcoes_media_dois_numeros.ts';
import { desafioFuncoesDistanciaEntrePontos } from './c_funcoes_distancia_entre_pontos.ts';

/**
 * Índice central de desafios do aplicativo.
 * Facilita a manutenção e expansão da base pedagógica.
 */
export const CHALLENGES: Challenge[] = [
  { ...desafioCci01CustoViagem, categoryId: 'representacao' },
  { ...desafioCci01MateriaisOficina, categoryId: 'representacao' },

  { ...desafio1, categoryId: 'condicionais' },
  { ...desafio2, categoryId: 'condicionais' },
  { ...desafio3, categoryId: 'condicionais' },
  { ...desafio4, categoryId: 'condicionais' },
  { ...desafio5, categoryId: 'condicionais' },
  { ...desafio6, categoryId: 'condicionais' },
  
  { ...desafioLacos1, categoryId: 'lacos' },
  { ...desafioLacos2, categoryId: 'lacos' },
  { ...desafioLacosContarParesAteN, categoryId: 'lacos' },
  { ...desafioLacosMediaCincoNumeros, categoryId: 'lacos' },
  { ...desafioLacosMaiorDezNumeros, categoryId: 'lacos' },
  { ...desafioLacosValidarSenhaTresTentativas, categoryId: 'lacos' },
  
  { ...desafioVetores1, categoryId: 'vetores' },
  { ...desafioVetores2, categoryId: 'vetores' },
  { ...desafioVetoresMediaSeisValores, categoryId: 'vetores' },
  { ...desafioVetoresMaioresQueDez, categoryId: 'vetores' },
  { ...desafioVetoresMenorEPosicao, categoryId: 'vetores' },
  { ...desafioVetoresPositivosNegativosZeros, categoryId: 'vetores' },
  
  { ...desafioMatrizes1, categoryId: 'matrizes' },
  { ...desafioMatrizes2, categoryId: 'matrizes' },
  { ...desafioMatrizesSomaPrimeiraLinha, categoryId: 'matrizes' },
  { ...desafioMatrizesContarPares, categoryId: 'matrizes' },
  { ...desafioMatrizesMaiorValor, categoryId: 'matrizes' },
  { ...desafioMatrizesSomaDiagonalPrincipal, categoryId: 'matrizes' },

  { ...desafioFuncoesMaiorTresNumeros, categoryId: 'funcoes' },
  { ...desafioFuncoesMediaDoisNumeros, categoryId: 'funcoes' },
  { ...desafioFuncoesDistanciaEntrePontos, categoryId: 'funcoes' }
];

/**
 * Recupera um desafio pelo ID.
 */
export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find(c => c.id === id);
}

/**
 * Recupera o próximo desafio sugerido.
 */
export function getNextChallenge(currentId: string): Challenge | undefined {
  const currentIndex = CHALLENGES.findIndex(c => c.id === currentId);
  if (currentIndex >= 0 && currentIndex < CHALLENGES.length - 1) {
    return CHALLENGES[currentIndex + 1];
  }
  return undefined;
}
