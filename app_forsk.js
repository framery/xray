var mysql = require('mysql');
var fs = require('fs');
var Xray = require('x-ray');
var x = Xray();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'xray',
	port: '33060',
	password: 'xray',
	database: 'forsk_events'
});

connection.connect();

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }
var args = process.argv.slice(2);
console.log(args)
x('http://forsk.dk/?ajax_load:int=1&b_start:int='+args[0], ['.item-conference-title a@href'])(function(err, arr) {
	
	if(arr) {
		for (var i = 0; i < arr.length; i++) {
			x(arr[i], {
				title: '.documentFirstHeading', 
				image: '.content-header-image@src',
				description: '.documentDescription',
				body: '.content-body',
				lecture_info: '.lecture-vocitem@html'
			})(function(error, obj) {
				// console.log(error)
				var querystring = "";
				var thingies = ""
				console.log(error)
				for (var key in obj) {
					// console.log(obj)
					querystring += ", " + key;
					thingies += ", ?";
				}
				querystring = querystring.substring(1,querystring.length)
				thingies = thingies.substring(1,thingies.length)
				console.log(querystring)
				// for (var i = obj.length - 1; i >= 0; i--) {
				// 	console.log(obj.)
				// }
				// obj.forEach(function(item, n){
				// 	console.log(item)
				// 	// querystring += item. + ", ";
				// 	thingies += "?, "
				// })
				// obj.lecture_info = escapeHtml(obj.lecture_info);

				// console.log(obj.lecture_info.length)
				connection.query('INSERT INTO events (' + querystring + ') VALUES ( ' + thingies + ');',[obj.title, obj.image, obj.description, obj.body, obj.lecture_info], function(err, rows, fields){
					if (!err)
						console.log('The solution is: ', rows);
					else
						console.log('Error while performing Query.');
						console.log(err);
				});
				
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