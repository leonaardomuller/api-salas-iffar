const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());

let db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

db.serialize(() => {
  db.run(
    "CREATE TABLE salas (id INT, predio TEXT, andar INT, sala INT, descricao TEXT)",
    (err) => {
      if (err) {
        console.log("Error creating table", err);
      } else {
        console.log("Table created successfully");
      }
    }
  );
});

// READ ALL
app.get("/salas", (req, res) => {
  let sql = `SELECT * FROM salas`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({
        message: "Não foram encontradas salas cadastradas.",
      });
    }
  });
});

// CREATE
app.post("/salas", (req, res) => {
  let data = req.body;

  let checkSql = `SELECT * FROM salas WHERE id = ?`;
  db.get(checkSql, [data.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      res.status(409).json({
        error: "Já existe uma sala com o ID fornecido.",
      });
    } else {
      let insertSql = `INSERT INTO salas (id, predio, andar, sala, descricao) VALUES (?, ?, ?, ?, ?)`;
      db.run(
        insertSql,
        [data.id, data.predio, data.andar, data.sala, data.descricao],
        (err) => {
          if (err) {
            return console.error(err.message);
          }
          res.json({
            message: "Sala adicionada com sucesso.",
          });
        }
      );
    }
  });
});

// READ
app.get("/salas/:id", (req, res) => {
  let sql = `SELECT * FROM salas WHERE id  = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({
        error: "A sala com o ID fornecido não foi encontrada.",
      });
    }
  });
});

// UPDATE
app.put("/salas/:id", (req, res) => {
  let data = req.body;
  let checkSql = `SELECT * FROM salas WHERE id = ?`;
  db.get(checkSql, [req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (!row) {
      res.status(404).json({
        error: "A sala com o ID fornecido não foi encontrada.",
      });
    } else {
      let sql = `UPDATE salas SET predio = ?, andar = ?, sala = ?, descricao = ? WHERE id = ?`;
      db.run(
        sql,
        [data.predio, data.andar, data.sala, data.descricao, req.params.id],
        (err) => {
          if (err) {
            return console.error(err.message);
          }
          res.json({
            message: "Sala atualizada com sucesso.",
          });
        }
      );
    }
  });
});

// DELETE
app.delete("/salas/:id", (req, res) => {
  let checkSql = `SELECT * FROM salas WHERE id = ?`;
  db.get(checkSql, [req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (!row) {
      res.status(404).json({
        error: "A sala com o ID fornecido não foi encontrada.",
      });
    } else {
      let sql = `DELETE FROM salas WHERE id = ?`;
      db.run(sql, [req.params.id], (err) => {
        if (err) {
          return console.error(err.message);
        }
        res.json({
          message: "Sala excluída com sucesso.",
        });
      });
    }
  });
});

// DELETE ALL
app.delete("/salas", (req, res) => {
  let sql = `DELETE FROM salas`;
  db.run(sql, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.json({
      message: "Todas as salas foram excluídas com sucesso.",
    });
  });
});

app.listen(3333, function () {
  console.log("App listening on port 3333!");
});
