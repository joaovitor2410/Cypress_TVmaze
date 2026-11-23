# Automação E2E do TVmaze com Cypress

Projeto individual para a disciplina de QA, com testes de interface do **TVmaze**, um sistema real de consulta e acompanhamento de séries.

- **Sistema-alvo:** [TVmaze](https://www.tvmaze.com/).
- **Repositório da entrega:** [joaovitor2410/Cypress_TVmaze](https://github.com/joaovitor2410/Cypress_TVmaze).
- **Framework:** Cypress 16.3.0, com Mocha nativo (`context`, `beforeEach`, `afterEach` e `it`).
- **Escopo:** login, busca de séries e acompanhamento de séries.
- **Modalidade:** individual; mínimo exigido de **5 testes**, com **12 blocos `it` implementados**.

Não são usados Cucumber, Gherkin, esperas fixas ou respostas simuladas para aprovar os cenários. Os exemplos antigos de outros sistemas não entram na contagem da entrega.

## Cobertura

| Funcionalidade | Testes | Precisa de conta? |
| --- | ---: | --- |
| Login | 6 | Dois cenários precisam de credenciais válidas |
| Busca de séries | 3 | Não |
| Acompanhamento de séries | 3 | Dois cenários precisam de credenciais válidas |
| **Total** | **12** | **8 públicos e 4 autenticados** |

## Regras de negócio levantadas

As regras abaixo foram levantadas observando o comportamento da interface do TVmaze. Representam o comportamento verificado pela automação, sem presumir acesso à documentação interna do sistema.

| Regra | Funcionalidade | Descrição |
| --- | --- | --- |
| RN-L01 | Login | Usuário e senha são obrigatórios. Campos vazios devem impedir a autenticação e apresentar mensagens nos respectivos campos. |
| RN-L02 | Login | Um usuário inexistente não pode autenticar; a interface deve informar `Unknown username/email`. |
| RN-L03 | Login | Credenciais válidas devem autenticar e redirecionar o usuário. O cabeçalho deve disponibilizar o logout e deixar de apresentar o acesso de visitante ao login. |
| RN-L04 | Login | Atualizar a página durante a sessão não deve encerrar a autenticação. |
| RN-B01 | Busca | Pesquisar pelo título de uma série existente deve apresentar um resultado correspondente. |
| RN-B02 | Busca | Selecionar um resultado deve abrir os detalhes da série correta, com título e descrição correspondentes. |
| RN-B03 | Busca | Uma consulta sem correspondências deve apresentar uma mensagem de ausência de resultados e nenhuma série na listagem. |
| RN-A01 | Acompanhamento | Um visitante precisa autenticar para acompanhar uma série. A tentativa deve abrir o formulário de login e manter a série sem acompanhamento. |
| RN-A02 | Acompanhamento | Um usuário autenticado pode acompanhar uma série; o estado `Following` deve permanecer após atualizar a página. |
| RN-A03 | Acompanhamento | Um usuário autenticado pode deixar de acompanhar uma série; o estado `Follow` deve permanecer após atualizar a página. |

## Casos de teste e resultados esperados

Os identificadores abaixo também aparecem nos títulos dos blocos `it`, permitindo relacionar o relatório de execução às regras de negócio.

### Login

Arquivos: [logins_validos.cy.js](cypress/e2e/tvmaze/login/logins_validos.cy.js) e [logins_invalidos.cy.js](cypress/e2e/tvmaze/login/logins_invalidos.cy.js).

| Caso | Regra | Pré-condição e ação | Resultado esperado |
| --- | --- | --- | --- |
| CT-L01 | RN-L03 | Informar usuário e senha válidos da conta de testes e enviar o formulário. | Sair da página de login; existir link de logout no cabeçalho e não existir o link de login de visitante. |
| CT-L02 | RN-L04 | Autenticar e atualizar a página. | Manter os indicadores de sessão autenticada no cabeçalho. |
| CT-L03 | RN-L01 | Enviar o formulário com usuário vazio e senha preenchida. | Exibir `cannot be blank` no campo de usuário; não autenticar. |
| CT-L04 | RN-L01 | Enviar o formulário com usuário preenchido e senha vazia. | Exibir `Password cannot be blank.` no campo de senha; não autenticar. |
| CT-L05 | RN-L01 | Enviar o formulário com ambos os campos vazios. | Exibir mensagens de obrigatoriedade nos dois campos; não autenticar. |
| CT-L06 | RN-L02 | Informar usuário inexistente e uma senha de teste. | Exibir `Unknown username/email` no campo de usuário; não autenticar. |

O logout fica em um submenu oculto. A autenticação é validada pela existência desse link e pela ausência do login de visitante; sua visibilidade não é exigida enquanto o menu estiver fechado.

### Busca de séries

Arquivos: [buscas_validas.cy.js](cypress/e2e/tvmaze/busca/buscas_validas.cy.js) e [buscas_invalidas.cy.js](cypress/e2e/tvmaze/busca/buscas_invalidas.cy.js).

| Caso | Regra | Pré-condição e ação | Resultado esperado |
| --- | --- | --- | --- |
| CT-B01 | RN-B01 | Pesquisar `Breaking Bad` pelo campo de busca. | Abrir `/search` e apresentar o resultado `Breaking Bad`, vinculado à série de ID 169. |
| CT-B02 | RN-B02 | Pesquisar `Breaking Bad` e selecionar o resultado correspondente. | Abrir `/shows/169/breaking-bad`, exibir o título correto, descrição com `Walter White` e o controle de acompanhamento. |
| CT-B03 | RN-B03 | Pesquisar `zzzxqvserieinexistente202622`. | Manter a consulta no campo, exibir `Pardon us, but no shows or people matching your query were found.` e não listar séries. |

### Acompanhamento de séries

Arquivos: [acompanhamento_sem_login.cy.js](cypress/e2e/tvmaze/acompanhamento/acompanhamento_sem_login.cy.js) e [adicionar_remover_series.cy.js](cypress/e2e/tvmaze/acompanhamento/adicionar_remover_series.cy.js).

| Caso | Regra | Pré-condição e ação | Resultado esperado |
| --- | --- | --- | --- |
| CT-A01 | RN-A01 | Sem autenticar, abrir `Breaking Bad` e acionar `Follow`. | Abrir modal com a exigência de login e os campos de autenticação; manter o estado `Follow`. |
| CT-A02 | RN-A02 | Autenticar, preparar a série como não acompanhada e adicioná-la ao acompanhamento. | Exibir `Following` e manter esse estado após atualizar a página. |
| CT-A03 | RN-A03 | Autenticar, preparar a série como acompanhada e remover o acompanhamento. | Exibir `Follow` e manter esse estado após atualizar a página. |

Cada cenário autenticado prepara seu próprio estado. O `afterEach` restaura o acompanhamento original de **Breaking Bad** e verifica a restauração após recarregar. Se o processo for interrompido antes da limpeza, confira o estado da série na conta de testes.

## Instalação local

### Pré-requisitos

- Git.
- Node.js **24 LTS**, com npm.
- Google Chrome instalado.
- Conexão à internet para acessar o TVmaze.
- Uma conta existente do TVmaze para os quatro cenários autenticados.

### Obter o projeto e instalar

```bash
git clone https://github.com/joaovitor2410/Cypress_TVmaze.git
cd Cypress_TVmaze
npm ci
```

O lockfile fixa a versão do Cypress. Se a instalação não baixar o aplicativo do Cypress, execute:

```bash
node scripts/cypress.cjs install
```

### Configurar a conta de testes

Copie `cypress.env.example.json` para `cypress.env.json` na raiz. Se o arquivo local já existir, preserve seus dados e adicione somente as chaves necessárias:

```json
{
  "TVMAZE_USERNAME": "seu_usuario_do_tvmaze",
  "TVMAZE_PASSWORD": "sua_senha_do_tvmaze"
}
```

Substitua os exemplos pelas credenciais de uma conta existente **do TVmaze**. A criação de conta não faz parte dos testes. Também é possível usar as variáveis de ambiente `CYPRESS_TVMAZE_USERNAME` e `CYPRESS_TVMAZE_PASSWORD`.

As credenciais são lidas com `cy.env()` e digitadas com `{ log: false }`. O arquivo `cypress.env.json` e possíveis cópias locais são ignorados pelo Git. Não coloque senhas reais no arquivo de exemplo.

Sem as credenciais, os quatro cenários autenticados falham com uma mensagem de configuração; eles não são ignorados silenciosamente. Para executar sem conta, use a suíte pública.

## Executar os testes

| Comando | Finalidade |
| --- | --- |
| `npm test` | Executar os 12 testes do TVmaze no Chrome. |
| `npm run cy:open` | Abrir o Cypress no Chrome para selecionar e acompanhar um arquivo de teste. |
| `npm run test:tvmaze:publico` | Executar os oito testes que não precisam de conta. |
| `npm run test:tvmaze` | Executar a mesma suíte completa usando a configuração explícita do TVmaze. |
| `npm run cy:open:tvmaze` | Abrir o modo visual usando a configuração explícita do TVmaze. |
| `npm run test:saucedemo` | Executar os exemplos antigos de login do SauceDemo, fora do escopo da entrega. |

Para executar apenas um arquivo:

```bash
npm test -- --spec cypress/e2e/tvmaze/busca/buscas_validas.cy.js
```

No modo visual, selecione um dos arquivos listados em **Specs**. Abrir a interface não executa todos os testes automaticamente.

## Resiliência e sincronização

- Os seletores priorizam IDs e classes específicas existentes no site, como `#searchform-q`, `#loginform-username`, `#following` e `.field-loginform-password`. Como o alvo é um site externo, os testes não adicionam atributos artificiais `data-cy` à aplicação.
- As consultas e asserções usam o retry nativo do Cypress. `filter(':visible')` identifica qual estado do acompanhamento está efetivamente exibido, considerando os estilos inline usados pelo TVmaze.
- `cy.intercept()` observa a requisição real de acompanhamento. `cy.wait('@alterarAcompanhamento')` aguarda esse evento e verifica o status HTTP; não é uma espera por tempo.
- Não há `cy.wait` numérico, `setTimeout` ou intervalo fixo de 12 segundos no código da suíte.
- O TVmaze pode responder HTTP 429 ao limitar tentativas de login. A requisição real de abertura do formulário é observada com `cy.intercept()`. Somente se houver 429, o código lê o `Retry-After` real e utiliza uma asserção com retry nativo para aguardar o prazo indicado; depois consulta o servidor novamente. São permitidas até duas novas consultas. Sem um prazo válido de até 60 segundos, ou se o limite persistir, o teste falha explicitamente.
- `failOnStatusCode: false` é usado somente na abertura do login, para inspecionar o 429 antes de validar a resposta observada. Respostas diferentes de 200 ou do 429 tratado reprovam o teste. Os fluxos de negócio não têm suas falhas HTTP ignoradas.
- A sessão anônima é obtida pela navegação normal e reutilizada com `cy.session()`. Os cenários não dependem de uma autenticação feita por outro teste.
- Os tempos limite são limites máximos para comandos e asserções, sem obrigar o teste a esperar todo esse período.

Evite execuções simultâneas na mesma conta: os cenários de acompanhamento alteram e restauram um dado real. O ambiente externo também pode ficar indisponível ou modificar sua interface; falhas de infraestrutura não são convertidas em sucesso.

## Estrutura principal

```text
cypress/
  e2e/tvmaze/
    login/
      logins_validos.cy.js
      logins_invalidos.cy.js
    busca/
      buscas_validas.cy.js
      buscas_invalidas.cy.js
    acompanhamento/
      acompanhamento_sem_login.cy.js
      adicionar_remover_series.cy.js
  support/
    tvmaze-e2e.js
    tvmaze.js
scripts/
  cypress.cjs
cypress.config.js
cypress.tvmaze.config.js
cypress.env.example.json
package.json
package-lock.json
README.md
```

`cypress.config.js` direciona a execução padrão para `cypress.tvmaze.config.js`. Essa configuração seleciona somente os testes do TVmaze e seu arquivo de suporte. Os demais exemplos e configurações do projeto não são contados como cobertura deste sistema.

O inicializador `scripts/cypress.cjs` executa a CLI oficial do Cypress, preserva o código de saída e remove `ELECTRON_RUN_AS_NODE` somente do processo filho, evitando interferência de terminais de IDE.

## Versionamento e evidências

O código-fonte e este README estão disponíveis no [repositório de entrega](https://github.com/joaovitor2410/Cypress_TVmaze). Arquivos de credenciais, `node_modules`, screenshots e vídeos locais não fazem parte do versionamento.

Os títulos `CT-Lxx`, `CT-Bxx` e `CT-Axx` identificam os casos no relatório do terminal. Em falhas, o Cypress gera screenshots em `cypress/screenshots/`. Esses arquivos podem ajudar a investigar a execução local, mas não substituem as asserções.

## Resultado da validação

Execução integral realizada em **23/11/2026**, com `npm test`:

| Item | Resultado |
| --- | --- |
| Framework | Cypress 16.3.0 |
| Navegador | Google Chrome 158, sem interface gráfica |
| Casos executados | 12 |
| Aprovados | 12 |
| Falhas | 0 |
| Ignorados | 0 |
| Duração aproximada | 1 minuto e 50 segundos |

Também foram conferidos a sintaxe dos arquivos, os links locais do README, a correspondência dos 12 identificadores com os blocos `it`, a ausência de esperas fixas e a exclusão das credenciais do conjunto de arquivos versionados. O resultado se refere a essa execução no site real; novas execuções dependem da disponibilidade do TVmaze e das credenciais configuradas.
