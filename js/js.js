var jq = jQuery, amt = 0, sliders_num = 3, max = 100, sliders = get_sliders(), sliders_num = sliders.length;

jq(function(){
	nonna_distibutePaymentInit( jq('#em-booking-form') );
});

function nonna_distibutePaymentInit( cont )
{	
	if( jq('input[name="donate"]').is('input') )
	{
		var container = cont, distibute_container = jq('<div id="distibute-credit-container" class="booking-box">'), amount_input = jq('input[name="donate"]'), init_vals = defaults.split_arr;
		
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
					var partial = max - ui.value, me = jq(this), me_name = me.attr('id').split('_')[1];
					
					console.log("mcm:: "+mmc(init_vals)+"\n");
					
					for(var i=0; i<sliders_num; i++)
					{
						if( me.attr('id') !== sliders[i].attr('id') ) 
						{
							var sliders_name = sliders[i].attr('id').split('_')[1], mult, maj;
							
							mult = partial / sliders[i].slider('value');
							
							maj = ( sliders[i].slider('value') * mult ) - defaults.split[sliders_name];
							
							//console.log( 'slide '+sliders[i].attr('id')+' val '+sliders[i].slider('value')+' mult '+mult +" maj "+maj+"\n");
							sliders[i].slider("value", maj );
						}
					}		
				}
			});
		});
		
		amount_input.blur(function(e){
			amt = jq(this).val();
		});
	} 
};

var defaults = {
	'split' : {
		'dev' : 70,
		'cook' : 20,
		'charity' : 10
	},
	'split_arr' : [70, 20, 10]
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
var mmc = function(o){
    for(var i, j, n, d, r = 1; (n = o.pop()) != undefined;)
        while(n > 1){
            if(n % 2){
                for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2);
                d = i <= j ? i : n;
            }
            else
                d = 2;
            for(n /= d, r *= d, i = o.length; i; !(o[--i] % d) && (o[i] /= d) == 1 && o.splice(i, 1));
        }
    return r;
};