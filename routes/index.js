
/*
 * GET home page.
 */

var mongoose = require( 'mongoose' );
var busTimes = mongoose.model( 'bustimes' );
var Switch = mongoose.model( 'switches' );

/*var kingsA = [],
    kingsD = [],
    centralA =[]
busTimes.find({location:'kingsA'}, function ( err, bustimes, count ){
    var kingsA = bustimes

});*/


exports.index = function ( req, res ){
    Switch.find( function ( err, switches, count ){
        res.render( 'home', {
            title : 'Home Automation',
            switches : switches
        });
        console.log(switches);
    });
};


exports.create = function ( req, res ){
    console.log(JSON.stringify(req.body));
    console.log("THIS IS THE CREATE CALLBACK");
    new Switch({
        elementID : req.body.elementID,
        dataID  : req.body.dataID,
        group  : req.body.group
    }).save( function( err, comment, count ){
            res.redirect( '/remote' );
        });
};

exports.delete = function ( req, res ){
    Switch.remove({elementID:req.body.elementID}, function( err, comment, count ){
        res.redirect( '/switches' );
    });
    console.log();
    console.log("Deleted: " + req.body.elementID);
    console.log();
};

exports.remote = function ( req, res ){
        res.render( 'remote', {
            title : 'Home Automation'
        });
};

exports.switches = function ( req, res ){
    Switch.find( function ( err, switches, count ){
        res.render( 'switches', {
            title : 'Home Automation',
            switches : switches
        });
    });
};

