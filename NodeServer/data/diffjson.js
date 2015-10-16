

var jsondiffpatch = require('jsondiffpatch');
var fs = require('fs');

var newJson = fs.readFileSync("workOrderTestMod.js", 'utf8'); ;
var oldJson = fs.readFileSync("workOrder.js", 'utf8');


console.log(diffJson(oldJson, newJson));

function cleanJson (jsonString) {
     return JSON.parse(jsonString.replace(/wo_mstr\./g, '').replace(/wo_lot/g, 'id').replace(/\./g, '$'));
}

function diffJson(originalOne, newOne) {
    originalOne = cleanJson(originalOne);
    newOne = cleanJson(newOne);

    var diffpatcher = jsondiffpatch.create({
        objectHash: function (obj) {
            return obj.id;
        }
    });
   return diffpatcher.diff(originalOne, newOne);
}




