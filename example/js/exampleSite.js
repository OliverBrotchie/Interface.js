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
	}
});

c.out(new message({text:"Welcome to Interface.js!",tag:"Console"}));
setTimeout(()=>{
	c.out(new message({text:"you can use code with << your code >>",tag:"Console"}))
	setTimeout(()=>{
		c.out(new message({text:"or you can use console commands with //yourCommand",tag:"Console"}))
		setTimeout(()=>{
			c.out(new message({text:"To get more info, see: https://github.com/OliverBrotchie/Interface.js",tag:"Console"}))
			setTimeout(()=>{
				c.out(new message({text:"Tip - You can clear the console with: //clearHistory",tag:"Console"}))
			},3000)
		},1500);
	},1500);
},1500);