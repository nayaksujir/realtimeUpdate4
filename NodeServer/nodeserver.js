var express = require( 'express' );
var app = express();
app.use(express.static(__dirname));
var fs = require('fs');
var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );

function cleanJson(jsonString) {
    return JSON.parse(jsonString.replace(/wo_mstr\./g, '').replace(/wo_lot/g, 'id').replace(/\./g, '$')).data;
}



var workOrderJson = cleanJson(fs.readFileSync("data/workOrder.js", 'utf8'));
//var workOrderJson = workOrderJson.data;
//var stringifiedWorkOrder = JSON.stringify(workOrderJson);
//workOrderJson = JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, '').replace(/wo_lot/g, 'id').replace(/\./g, '$'));

// Map of Socket.id to Socket object
var socketData = {};

// Namespace use when capturing data
var capture2 = io.of('/dataupdate');
capture2.on('connection', function (socket) {
    socket.on('dataUpdate', function (data) {
        console.log(data);
        consumer.emit('dataUpdate', data);
    });

    socket.on('disconnect', function () {
        delete socketData[socket.id];
        console.log("Disconnected");
    });

});


var consumer = io.of( '/consumer' );
consumer.on('connection', function (socket) {
    socket.on("getFullData", function() {
        socket.emit('create', workOrderJson);
    });    
    socket.emit("connected");
});

consumer.on('reconnect', function(socket) {
   console.log("!!!!!RECCONECT"); 
});

server.listen( 3000, function(){
  console.log( 'listening on *:3000' );
} );







////////////  delete below when done copying


//var uniqueID = 0;

//// Store data
//var stats = {
//    id: 0,
//    connections: 0,
//    touch: 0,
//    video: 0,
//    pages: {}
//};
//var workOrderJsonOne = JSON.parse(fs.readFileSync("data/workOrderTestMod.js", 'utf8'));
////var workOrderJsonOne = JSON.parse(fs.readFileSync("data/workOrder - OneWO.js", 'utf8'));

//var workOrderJsonOne = workOrderJsonOne.data;
//var stringifiedWorkOrder = JSON.stringify(workOrderJsonOne);
//workOrderJsonOne = JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, ''));

//var workOrderJsonTwo = JSON.parse(fs.readFileSync("data/workOrder - TwoWO.js", 'utf8'));
//var workOrderJsonTwo = workOrderJsonTwo.data;
//var stringifiedWorkOrder = JSON.stringify(workOrderJsonTwo);
//workOrderJsonTwo = JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, ''));

//console.log(workOrderJsonOne);

//var initialStatsArray =
//[
// { id: 0, connections: 0, touch: 0, video: 0, pages: {} },
// { id: 1, connections: 0, touch: 33, video: 0, pages: {} },
// { id: 2, connections: 0, touch: 44, video: 1, pages: {} },
// { id: 3, connections: 0, touch: 55, video: 0, pages: {} },
// { id: 4, connections: 0, touch: 99, video: 1, pages: {} },
// ]


//var capture = io.of('/capture');

//capture.on('connection', function (socket) {
//    ++stats.connections;

//    socket.on('client-data', function (data) {
//        socketData[socket.id] = data;
//        stats.id = uniqueID++ % 5;



//        stats.touch += (data.touch ? 1 : 0);
//        stats.video += (data.video ? 1 : 0);

//        var pageCount = stats.pages[data.url] || 0;
//        stats.pages[data.url] = ++pageCount;

//        console.log(stats);
//        // consumer.emit('stats-updated', stats);

//        //        if (uniqueID < 5)
//        //            consumer.emit('create', stats);
//        //        else {



//        //workOrderJsonOne[1].wo_seq = uniqueID;


//        stats.touch = 1;
//        //consumer.emit('update', stats);
//        if (uniqueID % 2 == 0) {
//            workOrderJsonOne[0].wo_seq = uniqueID;
//            console.log("emitted for " + workOrderJsonOne[0].wo_lot + "Seq:" + workOrderJsonOne[0].wo_seq);
//            consumer.emit('update', workOrderJsonOne);

//        }
//        else {
//            workOrderJsonTwo[0].wo_seq = uniqueID;
//            console.log("emitted for " + workOrderJsonTwo[0].wo_lot + "Seq:" + workOrderJsonTwo[0].wo_seq);
//            consumer.emit('update', workOrderJsonTwo);
//        }


//        //        }
//    });

//    socket.on('disconnect', function () {
//        // Clear down stats for lost socket
//        // comment this line if you want to see more grid rows
//        --stats.connections;

//        stats.touch -= (socketData[socket.id].touch ? 1 : 0);
//        stats.video -= (socketData[socket.id].video ? 1 : 0);
//        --stats.pages[socketData[socket.id].url];
//        delete socketData[socket.id];

//        console.log("Disconnected");
//        consumer.emit('stats-updated', stats);
//    });

//});