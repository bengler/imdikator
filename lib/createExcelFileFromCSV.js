import Excel from 'exceljs'

let workbook = new Excel.Workbook()

workbook.creator = 'IMDi'
workbook.created = new Date(2018, 1, 22)
workbook.modified = new Date().now()

const sheet = workbook.addWorksheet('IMDi statistikk')

