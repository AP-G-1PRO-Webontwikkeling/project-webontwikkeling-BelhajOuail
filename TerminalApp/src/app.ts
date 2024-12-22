import express from "express";
import { connect } from "./mongoDB"
import router from "./routes/transactionsRouter";
import session from "./session/session";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session)

app.use("/", router);
app.use("/transactions", router);

app.use("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); 
  }
  res.redirect('/index'); 
});


app.listen(PORT, () => {
  connect();
  console.log(`Server draait op http://localhost:${PORT}`);
});
