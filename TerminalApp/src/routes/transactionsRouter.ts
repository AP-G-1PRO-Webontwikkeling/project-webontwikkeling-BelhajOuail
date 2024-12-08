import { Router } from "express";

const router = Router();

export default function transactionsRouter(users: any[]) {
  const user = users[0];

  router.get("/:userId", (req, res) => {
    const { type, search } = req.query; // Haalt bedrag en het type op

    let filteredTransactions = user.expenses;

    // Filteren op type (incoming, outgoing of alle)
    if (type) {
      filteredTransactions = filteredTransactions.filter((transaction: any) =>
        type === 'incoming' ? transaction.isIncoming : !transaction.isIncoming
      );
    }

    // Zoeken op bedrag (als zoekterm bestaat, controleer of het een getal is)
    if (search && !isNaN(Number(search))) {
      const searchAmount = Number(search);
      filteredTransactions = filteredTransactions.filter((transaction: any) =>
        transaction.amount === searchAmount // Zoek op bedrag
      );
    }

    res.render("transactions", {
      user,
      expenses: filteredTransactions,
      type,
      search,
    });
  });

  // Verwijderen van transacties
  router.post("/:userId/delete/:transactionId", (req, res) => {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;

    user.expenses = user.expenses.filter((expense: any) => expense.id !== transactionId);

    res.redirect(`/transactions/${userId}`);
  });

  return router;
}
