function consoleInterface(element, onMessage, options){

	this.defaultOptions = { //The defualt options for a console
		
		messageOptions: {
			separators: 'full',	// False: no separators, stripped: between messages, full: separators beteen everything [defualt]
			includeTime: true, //Shows the time of the message
			block: false, //Inline or block messages
			includeTags: true, //Shows the author of the message
			defaultTagStyle: null, //Add css for the author '.your-class-name'
			defaultTextStyle: null, //Add css for the text '.your-class-name'
		},

		code: {
			usage: false, //False: no code evaluation, True: all text the user has entered is evaluated as js, tagged: code is run between between deliminator
			deliminator:'**'//Deliminator phrase for code
		},

		parrot: { 
			enabled: true, //Prints everything that the user inputs
			tag: 'You' //The author tag for the user - will look in authors for styling
		},

		listen:{
			enabled: false,  //Prints everything the browser console outputs
			tag: 'Console' //The author tag for the browser console - will look in authors for styling
		},

	}

	this.options = fullMerge(this.defaultOptions,options);
	this.onMessage = onMessage; 
	this.history = [];
	
	this.element = element;
	this.element.history = element.children[0].children[0].children[0];
	this.element.form = element.children[0].children[1].children[0];
	this.element.inputBox = this.element.form.children[0];
	this.element.inputBtn = this.element.form.children[1];
	
	this.element.form.addEventListener('submit', (e) => {
		e.preventDefault();
		this.getInput();
	});

	this.element.inputBtn.addEventListener('click',() => {this.getInput()});

}

function message(e){

	this.default = {
		tag: null, //The author of the message - not required
		text: null, //The text of the message
		style: {
			block: null, //Inline or block style
			tagStyle: null, //Add css for the author '.your-class-name'
			textStyle: null //Add css for the text '.your-class-name'
		}
	}

	e = fullMerge(this.default,e);
	this.tag = e.tag;
	this.text = e.text;
	this.style = e.style;	
	this.time = new Date();

}



consoleInterface.prototype.clearHistory = function(){//Clears the history of the console

	this.history = [];
	this.element.history.value = null;

}

consoleInterface.prototype.copyInput = function(){//Coppy's the current input

	var m = new message();
	m.tag = this.options.parrot.tag;
	m.text = this.element.inputBox.value;

	return m;
}

consoleInterface.prototype.getInput = function(){//Sends and clears the current input

	var m = this.copyInput();
	if(m.text != ''){
		this.element.inputBox.value = null;
		this.history.push(m);
		this.onMessage(m);
		if(this.options.parrot.enabled == true) this.out(m);
	}

}

consoleInterface.prototype.out = function(message){

	switch (this.options.code.usage){
		case true:
			message.text = eval(message.text);
		break;
		case 'tagged':
			if(message.text.includes(this.options.code.deliminator)){

				message.text = message.text.split(this.options.code.deliminator);

				for(var i=0;i<message.text.length;i++){
					if(i % 2) message.text[i] = eval(message.text[i]);
				}
				message.text = message.text.join('');
				
			}
		break;
	}

	
	// evalutate code

	// form html

	// display
}



function fullMerge(target, ...sources){ //merges two or more objects

	if(typeof target == 'undefined' || target == null) target = {};
	
	sources.forEach(source => {

		if(typeof source == 'undefined') source = {};
		for(var key in target){		
			if(source[key] != undefined){
				if(typeof target[key] == 'object' && target[key] != null){
					target[key] = fullMerge(target[key],source[key]);
				} else {
					if(typeof source[key] != 'null') target[key] = source[key];
				}
			}
		}

		for(var key in source) {
			if(target[key] == undefined) target[key] = source[key];
		}
	});

	return target;
}


//?!!!!!!! 
if(message.length > 20) {message.options.block = true}
//add and remove rules
var c = new consoleInterface(document.getElementById('1'),function(x){
	//console.log('New message: ' + x.text);
},{
	code: {
		usage:'tagged'
	}
});