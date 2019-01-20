const readline = require('readline');
const items = require('./items');
const events = require('events');
const _data = require('./data');
class _events extends events {};
let e = new _events();

e.on('exit', () => {
  cli.responders.exit();
}); 

e.on('help', () => {
  cli.responders.help();
});

e.on('man', () => {
  cli.responders.help();
});

e.on('items', () => {
  cli.responders.items();
});

e.on('list users', () => {
  cli.responders.listUsers();
});

e.on('more user info', (str) => {
  cli.responders.moreUserInfo(str);
});

let cli = {};

cli.responders = {};

cli.responders.exit = () => {
  process.exit(0);
};

cli.responders.help = () => {
  // commands and their explanations
  const commands = {
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'items' : 'Get list of items',
    'List users' : 'Show a list of all the registered (undeleted) users in the system',
    'More user info --{userId}' : 'Show details of a specified user',
    'List orders' : 'Show a list of all the orders made in the last 24 hours',
    'More order info --{userId}' : 'Show details of a specified order',
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  for(let key in commands) {
    if(commands.hasOwnProperty(key)){
      const value = commands[key];
      let line = '      \x1b[33m '+key+'      \x1b[0m';
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line +=' ';
      }
      line +=value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
};

// Items
cli.responders.items = () => {

  // Create a header for the items
  cli.centered('Items List');
  cli.horizontalLine();
  cli.horizontalLine();
  cli.verticalSpace(2);

  items.forEach((item) => {
    let line = '      \x1b[33m '+item.id+'      \x1b[0m';
      const padding = 60 - line.length;
      for(i = 0; i < padding; i++) {
        line += '';
      }
      line+=item.name;
      console.log(line);
      cli.verticalSpace();
  });


  // Create a footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();

};


// List Users
cli.responders.listUsers = () => {
  // get all the items in the user directory
  _data.list('users', (err, userIds) => {
    // Check if a valid data is returned
    if(!err && userIds && userIds.length > 0){
      cli.verticalSpace();
      userIds.forEach((userId) => {
        // check if the data file was created within the last 24 hours
        _data.createdTime('users', userId, (err, stats) => {
          if(!err && stats && stats < 24) {
            // retrieve the user data for the current user id
            _data.read('users', userId, (err, userData) => {
              // check if a valid userData was returned
              if(!err && userData){
                // add the userData to the line string
                let line = `Name: ${userData.userName} Address:  ${userData.userAddress} Email: ${userData.userEmail} Orders: `;
                const orders = typeof(userData.carts) == 'object' && userData.carts instanceof Array && userData.carts.length > 0 ? userData.carts.length : 0;
                line+=orders;
                console.log(line);
                cli.verticalSpace();
              }
            });
          }
        });
      });
    }
  });
};

// More user info
cli.responders.moreUserInfo = (str) => {
  // Get ID from string
  const arr = str.split('--'),
    userId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(userId){
    // Lookup the user
    _data.read('users', userId, (err,userData) => {
      if(!err && userData){
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(userData, { 'colors' : true });
        cli.verticalSpace();
      }
    });
  }
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
  const leftPadding = Math.floor((width - str.length) / 2);
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

  console.log(str);

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
       if(str.toLowerCase().indexOf(input) > -1) {
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