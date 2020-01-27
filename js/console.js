function consoleInterface(element, onMessage, options){

	this.defaultOptions = {

		listen: false, //true: Will print everything the browser console outputs
		separators: 'full', // none: no separators, stripped: between messages, full: separators beteen everything [defualt]
		
		code: {
			usage: false,
			deliminator:'**'
		},

		messageOptions: {
			includeAuthors: false,
			authors: {},
			includeTime: true,
			block: false
		}

	}
	
	this.element = element;
	this.onMessage = onMessage;
	this.history = [];
	this.options = completeAssign(this.defaultOptions,options);

	function completeAssign(target, ...sources) {
		sources.forEach(source => {
		  let descriptors = Object.keys(source).reduce((descriptors, key) => {
			descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
			return descriptors;
		  }, {});
		  
		  Object.getOwnPropertySymbols(source).forEach(sym => {
			let descriptor = Object.getOwnPropertyDescriptor(source, sym);
			if (descriptor.enumerable) {
			  descriptors[sym] = descriptor;
			}
		  });
		  Object.defineProperties(target, descriptors);
		});
		return target;
	}

	console.log(this.options);
}

function message(content,options){
	this.content = content;
}

consoleInterface.prototype.clear = function(){

	//change the htmllL!!!!!!
	this.history = [];
}

consoleInterface.prototype.out = function(message){

	var temp, output = "";

	

	//search for code

	//create html

	//post



}


//?!!!!!!! 
if(message.length > 20) {message.style.format = block}
//add and remove rules
var console = new Console();