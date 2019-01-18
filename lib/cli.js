const readline = require('readline');
const events = require('events');
class _events extends events {}
let e = new _events();

let cli = {};

cli.processInput = function(str) {
  str = typeof(str) === 'string' && str.trim().length > 0  ? str.trim() : false ;

  if(str) {
     let commands = [
       'man',
       'help',
       'get user',
       'list users'
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