# Auvo Automation Test — Playwright POC

Este repositório contém uma prova de conceito (POC) de automação E2E usando Playwright e JavaScript para o site público de e-commerce fictício https://www.saucedemo.com/.

**Objetivo:** validar o fluxo de login, navegação, validação de produto, adicionar ao carrinho, checkout e finalização de pedido.

---

**Pré-Requisitos**

- Node.js (recomendo v16+ ou v18+)
- npm (ou yarn)
- Conexão com internet para acessar https://www.saucedemo.com/ e baixar navegadores Playwright

Recomendações (Windows): abra o PowerShell como administrador quando for instalar dependências e navegadores.

---

**Instalação**

No diretório do projeto:

```powershell
npm install
npx playwright install
```

- `npm install` vai instalar dependências (inclui `@playwright/test`).
- `npx playwright install` instala os navegadores necessários (Chromium, Firefox, WebKit) para execução local.

---

**Execução dos testes**

Executar todos os testes:

```powershell
npx playwright test
```

Executar um spec específico (ex.: header):

```powershell
npx playwright test tests/e2e/header.spec.js
```

Rodar em modo headed (abrir navegador):

```powershell
npx playwright test --headed
```

Gerar relatório HTML após execução:

```powershell
npx playwright show-report
```

Observação: os testes usam `page.goto('/')` — verifique se `playwright.config.js` contém `use: { baseURL: 'https://www.saucedemo.com' }`. Se não existir, você pode alterar os `page.goto('/')` por `page.goto('https://www.saucedemo.com')` ou adicionar `baseURL` no config.

---

**Estrutura do repositório**

- `pages/` — Page Objects (POM): exemplos: `Login.page.js`, `Inventory.page.js`, `ProductDetails.page.js`, `Cart.page.js`, `Checkout.page.js`, `Header.page.js`, `Base.page.js`
- `selectors/` — seleção centralizada: todos os seletores para cada página (ex.: `LoginSelectors.js`, `InventorySelectors.js`, `HeaderSelectors.js`, `CartSelectors.js`, `CheckoutSelectors.js`, `ProductDetailsSelectors.js`)
- `tests/e2e/` — specs de teste E2E escritas com `@playwright/test`
- `fixtures/` — dados de teste (ex.: `users.json`, `products.json`, `checkoutInfo.json`)
- `playwright-report/` — relatórios gerados pelo Playwright (após execução)
- `package.json` — dependências do projeto

---

**Como o POM foi implementado**

- Cada página tem um `Page Object` na pasta `pages/` que encapsula ações e consultas da UI.
- Todos os seletores ficam centralizados em `selectors/` (um arquivo por componente/página) para facilitar manutenção.
- Há um `Base.page.js` com métodos utilitários (navegar, clicar, preencher, esperar elementos, etc.) que os Page Objects estendem.

---

**Cenários de teste realizados (organizados por spec)**

OBS: os testes seguem o padrão Arrange / Act / Assert (AAA).

| Spec de testes | Quantidade de testes | Descrição dos testes | Fluxo realizado |
|---|---:|---|---|
| tests/e2e/login.spec.js | 6 | Casos de login: sucesso, senha/usuário inválidos e validações de campos vazios | Login → verificação de redirecionamento/erros |
| tests/e2e/inventory.spec.js | 10 | Visualização de produtos, ordenação, adicionar/remover do carrinho, abrir detalhes e verificação de preços/badge | Login → Inventário → ações sobre produtos |
| tests/e2e/productDetails.spec.js | 5 | Visualizar título/descrição/preço/imagem, adicionar/remover no detalhe, voltar à lista e checar estado do botão | Login → Inventário → Detalhes do produto → Carrinho |
| tests/e2e/cart.spec.js | 8 | Visualizar itens do carrinho, remover itens, continuar comprando e navegar para checkout; validações de quantidade/preço | Login → Inventário → Carrinho → (Checkout) |
| tests/e2e/checkout.spec.js | 9 | Preenchimento de informações, validações obrigatórias, overview (subtotal/tax/total) e finalização do pedido | Login → Inventário → Carrinho → Checkout → Resumo (Steps 1→2→Complete) |
| tests/e2e/header.spec.js | 10 | Menu hambúrguer: links (All Items, About, Logout, Reset), abrir/fechar menu, badge do carrinho e navegação para o carrinho | Login → Interação com Header (menu / links / logout / reset) |
| tests/e2e/complete-order-flow.spec.js | 3 | Fluxo completo de pedido: 1 produto, todos os 6 produtos e cenário de carrinho vazio | Login → Inventário → Carrinho → Checkout → Resumo → Conclusão |

---

**Observações e sugestões / gap report**

- Documentação (README): adicionado neste arquivo.
- BaseURL: confirme `playwright.config.js` com `baseURL: 'https://www.saucedemo.com'` para permitir `page.goto('/')` nos testes.
- Seletores centralizados: todos os asserts e validações usam seletores importados de `selectors/`.
- Pesquisa: o site `saucedemo` não tem um campo de busca nativo. O requisito foi atendido através de seleção/filtragem por nome (método `addProductToCartByName`) e ordenação (testes TC-INVENTORY-004 a TC-INVENTORY-007).
- CI / Publicação: confirme que o repositório foi publicado no GitHub e compartilhe o link (requisito de entrega).
- Execução local: alguns testes abrem novas abas (ex.: About) — caso haja bloqueio de popups ou políticas de rede, isso pode impactar a execução em ambientes restritos.

---

**Status final de conformidade ao Desafio Auvo**

✅ **Ferramenta**: Playwright + JavaScript
✅ **Arquitetura**: Page Object Model (POM) implementado com Base.page.js e seletores centralizados
✅ **Seletores**: 100% centralizados em arquivos separados (`selectors/`)
✅ **Cobertura de testes**: Login → Inventário → Produto → Carrinho → Checkout → Finalização
✅ **Estrutura modular**: Fácil de manter e estender (adicionar novos testes requer apenas novos métodos no POM)
✅ **Documentação**: README com instruções de setup, execução e mapeamento de cenários
✅ **Dados de teste**: Fixtures centralizadas (`users.json`, `products.json`)
✅ **Pattern AAA**: Todos os testes seguem Arrange/Act/Assert
