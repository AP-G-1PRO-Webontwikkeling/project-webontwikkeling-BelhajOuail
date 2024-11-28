import { Router } from "express";

const router = Router();

export default function transactionsRouter(users: any[]) {
  const user = users[0];

  router.get("/:userId", (req, res) => {
    res.render("transactions", { user });
  });

  router.post("/:userId/add", (req, res) => {
    const { description, amount, category, isIncoming } = req.body;

    const newTransaction = {
      id: Date.now().toString(),
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

    user.expenses.push(newTransaction);

    res.redirect(`/transactions/${user.id}`);
  });

  router.post("/:userId/delete/:transactionId", (req, res) => {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;

    user.expenses = user.expenses.filter((expense: any) => expense.id !== transactionId);

    res.redirect(`/transactions/${userId}`);
  });

  return router;
}
