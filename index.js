var fs = require("fs");
var HtmlDom = require("htmldom");
var RE = require("re2");
var data = {};



/*
 *	RULES
 *	Attribute data should only be added and set for script that contains JSON data model.
 *	Only one script should contain attribute data
 *	The first script in the body should be the data model script 
 *	@author Jawad A. Bashorun
 *	This is dedicated to my mum for everything she has ever done for me from the very first day
 *	I step my consciousness into this universe. A conscious observer.
 */






/*
 *	@param filename
 *	@param callback
 */
//parser puts the scripts object in the right place
var jaw_parser = function(filename/*parse in a .jaw or .html document type*/, callback){
	try{
		getDocument(filename, function(err, document){
			if(err) throw new JawError(err);
			scripts = document.$("script");
			launchScripts(scripts);
		});
	}
	catch(e){
		console.error(e);
	}
}






/*
 *	@param scripts
 */
function launchScripts(scripts/*HTMLDOM Document Type*/){
	for(var i = 0; i < scripts.length; i++){
		i===0?console.log("processing "+scripts[0].attributes.name+"..."):null;
		extractDataStructure(scripts[i]);
		directory = getDataValue(scripts[i].attributes.directory);
		mode = getDataValue(scripts[i].attributes.mode);
		content = scripts[i].children[0].value;
		writeScripts(directory, content, mode);
	}
}





/*
 *	@param script
 */
function extractDataStructure(script){
	if(script.attributes.data === "true"){
		value = script.children[0].value.split("=");
		for (var i = 0; i < value.length; i++) {
			value[i]=value[i].replace(/(\n|\t|\s)/g,'').replace(/(\')/g,'"');
			value[i]=i===1?JSON.parse(value[i]):value[i];
		}
		data[value[0]]=value[1];
	}
}





/*
 *	@param directory
 * 	@param content
 * 	@param mode
 */
//writes scripts in allocated directories
function writeScripts(directory, content, mode){
	mkDirIfNotExist(directory);
	fs.writeFile(directory,content,function(err,response){
		if(err) throw new JawError(err);
		else new SuccessHandler(response);
	})
}






/*
 *	@param directory
 */
function mkDirIfNotExist(directory){
	dirs = directory.split("/");
	string_dir="."
	for(var i=0;i<dirs.length-1;i++){
		string_dir+="/"+dirs[i];
		console.log(string_dir)
		if(!fs.existsSync(string_dir)) fs.mkdirSync(string_dir);
	}
	string_dir+=dirs[(dirs.length-1)];
}





/*
 *	@param filename
 * 	@param callback
 */
function getDocument(filename, callback){
	fs.readFile(filename,"utf-8", function(err, htmlString){
		if(err) callback(err, null);
		else {
			document = new HtmlDom(htmlString);
			callback(null, document);
		}
	});}







/*
 *
 * 	@param string
 */ 
function getDataValue(string){//get data value
	var start = new RE('{{');
	var stop = new RE('}}');
	var value = string;
	if(start.match(value)||stop.match(value)){
		if(start.match(value) && stop.match(value)){
			value=start.replace(stop.replace(value,""),"");
			array=value.split(".");
			for (var i=0; i<array.length; i++){
				value = i === 0 ? data[array[i]]: value[array[i]];
			}
		}
		else throw new JawError();
	}
	return value;}






/*
 *
 * 	@param error
 *	
 */ 
function JawError(error){
	return Error(error);
}






/*
 *
 * 	@param response
 */ 
function SuccessHandler(response){
	return console.log(response);
}








module.exports = {
	parse:jaw_parser,
};