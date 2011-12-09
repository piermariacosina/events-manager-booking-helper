var jq = jQuery, contribution = 0, sliders_num = 3, max = 2500, sliders = get_sliders(), sliders_num = sliders.length, timeout, time = 0, defaults = new Defaults(), timeout = -100, display_prices = new Array(), hiddens = new Array(), NonnaHelper, info_box = jq('<div id="info-box"></div>'), people, price, tax = 3.5;

jq(function(){
	if( jq('input[name="donate"]').is('input') ){

		jq( "#messages_to_user" ).dialog({
			autoOpen: false,
			close:function(event, ui)
			{
				jq('input[name="donate"]').val('');
			}
		});
		nonna_distibutePaymentInit( jq('#em-booking-form') );
		changeTotalsOnChangePeople();
	}
});
function Defaults()
{
	this.split = {
		'dev' : 0.70000000000000004,
		'cook' : 0.2000000000000004,
		'charity' : 0.10000000000004
	}
};
function changeTotalsOnChangePeople()
{
	jq('.em-ticket-select').change(function(event){
		var r;
		people = jq(this).val();
		var tt = ( ( parseFloat(price) + parseFloat(contribution) ) * people );
		r = parseFloat( ( tt / 100 ) * tax );
		tt = tt + r; 
		
		info_box.text( 'Price €'+parseFloat(price).toFixed(2)+' donation €'+parseFloat(contribution).toFixed(2)+' for ' +people+' people = '+ tt.toFixed(2) +'€'); 
	});
}
function nonna_distibutePaymentInit( cont )
{	
	if( jq('input[name="donate"]').is('input') )
	{
		var container = cont, distibute_container = jq('<div id="distibute-credit-container" class="booking-box">'), amount_input = jq('input[name="donate"]'), append = jq('.em-booking-buttons'), index, tt;
		
		price = cleanamount( jq('.em-booking-form-details > p > strong').text() );
		
		people = jq('.em-ticket-select').val();
		
		tt = parseFloat( ( price * people ) );
		
		tt = tt + ( tt / 100 ) * tax;
		
		jq('div.em-booking-buttons').before( distibute_container );
		
		jq('div.em-booking-buttons').before( info_box );
		
		info_box.text( 'Price €'+price.toFixed(2)+' for ' +people+' people = '+ tt.toFixed(2) +'€' );
		
		jq.each(sliders, function(i){
			
			var name = jq(this).attr('id').split('_')[1], delta;
			
			display_prices[i] = jq('<div class="display-splits" id="split_'+name+'">');
			
			display_prices[i].text('0.00');
			
			hiddens[i] = jq('<input type="hidden" name="split_amount_'+name+'" id="split_amount_'+name+'" value="0" />');
			
			distibute_container.append( jq(this) );
			
			container.append( hiddens[i] );
			
			jq(this).after(display_prices[i]);
			
			jq( this ).slider({
				min:1,
				max: max,
				value: max * defaults.split[name],
				step: 1,
				create: function(event, ui)
				{
					
				},
				start: function( event, ui )
				{
					index = i;
				},
				slide: function(event, ui) 
				{ 
					if( contribution == 0 ) 
					{
						globalMessages('You should fill a donation amount to split it!');
						return false;
					}
					return slideslide(event,ui,i);
				},
				stop: function(event, ui)
				{
					/// 
				}
			});
		});
		
		amount_input.keyup(function(e){
			
			var val = isNaN( jq(this).val() ) || jq(this).val() == '' ? 0 : jq(this).val(), tt;
			
				if( val >= 0 )
				{
					
					contribution = val;
					
					tt = ( ( parseFloat(price) + parseFloat(contribution) ) * people );
					
					tt = tt + ( tt / 100 ) * tax;
					
					if( validamount( contribution ) )
					{
						info_box.text( 'Price €'+parseFloat(price).toFixed(2)+' donation €'+parseFloat(contribution).toFixed(2)+' for ' +people+' people = '+ tt.toFixed(2) +'€'); 

						updatesliders( index );
					}
					else
					{
						if( event.keyCode != 8)
						globalMessages('Please check the format of the donation you made.');
					}
				}
				else
				{
					if( event.keyCode != 8)
					globalMessages('Only numbers are allowed in this field!');
				}
		});
	} 
};
function updatesliders( index ) {
  var total = 0, amt = 0;
  
  for (var i = 0; i<sliders_num; i++) 
  {
    var v = sliders[i].slider('value');
    if (v < 10) v = 0;
    total += v;
  }
  for (var i = 0; i<sliders_num; i++) 
  {
    var v = sliders[i].slider('value'), p = v / total, d = Math.floor(1000000 * p) / 10000, da = Math.floor(contribution * p * 100);
	if (v < 10) v = 0;
	sliders[i].discreteamount = da;
    sliders[i].difference = (p * contribution * 100) - da;
  }
  sum = 0;
  for (var i = 0; i<sliders_num; i++) 
  {
    sum += sliders[i].discreteamount;
  }

  difference = Math.round(contribution * 100 - sum);
	
	for (var i = difference; i >= 1; i -= 1) {
	    var md = mostdifferent();
	    md.difference -= 1;
	    md.discreteamount += 1;
	  }

  for (var i = 0; i<sliders_num; i++) 
  {
	amt = ( sliders[i].discreteamount  ) / 100, display = parseFloat( amt.toFixed(2) );
	 
	display_prices[i].text( moneyfmt(prettymoney( display )));
	hiddens[i].val( prettymoney( display ) );
  }
};
var mostdifferent = function() {
  var largest;
  for (var i = 0; i<sliders_num; i++) {
    if (!largest || sliders[i].difference > largest.difference)
      largest = sliders[i];
  }
  return largest;
};
function moveothersliders(index,val) {
  var sum = 0, difference;
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
	updatesliders( index )
};
var slideslide = function(e,ui,index) 
{
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
function validamount(a) 
{
  if (typeof(a) == 'number') return true;
  a = a.replace('$','');
  return /^\d+\.$/.test(a) || /^\d+$/.test(a) || /^\d*\.\d+$/.test(a) || /^\d*\.\d+$/.test(a) || /^(\d,|\d\d,)?(\d\d\d,)*\d\d\d(\.\d+)?$/.test(a)
};
function cleanamount(a) {
  if (typeof(a) == 'number') return a;
  a = a.replace('$','');
  a = a.replace('€','');
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
/*
 * JavaScript currency formatting
 * (from http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript/149099#149099)
 */
var formatMoney = function(n,c,d,t,z) {
  z = z ? z : '';  c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? ',' : d, t = t == undefined ? '.' : t, s = n < 0 ? '-' : '', i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '', j = (j = i.length) > 3 ? j % 3 : 0;
    return z + s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};
var moneyfmt = function(a) {
  return formatMoney(a,2,'.',',','€');
};