import express from "express";
import { connect } from "./mongoDB"
import router from "./routes/transactionsRouter";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use("/transactions", router);

app.listen(PORT, () => {
  connect();
  console.log(`Server draait op http://localhost:${PORT}`);
  
});
