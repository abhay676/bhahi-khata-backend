const Expenses = require("../model/Expenses");
const Wallets = require("../model/Wallets");
// const generateMsg = require("../utils/GenerateMsg");
// const msg = require("../utils/ToastMsg");

// ! For Sorting
// GET
exports.sortExpenses = async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const search = req.query;
    // Storing Key
    const key = Object.keys(search);
    const value = Object.values(search);
    const query = {};

    if (value[0] === "asc") {
      // For Ascending order
      query[key] = 1;
    } else {
      query[key] = -1;
    }
    console.log(query);
    const expenses = await Wallets.findById(walletId);
    if (!expenses) throw new Error(msg.expenseAllError);
    await expenses.populate("transactions").execPopulate();
    const results = await Expenses.find({}).sort(query);
    const resultLength = results.length;
    res.send(
      generateMsg(msg.filterAppliedSuccess, "success", {
        results,
        resultLength
      })
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};

// ! For Search
// GET
exports.searchExpenses = async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const search = req.query;
    // Storing Key and Value
    const key = Object.keys(search);
    const value = Object.values(search);
    const query = {};

    query[key] = value; // Assign key and value

    const expenses = await Wallets.findById(walletId);
    if (!expenses) throw new Error(msg.expenseAllError);
    await expenses.populate("transactions").execPopulate();
    const results = await Expenses.find(query);
    const resultLength = results.length;
    res.send(
      generateMsg(msg.searchFoundSuccess, "success", {
        results,
        resultLength
      })
    );
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
