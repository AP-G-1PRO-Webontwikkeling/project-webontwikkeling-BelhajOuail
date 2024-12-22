import { Router } from "express";
import { User } from "../models/interfaces";
import { addTransactionToUser, filterTransactions, getUser, getUserAndTransactions, loginUser, registerUser, removeTransactionFromUser, updateTransactionForUser } from "../mongoDB";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const user = await getUser(userId);

  if (user) {
    res.render("index", { user });
  } else {
    res.redirect('/login');
  }
});

router.get('/index', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const user = await getUser(userId);

  if (user) {
    res.render("index", { user });
  } else {
    res.redirect('/login');
  }
});


router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
      res.redirect("/login");
  });
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password, confirm_password, fullname } = req.body;

  if (password !== confirm_password) {
    return res.render('register', { message: 'Wachtwoorden komen niet overeen.' });
  }

  const newUser: User = {
    id: username,
    name: fullname,
    email: email,
    expenses: [],
    password: password,
    budget: {
      monthlyLimit: 0,
      notificationThreshold: 0,
      isActive: false
    },
  };

  try {
    await registerUser(newUser);
    res.redirect('/login');
  } catch (error) {
    res.render('register', { message: 'Gebruikersnaam is al in gebruik.' });
  }
});



router.get('/login', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/index');
  }
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const loggedInUser = await loginUser(username, password);
    if (loggedInUser) {
      req.session.user = loggedInUser;
      return res.redirect('/index');
    } else {
      return res.render('login', {
        message: 'Foute gebruikersnaam of wachtwoord!',
      });
    }
  } catch (error) {
    return res.render('login', { message: 'Er is een fout opgetreden tijdens het inloggen.' });
  }
});



router.get("/:userId", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id; 
  const { search, type } = req.query as { search?: string; type?: string };

  const { user, transactions } = await getUserAndTransactions(userId);

  let filteredTransactions = await filterTransactions(transactions, type, search);

  res.render("transactions", {
    user,
    expenses: filteredTransactions,
    type,
    search,
  });
});

router.post("/:userId/add", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
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

  await addTransactionToUser(userId, newTransaction);
  res.redirect(`/transactions/${userId}`);
});


router.post("/:userId/delete/:transactionId", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const { transactionId } = req.params;

  await removeTransactionFromUser(userId, transactionId);
  res.redirect(`/transactions`);
});


router.post("/:userId/edit/:transactionId", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const { transactionId } = req.params;
  const { description, amount, category, isIncoming } = req.body;

  const updatedTransaction = {
    description,
    amount: parseFloat(amount),
    category,
    isIncoming: isIncoming === "true",
  };

  await updateTransactionForUser(userId, transactionId, updatedTransaction);
  res.redirect(`/transactions`);
});


export default router;

