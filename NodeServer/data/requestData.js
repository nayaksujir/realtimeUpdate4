var debug = false;

var request = require('request');
var jsondiffpatch = require('jsondiffpatch');
var fs = require('fs');
var io = require('socket.io-client');
var refreshFileName = "workOrderTestMod.js";
var refreshURL = "https://yab.qad.com:443/hackathon/api/qracore/browses?browseId=mfg%3Awo003&filter=wo_mstr.wo_due_date%2Ceq%2C2015-04-18T00%3A00%3A00.000Z%2C";
var oldJson;
var newJson;
var options = {
    url: 'https://yab.qad.com:443/hackathon/api/qracore/browses?browseId=mfg%3Awo003&filter=wo_mstr.wo_due_date%2Ceq%2C2015-04-18T00%3A00%3A00.000Z%2C',  
    headers: { 'Authorization': 'Basic bWZnOgo=' }  
};


var initialJsonText = fs.readFileSync("workOrder.js", 'utf8');
var socket = io('http://localhost:3000/dataupdate');
var dataUpdatePacket = { 
        orderQtyDelta: 0,
        completedQtyDelta: 0,
        updatedWorkOrder: ''        
    };



//    function socketEmit(dataUpdatePacket) {
//        socket.emit('status-updated', dataUpdatePacket);
//    }

function cleanJson (jsonString) {
    return JSON.parse(jsonString.replace(/wo_mstr\./g, '').replace(/wo_lot/g, 'id').replace(/\./g, '$')).data;
}

function diffJson(originalOne, newOne) {
    //console.log(newOne);
    //console.log("=========================================");
    //console.log(originalOne);

    var diffpatcher = jsondiffpatch.create({
        objectHash: function (obj) {
            return obj.id;
        }
    });
   return diffpatcher.diff(originalOne, newOne);
}

function calculateQtyDeltaForChange(jsonChange, fieldName) {
    if (jsonChange.hasOwnProperty(fieldName)) {
        var beforeValue = jsonChange[fieldName][0];
        var afterValue = jsonChange[fieldName][1];
        return (afterValue - beforeValue);        
    }
}

function diffExamine(diffDelta) {
    var orderQtyDelta = 0;
    var completedQtyDelta = 0;
    var updatedWorkOrder = "";
    console.log("Difference is " + diffDelta);

    if (undefined == diffDelta)
        return;

    delete diffDelta["_t"];    
    var keys = Object.keys(diffDelta);
    for (var i = 0, length = keys.length; i < length; i++) {
        //console.log(keys[i]);
        

        //console.log(newJson[Number(keys[i])]);

        var woIndex = Number(keys[i]);
        var changedWorkOrder = newJson[woIndex];
        var change = diffDelta[keys[i]];

//        console.log(woIndex);
//        console.log(changedWorkOrder);
        console.log(change);
        if (change.hasOwnProperty("wo_qty_ord")) {
            orderQtyDelta = calculateQtyDeltaForChange(change, "wo_qty_ord");
        }

       if (change.hasOwnProperty("wo_qty_comp")) {
           completedQtyDelta = calculateQtyDeltaForChange(change, "wo_qty_comp");
       }
   }
   if (completedQtyDelta != 0 || orderQtyDelta != 0) {
       dataUpdatePacket.orderQtyDelta = orderQtyDelta;
       dataUpdatePacket.completedQtyDelta = completedQtyDelta;
       dataUpdatePacket.updatedWorkOrder = JSON.stringify(changedWorkOrder);
       console.log("Emitting packet: " + dataUpdatePacket);
       socket.emit('dataUpdate', dataUpdatePacket);
   }
         
}


function callLocalRead() {

    fs.readFile(refreshFileName, 'utf8', function (error, body) {

        if (error) throw error;
        console.log("New Json is" + newJson);
        if (undefined != oldJson) {
            //console.log(diffJson(oldJson, newJson));
            newJson = cleanJson(body);
            diffExamine(diffJson(oldJson, newJson));
        }
        oldJson = newJson;
        console.log("Waiting...........................");
        
        //setTimeout(callLocalRead(), 10000);
    });
}


function callREST() {
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            newJson = cleanJson(body);
            if (undefined != oldJson) {
                //console.log(diffJson(oldJson, newJson));
                diffExamine(diffJson(oldJson, newJson));
            }
            oldJson = newJson;
            console.log("Waiting...........................");
            setTimeout(callREST());
        }
    });     
}

if (debug) {
    oldJson = cleanJson(initialJsonText);
    callLocalRead();
}
else
    callREST();



//request(options, callback);

//console.log("eee" + JSON.stringify(request(options)));
//console.log("fff" + JSON.stringify(readREST(refreshURL)));
//workOrderJsonLatest = refreshData();
//console.log("aaa" + JSON.stringify(workOrderJsonLatest)); 

//process.exit();

//var workOrderJsonOld = modifyJson("workOrder.js");


//var workOrderJsonNew = modifyJson("workOrderTestMod.js");
//var diffpatcher = jsondiffpatch.create({
//    objectHash: function (obj) {
//        return obj.id;
//    }
//});




//var delta = diffpatcher.diff(workOrderJsonOld, workOrderJsonNew);
//console.log(delta);







//Dead code
//    for (var i = 0; i < workOrderJson.length; i++) {
//        delete workOrderJson[i]["local_variables.local-var02"];
//        delete workOrderJson[i]["local_variables.BrowseRowOrderIndex"];
//        delete workOrderJson[i]["local_variables.uniqueId"];
//        delete workOrderJson[i]["local_variables.decoration_cell"];
//        delete workOrderJson[i]["local_variables.local-var04"];
//    }

//request(options, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        info = JSON.parse(body);

//        console.log("bb" + JSON.stringify(info.data));  //output correctly
//        info = JSON.stringify(info.data);

//    }
//    else {
//        console.log(error);
//    }
//});


//console.log("cccc" + JSON.stringify(request(options))); ;
//    

//function readREST(url) {
//    options.url = url;
//    return request(options);
//}

//function readFile(fileName) {
//    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
//}

//function refreshData() {
//    if (!debug)

//        request(options, function (error, response, body) {
//        
//        }
//        return modifyJson(readREST(refreshURL));
//    else
//        return modifyJson(readFile(refreshFileName));
//}

//function modifyJson(workOrderJson) {
//    var stringifiedWorkOrder = JSON.stringify(workOrderJson);
//    console.log("ccc" + stringifiedWorkOrder);
//    return JSON.parse(stringifiedWorkOrder.replace(/wo_mstr\./g, '').replace(/wo_lot/g, 'id').replace(/\./g, '$'));
//}

