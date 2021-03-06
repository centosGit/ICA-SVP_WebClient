var scp;
var font_color;
var app_bgcolor;
var timeout = null;
var leaves_count = 0;
var cursor_window;
var is_first_time;
var canUpdate = true;

$(document).ready(function(){

	scp = angular.element('.main').scope();

	String.prototype.isEmpty = function() {
    	return (this.length === 0 || !this.trim());
	}

	$('#cb_controls').change(function() {
           $("#controls").toggle();
    });

	//Set default values
	font_color = defaults.font_color;
	app_bgcolor = $('body').css("background-color");

	//Setup plugins
	$("#font_color").spectrum({
		preferredFormat: "hex",
    	showInput: true,
    	color: font_color,
    	change: setColor,
    	showButtons: false
	});

	$("#app_color").spectrum({
		preferredFormat: "hex",
    	showInput: true,
    	color: app_bgcolor,
    	change: setColor,
    	showButtons: false
	});

	//Show modal
	$('.reveal-modal').css('max-height', $('html').height() - 110 + 'px');
	$('#config_modal').reveal();
});

// Reset max-height after window resize
$(window).resize(function() {
    $('.reveal-modal').css('max-height', $('html').height() - 110 + 'px');
});

function setColor(color){
	//Color picker callback
	if(this.id === "font_color") font_color = color;
	else if(this.id === "app_color") app_bgcolor = color;
}

function setup(){
	//Setup environment before start
	updateBgColor(app_bgcolor)
	$('#div_word').css("color", font_color);

	//Update model
	$('#font_color').trigger('input');
	$('#app_color').trigger('input');

	//Check if values are set, otherwise set default
	validate();

	//Mouse events
	$('#div_cursor').mouseleave(onMouseLeave);
	$('#div_cursor').mouseenter(onMouseEnter);
}

function closeCallback(){
	//Configuration modal close callback
	setup();
	is_first_time = true;
}

function onMouseLeave(){
	if(timeout == null && scp.isRunning()){
		timeout = setTimeout(scp.pause, cursor_window);
	}
}

function onMouseEnter(){

	$("#config_modal").toggle(); //Remove the modal to avoid scroll appearance
	
	if(is_first_time){
		is_first_time = false;
		$(".main").css("cursor","none");
		scp.start();
	}else{
		if(timeout != null){
			clearTimeout(timeout);
			timeout = null;
		}
		if(!scp.isRunning())
			scp.resume();
	}
}

function validate(){
	//If not valid input, set defaults

	var file_name = $('#file_name').val();
	if(file_name.isEmpty()){
		$('#file_name').val(defaults.content);
		$('#file_name').trigger('input');
	}

	item_time = $('#item_time').val();
	if(!$.isNumeric(item_time)){
		$('#item_time').val(defaults.item_time);
		$('#item_time').trigger('input');
	}

	delay_time = $('#delay_time').val();
	if(!$.isNumeric(delay_time)){
		$('#delay_time').val(defaults.delay_time);
		$('#delay_time').trigger('input');
	}

	var font_size = $('#font_size').val();
	if($.isNumeric(font_size))
		$('#div_word').css("font-size", font_size + "pt");
	else{
		$('#div_word').css("font-size", defaults.font_size + "pt");
		$('#font_size').val(defaults.font_size);
		$('#font_size').trigger('input');
	}
	
	var cursor_padding = $('#padding').val();
	if($.isNumeric(cursor_padding)){
		$('#div_cursor').css("padding-top", cursor_padding + "px");
		$('#div_cursor').css("padding-bottom", cursor_padding + "px");
	}else{
		$('#padding').val(defaults.padding);
		$('#padding').trigger('input');
		$('#div_cursor').css("padding-top", defaults.padding + "px");
		$('#div_cursor').css("padding-bottom", defaults.padding + "px");
	}

	cursor_window = $('#window').val();
	if(!$.isNumeric(cursor_window)){
		$('#window').val(defaults.window);
		$('#window').trigger('input');
		cursor_window = defaults.window;
	}
}

function updateBgColor(color){
	//Update background color
	if(canUpdate)
		$('body').css("background-color", color);
}

function setDelayBoxHeight(id){
	var height = $("#div_" + id).css("height");
	$("#div_target").css("height",height);
}

function trialFinished(){
	canUpdate = false;
	$(".main").css("cursor","pointer");
}