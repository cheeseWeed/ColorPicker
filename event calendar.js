var categories = [];
var target_date = new Date(); 
var oldUpdateFormDigest = UpdateFormDigest;
var oldMoveToDate = MoveToDate;
var oldClickDay = ClickDay;

// TOISOString shim for IE8: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
if (!Date.prototype.toISOString) {
    (function () {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        Date.prototype.toISOString = function () {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };
    }());
}
var s4Click=false;
//checks if date item is changed then adds color
$(document).on('click', "a.ms-cal-nav", function(){ UpdateFormDigest() });

//allows the expand image inside the calendar to add color in ie
$(document).on('click', "img", function(){UpdateFormDigest(); });

//allows the expand collapse buttons to add color
$(document).on('click', ".s4-ba", function(){ if(s4Click==false) { s4Click=true;  setTimeout( function(){ $( ".ms-acal-day0" ).trigger( "click" ); console.log(this);},100);} $("[id ^='Ribbon.Calendar.Calendar.Expander']").on('click', function(){ UpdateFormDigest();});});

//$("[id ^='Ribbon.Calendar.Calendar.Expander']").on('click', function(){console.log("yes");});
UpdateFormDigest = function(){
	oldUpdateFormDigest.apply(this,arguments);
	colorize(target_date);
}

//Monkey patch to hook our colorize function into SP's MoveToDate function
MoveToDate = function () {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    oldMoveToDate.apply(this, arguments);
    target_date = new Date(arguments[0]);
    //Call our colorize function
    colorize(arguments[0]);
}

//Monkey patch to hook our colorize function into SP's ClickDay function
ClickDay = function () {
    oldClickDay.apply(this, arguments);
    target_date = new Date(arguments[0]);
    //Call our colorize function
    colorize(arguments[0]);
}

/*         Colorize(Date obj)
This function takes a date object or string to 
get the list of Events between the first and 
last day of the month (using SPService) and 
colorizes them according to Category (which
is not available in month view).            */
function colorize( target_date ){
    var d = (target_date.getMonth) ? target_date : new Date(target_date),
        month = d.getMonth(),
        year = d.getFullYear(),
        startDate = new Date(year, month, 1),
        endDate = new Date(year, month + 6, 1);
    setTimeout( function(){
        $().SPServices({
            operation: "GetListItems",
            async: true,
            listName: "Events",
            CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Category' /></ViewFields>",
            CAMLQuery: '<Query><Where><And><Geq><FieldRef Name="EventDate" /><Value IncludeTimeValue="TRUE" Type="DateTime">' + startDate.toISOString() + '</Value></Geq><Leq><FieldRef Name="EndDate" /><Value IncludeTimeValue="TRUE" Type="DateTime">' + endDate.toISOString() + '</Value></Leq></And></Where></Query>',
            completefunc: function (xData, Status) {            	
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    var color    = "#F66890";   	
                    if( $(this).attr("ows_Cats") ){
                    	var category = $(this).attr("ows_Cats");
                        category = category.substr(category.indexOf('#') + 1);
                        for( var i =0; i< categories.length; i++){
	                    	if( category == categories[i][0] ){
	                    		color = categories[i][1];
	                    	}
                    	}
                    }
                                        
                    
                    $("a[href$='ID=" + $(this).attr("ows_ID") + "']")                    
                        .closest(".ms-acal-item")
	                    	.css({
	                            "background-color": color
	                        });
                });
            }
        })
    }, 300); //setTimeout wait time
}

//Colorize Events on page load
$(function () {
	$().SPServices({
		operation: "GetListItems",
		async: true,
		listName: "CategoryColors",
		CAMLViewFields:  "<ViewFields><FieldRef Name='Title'/><FieldRef Name='Color'/></ViewFields>",
		CAMLQuery: '<Query><Where><IsNotNull><FieldRef Name="Color" /></IsNotNull></Where></Query>',
		completefunc: function (xData, Status) {            	
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var cTitle = $(this).attr("ows_Title");
                var cColor = $(this).attr("ows_Color");
                categories.push([ cTitle, cColor ]);    
				});
		}
	});

	colorize(new Date());


});