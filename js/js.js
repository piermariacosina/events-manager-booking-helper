var jq = jQuery, amt = 0, sliders_num = 3, max = 100, sliders = get_sliders(), sliders_num = sliders.length, timeout, time = 0, defaults = new Defaults();

jq(function(){
	nonna_distibutePaymentInit( jq('#em-booking-form') );
});

function Defaults(){
	this.split = {
		'dev' : 70,
		'cook' : 20,
		'charity' : 10
	},
	this.tmp = {
		'dev': 0,
		'cook' : 0,
		'charity' : 0
	}
};
function nonna_distibutePaymentInit( cont )
{	
	if( jq('input[name="donate"]').is('input') )
	{
		var container = cont, distibute_container = jq('<div id="distibute-credit-container" class="booking-box">'), amount_input = jq('input[name="donate"]'), display_prices = new Array(), append = jq('.em-booking-buttons');
		
		
		jq('div.em-booking-buttons').before( distibute_container );
		
		jq.each(sliders, function(i){
			var name = jq(this).attr('id').split('_')[1];
			
			display_prices[i] = jq('<div class="display-splits" id="split_'+name+'">');
			
			display_prices[i].text('0.00');
			
			distibute_container.append( jq(this) );
			
			jq(this).after(display_prices[i]);
			
			jq( this ).slider({
				min:1,
				max: max,
				value: defaults.split[name],
				step: 1,
				start: function( event, ui )
				{
					///
				},
				slide: function(event, ui) 
				{ 
					slideslide(event,ui,i);
					if( amt == 0 ) return;
					return updatePrices( display_prices );
				},
				stop: function(event, ui)
				{
					/// 
				}
			});
		});
		
		amount_input.keyup(function(e){
			var val = isNaN( jq(this).val() ) ? false : jq(this).val() ;

			if(val)
			{
				amt = cleanamount( jq(this).val() );

				if( validamount( amt ) )
				{
					updatePrices( display_prices );
				}
				else
				{
					globalMessages('Please check the format of the donation you made.');
				}
			}
			else
			{
				globalMessages('Only numbers are allowed in this field!');
			}
		});
	} 
};
function updatePrices( elements )
{
	var els = elements;
	jq.each(els, function(i){
		var /*name = els[i].attr('id').split('_')[1],*/ rate = sliders[i].slider('value');
		money = ( amt / 100 ) * rate;
		elements[i].text( prettymoney(money) );
	});
};
function moveothersliders(index,val) {
  var sum = 0;
  for (var i = 0; i<sliders_num; i++) {
    if (i == index) continue;
    sum += sliders[i].slider('value');
  }
  var mult = (max - (val ? val : sliders[index].slider('value'))) / sum, /*name,*/ val;
  for (var i = 0; i<sliders_num; i++) {
    if (i == index) continue;
//	name = sliders[i].attr('id').split('_')[1];
	val = sliders[i].slider('value') * mult;
    sliders[i].slider('value',val);
  }
};
var slideslide = function(e,ui,index) {
  
  if (time + 20 > e.timeStamp) return;
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    moveothersliders(index);
  },20);
  time = e.timeStamp;
  moveothersliders(index,ui.value);
};
function get_sliders()
{
	var sliders = new Array( jq('<div id="slider_dev" class="sliders">'), jq('<div id="slider_cook" class="sliders">'), jq('<div id="slider_charity" class="sliders">') );
	return sliders;
};

function validamount(a) {
  if (typeof(a) == 'number') return true;
  a = a.replace('$','');
  return /^\d+\.$/.test(a) || /^\d+$/.test(a) || /^\d*\.\d+$/.test(a) || /^\d*\.\d+$/.test(a) || /^(\d,|\d\d,)?(\d\d\d,)*\d\d\d(\.\d+)?$/.test(a)
};
function cleanamount(a) {
  if (typeof(a) == 'number') return a;
  a = a.replace('$','');
 // a = a.replace('€','');
  a = a.replace(',','');
  a = parseFloat(a);
  return a;
};
function prettymoney(c) {
  c = '' + c;
  c = c.split('.');
  c.push('00');
  if (c[1].length == 1) c[1] += '0';
  return c[0] + '.' + c[1];
};
String.prototype.isInteger = function()
{
	var reInteger = /^\d+$/;
	return reInteger.test(this);
};