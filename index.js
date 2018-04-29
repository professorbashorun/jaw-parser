var fs = require("fs");
var HtmlDom = require("htmldom");
var RE = require("re2");
var data = [];



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
			console.log("processing "+scripts[0].attributes.name+"...");
			if(scripts[i].attributes.data === "true"){
				data.push(JSON.parse(scripts[i].children[0].value.strip()));
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
			document = new HtmlDom(htmlString);
			callback(null, document);
		}
	});
}









function getDataValue(string){
	var start = new RE('{{');
	var stop = new RE('}}');
	var value = string;
	if(start.match(value) || stop.match(value)){
		if(start.match(value) && stop.match(value)){
			value = start.replace("", stop.replace("", value));
			array = value.strip(".");
			for (var i = 0; i < array.length; i++){
				value = i === 0? data[array[i]] : value[array[i]];
			}
		}
		else throw new JawError();
	}
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