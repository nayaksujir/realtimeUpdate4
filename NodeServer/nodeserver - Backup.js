var express = require( 'express' );
var app = express();
app.use(express.static(__dirname));
var fs = require('fs');


var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );

// Store data
var stats = {
  id: 0,
  connections: 0,
  touch: 0,
  video: 0,
  pages: {}
};

var workOrderJson = JSON.parse(fs.readFileSync("data/workOrder.js", 'utf8'));
var workOrderJson = workOrderJson.data;
var stringifiedWorkOrder = JSON.stringify(workOrderJson);
workOrderJson = JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, ''));

var workOrderJsonOne = JSON.parse(fs.readFileSync("data/workOrderTestMod.js", 'utf8'));
//var workOrderJsonOne = JSON.parse(fs.readFileSync("data/workOrder - OneWO.js", 'utf8'));

var workOrderJsonOne = workOrderJsonOne.data;
var stringifiedWorkOrder = JSON.stringify(workOrderJsonOne);
workOrderJsonOne = JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, ''));

var workOrderJsonTwo = JSON.parse(fs.readFileSync("data/workOrder - TwoWO.js", 'utf8'));
var workOrderJsonTwo = workOrderJsonTwo.data;
var stringifiedWorkOrder = JSON.stringify(workOrderJsonTwo);
workOrderJsonTwo = JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, ''));

console.log(workOrderJsonOne);

var initialStatsArray =
[
 { id: 0, connections: 0, touch: 0, video: 0, pages: {} },
 { id: 1, connections: 0, touch: 33, video: 0, pages: {} },
 { id: 2, connections: 0, touch: 44, video: 1, pages: {} },
 { id: 3, connections: 0, touch: 55, video: 0, pages: {} },
 { id: 4, connections: 0, touch: 99, video: 1, pages: {} },
 ]

//var workOrderArray =
//[
// { wo_nbr: "AAA", wo_status: "R", wo_seq: 2 },
// { wo_nbr: "BBB", wo_status: "E", wo_seq: 1 },
// { wo_nbr: "CCC", wo_status: "A", wo_seq: 3 }
// ]

//var workOrderArray =
//[
// { wo_mstr.wo_nbr: "AAA", wo_mstr.wo_status: "R", wo_mstr.wo_seq: 2 },
// { wo_mstr.wo_nbr: "BBB", wo_mstr.wo_status: "E", wo_mstr.wo_seq: 1 },
// { wo_mstr.wo_nbr: "CCC", wo_mstr.wo_status: "A", wo_mstr.wo_seq: 3 }
// ]

 var uniqueID = 0;
// Map of Socket.id to Socket object
var socketData = {};

// Namespace use when capturing data
var capture = io.of('/capture');
//var capture2 = io.of('/capture2');

//capture2.on('connection', function (socket) {
//    console.log("Caaaaaputure 2222222");
//    socket.on('status-updated', function (data) {
//        console.log("Emitting to consumer from Capture2222");
//        consumer.emit('stats-updated', stats);
//    });
//});


capture.on('connection', function (socket) {
    ++stats.connections;

    socket.on('client-data', function (data) {
        socketData[socket.id] = data;
        stats.id = uniqueID++ % 5;



        stats.touch += (data.touch ? 1 : 0);
        stats.video += (data.video ? 1 : 0);

        var pageCount = stats.pages[data.url] || 0;
        stats.pages[data.url] = ++pageCount;

        console.log(stats);
       // consumer.emit('stats-updated', stats);

        //        if (uniqueID < 5)
        //            consumer.emit('create', stats);
        //        else {



        //workOrderJsonOne[1].wo_seq = uniqueID;


        stats.touch = 1;
        //consumer.emit('update', stats);
        if (uniqueID % 2 == 0) {
            workOrderJsonOne[0].wo_seq = uniqueID;
            console.log("emitted for " + workOrderJsonOne[0].wo_lot + "Seq:" + workOrderJsonOne[0].wo_seq);
            consumer.emit('update', workOrderJsonOne);

        }
        else {
            workOrderJsonTwo[0].wo_seq = uniqueID;
            console.log("emitted for " + workOrderJsonTwo[0].wo_lot + "Seq:" + workOrderJsonTwo[0].wo_seq);
            consumer.emit('update', workOrderJsonTwo);
        }


        //        }
    });

    socket.on('disconnect', function () {
        // Clear down stats for lost socket
        // comment this line if you want to see more grid rows
        --stats.connections;

        stats.touch -= (socketData[socket.id].touch ? 1 : 0);
        stats.video -= (socketData[socket.id].video ? 1 : 0);
        --stats.pages[socketData[socket.id].url];
        delete socketData[socket.id];

        console.log(stats);
        //consumer.emit('stats-updated', stats);
    });

});

var consumer = io.of( '/consumer' );
consumer.on('connection', function (socket) {
    //socket.emit( 'create', initialStatsArray );    
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
