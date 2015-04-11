var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var switchSchema = new Schema({
    elementID : String,
    dataID  : String,
    group  : String
});

mongoose.model( 'switches',switchSchema );

mongoose.connect( 'mongodb://localhost/nodejs' );