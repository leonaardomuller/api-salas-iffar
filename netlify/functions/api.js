const path = require("path");
const express = require("express");
const serverless = require("serverless-http");
const faunadb = require("faunadb");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load(path.join(__dirname, "../../swagger.yaml"));
const cors = require("cors");

const app = express();
const router = express.Router();

app.use(cors());
app.use(
  "/.netlify/functions/api/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use(express.json());

const client = new faunadb.Client({
  secret: "fnAFG3GNP8AAzqIdK9L34GE0O8z68_lAldwxR3dx",
});
const q = faunadb.query;

const salasCollection = "salas";

// Helper function to handle FaunaDB errors
const handleFaunaError = (res, error) => {
  console.error("FaunaDB Error:", error);
  res.status(500).json({ error: error });
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: "App is running...",
  });
});

router.get("/salas", (req, res) => {
  client
    .query(q.Paginate(q.Documents(q.Collection(salasCollection))))
    .then((response) => {
      const salaRefs = response.data;
      if (salaRefs.length === 0) {
        return res
          .status(200)
          .json({ message: "Não foram encontradas salas cadastradas." });
      }
      const getAllSalaDataQuery = salaRefs.map((ref) => q.Get(ref));
      client
        .query(getAllSalaDataQuery)
        .then((ret) => {
          const salas = ret.map((sala) => sala.data);
          res.json(salas);
        })
        .catch((error) => handleFaunaError(res, error));
    })
    .catch((error) => handleFaunaError(res, error));
});

router.post("/salas", (req, res) => {
  const data = req.body;
  client
    .query(q.Create(q.Collection(salasCollection), { data }))
    .then(() => {
      res.json({
        message: "Sala adicionada com sucesso.",
      });
    })
    .catch((error) => handleFaunaError(res, error));
});

router.get("/salas/:id", (req, res) => {
  const salaId = Number(req.params.id);
  client
    .query(q.Get(q.Match(q.Index("salas_by_id"), salaId)))
    .then((ret) => {
      const sala = ret.data;
      if (!sala) {
        return res
          .status(404)
          .json({ message: "Não foi encontrada uma sala com este ID." });
      }
      res.json(sala);
    })
    .catch((error) => handleFaunaError(res, error));
});

router.put("/salas/:id", (req, res) => {
  const salaId = Number(req.params.id);
  const data = req.body;
  client
    .query(q.Get(q.Match(q.Index("salas_by_id"), salaId)))
    .then((ret) => {
      return client.query(q.Update(ret.ref, { data }));
    })
    .then(() => {
      res.json({
        message: "Sala atualizada com sucesso.",
      });
    })
    .catch((error) => handleFaunaError(res, error));
});

router.delete("/salas/:id", (req, res) => {
  const salaId = Number(req.params.id);
  client
    .query(q.Get(q.Match(q.Index("salas_by_id"), salaId)))
    .then((ret) => {
      return client.query(q.Delete(ret.ref));
    })
    .then(() => {
      res.json({
        message: "Sala excluída com sucesso.",
      });
    })
    .catch((error) => handleFaunaError(res, error));
});

router.delete("/salas", (req, res) => {
  client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection(salasCollection))),
        q.Lambda("X", q.Delete(q.Var("X")))
      )
    )
    .then(() => {
      res.json({
        message: "Todas as salas foram excluídas com sucesso.",
      });
    })
    .catch((error) => handleFaunaError(res, error));
});

app.use("/.netlify/functions/api", router);

module.exports = app;
module.exports.handler = serverless(app);
