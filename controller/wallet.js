const Wallet = require('../models/Wallet');

// Get wallet data
exports.getWallet = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await Wallet.create({ userId, balance: 0 });
      return res.json(newWallet);
    }
    res.json(wallet);
  } catch (err) {
    console.error('Get wallet error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Add transaction and update balance
exports.addTransaction = async (req, res) => {
  try {
    const { userId, type, amount, description } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!type || !['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'Valid transaction type (credit/debit) is required' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Find or create wallet
    let wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    // Check balance for debit
    if (type === 'debit' && parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Add transaction (this also updates the balance)
    wallet = await Wallet.addTransaction(wallet.id, {
      type,
      amount: parseFloat(amount),
      description: description || null
    });

    res.status(201).json(wallet);
  } catch (err) {
    console.error('Add transaction error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get wallet transactions
exports.getTransactions = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const transactions = await Wallet.getTransactions(wallet.id);
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ message: err.message });
  }
};
