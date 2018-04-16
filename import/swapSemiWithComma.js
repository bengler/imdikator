/* eslint-disable */
// imdi delivers faulty format with duplicate values
// this script will solve that.

var fs = require('fs')
var ora = require('ora')
var eol = require('eol')
var chalk = require('chalk')

// show text in terminal saying script has started
var spinner = ora('working...\n')
spinner.start()

var path = './import/regioninndeling-fylker-kommuner.csv'

var newFileContent = '' // holds the new content to be exported

// read the file
fs.readFile(path, function(err, buff) {
  // get all text from the file
  var fileContent = buff.toString()

  // split the text on newline \n
  var arrayOfContent = eol.split(fileContent)

  // handle each line
  arrayOfContent.forEach(function(item, index) {
    
    // split line into array of chars
    var values = item.split('')

    // replace ; with ,
    for (var v = 0; v < values.length; v++) {
      if (values[v] === ';') {
        values[v] = ','
      }
    }

    // add parsed line to newFileContent
    values = values.join('')
    newFileContent += `${values}\n`
  })

  // create new file with parsed stuff
  fs.writeFile(path, newFileContent, function(error) {
  
    if (error) throw error
    console.log(chalk.cyan('  Successfully overwrote previous script\n'))
  })
  
  // stop spinning and say that we're finished parsing
  console.log(chalk.cyan('  Successfully parsed script\n'))
  spinner.stop()
})


