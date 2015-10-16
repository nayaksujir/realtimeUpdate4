
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: 'Home',
          initalize: InitializeGauge
        },
        settings: {
          title: 'Settings',
          initalize: InitializeGrid
        },
        contacts: {
          title: 'Contacts',
          ds: new kendo.data.DataSource({
              data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }, { id: 4, name: 'Shilpa'}]
          }),
          alert: function(e) {
            alert(e.data.name);
          }
        }
      }
    };


    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();

      app = new kendo.mobile.Application(document.body, {

        // you can change the default transition (slide, zoom or fade)
        transition: 'slide',

        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'flat',

        // the application needs to know which view to load first
        initial: 'views/home.html'
      });

    }, false);


} ());

function InitializeGrid() {
    var gridInitialized = false;

    var consumer = io('http://127.0.0.1:3000/consumer');
    
    
    consumer.on('connected', function (update) {
        
        if(gridInitialized) {
            return;
        }
        
        gridInitialized = true;
        consumer.emit("getFullData");
    });

//    var host = "wss://kendoui-ws-demo.herokuapp.com";
//    var ws = new WebSocket(host);


    //Bind the grid when the socket connects
    //        ws.onopen = function () {
    //            $("#grid").data("kendoGrid").dataSource.fetch();
    //        };

    //Close the socket when the browser window is closed.
//    window.onbeforeunload = function () {
//        ws.close();
//    }

    //Helper function to send data through the socket
//    function send(ws, request, callback) {
//        if (ws.readyState != 1) {
//            alert("Socket was closed. Please reload the page.");
//            return;
//        }

//        //Assign unique id to the request. Will use that to distinguish the response.
//        request.id = kendo.guid();

//        //Listen to the "message" event to get server response
//        ws.addEventListener("message", function (e) {
//            var result = JSON.parse(e.data);

//            //Check if the response is for the current request
//            if (result.id == request.id) {
//                //Stop listening
//                ws.removeEventListener("message", arguments.callee);

//                //Invoke the callback with the result
//                callback(result);
//            }
//        });

//        //Send the data to the server
//        ws.send(JSON.stringify(request));
//    }

    // $("#notification").kendoNotification({
    //     width: "100%",
    //     position: {
    //         top: 0,
    //         left: 0
    //     }
    // });

    $("#grid").kendoGrid({
        height: 550,
        //autoBind: false,
        editable: true,
        sortable: true,
                columns: [
                            { field: "wo_lot", title: "ID" },
                            { field: "wo_seq", title: "Sequence" },
                            { field: "wo_qty_ord", title: "Quantity" },
                            { field: "wo_qty_comp", title: "Complete" }
                        ],
//        columns: [
//                    { field: "wo_mstr.wo_lot", title: "Number" },
//                    { field: "wo_mstr.wo_status", title: "Status" },
//                    { field: "wo_mstr.wo_seq", title: "Sequence" }
//                ],
//        columns: [
//                    { field: "wo_mstr-wo_lot", title: "Number" },
//                    { field: "wo_mstr-wo_status", title: "Status" },
//                    { field: "wo_mstr-wo_seq", title: "Sequence" }
//                ],

        dataSource: {



            // Handle the push event to display notifications when push updates arrive
            //data: products,
            push: function (e) {
                //var notification = $("#notification").data("kendoNotification");
                //notification.success("success");
            },
            //autoSync: true,
            schema: {


//                model: {
//                    fields: {
//                        "connections": { type: "number" },
//                        "touch": { type: "number" },
//                        "video": { type: "number" }
//                    }
//                }

                                model: {
                                    id: 'id',
                                    fields: {
                                        'wo_seq': { type: "number" },
                                        'wo_qty_ord': { type: "number" },
                                        'wo_qty_comp': { type: "number" },
                                    }
                                }

//                                model: {
//                                    fields: {
//                                        'wo_mstr.wo_lot': { type: "string" },
//                                        'wo_mstr.wo_status': { type: "string" },
//                                        'wo_mstr.wo_seq': { type: "number" }
//                                    }
//                                }

//                                model: {
//                                    fields: {
//                                        'wo_mstr-wo_lot': { type: "string" },
//                                        'wo_mstr-wo_status': { type: "string" },
//                                        'wo_mstr-wo_seq': { type: "number" }
//                                    }
//                                }


            },

            sort: { field: "id", dir: "asc" },

            transport: {
                push: function (callbacks) {
                    console.log(callbacks);
                    consumer.on("create", function (result) {
                        console.log(result);
                        console.log("push create");
                        callbacks.pushCreate(result);

                    });
                    consumer.on("update", function (result) {
                        console.log("push update");
                        console.log(result);
                        callbacks.pushUpdate(result);
                    });
                    consumer.on("destroy", function (result) {
                        console.log("push destroy");
                        callbacks.pushDestroy(result);
                    });
                },
                read: function () {
                }
            }
        }
    });
}



function InitializeGridWorking() {

    $("#grid").kendoGrid({
        dataSource: {
            data: products,
            //            transport: {
            //                push: function (callbacks) {
            //                    //                    hub.on("create", function (result) {
            //                        console.log("push create");
            //                        callbacks.pushCreate(result);
            //                    });
            //                    hub.on("update", function (result) {
            //                        console.log("push update");
            //                        callbacks.pushUpdate(result);
            //                    });
            //                    hub.on("destroy", function (result) {
            //                        console.log("push destroy");
            //                        callbacks.pushDestroy(result);
            //                    });
            //                }
            //            },
            schema: {
                model: {
                    fields: {
                        ProductName: { type: "string" },
                        UnitPrice: { type: "number" },
                        UnitsInStock: { type: "number" },
                        Discontinued: { type: "boolean" }
                    }
                }
            },
            pageSize: 20
        },
        height: 550,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
                            "ProductName",
                            { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
                            { field: "UnitsInStock", title: "Units In Stock", width: "130px" },
                            { field: "Discontinued", width: "130px" }
                        ]
    });
}





function InitializeGridSignalR() {

    var hubUrl = "http://demos.telerik.com/kendo-ui/service/signalr/hubs";
    var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
    var hub = connection.createHubProxy("productHub");
    var hubStart = connection.start({ jsonp: true });

    hubStart.done(function () {
        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    push: function (callbacks) {
                        hub.on("create", function (result) {
                            console.log("push create");
                            callbacks.pushCreate(result);
                        });
                        hub.on("update", function (result) {
                            console.log("push update");
                            callbacks.pushUpdate(result);
                        });
                        hub.on("destroy", function (result) {
                            console.log("push destroy");
                            callbacks.pushDestroy(result);
                        });
                    },
                    read: function (options) {
                        hub.invoke("read", { type: "read" }).done(function (result) {
                            options.success(result);
                        });
                    },
                    update: function (options) {
                        hub.invoke("update", options.success);
                    },
                    destroy: function (options) {
                        hub.invoke("destroy", options.success);
                    },
                    create: function (options) {
                        hub.invoke("create", options.success);
                    }
                },
                schema: {
                    model: {
                        fields: {
                            ProductName: { type: "string" },
                            UnitPrice: { type: "number" },
                            UnitsInStock: { type: "number" },
                            Discontinued: { type: "boolean" }
                        }
                    }
                }
            },
            height: 550,
            scrollable: true,
            sortable: true,
            filterable: true,
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                           "ProductName",
                           { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
                           { field: "UnitsInStock", title: "Units In Stock", width: "130px" },
                           { field: "Discontinued", width: "130px" }
                       ]
        });
    });
}





function InitializeGauge() {

    //var value = $("#gauge-value").val();
    //var dashboard = io('localhost:3000/dashboard')
    $("#gauge").kendoLinearGauge({
        pointer: {
            value: 10
        },

        scale: {
            majorUnit: 20,
            minorUnit: 2,
            min: -40,
            max: 60,
            vertical: true,
            ranges: [
                          {
                              from: -40,
                              to: -20,
                              color: "#2798df"
                          }, {
                              from: 30,
                              to: 45,
                              color: "#ffc700"
                          }, {
                              from: 45,
                              to: 60,
                              color: "#c20000"
                          }
                      ]
        }
    });
}
