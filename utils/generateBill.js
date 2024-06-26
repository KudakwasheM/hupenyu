var PdfPrinter = require("pdfmake");
var fs = require("fs");
const moment = require("moment");

const makeInvoice = (data) => {
  var fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
      bold: "fonts/Roboto-Medium.ttf",
      italics: "fonts/Roboto-Italic.ttf",
      bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };
  var printer = new PdfPrinter(fonts);

  const tableRows = [];

  data.services_medicine.forEach((sm) => {
    const { name, quantity, unit_price } = sm;
    var total = (quantity * unit_price).toFixed(2);
    tableRows.push([
      {
        text: name,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "left",
      },
      {
        text: quantity.toFixed(2),
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "center",
      },
      {
        text: `$${unit_price.toFixed(2)}`,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "right",
      },
      {
        text: `$${total}`,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "right",
      },
    ]);
  });

  const table = {
    layout: "lightHorizontalLines",
    table: {
      headerRows: 1,
      widths: ["*", "auto", "auto", "auto"],
      body: [
        [
          {
            text: "SERVICE/MEDICATION",
            fillColor: "#eaf2f5",
            border: [false, true, false, true],
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
          {
            text: "QUANTITY",
            border: [false, true, false, true],
            alignment: "right",
            fillColor: "#eaf2f5",
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
          {
            text: "UNIT PRICE",
            border: [false, true, false, true],
            alignment: "right",
            fillColor: "#eaf2f5",
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
          {
            text: "TOTAL",
            border: [false, true, false, true],
            alignment: "right",
            fillColor: "#eaf2f5",
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
        ],
        ...tableRows,
      ],
    },
  };

  var docDefinition = {
    content: [
      {
        columns: [
          {
            text: "LOGO",
            padding: [10, 15],
            fontSize: 30,
            bold: true,
            backgroundColor: "#eaf2f5",
          },
          [
            {
              text: "Invoice",
              color: "#333333",
              width: "*",
              fontSize: 28,
              bold: true,
              alignment: "right",
              margin: [0, 0, 0, 15],
            },
            {
              stack: [
                {
                  columns: [
                    {
                      text: "Invoice No.",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: `${data.bill_number}`,
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 100,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: "Date Issued",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: moment(data.created_at).format("MMM DD, YYYY"),
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 100,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: "Status",
                      color: "#aaaaab",
                      bold: true,
                      fontSize: 12,
                      alignment: "right",
                      width: "*",
                    },
                    {
                      text: data.paymentStatus.toUpperCase(),
                      bold: true,
                      fontSize: 12,
                      alignment: "right",
                      color: data.paymentStatus === "paid" ? "green" : "red",
                      width: 100,
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
      {
        width: "100%",
        alignment: "center",
        text: `Invoice No. ${data.bill_number}`,
        bold: true,
        margin: [0, 10, 0, 10],
        fontSize: 15,
      },
      table,
      "\n",
      "\n\n",
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 1;
          },
          hLineColor: function (i, node) {
            return "#eaeaea";
          },
          vLineColor: function (i, node) {
            return "#eaeaea";
          },
          hLineStyle: function (i, node) {
            // if (i === 0 || i === node.table.body.length) {
            return null;
            //}
          },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          paddingLeft: function (i, node) {
            return 10;
          },
          paddingRight: function (i, node) {
            return 10;
          },
          paddingTop: function (i, node) {
            return 3;
          },
          paddingBottom: function (i, node) {
            return 3;
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return "#fff";
          },
        },
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Payment Subtotal",
                border: [false, true, false, true],
                alignment: "right",
                margin: [0, 3, 0, 3],
              },
              {
                border: [false, true, false, true],
                text: `$${data.total.toFixed(2)}`,
                alignment: "right",
                fillColor: "#f5f5f5",
                margin: [0, 3, 0, 3],
              },
            ],
            [
              {
                text: "Payment Processing Fee",
                border: [false, false, false, true],
                alignment: "right",
                margin: [0, 3, 0, 3],
              },
              {
                text: `$${data.total.toFixed(2)}`,
                border: [false, false, false, true],
                fillColor: "#f5f5f5",
                alignment: "right",
                margin: [0, 3, 0, 3],
              },
            ],
            [
              {
                text: "Total Amount",
                bold: true,
                fontSize: 18,
                alignment: "right",
                border: [false, false, false, true],
                margin: [0, 3, 0, 3],
              },
              {
                text: `$${data.total.toFixed(2)}`,
                bold: true,
                fontSize: 18,
                alignment: "right",
                border: [false, false, false, true],
                fillColor: "#f5f5f5",
                margin: [0, 3, 0, 3],
              },
            ],
          ],
        },
      },
      "\n\n",
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(
    fs.createWriteStream(
      `${process.env.FILE_UPLOAD_PATH}/bills/${data.bill_number}.pdf`
    )
  );
  pdfDoc.end();
};

module.exports = { makeInvoice };
