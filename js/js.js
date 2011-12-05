var jq = jQuery, amt = 0, sliders_num = 3, max = 100, sliders = get_sliders(), sliders_num = sliders.length, timeout, time = 0, defaults = new Defaults();

jq(function(){
	if( jq('input[name="donate"]').is('input') ){

		jq( "#messages_to_user" ).dialog({
			autoOpen: false,
			close:function(event, ui)
			{
				jq('input[name="donate"]').val('');
			}
		});
	}
	nonna_distibutePaymentInit( jq('#em-booking-form') );
});

function Defaults()
{
	this.split = {
		'dev' : 70,
		'cook' : 20,
		'charity' : 10
	}
};
function nonna_distibutePaymentInit( cont )
{	
	if( jq('input[name="donate"]').is('input') )
	{
		var container = cont, distibute_container = jq('<div id="distibute-credit-container" class="booking-box">'), amount_input = jq('input[name="donate"]'), display_prices = new Array(), append = jq('.em-booking-buttons'), hiddens = new Array();
		
		
		jq('div.em-booking-buttons').before( distibute_container );
		
		jq.each(sliders, function(i){
			var name = jq(this).attr('id').split('_')[1];
			
			display_prices[i] = jq('<div class="display-splits" id="split_'+name+'">');
			
			display_prices[i].text('0.00');
			
			hiddens[i] = jq('<input type="hidden" name="split_amount_'+name+'" id="split_amount_'+name+'" value="0" />');
			
			distibute_container.append( jq(this) );
			
			container.append( hiddens[i] );
			
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
					if( amt == 0 ) 
					{
						globalMessages('You should fill a donation amount to split it!');
						return false;
					}
					return updatePrices( display_prices, hiddens, i );
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
					updatePrices( display_prices, hiddens );
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
function updatePrices( elements, hiddens, index )
{
	var els = elements, pos = ( index ) ? index : 0;
	
	jq.each(els, function(i){
		var /*name = els[i].attr('id').split('_')[1],*/ rate = sliders[i].slider('value'), round = 0;
		money = ( amt / 100 ) * rate;
		round = money.roundNumber(2);
		if( round < 1 )
		{
			round = 0;
		}
		if( ( max -sliders[index].slider('value') ) < 1 )
		{
			round = parseInt( round );
		}
		elements[i].text( round );
		hiddens[i].val( round );
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