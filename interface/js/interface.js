function Interface(element, onMessage, options){

	this.defaultOptions = { //The defualt options for an interface
		
		messageOptions: {
			text:{
				defaultTextStyle: null //Add css for the text -  '.your-class-name'
			},
			tags:{
				enabled: true, //Shows the author of the message
				defaultTagStyle: null, //Add css for the author -  '.your-class-name'
				tagStyles:{} //Add css for the author -  authorName:'.your-class-name'
			},
			separators: true,	//Includes seperators between messages
			includeTime: true //Shows the time of the message		
		},

		consoleCommands: {
			enabled: true, //Allows the use of console commands
			deliminator: "//", //Deliminator phrase for console commands
			commands: { //List of console commands
				clearHistory: this.clearHistory.bind(this)
			} 
		},

		code: {
			usage: false, //False: no code evaluation, True: all text the user has entered is evaluated as js, tagged: code is run between between deliminator
			deliminator:'<<'//Deliminator phrase for code (will be reversed for the closing deliminator)
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
		style: { //Overides any default styles
			block: null, //Inline or block style
			tagStyle: null, //Add css for the author '.your-class-name'
			textStyle: null //Add css for the text '.your-class-name'
		}
	}

	e = fullMerge(this.default,e);
	this.tag = e.tag;
	this.text = e.text;
	this.style = e.style;	
	this.time = Date.now();
}




Interface.prototype.evalCode = function(m){ //evaluates any code in a message

	switch (this.options.code.usage){
		case true:
			try {
				m.text = eval(m.text);
			} catch(error){ 
				m.text = error.message;
			}
		break;
		case 'tagged':
			if(m.text.includes(this.options.code.deliminator)){

				if(this.options.code.deliminator == reverseChars(this.options.code.deliminator)){
					m.text = m.text.split(this.options.code.deliminator);
				} else {
					m.text = multipleSplit(m.text,[this.options.code.deliminator, reverseChars(this.options.code.deliminator)]);
				}

				for(var i=0;i<m.text.length;i++){
					if(i % 2){
						try {
							m.text[i] = eval(m.text[i]);
						} catch(error){ 
							m.text[i] = error.message;
						}
					}
				}

				m.text = m.text.join('');
			}
		break;
	}

	return m;
}

Interface.prototype.evalCommands = function(m){

	m.text.split(" ").forEach(e=>{
		if(e.includes(this.options.consoleCommands.deliminator)){
			Object.keys(this.options.consoleCommands.commands).forEach(key =>{
				if(e.substr(2, e.length) == key){
					try{
						this.options.consoleCommands.commands[key]();
					} catch(error){
						console.log("Console command failed, reason: " + error.message);
					}
				}
			})
		}
	});
	
}

Interface.prototype.copyInput = function(){ //Coppy's the current input

	var m = new message();
	m.tag = this.options.parrot.tag;
	m.text = this.element.inputBox.value;

	return this.evalCode(m);
}

Interface.prototype.getInput = function(){ //Sends and clears the current input

	var m = this.copyInput();
	if(m.text != ''){
		this.element.inputBox.value = null;
		this.history.push(m);

		if(this.options.parrot.enabled == true) this.out(m);
		if(this.options.consoleCommands.enabled == true) this.evalCommands(m);
		this.onMessage(m);
	}

}

Interface.prototype.clearHistory = function(){ //Clears the history

	this.history = [];

	while (this.element.history.firstChild) {
		this.element.history.removeChild(this.element.history.firstChild);
	}

}


Interface.prototype.out = function(m){ //Outputs a message to the interface

	var html = document.createElement("div");
	html.classList.add("message");

	//add separators
	if(this.options.messageOptions.separators){

		if(this.element.history.childElementCount == 0){
			this.element.history.appendChild(document.createElement("div"));
			this.element.history.lastChild.classList.add("separator");
		}

		html.classList.add("has-separator");

	}
	//add tags
	if(this.options.messageOptions.tags.enabled){

		html.appendChild(document.createElement("div"));
		html.lastChild.classList.add("message-author");
		html.lastChild.appendChild(document.createTextNode(m.tag + ":"));

		if(m.style.tagStyle != null){
			html = addClasses(html, m.style.tagStyle);
		} else {
			if(this.options.messageOptions.tags.defaultTagStyle != null){
				html = addClasses(html, this.options.messageOptions.tags.defaultTagStyle);
			} else {
				if(Object.keys(this.options.messageOptions.tags.tagStyles).includes(m.tag)){
					html = addClasses(html, this.options.messageOptions.tags.tagStyles[m.tag]);
				}
			}
		}

	}
	
	//add the message
	html.appendChild(document.createElement("div"));
	html.lastChild.classList.add("message-text");

	evalLinks(m.text).forEach(e =>{
		html.lastChild.appendChild(e);
	});

	html.lastChild.normalize();

	if(m.style.textStyle != null){
		html = addClasses(html, m.style.textStyle);
	} else {
		if(this.options.messageOptions.tags.defaultTagStyle != null){
			html = addClasses(html, this.options.messageOptions.text.defaultTextStyle);
		} 
	}

	//add time
	if(this.options.messageOptions.includeTime) {

		html.appendChild(document.createElement("div"));
		html.lastChild.classList.add("message-time");
		html.lastChild.appendChild(document.createTextNode(
			addZero(new Date(m.time).getHours()) + ":" + addZero(new Date(m.time).getMinutes())
		));

	}

	//display
	this.element.history.appendChild(html);
	this.element.history.lastChild.scrollIntoView();
}

function reverseChars(str){ //Reverses given charecters (including open/close chars)

	var chars = ['[','{','(','<'], reverseChars = [']','}',')','>'];
	str = str.split('');

	for(var i = 0;i<chars.length;i++){
		for(var j =0;j<str.length;j++){
			str[j] = str[j].replace(chars[i],reverseChars[i]);
		}
	}
	
	return str.reverse().join('');
}


function multipleSplit(text,separators){ //splits on multiple separators

	var temp, output = [];
	separators.forEach(separator=>{
		
		if(output.length == 0){

			temp = text.split(separator);
			if(temp.length > 1)	output = temp;
			
		} else {
			for(var i = 0; i<output.length;i++){

				temp = output[i].split(separator);
				if(temp.length > 1){
					//merge the elements in
					output.splice(i, 1, ...temp);
					//update i
					i+= temp.length-1;
				}

			}
		}
	});
	
	return output;
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

function addClasses(html,classList){

	classList.split(" ").forEach(e => {
		html.lastChild.classList.add(e);
	});

	return html;
}

function addZero(i) {
	if (i < 10) {
	  i = "0" + i;
	}
	return i;
}

function evalLinks(string){
	
	var temp, output = [];

	string.split(' ').forEach(e=>{
		if(e.includes("http")){
			temp = document.createElement("a");
			temp.href = e;
			temp.appendChild(document.createTextNode(e)); 
		} else {
			temp = document.createTextNode(e)
		}

		output.push(temp);
	});

	var i = 1;

	while (i < output.length) {
		output.splice(i, 0, document.createTextNode(" "));
		i += 2;
	}

	console.log(output);

	return output;

}