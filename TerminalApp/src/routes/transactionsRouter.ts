import { Router } from "express";
import { addTransactionToUser, filterTransactions, getUser, getUserAndTransactions, removeTransactionFromUser, updateTransactionForUser } from "../mongoDB";

const router = Router();

router.get("/", async (req, res) => {
  const userId = "BelhajOuail" // dit is nog hardcoded momenteel
  const user = await getUser(userId);
  if (user) {
    res.render("index", { user });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { search, type } = req.query as { search?: string; type?: string };

  const { user, transactions } = await getUserAndTransactions(userId)

  let filteredTransactions = await filterTransactions(transactions, type, search);

  res.render("transactions", {
    user,
    expenses: filteredTransactions,
    type,
    search,
  });
});

router.post("/:userId/add", async (req, res) => {
  const { userId } = req.params;
  const { description, amount, category, isIncoming } = req.body;


  const newTransaction = {
    id: parseFloat(amount),
    description,
    amount: parseFloat(amount),
    date: new Date().toISOString(),
    currency: "EUR",
    paymentMethod: { method: "Onbekend" },
    isIncoming: isIncoming === "true",
    category,
    tags: [],
    isPaid: false,
  };


  addTransactionToUser(userId, newTransaction);
  res.redirect(`/transactions/${userId}`);

});

// Verwijderen van transacties
router.post("/:userId/delete/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;
  removeTransactionFromUser(userId, transactionId);

  res.redirect(`/transactions/${userId}`);

});


router.post("/:userId/edit/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;
  const { description, amount, category, isIncoming } = req.body;

  const updatedTransaction = {
      description,
      amount: parseFloat(amount),
      category,
      isIncoming: isIncoming === "true",  // Zorg ervoor dat het correct wordt omgezet
  };

  
       updateTransactionForUser(userId, transactionId, updatedTransaction);
      res.redirect(`/transactions/${userId}`);  // Terug naar de transactiepagina

});



export default router;

