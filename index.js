var fs = require("fs");
var HtmlDom = require("htmldom");
var data = null;



/*
 *	RULES
 *	Attribue data should only be added and set for script that contains JSON data model.
 *	Only one script should contain attribute data
 *
 */


//parser puts the scripts object in the right place
var jaw_parser = function(filename, callback){
	getDocument(filename, function(err, document){
		if(err) throw new JawError(err);
		scripts = document.$("script");
		for(var i = 0; i < scripts.length; i++){
			console.log(scripts[i].attributes)
			if(scripts[i].attributes.data == "true"){
				data = JSON.parse(scripts[i].children[0].value);
				console.log(data);
			}
			directory = getDataValue(scripts[i].attributes.directory);
			mode = getDataValue(scripts[i].attributes.mode);
			content = scripts[i].children[0].value;
			fs.writeFile(directory, content, function(err, response){
				if(err) throw new JawError(err);
				else new SuccessHandler(response);
			});
		}
	});
}




function getDocument(filename, callback){
	fs.readFile(filename,"utf-8", function(err, htmlString){
		if(err) callback(err, null);
		else {
			codukmonej wlkaefkar bfaev.krgalo
			document = new HtmlDom(htmlString);
			callback(null, document);
		}
	});
}




function getDataValue(string_path){
	string_path = string_path.remove("{|}");
	path = string_path.split(".");
	for (var i = 0; i < path.length; i++){
		value = value[array[i]];
	}
	console.log(value);
	return value;
}




function JawError(err){
	return Error(err);
}




function SuccessHandler(response){
	return console.log(response);
}





module.exports = {
	parse:jaw_parser
};