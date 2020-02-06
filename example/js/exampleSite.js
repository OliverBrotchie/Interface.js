var c = new Interface(document.getElementById('example').firstElementChild,m => {},{

	messageOptions: {
		tags:{
			tagStyles:{
				You:"client",
				Console:"host"
			}
		}
	},
	code: {
		usage:'tagged'
	},
	consoleCommands:{
		commands:{ 
			secret: function(){
				this.removeLast();
				this.out(new Message({text:"°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸",tag:"Console"}));
			},
			args: function(x,y,z){
				this.removeLast();
				this.out(new Message({text:x,tag:"Console"}));
				this.out(new Message({text:y,tag:"Console"}));
				this.out(new Message({text:z,tag:"Console"}));
			}
		}
	}
});

c.element.inputBox.focus();

c.out(new Message({text:"Welcome to Interface.js!",tag:"Console"}));
setTimeout(()=>{
	c.out(new Message({text:"you can use code with << your code >>",tag:"Console"}))
	setTimeout(()=>{
		c.out(new Message({text:"or you can use console commands with //yourCommand",tag:"Console"}))
		setTimeout(()=>{
			c.out(new Message({text:"To get more info, see: https://github.com/OliverBrotchie/Interface.js",tag:"Console"}))
			setTimeout(()=>{
				c.out(new Message({text:"Tip - You can clear the console with: //clearHistory",tag:"Console"}));
			},3000)
		},1500);
	},1500);
},1500);