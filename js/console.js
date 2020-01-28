function consoleInterface(element, onMessage, options){

	this.defaultOptions = { //The defualt options for a console
		
		messageOptions: {
			separators: 'full',	// False: no separators, stripped: between messages, full: separators beteen everything [defualt]
			includeTime: true, //Shows the time of the message
			block: false, //Inline or block messages
			includeTags: true, //Shows the author of the message
		},

		code: {
			//False: no user code, 
			//True: user must spesify the code with the deliminator phrase - ** //your code here **, 
			//Auto: Will automatically detect javascript
			usage: false,
			deliminator:'**'//Deliminator phrase for code
		},

		parrot: { 
			enabled: true, //Prints everything that the user inputs
			tag: 'You' //The author tag for the user - will look in authors for styling
		},

		listen:{
			enabled: true,  //Prints everything the browser console outputs
			tag: 'Console' //The author tag for the browser console - will look in authors for styling
		}
		

	}
	
	this.element = element;
	this.onMessage = onMessage;
	this.history = [];
	this.options = completeAssign(this.defaultOptions,options);

}

function message(content,options){

	this.defaultContent = {
		tag: null, //The author of the message - not required
		text: null //The text of the message
	}

	this.defaultOptions = {
		block: null, //Inline or block style
		tagStyle: null, //Add css for the author '.your-class-name'
		textStyle: null, //Add css for the text '.your-class-name'
	}

	this.content = completeAssign(this.defaultContent,content);
	this.options = completeAssign(this.defaultOptions,options);
	this.time = null; 

}

consoleInterface.prototype.clear = function(){

	//change the htmllL!!!!!!
	this.history = [];
}

consoleInterface.prototype.out = function(message){

	var output = '';

	

	//search for code

	//create html

	//post



}

//Full merge
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


//?!!!!!!! 
if(message.length > 20) {message.style.format = block}
//add and remove rules
var console = new Console();