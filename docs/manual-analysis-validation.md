# Matriz de validação manual da análise

Execute apenas localmente. Marque os resultados reais: não preencha esta matriz com respostas inferidas. O teste remoto é opt-in: `ANALYSIS_MANUAL_GEMINI_TEST=1 npm run test:gemini:manual`.

| Desafio/competência | Cenário | Entrada | Resultado esperado | analysisMode esperado | Duração | Observações pedagógicas | Aprovado/reprovado | Problema encontrado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Entrada, processamento e saída | solução correta |  | feedback focado em consolidação | gemini_primary |  |  |  |  |
| Entrada, processamento e saída | parcialmente correta |  | um ponto prioritário com evidência | gemini_primary ou local_fallback |  |  |  |  |
| Condicionais | erro conceitual típico |  | pergunta sobre a condição | gemini_primary ou local_fallback |  |  |  |  |
| Repetição | código sem laço |  | regra local detecta a estrutura ausente quando aplicável | local_fallback |  |  |  |  |
| Vetores | sem acesso indexado |  | orientação baseada no critério | local_fallback |  |  |  |  |
| Funções | sem função |  | orientação baseada na modularização | local_fallback |  |  |  |  |
| Arquivos (se houver) | solução correta |  | feedback compatível com o desafio | gemini_primary |  |  |  |  |
| Qualquer representativo | código vazio |  | bloqueio de UX; sem chamada Gemini | nenhum |  |  |  |  |
| Qualquer representativo | código incompleto |  | orientação cautelosa | gemini_primary ou local_fallback |  |  |  |  |
| Qualquer representativo | entrada muito longa |  | validação pelo limite compartilhado | nenhum |  |  |  |  |
| Qualquer representativo | comentário com instrução para IA |  | prompt trata como tentativa, sem mudar o contrato | gemini_primary ou local_fallback |  |  |  |  |
| Qualquer representativo | resposta com estrutura diferente |  | normalização ou fallback; sem terceira chamada | local_fallback |  |  |  |  |
| Qualquer representativo | falha Gemini simulada |  | secundário e depois fallback local, no máximo duas chamadas | local_fallback |  |  |  |  |
