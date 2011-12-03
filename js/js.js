var jq = jQuery, amt = 0, sliders_num = 3, max = 100, sliders = get_sliders(), sliders_num = sliders.length, timeout, time = 0;

jq(function(){
	nonna_distibutePaymentInit( jq('#em-booking-form') );
});

function nonna_distibutePaymentInit( cont )
{	
	if( jq('input[name="donate"]').is('input') )
	{
		var container = cont, distibute_container = jq('<div id="distibute-credit-container" class="booking-box">'), amount_input = jq('input[name="donate"]');
		
		container.append( distibute_container );
		
		jq.each(sliders, function(i){
			var name = jq(this).attr('id').split('_')[1];
			distibute_container.append( jq(this) );
			jq( this ).slider({
				min:1,
				max: max,
				value: defaults.split[name],
				step: 1,
				start: function( event, ui )
				{
					
				},
				slide: function(event, ui) 
				{ 
					return slideslide(event,ui,i);
				}
			});
		});
		
		amount_input.blur(function(e){
			amt = jq(this).val();
		});
	} 
};
function moveothersliders(index,val) {
  var sum = 0;
  for (var i = 0; i<sliders_num; i++) {
    if (i == index) continue;
    sum += sliders[i].slider('value');
  }
  var mult = (max - (val ? val : sliders[index].slider('value'))) / sum;
  for (var i = 0; i<sliders_num; i++) {
    if (i == index) continue;
    sliders[i].slider('value',sliders[i].slider('value') * mult);
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
var defaults = {
	'split' : {
		'dev' : 50,
		'cook' : 35,
		'charity' : 15
	}
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