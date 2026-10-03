const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const { Produto, Categoria } = require("../models");

// GET /produtos — lista todos (com busca ?q= e filtro ?categoriaId=)
router.get("/", async (req, res, next) => {
  try {
    const { q, categoriaId } = req.query;
    const where = {};

    if (q && q.trim() !== "") {
      where.nome = { [Op.like]: `%${q.trim()}%` };
    }

    if (categoriaId && categoriaId !== "") {
      where.categoriaId = categoriaId;
    }

    const [produtos, categorias] = await Promise.all([
      Produto.findAll({
        where,
        include: [{ model: Categoria, as: "categoria" }],
        order: [["id", "ASC"]],
      }),
      Categoria.findAll({ order: [["nome", "ASC"]] }),
    ]);

    res.render("produtos/index", {
      produtos,
      categorias,
      q: q || "",
      categoriaId: categoriaId || "",
    });
  } catch (err) {
    next(err);
  }
});

// GET /produtos/novo — formulário de criação
router.get("/novo", async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({ order: [["nome", "ASC"]] });
    res.render("produtos/novo", { categorias, erro: null });
  } catch (err) {
    next(err);
  }
});

// POST /produtos — cria produto
router.post("/", async (req, res, next) => {
  try {
    const categoriaId =
      req.body.categoriaId === "" ? null : req.body.categoriaId;
    await Produto.create({ ...req.body, categoriaId });
    res.redirect("/produtos");
  } catch (err) {
    try {
      const categorias = await Categoria.findAll({ order: [["nome", "ASC"]] });
      res.status(400).render("produtos/novo", {
        categorias,
        erro: "Verifique os dados informados (nome e preço são obrigatórios).",
      });
    } catch (e) {
      next(err);
    }
  }
});

router.get("/categoria/:id", async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria)
      return res
        .status(404)
        .render("error", { message: "Categoria não encontrada", error: {} });

    const produtos = await Produto.findAll({
      where: { categoriaId: req.params.id },
      include: [{ model: Categoria, as: "categoria" }],
      order: [["id", "ASC"]],
    });

    const categorias = await Categoria.findAll({ order: [["nome", "ASC"]] });

    res.render("produtos/por-categoria", { categoria, produtos, categorias });
  } catch (err) {
    next(err);
  }
});

// GET /produtos/:id/editar — formulário de edição
router.get("/:id/editar", async (req, res, next) => {
  try {
    const [produto, categorias] = await Promise.all([
      Produto.findByPk(req.params.id, {
        include: [{ model: Categoria, as: "categoria" }],
      }),
      Categoria.findAll({ order: [["nome", "ASC"]] }),
    ]);
    if (!produto)
      return res
        .status(404)
        .render("error", { message: "Produto não encontrado", error: {} });
    res.render("produtos/editar", { produto, categorias, erro: null });
  } catch (err) {
    next(err);
  }
});

// POST /produtos/:id — atualiza produto
router.post("/:id", async (req, res, next) => {
  try {
    const categoriaId =
      req.body.categoriaId === "" ? null : req.body.categoriaId;
    await Produto.update(
      { ...req.body, categoriaId },
      { where: { id: req.params.id } },
    );
    res.redirect("/produtos");
  } catch (err) {
    next(err);
  }
});

// POST /produtos/:id/deletar — exclui produto
router.post("/:id/deletar", async (req, res, next) => {
  try {
    await Produto.destroy({ where: { id: req.params.id } });
    res.redirect("/produtos");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
