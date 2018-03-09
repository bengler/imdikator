// imdi delivers faulty format with duplicate values
// this script will solve that.

import fs from 'fs'
import ora from 'ora'
import eol from 'eol'
import chalk from 'chalk'

// show text in terminal saying script has started
const spinner = ora('working...\n')
spinner.start()

const path = './import/regioninndeling-fylker-kommuner.csv'
let newFileContent

// read the file
fs.readFile(path, (err, buff) => {
  // get all text from the file
  const fileContent = buff.toString()

  // split the text on newline \n
  const arrayOfContent = eol.split(fileContent)

  // handle each line
  arrayOfContent.forEach((item, index) => {
    // skip the first and last line
    if (index !== 0 || index != arrayOfContent.length) {
      let values = item.split(',')
      values.splice(5, 1)
      values.splice(5, 1)
      newFileContent += `${values}\n`
    }
  })

  console.log(chalk.cyan('  Successfully parsed script\n'))

  fs.writeFile(path, newFileContent, error => {
    if (error) throw error
    console.log(chalk.cyan('  Successfully overwrote previous script\n'))
  })

  // stop spinning and say that we're finished parsing
  spinner.stop()
})
