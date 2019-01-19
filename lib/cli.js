const readline = require('readline');
const events = require('events');
class _events extends events {}
let e = new _events();

e.on('exit', () => {
  cli.responders.exit();
}); 

let cli = {};

cli.responders = {};

cli.responders.exit = () => {
  process.exit(0);
};

cli.responders.help = () => {
  
};

// Create a horizontal line across the screen
cli.horizontalLine = () => {
  // Get the available screen size
  let width = process.stdout.columns;
  let line = '';
  for(i = 0; i < width; i++) {
    // Add dashes to cover the width
    line += '-';
  }
  console.log(line);
}

// create vertical line
cli.verticalSpace = (lines) => {
  lines = typeof(lines) === 'number' && lines > 0 ? lines : 1;

  for(i = 0; i < lines; i++) {
    console.log('');
  }
}

cli.centered = (str) => {
  str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  const width = process.stdout.columns;

  // Calculate the center of the screen
  const leftPadding = Math.floor(width - str.length / 2);
  // Put in left padded spaces before the string itself
  let line = '';
  for (i = 0; i < leftPadding; i++) {
    line+=' ';
  }

  line+= str;
  console.log(line);
}

cli.processInput = function(str) {
  str = typeof(str) === 'string' && str.trim().length > 0  ? str.trim() : false ;

  if(str) {
     let commands = [
      'man',
      'help',
      'exit',
      'items',
      'list users',
      'more user info',
      'list orders',
      'more order info',
     ];

     let matchFound = false;
     commands.some((input) => {
       if(input.toLowerCase().indexOf(str) > -1) {
           matchFound = true;
           e.emit(input, str);
           return true;
       }
     });

     // If no match is found, tell the user to try again
    if(!matchFound){
      console.log("Sorry, try again");
    }
  }
}

cli.init = function() {
    let interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '#'
    });

    interface.prompt();
    
    interface.on('line', (str) => {
    //   console.log("Data", str);
      cli.processInput(str);
      interface.prompt();
    });

    interface.on('close', () => {
      process.exit(0);
    });
}

module.exports = cli;