const readline = require('readline');

let cli = {};

cli.init = function() {
    let interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '#'
    });

    interface.prompt();
    
    interface.on('line', (str) => {
      console.log("Data", str);
      interface.prompt();
    });

    interface.on('close', () => {
      process.exit(0);
    });
}

module.exports = cli;