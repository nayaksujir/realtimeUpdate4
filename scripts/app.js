
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: '----- Quantity Ordered ----- Quantity Received -----',
          initalize: InitializeGaugeAndDial
        },
        settings: {
          title: '',
          initalize: InitializeGrid
        },
        contacts: {
          title: '',
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

function InitializeGaugeAndDial() {
    InitializeDial("#dialLeft", 95000);

    InitializeDial("#dialRight", 43000);
}


function InitializeDial(dialName, initialValue) {

    $(dialName).kendoRadialGauge({
        pointer:        
          [{
              //RED
              value: initialValue,
              color: "#c20000",
              cap: { size: 0.15 }
          }, {
              //ORANGE
              value: 175000,
              color: "#ff7a00",
              cap: { size: 0.1 }
          }, {
              //YELLOW
              value: 125000,
              color: "#ffc700"
          }],
        theme: "black",
        scale: {
            majorUnit: 50000,
            minorUnit: 10000,
            min: 0,
            max: 200000,
            vertical: true,
//            ranges: [
//                          {
//                              from: 0,
//                              to: 125000,
//                              color: "#22ff00"
//                          }, {
//                              from: 125000,
//                              to: 175000,
//                              color: "#fff700"
//                          }, {
//                              from: 175000,
//                              to: 200000,
//                              color: "#c20000"
//                          }
//                      ]
        }
    });
}





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

    $("#grid").kendoGrid({
        height: 550,
        //autoBind: false,
        editable: true,
        sortable: true,
        columns: [
            { field: "id", title: "ID" },
            { field: "wo_seq", title: "Sequence" },
            { field: "wo_qty_ord", title: "Quantity" },
            { field: "wo_qty_comp", title: "Complete" }
        ],
        dataSource: {
            // Handle the push event to display notifications when push updates arrive
            //data: products,
            push: function (e) {
                //var notification = $("#notification").data("kendoNotification");
                //notification.success("success");
            },
            //autoSync: true,
            schema: {

                model: {
                    id: 'id',
                    fields: {
                        'wo_seq': { type: "number" },
                        'wo_qty_ord': { type: "number" },
                        'wo_qty_comp': { type: "number" }
                    }
                }
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

