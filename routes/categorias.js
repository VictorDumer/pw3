const express = require("express");
const router = express.Router();

const { Categoria, Produto } = require("../models");

// GET /categorias — lista categorias
router.get("/", async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      include: [{ model: Produto, as: "produtos" }],
      order: [["id", "ASC"]],
    });
    res.render("categorias/index", { categorias });
  } catch (err) {
    next(err);
  }
});

// GET /categorias/nova — formulário
router.get("/nova", (req, res) => {
  res.render("categorias/nova", { erro: null });
});

// POST /categorias — cria categoria
router.post("/", async (req, res, next) => {
  try {
    await Categoria.create({ nome: (req.body.nome || "").trim() });
    res.redirect("/categorias");
  } catch (err) {
    res.status(400).render("categorias/nova", {
      erro: "Informe um nome válido (e não repetido) para a categoria.",
    });
  }
});

// GET /categorias/:id/editar — formulário de edição
router.get("/:id/editar", async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria)
      return res
        .status(404)
        .render("error", { message: "Categoria não encontrada", error: {} });
    res.render("categorias/editar", { categoria, erro: null });
  } catch (err) {
    next(err);
  }
});

// POST /categorias/:id — atualiza categoria
router.post("/:id", async (req, res, next) => {
  try {
    await Categoria.update(
      { nome: (req.body.nome || "").trim() },
      { where: { id: req.params.id } },
    );
    res.redirect("/categorias");
  } catch (err) {
    next(err);
  }
});

// POST /categorias/:id/deletar — exclui categoria (produtos ficam sem categoria)
router.post("/:id/deletar", async (req, res, next) => {
  try {
    await Categoria.destroy({ where: { id: req.params.id } });
    res.redirect("/categorias");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
