
/*
 * GET users listing.
 */
var http = require('http');

exports.address = function(req, res){
    //res.send("respond with a resource " + req.query.search);

    var query = req.query.search.split(',').toString().trim();


    var options =
    {
        host: '192.168.1.30',
        port: '8088',
        path:encodeURI('/content/address/select/?qt=autocomplete_address&wt=json&fl=nome_completo, tipo, score&q='+req.query.search),

    };
    console.log(req.query.search);
    var request = http.get(options,function (data) {
        console.log('hahahahaha')

        var textdata = '';
        data.on('data',function (chunk){
            textdata +=chunk;

        });


        data.on('end',function(err){
            console.log(JSON.parse(textdata)['response']['docs']);
            //data.send(JSON.parse(textdata)['response']['docs']);
            res.writeHead(200,{"Content-Type":"application/json"});
            res.write(JSON.stringify(JSON.parse(textdata)['response']['docs']));
            res.end();
        });
    });

};