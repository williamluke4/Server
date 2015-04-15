var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var switchSchema = new Schema({
    elementID : String,
    dataID  : String,
    group  : String
});

var bustimeSchema = new Schema({
    location  : String,
    time : String

});

mongoose.model( 'switches',switchSchema );
mongoose.model( 'bustimes',bustimeSchema );

mongoose.connect( 'mongodb://localhost/nodejs' );