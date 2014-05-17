var express = require('express')
  , app = express()
  , fs = require('fs')
  , path = require('path')
  , server = require("http").createServer(app)
  , io = require('socket.io').listen(server)
  , arDrone = require('ar-drone')
  , arDroneConstants = require('ar-drone/lib/constants')
  , ncp = require('ncp').ncp
  ;

// Fetch configuration
try {
    var config = require('./config');
} catch (err) {
    console.log("Missing or corrupted config file. Have a look at config.js.example if you need an example.");
    process.exit(-1);
}


// Override the drone ip using an environment variable,
// using the same convention as node-ar-drone
var drone_ip = process.env.DEFAULT_DRONE_IP || '192.168.1.1';

// Keep track of plugins js and css to load them in the view
var scripts = []
  , styles = []
  ;

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs', { pretty: true });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use("/components", express.static(path.join(__dirname, 'bower_components')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
    app.locals.pretty = true;
});

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Express'
        ,scripts: scripts
        ,styles: styles
        ,options: {
          keyboard: config.keyboard
        }
    });
});

function navdata_option_mask(c) {
  return 1 << c;
}

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
);

// Connect and configure the drone
var client = new arDrone.createClient({timeout:4000});
client.config('general:navdata_demo', 'TRUE');
client.config('video:video_channel', '0');
client.config('general:navdata_options', navdata_options);

// Add a handler on navdata updates
var latestNavData;
client.on('navdata', function (d) {
    latestNavData = d;
});

// Signal landed and flying events.
client.on('landing', function () {
  console.log('LANDING');
  io.sockets.emit('landing');
});
client.on('landed', function () {
  console.log('LANDED');
  io.sockets.emit('landed');
});
client.on('takeoff', function() {
  console.log('TAKEOFF');
  io.sockets.emit('takeoff');
});
client.on('hovering', function() {
  console.log('HOVERING');
  io.sockets.emit('hovering');
});
client.on('flying', function() {
  console.log('FLYING');
  io.sockets.emit('flying');
});

// Process new websocket connection
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  socket.emit('event', { message: 'Welcome to cockpit :-)' });
});

// Schedule a time to push navdata updates
var pushNavData = function() {
    io.sockets.emit('navdata', latestNavData);
};
var navTimer = setInterval(pushNavData, 100);

// Prepare dependency map for plugins
var deps = {
    server: server
  , app: app
  , io: io
  , client: client
  , config: config
};


// Load the plugins
var dir = path.join(__dirname, 'plugins');
function getFilter(ext) {
    return function(filename) {
        return filename.match(new RegExp('\\.' + ext + '$', 'i'));
    };
}

config.plugins.forEach(function (plugin) {
    console.log("Loading " + plugin + " plugin.");

    // Load the backend code
    require(path.join(dir, plugin))(plugin, deps);

    // Add the public assets to a static route
    if (fs.existsSync(assets = path.join(dir, plugin, 'public'))) {
      app.use("/plugin/" + plugin, express.static(assets));
    }

    // Add the js to the view
    if (fs.existsSync(js = path.join(assets, 'js'))) {
        fs.readdirSync(js).filter(getFilter('js')).forEach(function(script) {
            scripts.push("/plugin/" + plugin + "/js/" + script);
        });
    }

    // Add the css to the view
    if (fs.existsSync(css = path.join(assets, 'css'))) {
        fs.readdirSync(css).filter(getFilter('css')).forEach(function(style) {
            styles.push("/plugin/" + plugin + "/css/" + style);
        });
    }
});

////////////////////////////////
////////////////////////////////
////////////////////////////////

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({'server':server});

var mySocket = undefined;

wss.on('connection', function(ws){

	ws.on('message',function(msg){
		myPort.write(msg);
	});

	ws.on('close',function(){
		mySocket = undefined;
	});

	mySocket = ws;
} );

////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////

var serialport = require('serialport');
var myPortName = '/dev/tty.usbmodemfd131';
// var arDrone = require('ar-drone');
// var client = arDrone.createClient();

// serialport.list( function(error,ports){
// 	console.log(ports);
// });

var options = {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n')
};

var myPort = new serialport.SerialPort( myPortName , options);

myPort.on('open',function(){
	console.log('yay! it is open!');
});

//var value = "";

var buttonLog = [];

myPort.on('data', function(mySensorValues) {
  console.log("NEW DATA:" + mySensorValues);

  buttonLog.push(mySensorValues);
  console.log("array length:" + buttonLog.length);

  if (buttonLog.length === 9) {

  //for (var i in mySensorValues) {
    //var c = mySensorValues[i];
    //if (c == 'n') {
      //console.log("NEW VALUE:" + value);
      //if(mySocket) {
      //  mySocket.send(value);
        //if (parseFloat(value) > 1000) {
          

          client.takeoff();

          console.log('taking off');

          client.after(3000, function(){
            this.land(); 

              var gifdir = fs.readdirSync('./gif') // READ GIF DIR

              var count = gifdir.length + 1; //COUNT FOLDERS IN GIF DIR AND INCREMENT +1
              console.log(count.length);

              fs.mkdir(count.toString());

                //COPY FROM PNG SOURCE FOLDER TO GIF+1 ON BUTTONPRESS
                ncp.limit = 16;

                ncp("./png", "./gif/" + count, function (err) {
                 if (err) {
                   return console.error(err);
                 }
                 console.log('done!');
                });


          });

          } else if (buttonLog.length >= 9) {

            buttonLog = [];

          }
          else { console.log ("else"); 

        };
        });

    //  value = "";
    //} else {
    //  value = value + c;
    //}
  //}

////////////////////////////////
////////////////////////////////
////////////////////////////////

// Start the web server
server.listen(app.get('port'), function() {
  console.log('AR. Drone WebFlight is listening on port ' + app.get('port'));
});
