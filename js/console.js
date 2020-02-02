function consoleInterface(element, onMessage, options){

	this.defaultOptions = { //The defualt options for a console
		
		messageOptions: {
			text:{
				block: false, //Inline or block messages
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

		code: {
			usage: false, //False: no code evaluation, True: all text the user has entered is evaluated as js, tagged: code is run between between deliminator
			deliminator:'^^'//Deliminator phrase for code
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
	this.time = new Date();

}



consoleInterface.prototype.clearHistory = function(){//Clears the history of the console

	this.history = [];
	this.element.history.value = null;

}


consoleInterface.prototype.evalCode = function(m){

	switch (this.options.code.usage){
		case true:
			m.text = eval(m.text);
		break;
		case 'tagged':
			if(m.text.includes(this.options.code.deliminator)){

				if(this.options.code.deliminator == reverseChars(this.options.code.deliminator)){
					m.text = m.text.split(this.options.code.deliminator);
				} else {
					m.text = splitMulti(m.text,[this.options.code.deliminator, reverseChars(this.options.code.deliminator)]);
				}

				for(var i=0;i<m.text.length;i++){
					if(i % 2) m.text[i] = eval(m.text[i]);
				}

				m.text = m.text.join('');

			}
		break;
	}

	return m;
}

consoleInterface.prototype.copyInput = function(){//Coppy's the current input

	var m = new message();
	m.tag = this.options.parrot.tag;
	m.text = this.element.inputBox.value;

	return this.evalCode(m);
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


consoleInterface.prototype.out = function(m){

	var html = document.createElement("div");

	switch(true){
		case this.options.messageOptions.separators:

			if(!this.element.history.hasChildNodes()){
				this.element.history.appendChild(document.createElement("div"));
				this.element.history.lastChilds.classList.add("separator");
			}

			html.classList.add("has-separator");
		break;
		case this.options.messageOptions.tags.enabled:

			html.appendChild(document.createElement("div"));
			
			if(m.style.tagStyle)
			 
			


		break;
		case true:

			html += '<div class="message-text">'+ m.text + '</div>';

		break;
		case this.options.includeTime == true:

		break;
		default:
			html += '</div>'
	}
	// form html

	// display
}

function reverseChars(str){
	var chars = ['[','{','(','<'], reverseChars = [']','}',')','>'];
	str = str.split('');

	str.forEach(e => {
		for(var i = 0;i<chars.length;i++){
			e.replace(chars[i],reverseChars[i]);
		}
	});
	
	return str.reverse().join('');
}

function splitMulti(str, separators){
	var tempChar = 't3mp'; //prevent short text separator in split down
	
	//split by regex e.g. \b(or|and)\b
	var re = new RegExp('\\b(' + separators.join('|') + ')\\b' , "g");
	str = str.replace(re, tempChar).split(tempChar);
	
	// trim & remove empty
	return str.map(el => el.trim()).filter(el => el.length > 0);
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

var c = new consoleInterface(document.getElementById('1'),function(x){},{
	code: {
		usage:'tagged'
	}
});

//make the code mixins!!!