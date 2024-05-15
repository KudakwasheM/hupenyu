var PdfPrinter = require("pdfmake");
var fs = require("fs");
const moment = require("moment");

const makePrescription = (data) => {
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
  console.log(data);

  data.medication.forEach((m) => {
    const { medicine, dosage, frequency, days } = m;
    tableRows.push([
      {
        text: medicine,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "left",
      },
      {
        text: dosage,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "left",
      },
      {
        text: frequency,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "left",
      },
      {
        text: days,
        border: [false, false, false, false],
        margin: [0, 5, 0, 5],
        alignment: "left",
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
            text: "MEDICINE",
            fillColor: "#eaf2f5",
            border: [false, true, false, true],
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
          {
            text: "DOSAGE",
            border: [false, true, false, true],
            alignment: "right",
            fillColor: "#eaf2f5",
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
          {
            text: "FREQUENCY",
            border: [false, true, false, true],
            alignment: "right",
            fillColor: "#eaf2f5",
            margin: [0, 5, 0, 5],
            textTransform: "uppercase",
          },
          {
            text: "DAYS",
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
              text: "Prescription",
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
                      text: "Prescription No.",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: `${data.prescription_number}`,
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
                // {
                //   columns: [
                //     {
                //       text: "Status",
                //       color: "#aaaaab",
                //       bold: true,
                //       fontSize: 12,
                //       alignment: "right",
                //       width: "*",
                //     },
                //     {
                //       text: data.paymentStatus.toUpperCase(),
                //       bold: true,
                //       fontSize: 12,
                //       alignment: "right",
                //       color: data.paymentStatus === "paid" ? "green" : "red",
                //       width: 100,
                //     },
                //   ],
                // },
              ],
            },
          ],
        ],
      },
      {
        width: "100%",
        alignment: "center",
        text: `Prescription No. ${data.prescription_number}`,
        bold: true,
        margin: [0, 10, 0, 10],
        fontSize: 15,
      },
      table,
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
      `${process.env.FILE_UPLOAD_PATH}/prescriptions/${data.prescription_number}.pdf`
    )
  );
  pdfDoc.end();
};

module.exports = { makePrescription };
