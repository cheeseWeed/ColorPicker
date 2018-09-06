
//sets the colors on each hexagon
//sets the event handlers
function setColorSelector(){
	$("#close").on('click', function(){
	$("#popout").hide();
	$("#colorWheel").show();
	$(this).css(["background-Color"])=chosenColor.innerHTML;
	});
	var colorList = document.querySelectorAll('div.hexagon');
	var middle = document.querySelectorAll('div.hex');
	var top = document.querySelectorAll('div.top');
	var bottom = document.querySelectorAll('div.bottom');
	for(var i=0; i < colorList.length; i++) {
		var colors=colorList[i];
		var cTop = top[i];
		var cBottom = bottom[i];
		var cMiddle = middle[i];
		var h = colors.dataset.hcolor;
		var t = cMiddle.background;	
		colors.onclick=function(){clickColor(this);};
		colors.onmouseout=function(){onMouseOutMap();};
		colors.onmouseover=function(){mouseOverColor(this);}; 
		colors = document.querySelectorAll( '[data-hcolor="' + h + '"]' );
		if( colors.length > 0 ){
			cMiddle.style.background= h;
			cTop.style.borderBottom= '5px solid' +h;
			cBottom.style.borderTop= '5px solid' +h;
		}
	}
}

//stored the hex value of the color chosen in a hidden div
function clickColor(picked) {
	if(isSelected){
		isSelected.getElementsByTagName('div')[1].innerHTML="";
	}
	isSelected=picked;
	var color = picked.dataset.hcolor;
	
var chosenColor = document.getElementById('myColor');
	chosenColor.innerHTML = color;
	var middleDiv = picked.getElementsByTagName('div')[1];
	middleDiv.innerHTML=("<div class = 'outline'><div class='dot'></div></div>");
	//remove 'selectedHex' class from any elements who have it
	//add 'selectedHex' class to element that was clicked
	//picked.firstChild.style.borderBottom = ' 5px solid' + color;
}

//updates what is seen in the color box and hex code
function mouseOverColor(picked) {
	var color = picked.dataset.hcolor;
    var clickedTxt = document.getElementById("divpreviewtxt");
    clickedTxt.innerHTML = color;
    clickedTxt.style.color = color;
    var clickedBg = document.getElementById("divpreview");
    clickedBg.style.backgroundColor = color;
}

//when mouse leaves the color picker, box is updated with selected color
function onMouseOutMap() {
    var clickedTxt = document.getElementById("divpreviewtxt");
    var clickedBg = document.getElementById("divpreview");
    var chosenColor = document.getElementById('myColor');
    clickedTxt.innerHTML = chosenColor.innerHTML;
    clickedTxt.style.color = chosenColor.innerHTML;
    clickedBg.style.backgroundColor = chosenColor.innerHTML;

}
var isSelected;
//sets stuff up when document is ready
(function(){

	window.onload=function(){
		
		$(".square, #colorWheel").on('click',function(){
			$("#colorWheel").hide();
			$("#popout").show();
			$("#main").show();
			setColorSelector();
		
		});
		
	}
})();