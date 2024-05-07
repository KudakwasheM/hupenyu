var PdfPrinter = require("pdfmake");
var fs = require("fs");
const moment = require("moment");

const makePrescription=(data)=>{
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

      data.medication.foreach(m=>{
        const {name,}
      })
}