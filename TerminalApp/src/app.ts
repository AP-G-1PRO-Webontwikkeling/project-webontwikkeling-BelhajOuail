import express from "express";
import transactionsRouter from "./routes/transactionsRouter";
import users from "./data/data.json";
import { connect } from "./mongoDB"

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/transactions", transactionsRouter(users));

app.get('/', (req, res) => {
  const user = users[0];
  res.render('index', { user });
});

app.listen(PORT, () => {
  connect();
  console.log(`Server draait op http://localhost:${PORT}`);
});
