'use strict';
require( './db' ); //for mongoose. Require this first!!!

var Promise = global.Promise || require('promise');

var express = require('express'),
    exphbs  = require('./index.js'), // "express-handlebars"
    socket  = require('socket.io'),
    exec = require('child_process'),
    routes = require('./routes'),
    bodyParser = require('body-parser');


var app = express();

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',


    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ]
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var port = 3700;

//app.enable('view cache');
// Middleware to expose the app's shared templates to the cliet-side of the app
// for pages which need them.
function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('shared/templates/', {
        cache      : app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegex = new RegExp(hbs.extname + '$');

        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }

        setImmediate(next);
    })
    .catch(next);
}




app.get('/', routes.index);
app.get('/remote', routes.remote);
app.get('/switches', routes.switches);
app.post( '/create', routes.create );
app.post('/delete',routes.delete);
app.post('/8315',function(req,res){
    console.log("Sending The Message")
    sendMessage(8315,false,false,false,false)
});
app.use(express.static('public/'));

function sendMessage(message, socket, elementID, webState,callback){
    exec.execFile('../remote',
                ['-m', message],
                function (error, stdout, stderr) {
                    console.log("The message is: " + message);
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if( stdout.indexOf("RECIVED:") > -1 && callback == true){
                        var state = stdout.split('RECIVED: ')[1].split('.')[0];
                        console.log("Sending Message Back To Client");
                        socket.emit(
                            "callbackButton",
                            {
                                webstate: webState,
                                message: "received",
                                operation: message,
                                state: state,
                                switchID: elementID

                            });
                    }

                    else if(stdout.indexOf("NO REPLY") > -1 && callback == true) {
                        console.log('NO REPLY' + elementID + ' ' + webState);
                    
                        socket.emit(
                            "failed", 
                            {   
                                webstate: webState,
                                switchID: elementID
                            });
                    
                    }

                    if (error !== null && callback == true) {
                        console.log('exec error: ' + error );
                    
                        socket.emit(
                            "callbackError", 
                            {
                                webstate: webState,
                                error: error,
                                switchID: elementID

                            });
                    
                    }

                    
                });
}






var io = socket.listen(app.listen(port));
io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {

        sendMessage(data.message, socket, data.switchID, data.webstate, true);

    });
});
console.log("-----------------------------");
console.log("Server Started Port: " + port);
console.log("-----------------------------");

