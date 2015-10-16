function callREST() {
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            setTimeout(callREST(), 1000);
        }        
    });     
}

callREST();




