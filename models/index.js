const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

const Categoria = sequelize.define("Categoria", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

const Produto = sequelize.define("Produto", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 },
  },
  quantidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Categoria,
      key: "id",
    },
  },
});

Categoria.hasMany(Produto, {
  foreignKey: "categoriaId",
  as: "produtos",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Produto.belongsTo(Categoria, {
  foreignKey: "categoriaId",
  as: "categoria",
});

module.exports = {
  sequelize,
  Produto,
  Categoria,
};
