function AnimationLeds()
{
	
	this.ANIM = {
		ANIM_PROGRESS: 1,
		ANIM_PROGRESS_CENTER:2,
		ANIM_PROGRESS_CENTER_CHARGE:3,
		ANIM_PROGRESS_CENTER_CHARGE_BLINK: 4,
		ANIM_RAINBOW : 5,
		ANIM_K2000 : 6,
		ANIM_BLINK : 7,
		ANIM_BLINK_2 : 8,
		ANIM_POLICE  : 9,
		ANIM_FADE : 10,
		ANIM_MOVE : 11,
		ANIM_LIGHT : 12,
		ANIM_FADE_FR_FLAG : 13,
		ANIM_CUSTOM : 14,
	};
	
	this.currentLed = 0;
	this.currentLed2 = 0;
	this.centre = 0;
	this.directionK2000G = 0;
	this.directionK2000G1 = 0;
	this.directionK2000G2 = 0;
	this.directionK2000G3 = 0;
	this.directionK2000D = 0;
	this.directionK2000D1 = 0;
	this.directionK2000D2 = 0;
	this.directionK2000D3 = 0;
	this.blinkK2000 = 0;
	this.onBlinkK2000 = 0;

	this.currentLedLeft = 0;
	this.currentLedLeft1 = 0;
	this.currentLedLeft2 = 0;
	this.currentLedLeft3 = 0;
	this.currentLedLeft4 = 0;
	
	this.currentLedRight = 0;
	this.currentLedRight1 = 0;
	this.currentLedRight2 = 0;
	this.currentLedRight3 = 0;
	this.currentLedRight4 = 0;
	
	this.l = 0;
	this.l1 = 0;
	this.l2 = 0;
	this.l3 = 0;
	this.l4 = 0;

	this.time_loop = 0;

	this.luminosite = 0;
	this.directionAugmente = true;

	this.c = [0,0,0];

	this.counter = 0;
	this.chasePeriodInMs = 0;
	this.chaseWait = 0;
	this.chaseWaitLeft = 0;
	this.chaseWaitRight = 0;

	this.rainbowColor = 0;

	
	
	this.ledsNumber = 37;
	this.lastAnim = -1;
	this.counter = 0;
	this.time_loop = 10;
	this.chasePeriodInMs = 75;
	this.chaseWait = 0; // this.chasePeriodInMs * this.frequenceIT / 1000;
	this.chaseWaitLeft = this.chaseWait;
	this.chaseWaitRight = this.chaseWait;
	this.rainbowColor = 0;
	this.i = 0;
	
	this.frontLeds = Array();
	this.backLeds = Array();
	
	this.frequenceIT = 30; // Hz
	
	for(i=0 ; i<this.ledsNumber ; i++)
    {
      this.frontLeds.push([0,0,0]);
      this.backLeds.push([0,0,0]);
    }
	
	this.setLeds = function()
	{
	};
	
	this.AnimProgress = function(r, g, b)
	{
		if (this.lastAnim != 2)
		{
			this.lastAnim = 2;
			// Init
		}
		this.chaseWait = 0; //150 * this.frequenceIT / 1000;

		if (this.counter > 0)
		{
			this.counter--;
		}
		else
		{
			this.counter = this.chaseWait;

			this.i = 0;
			for (this.i = 0; this.i<this.ledsNumber; this.i++)
			{
				this.frontLeds[this.i]= [0, 0, 0];
				this.backLeds[this.i]= [0, 0, 0];
			}

			for (this.i = 0; this.i <= this.currentLedLeft; this.i++)
			{
				if (this.i < parseInt(this.ledsNumber / 2) + 1)
				{
					this.backLeds[parseInt(this.ledsNumber /2) - this.i]= [
						parseInt(r * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(g * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(b * ((this.i + 1) / (this.currentLedLeft + 1)))];
					this.backLeds[parseInt(this.ledsNumber /2) + this.i] = [
						parseInt(r * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(g * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(b * ((this.i + 1) / (this.currentLedLeft + 1)))];
				}
				else
				{
					this.frontLeds[this.i - parseInt(this.ledsNumber /2) - 1]= [
						parseInt(r * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(g * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(b * ((this.i + 1) / (this.currentLedLeft + 1)))];
					this.frontLeds[this.ledsNumber - (this.i - parseInt(this.ledsNumber /2))]= [
						parseInt(r * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(g * ((this.i + 1) / (this.currentLedLeft + 1))), 
						parseInt(b * ((this.i + 1) / (this.currentLedLeft + 1)))];
				}
			}

			this.currentLedLeft++;
			if (this.currentLedLeft >= this.ledsNumber) this.currentLedLeft = 0;

			this.setLeds();
		}
	};
	
}