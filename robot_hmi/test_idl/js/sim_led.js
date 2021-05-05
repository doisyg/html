var nb_LEDs = 37;
var LED_width = 10;
$( window ).on( "load", DrawLEDs );
	
function DrawLEDs(){
	let elo_width = $('#eloLED').outerWidth();
	let offset = -Math.PI * 0.1;
	let offset_absolute = (elo_width/2) ;
	let radius = elo_width *0.6;
	let x,y,div,i;
	//BACK LEDS
	for(let i=0;i<nb_LEDs;i++){
		
		x = radius * Math.cos(( Math.PI * 0.8 * (nb_LEDs - i -1)) / nb_LEDs - offset) + offset_absolute - LED_width/2;
        y = radius * Math.sin(( Math.PI * 0.8 * (nb_LEDs - i -1)) / nb_LEDs - offset) + offset_absolute - LED_width/2;
        div = '<div class="led led_back" data-led="'+(i)+'" data-type="back" id="LED_back_'+(i)+'" style="top:'+(y)+'px;left:'+(x)+'px"></div>';
		$('#LED_wrapper').append(div);
	}
	
	
	//FRONT LEDS
	offset = Math.PI * 0.1;
	for(let i=0;i<nb_LEDs;i++){
		
		x = radius * Math.cos(( -Math.PI * 0.8 * (nb_LEDs - i - 1)) / nb_LEDs - offset) + offset_absolute - LED_width/2;
        y = radius * Math.sin(( -Math.PI * 0.8 * (nb_LEDs - i - 1 )) / nb_LEDs - offset) + offset_absolute - LED_width/2;
        div = '<div class="led led_front" data-led="'+(i)+'" data-type="front" id="LED_front_'+(i)+'" style="top:'+(y)+'px;left:'+(x)+'px;frontground:green;"></div>';
		$('#LED_wrapper').append(div);
	}
	
}

var animations = new AnimationLeds();

$(document).ready(function()
{
	//setInterval(refreshLEDs, 100);
});

function refreshLEDs(){
	// current_anim = animations.ANIM.ANIM_MOVE; //TEST PURPOSE
	if (LED != undefined)
	{
		current_anim = LED.anim;
		current_r = LED.r;
		current_b = LED.b;
		current_g = LED.g;
		voltage = SOC; // last battery .SOC
		leftSpeed = LED.speedLeft;
		rightSpeed = LED.speedRight;
		
		switch(current_anim)
		{
			case animations.ANIM.ANIM_PROGRESS: animations.AnimProgress(current_r, current_g, current_b);  break;
			case animations.ANIM.ANIM_PROGRESS_CENTER: animations.AnimProgressFromCenter(current_r, current_g, current_b);  break;
			case animations.ANIM.ANIM_PROGRESS_CENTER_CHARGE: animations.AnimProgressFromCenterCharge(current_r, current_g, current_b,voltage);  break;
			case animations.ANIM.ANIM_PROGRESS_CENTER_CHARGE_BLINK: animations.AnimProgressFromCenterChargeBlink(current_r, current_g, current_b, voltage); break;
			case animations.ANIM.ANIM_RAINBOW : animations.AnimRainbow(); break;
			case animations.ANIM.ANIM_K2000 : animations.AnimK2000(current_r, current_g, current_b); break;
			case animations.ANIM.ANIM_BLINK : animations.AnimBlink(current_r, current_g, current_b); break;
			case animations.ANIM.ANIM_BLINK_2 : animations.AnimBlink2(current_r, current_g, current_b); break;
			case animations.ANIM.ANIM_POLICE  : animations.AnimPolice(); break;
			case animations.ANIM.ANIM_FADE : animations.AnimFade(current_r, current_g, current_b); break;
			case animations.ANIM.ANIM_MOVE : animations.Move(current_r, current_g, current_b, leftSpeed, rightSpeed); break;
			case animations.ANIM.ANIM_LIGHT : animations.AnimLight(current_r, current_g, current_b); break;
			case animations.ANIM.ANIM_FADE_FR_FLAG : animations.AnimFadeFrFlag(); break;
			case animations.ANIM.ANIM_CUSTOM : animations.AnimCustom(_custom_msg); break;
			
			default: animations.AnimProgressFromCenter(current_r, current_g, current_b); break;
		}
		
		//console.log(animations.frontLeds);
		
		// Avant
		for(let i=0 ; i<nb_LEDs ; i++)
		{
			nom_div = '#LED_front_'+i;
		   
			$(nom_div).css('background', 'rgb('+animations.frontLeds[i][0]+', '+animations.frontLeds[i][1]+', '+animations.frontLeds[i][2]+')');
		   
		}
	
		// Arriere
		for(let i=0 ; i<nb_LEDs ; i++)
		{
			nom_div = '#LED_back_'+i;
		   
			$(nom_div).css('background', 'rgb('+animations.backLeds[i][0]+', '+animations.backLeds[i][1]+', '+animations.backLeds[i][2]+')');
		   
		}
	}
}

