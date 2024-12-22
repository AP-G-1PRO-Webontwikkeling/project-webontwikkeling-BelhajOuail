import express from "express";
import { connect } from "./mongoDB"
import router from "./routes/transactionsRouter";
import session from "./session/session";
import path from 'path';

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session)

app.use("/", router);
app.use("/transactions", router);

app.listen(PORT, () => {
  connect();
  console.log(`Server draait op http://localhost:${PORT}`);
});
