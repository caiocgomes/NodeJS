var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var url = require("url");
var AWS = require("aws-sdk");
var http = require("http");

AWS.config.loadFromPath('./cred.json');


AWS.config.update({region:'sa-east-1'});


function start(response) { 
	console.log("Request handler 'start' was called.");


    var body = '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
'</form>'
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response,request){
	console.log("Request handler 'upload was called");

	var form = new formidable.IncomingForm();

	console.log("about to parse");
	var s3 = new AWS.S3();
	





	form.parse(request, function(error,fields,files) {
		console.log("parsing done");

		console.log("Start Upload S3")
		fs.readFile(files.upload.path, function (err, data) {


			var base64data = data
			
			console.log(files.upload.name);
			
			var param = {Bucket: 'images.caiogomes.com.br',Key :'images/'+files.upload.name,Body : base64data,ACL:'public-read',ContentType: 'image/png'};

			s3.client.putObject(param, function (){
  					console.log("Successfully uploaded data to" + param.Bucket + "/"  + param.Key);
				
				});

		});

		response.end();
		
	});

}


function show(response,request){

	console.log("Request handler show was called.");
	
	if (querystring.parse(url.parse(request.url).query)["name"] === undefined) { 
		var name = null;		
	}
	else {
		var name = querystring.parse(url.parse(request.url).query)["name"]
	}

	var params = {Bucket: 'images.caiogomes.com.br',Key:'images/'+name};

	var s3 = new AWS.S3();



	var options = {
	  host: 'images.caiogomes.com.br',
	  port: 80,
	  path: '/images/'+name,
	};

	var req= http.get(options, function(res){
		if(res.statusCode =='404'){
			response.writeHead(404)
			response.write("File not exist");
			response.end();
		}
		else{
	    	var imagedata = '';
	    	res.setEncoding('binary');

		    res.on('data', function(chunk){
	    	    imagedata += chunk;
	    	});

	    	res.on('end', function(){
				response.writeHead(200,{"Content-Type": "image/png"});      		
				response.write(imagedata,"binary");
				response.end();
			});
	    }
    });

}

	
exports.start = start;
exports.upload = upload;
exports.show = show;