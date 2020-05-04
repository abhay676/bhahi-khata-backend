const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
const uid = require("uniqid");
const generateMsg = require("../../utils/GenerateMsg");
const msg = require("../../utils/ToastMsg");
const User = require("../model/User");
const Wallet = require("../model/Wallets");
const Expenses = require("../model/Expenses");

function generateTableRow (doc, y, c1, c2, c3, c4, c5) {
  if (typeof c5 === "string") {
    c5 = "Date";
  } else {
    c5 = moment(c5).format("L");
  }
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}

exports.generatePDF = async (req, res) => {
  try {
    //  Fetching User Info
    const id = req.user._id;
    const user = await User.findById(id);
    // const id = req.user._id;
    const walletId = req.params.walletId;
    // fetching date from the req
    let from = req.query.from;
    let to = req.query.to;
    // Convert into ISO-format
    from = new Date(from);
    to = new Date(to);
    // const user = await User.findById(id);
    const expenses = await Expenses.find({
      $and: [
        {
          walletId,
          createdAt: {
            $gte: from
          }
        },
        {
          walletId,
          updatedAt: {
            $lte: to
          }
        }
      ]
    });
    const walletName = await Wallet.findById(walletId);
    const reportId = uid.time();

    // Data Model
    const report = {
      userInfo: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        mobile: user.mobile
      },
      expenses
    };

    // Format date for PDF
    const fromDate = moment(from).format("L");
    const toDate = moment(to).format("L");

    const userInforTop = 200;
    const doc = new PDFDocument();

    const reportMetaData = {
      Title: "Report Summary",
      Author: `${user.firstName} ${user.lastName}`,
      Subject: `Summary of ${walletName.name}`,
      Keywords: reportId,
      ModDate: moment().format("L")
    };

    doc.info = reportMetaData;
    // Generate Header
    doc
      .text("Bhahi-Khata Summary", 200, 65, {
        align: "centre",
        underline: true,
        lineBreak: true
      })
      .font("Helvetica-Bold")
      .moveDown();
    doc
      .text(`Report on ${walletName.name}`, 200, 95, {
        align: "centre",
        underline: true
      })
      .text(`${fromDate} - ${toDate}`, 200, 80, { align: "right" })
      .moveDown();

    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, 185)
      .lineTo(550, 185)
      .stroke();
    // User Info
    const userData = report.userInfo;

    doc
      .text(`Report Id: ${reportId}`, 50, userInforTop)
      .font("Helvetica-Bold")
      .text(`Report Date: ${moment().format("L")}`, 50, userInforTop + 25)
      .font("Helvetica")
      .text(`Wallet amount: ${walletName.amount}`, 50, userInforTop + 55);
    doc
      .text(`Name: ${userData.name}`, 300, userInforTop)
      .font("Helvetica")
      .text(`Email: ${userData.email}`, 300, userInforTop + 25)
      .text(`Mobile: ${userData.mobile}`, 300, userInforTop + 55)
      .moveDown();

    doc
      .strokeColor("#000000")
      .lineWidth(1)
      .moveTo(50, 185)
      .lineTo(550, 185)
      .stroke();
    //   Generate Table Row
    let i;
    const reportTableTop = 330;
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      reportTableTop,
      "Merchant",
      "Description",
      "Amount",
      "Category",
      "Created date"
    );

    doc
      .strokeColor("#000000")
      .lineWidth(1)
      .moveTo(50, 185)
      .lineTo(550, 185)
      .stroke();

    doc.font("Helvetica");

    for (i = 0; i < report.expenses.length; i++) {
      const item = report.expenses[i];
      const position = reportTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.merchantName,
        item.description,
        item.amount,
        item.category,
        item.createdAt
      );
    }
    doc.end();
    doc.pipe(fs.createWriteStream(`${reportId}.pdf`));
    await Wallet.findByIdAndUpdate(walletId, {
      $push: {
        reports: reportMetaData
      }
    });
    res.send(msg.reportGenSuccess, "success", msg.reportGenSuccess);
  } catch (error) {
    res.send(generateMsg(null, "error", error));
  }
};
