var mysql = require('mysql');
var fs = require('fs');
var Xray = require('x-ray');
var x = Xray();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'xray',
	port: '33060',
	password: 'xray',
	database: 'dtu_events'
});

connection.connect();

x('http://www.dtu.dk/Forskning/Forskningsformidling/Forskningens-doegn/For-skoler-og-gymnasier', ['.pageListLink@href'])(function(err, arr) {
	
	if(arr) {
		for (var i = 0; i < arr.length; i++) {
			x(arr[i], {
				title: '#outercontent_0_content_0_ContentHeading', 
				summary: '#outercontent_0_content_0_ContentSummary', 
				text: '#outercontent_0_content_0_ContentText :first-child',
				meta: '#outercontent_0_content_0_ContentText :last-child',
				image: '.contentimage@src'
			})(function(error, obj) {
				connection.query('INSERT INTO events (title, summary, text, meta, image) VALUES ( ?, ?, ?, ?, ?);',[obj.title, obj.summary, obj.text, obj.meta, obj.image], function(err, rows, fields){
					if (!err)
						console.log('The solution is: ', rows);
					else
						console.log('Error while performing Query.');
				});
				// console.log(obj)
				// thedata += obj
			})
		}
	}
})


x()





// x('http://www.dtu.dk/Forskning/Forskningsformidling/Forskningens-doegn/For-skoler-og-gymnasier', {
// 	links: x('.pageListLink', [{
// 		title: '#outercontent_0_content_0_ContentHeading',
// 	}])
// })(function(err, content) {

//   console.log(content)
// })