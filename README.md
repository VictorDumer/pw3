# Cadastro de Produtos — MVC

Sistema web para cadastro de produtos de uma pequena loja, construído com Node.js, Express, EJS, Sequelize e SQLite seguindo o padrão MVC.

## Integrante

- Nome: Victor Gabriel Cruz de Souza Dumer — RM: 20240057

## Como executar

Pré-requisito: Node.js 18+ instalado.

```bash
npm install
npm start
```

Acesse: `http://localhost:3000`

- Produtos: `http://localhost:3000/produtos`
- Categorias: `http://localhost:3000/categorias`

O banco SQLite (`database.sqlite`) é criado automaticamente na primeira execução via `sequelize.sync()`.

## Funcionalidades

- Cadastro de produtos (nome, preço, quantidade, categoria)
- Listagem de produtos (com categoria)
- Edição de produtos
- Exclusão de produtos
- Cadastro de categorias
- Listagem/edição/exclusão de categorias
- Produtos por categoria (`GET /produtos/categoria/:id` + filtro `?categoriaId=`)
- Pesquisa de produtos por nome (`GET /produtos?q=termo`, operador `LIKE`)

## Rotas principais

```
GET     /                          → página inicial
GET     /produtos                  → lista (aceita ?q= e ?categoriaId=)
GET     /produtos/novo              → formulário de criação
POST    /produtos                  → cria (Produto.create)
GET     /produtos/categoria/:id     → produtos de uma categoria
GET     /produtos/:id/editar        → formulário de edição
POST    /produtos/:id              → atualiza (Produto.update)
POST    /produtos/:id/deletar      → exclui (Produto.destroy)

GET     /categorias                → lista categorias
GET     /categorias/nova           → formulário
POST    /categorias                → cria
GET     /categorias/:id/editar     → formulário de edição
POST    /categorias/:id            → atualiza
POST    /categorias/:id/deletar    → exclui
```

## Desafios

### Desafio 1 — Categorias e relacionamento

- Criado o model `Categoria` (`models/index.js`) com campo `nome` único e obrigatório.
- Adicionada a chave estrangeira `Produto.categoriaId` referenciando `Categoria.id`.
- Associações Sequelize:
  ```js
  Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'produtos', onDelete: 'SET NULL' });
  Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
  ```
- CRUD completo de categorias em `routes/categorias.js` + views `views/categorias/`.
- Formulários de produto (`novo.ejs` / `editar.ejs`) com `<select>` de categoria; listagem com `include: Categoria` exibindo o nome da categoria. Tudo persistido no SQLite.

### Desafio 2 — Produtos por categoria

- Rota `GET /produtos/categoria/:id` (`routes/produtos.js`): busca a categoria por PK e faz `Produto.findAll({ where: { categoriaId: id }, include: Categoria })`, renderizando `views/produtos/por-categoria.ejs`.
- A listagem principal também permite filtrar por categoria via `?categoriaId=` e por chips/links que apontam para a rota dedicada. Definida antes de `/:id/editar` para evitar conflito de rota.

### Desafio extra — Pesquisa por nome

- Na rota `GET /produtos`, se `?q=` for informado, aplica `where.nome = { [Op.like]: '%termo%' }` (SQLite `LIKE`), retornando apenas produtos cujo nome contém o termo. Formulário de busca na própria listagem.

## Visual — Livro-Caixa

Interface redesenhada(direção "Caderneta do lojista", estrela-guia "A Conferência Diária"). Nada de rotas, variáveis EJS ou comportamento mudou — só HTML/CSS e um JS progressivo:

- Papel quente + tinta, títulos em serifada de livro, numerais sempre tabulares.
- Linha de saldo: cada produto mostra valor + barra + carimbo `BAIXO` (≤5) ou `ZERADO`.
- Tarjas de categoria codificadas por cor, faixa com contagem do filtro (`aria-live`) e legenda de saldos.
- Alertas com SweetAlert2 via CDN (`public/javascripts/app.js`): confirmação de exclusão nomeando o registro e toast de retorno após criar/editar/excluir — com queda graciosa para `confirm()` nativo se o CDN estiver fora do ar.
