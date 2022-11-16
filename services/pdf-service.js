const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = { buildBugPDF }


function buildBugPDF(bugs, filename = 'pdf/bugs.pdf') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        doc.pipe(fs.createWriteStream(filename))
        bugs.forEach((bug, idx) => {
            if (idx !== 0) doc.addPage()
            var sevColor
            switch (bug.severity) {
                case 1:
                    sevColor = 'red'
                    break
                case 2:
                    sevColor = 'gold'
                    break
                case 3:
                    sevColor = 'green'
                    break
            }

            doc
                .fontSize(25)
                .text(idx + 1 + '. ' + bug.title, 100, 50)
                .underline(100, 50, 34 + 13 * bug.title.length, 27)
                .fillColor(sevColor)
                .fontSize(16)
                .text('Severity: ' + bug.severity, 100, 85)
                .fillColor('black')
                .fontSize(20)
                .text('Description: ' + bug.description, 100, 110)
        })

        doc.end()
        console.log('end PDF')
        resolve()



    })
}
