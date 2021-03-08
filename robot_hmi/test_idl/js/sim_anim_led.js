function AnimationLeds()
{

	this.ANIM = {
		ANIM_PROGRESS: 1,
		ANIM_PROGRESS_CENTER:2,
		ANIM_RAINBOW:3,
		ANIM_K2000:4,
		ANIM_BLINK:5,
		ANIM_BLINK_2:6,
		ANIM_POLICE:7,
		ANIM_FADE:8,
		ANIM_MOVE:9,
		ANIM_LIGHT:10,
		ANIM_PROGRESS_CENTER_CHARGE:11,
		ANIM_PROGRESS_CENTER_CHARGE_BLINK:12,
		ANIM_FADE_FR_FLAG:13,
		ANIM_CUSTOM:14,
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

	this.luminosite = 0;
	this.directionAugmente = true;

	this.c = [0,0,0];

	this.counter = 0;
	this.chasePeriodInMs = 0;
	this.chaseWait = 0;
	this.chaseWaitLeft = 0;
	this.chaseWaitRight = 0;

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
	
	this.directionMoveG = 0;
	this.counterLeft = 0;
	this.directionMoveD = 0;
	this.counterRight = 0;
	
	for(i=0 ; i<this.ledsNumber ; i++)
    {
		this.frontLeds.push([0,0,0]);
		this.backLeds.push([0,0,0]);
    }

	this.setLeds = function()
	{
	};

	this.Move = function(r, g, b, leftSpeed, rightSpeed)
	{
		if (this.lastAnim != 1)
		{
			this.lastAnim = 1;
			// Init
			this.currentLedRight = 0;
			this.currentLedLeft = 0;
		}
		// LEFT
		if (this.counterLeft > 0)
		{
			this.counterLeft--;
		}
		else
		{
			
			for (this.i = parseInt(this.ledsNumber/2 + 1); this.i<this.ledsNumber; this.i++)
			{
				this.frontLeds[this.i]= [0, 0, 0];
				this.backLeds[this.i]= [0, 0, 0];
			}

			if (this.currentLedLeft >= this.time_loop) this.currentLedLeft = 0;
			if (this.currentLedLeft < 0) this.currentLedLeft = this.time_loop-1;
			
			if (leftSpeed > 0)
			{
				if (((150 - leftSpeed) + 1) < 50) this.chaseWaitLeft = 50;
				else this.chaseWaitLeft = ((150 - leftSpeed) + 1);
				this.chaseWaitLeft = this.chaseWaitLeft * this.frequenceIT / 1000;
				this.directionMoveG = 1;
			}
			else
			{
				if (((150 + leftSpeed) + 1) < 50) this.chaseWaitLeft = 50;
				else this.chaseWaitLeft = ((150 + leftSpeed) + 1);
				this.chaseWaitLeft = this.chaseWaitLeft * this.frequenceIT / 1000;
				this.directionMoveG = 0;
			}
			
			this.counterLeft = this.chaseWaitLeft;
			
			
			if (this.directionMoveG == 0) // Changement de this.direction
			{
				this.currentLedLeft1 = this.currentLedLeft + 1;
				this.currentLedLeft2 = this.currentLedLeft + 2;
				this.currentLedLeft3 = this.currentLedLeft + 3;
				this.currentLedLeft4 = this.currentLedLeft + 4;
			   
				if (this.currentLedLeft1 >= this.time_loop) this.currentLedLeft1 = this.currentLedLeft1 - this.time_loop;
				if (this.currentLedLeft2 >= this.time_loop) this.currentLedLeft2 = this.currentLedLeft2 - this.time_loop;
				if (this.currentLedLeft3 >= this.time_loop) this.currentLedLeft3 = this.currentLedLeft3 - this.time_loop;
				if (this.currentLedLeft4 >= this.time_loop) this.currentLedLeft4 = this.currentLedLeft4 - this.time_loop;
			 }                                                                  
			 else
			 {
				this.currentLedLeft1 = this.currentLedLeft - 1;
				this.currentLedLeft2 = this.currentLedLeft - 2;
				this.currentLedLeft3 = this.currentLedLeft - 3;
				this.currentLedLeft4 = this.currentLedLeft - 4;
	
				if (this.currentLedLeft1 < 0) this.currentLedLeft1 = this.time_loop + this.currentLedLeft1;
				if (this.currentLedLeft2 < 0) this.currentLedLeft2 = this.time_loop + this.currentLedLeft2;
				if (this.currentLedLeft3 < 0) this.currentLedLeft3 = this.time_loop + this.currentLedLeft3;
				if (this.currentLedLeft4 < 0) this.currentLedLeft4 = this.time_loop + this.currentLedLeft4;
			 }
			 
			this.l = this.currentLedLeft;
			this.l1 = this.currentLedLeft1;
			this.l2 = this.currentLedLeft2;
			this.l3 = this.currentLedLeft3;
			this.l4 = this.currentLedLeft4;
			
			for (this.i = 0; this.i < 5; this.i++)
			{
				if (this.l4 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) + this.l4] = [(r * 25) >> 8, (g * 25) >> 8, (b * 25) >> 8];
				else if(this.l4 <= this.ledsNumber) this.frontLeds[this.ledsNumber - (this.l4 - parseInt(this.ledsNumber/2))] = [(r * 25) >> 8, (g * 25) >> 8, (b * 25) >> 8];

				if (this.l3 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) + this.l3] = [(r * 75) >> 8, (g * 75) >> 8, (b * 75) >> 8];
				else if(this.l3 < this.ledsNumber) this.frontLeds[this.ledsNumber - (this.l3 - parseInt(this.ledsNumber/2))] = [(r * 75) >> 8, (g * 75) >> 8, (b * 75) >> 8];
		
				if (this.l2 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) + this.l2] = [(r * 125) >> 8, (g * 125) >> 8, (b * 125) >> 8];
				else if(this.l2 <= this.ledsNumber) this.frontLeds[this.ledsNumber - (this.l2 - parseInt(this.ledsNumber/2))] = [(r * 125) >> 8, (g * 125) >> 8, (b * 125) >> 8];
		
				if (this.l1 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) + this.l1] = [(r * 175) >> 8, (g * 175) >> 8, (b * 175) >> 8];
				else if(this.l1 <= this.ledsNumber) this.frontLeds[this.ledsNumber - (this.l1 - parseInt(this.ledsNumber/2))] = [(r * 175) >> 8, (g * 175) >> 8, (b * 175) >> 8];
		
				if (this.l <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) + this.l]= [r, g, b];
				else if(this.l <= this.ledsNumber) this.frontLeds[this.ledsNumber - (this.l - parseInt(this.ledsNumber/2))]= [r, g, b];
		
				this.l4 += this.time_loop;
				this.l3 += this.time_loop;
				this.l2 += this.time_loop;
				this.l1 += this.time_loop;
				this.l += this.time_loop;
			}

			if (this.directionMoveG == 1)
			{
				this.currentLedLeft++;
			}
			else
			{
				this.currentLedLeft--;
			}				
		}
		 //RIGHT
		if (this.counterRight > 0)
		{
			this.counterRight--;
		}
		else
		{ 
			for (this.i = 0; this.i<=parseInt(this.ledsNumber/2); this.i++)
			{
				  this.frontLeds[this.i]= [0, 0, 0];
				  this.backLeds[this.i]= [0, 0, 0];
			}
			
			if (this.currentLedRight >= this.time_loop) this.currentLedRight = 0;
			if (this.currentLedRight < 0) this.currentLedRight = this.time_loop-1;
			
			if (rightSpeed > 0)
			{
			   if (((150 - rightSpeed) + 1) < 50) this.chaseWaitRight = 50;
			   else this.chaseWaitRight = ((150 - rightSpeed) + 1);
			   this.chaseWaitRight = this.chaseWaitRight * this.frequenceIT / 1000;
			   this.directionMoveG = 1;
			}
			else
			{
			   if (((150 + rightSpeed) + 1) < 50) this.chaseWaitRight = 50;
			   else this.chaseWaitRight = ((150 + rightSpeed) + 1);
			   this.chaseWaitRight = this.chaseWaitRight * this.frequenceIT / 1000;
			   this.directionMoveG = 0;
			}
			
			this.counterRight = this.chaseWaitRight;

			if (this.directionMoveG == 0) // Changement de this.direction
			{
				this.currentLedRight1 = this.currentLedRight + 1;
				this.currentLedRight2 = this.currentLedRight + 2;
				this.currentLedRight3 = this.currentLedRight + 3;
				this.currentLedRight4 = this.currentLedRight + 4;
			
				if (this.currentLedRight1 >= this.time_loop) this.currentLedRight1 = this.currentLedRight1 - this.time_loop;
				if (this.currentLedRight2 >= this.time_loop) this.currentLedRight2 = this.currentLedRight2 - this.time_loop;
				if (this.currentLedRight3 >= this.time_loop) this.currentLedRight3 = this.currentLedRight3 - this.time_loop;
				if (this.currentLedRight4 >= this.time_loop) this.currentLedRight4 = this.currentLedRight4 - this.time_loop;
			}
			else
			{
				this.currentLedRight1 = this.currentLedRight - 1;
				this.currentLedRight2 = this.currentLedRight - 2;
				this.currentLedRight3 = this.currentLedRight - 3;
				this.currentLedRight4 = this.currentLedRight - 4;
		
				if (this.currentLedRight1 < 0) this.currentLedRight1 = this.time_loop + this.currentLedRight1;
				if (this.currentLedRight2 < 0) this.currentLedRight2 = this.time_loop + this.currentLedRight2;
				if (this.currentLedRight3 < 0) this.currentLedRight3 = this.time_loop + this.currentLedRight3;
				if (this.currentLedRight4 < 0) this.currentLedRight4 = this.time_loop + this.currentLedRight4;
			}

			this.l = this.currentLedRight;
			this.l1 = this.currentLedRight1;
			this.l2 = this.currentLedRight2;
			this.l3 = this.currentLedRight3;
			this.l4 = this.currentLedRight4;

			for (this.i = 0; this.i < 5; this.i++)
			{
				if (this.l4 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) - this.l4] = [(r * 25) >> 8, (g * 25) >> 8, (b * 25) >> 8];
				else if(this.l4 <= this.ledsNumber) this.frontLeds[this.l4 - parseInt(this.ledsNumber/2)] = [(r * 25) >> 8, (g * 25) >> 8, (b * 25) >> 8];

				if (this.l3 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) - this.l3] = [(r * 75) >> 8, (g * 75) >> 8, (b * 75) >> 8];
				else if(this.l3 <= this.ledsNumber) this.frontLeds[this.l3 - parseInt(this.ledsNumber/2)] = [(r * 75) >> 8, (g * 75) >> 8, (b * 75) >> 8];

				if (this.l2 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) - this.l2] = [(r * 125) >> 8, (g * 125) >> 8, (b * 125) >> 8];
				else if(this.l2 <= this.ledsNumber) this.frontLeds[this.l2 - parseInt(this.ledsNumber/2)] = [(r * 125) >> 8, (g * 125) >> 8, (b * 125) >> 8];

				if (this.l1 <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) - this.l1] = [(r * 175) >> 8, (g * 175) >> 8, (b * 175) >> 8];
				else if(this.l1 <= this.ledsNumber) this.frontLeds[this.l1 - parseInt(this.ledsNumber/2)] = [(r * 175) >> 8, (g * 175) >> 8, (b * 175) >> 8];

				if (this.l <= this.ledsNumber/2) this.backLeds[parseInt(this.ledsNumber/2) - this.l]= [r, g, b];
				else if(this.l <= this.ledsNumber) this.frontLeds[this.l - parseInt(this.ledsNumber/2)]= [r, g, b];

				this.l += this.time_loop;
				this.l1 += this.time_loop;
				this.l2 += this.time_loop;
				this.l3 += this.time_loop;
				this.l4 += this.time_loop;
			}

			if (this.directionMoveG == 1)
			{
				this.currentLedRight++;
			}
			else
			{
				this.currentLedRight--;
			}
		}
		this.setLeds();
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

	this.AnimProgressFromCenter =  function(r, g, b)
	{
		intensite = 0;
		if (this.lastAnim != 3)
		{
			this.lastAnim = 3;
			// Init
			this.currentLed = 0;
		}

		this.chaseWait = 150 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}
			for (this.i = 0; this.i <= this.currentLed; this.i++)
			{
				intensite = (this.i + 1) /(this.currentLed + 1);

				c =[parseInt(r * intensite),parseInt(g * intensite), parseInt(b * intensite)];
				this.frontLeds[this.i]= c;
				this.frontLeds[this.ledsNumber - this.i - 1]= c;

				this.backLeds[this.i]= c;
				this.backLeds[this.ledsNumber - this.i - 1]= c;
			}		
			this.currentLed++;
			if (this.currentLed >= parseInt((this.ledsNumber / 2) + 1)) this.currentLed = 0;

			this.setLeds();
		}
	},

	this.AnimProgressFromCenterCharge =  function(r, g, b, charge)
	{
		intensite = 0;
		nb_on = parseInt((this.ledsNumber/2 + 1) * charge/100)
		if (this.lastAnim != 3)
		{
			this.lastAnim = 3;
			// Init
			this.currentLed = nb_on + 1;
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}

			if (nb_on < 1) nb_on = 1;
			c = [r,g,b];
			for (this.i = 0; this.i <= nb_on; this.i++)
			{
				this.frontLeds[this.i]= c;
				this.frontLeds[this.ledsNumber - this.i - 1]= c;
				this.backLeds[this.i]= c;
				this.backLeds[this.ledsNumber - this.i - 1]= c;
			}

			if (this.currentLed < nb_on) this.currentLed = nb_on + 1;
			if (this.currentLed < parseInt(this.ledsNumber / 2 + 1))
			{
				for (this.i = nb_on+1; this.i <= this.currentLed; this.i++)
				{
					intensite = ((this.i + 1) / (this.currentLed + 1));

					c = [parseInt(r * intensite),parseInt(g * intensite), parseInt(b * intensite)];
					this.frontLeds[this.i]= c;
					this.frontLeds[this.ledsNumber - this.i - 1]= c;

					this.backLeds[this.i]= c;
					this.backLeds[this.ledsNumber - this.i - 1]= c;
				}
			}

			this.currentLed++;
			if (this.currentLed >= parseInt(this.ledsNumber / 2 + 1)) this.currentLed = nb_on;

			this.setLeds();
		}
	},

	this.AnimProgressFromCenterChargeBlink =  function(r, g, b, charge)
	{
		if (charge > 99)
		{
			this.AnimFade(r,g,b);
			return;
		}
		
		intensite = 0;
		nb_on = parseInt((this.ledsNumber/2 + 1) * charge/100)
		if (this.lastAnim != 3)
		{
			this.lastAnim = 3;
			// Init
			this.currentLed = 0;
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}

			if (nb_on < 1) nb_on = 1;
			c = [r,g,b];
			for (this.i = 0; this.i <= nb_on; this.i++)
			{
				this.frontLeds[this.i]= c;
				this.frontLeds[this.ledsNumber - this.i - 1]= c;
				this.backLeds[this.i]= c;
				this.backLeds[this.ledsNumber - this.i - 1]= c;
			}
			index = 0;
			for (this.i = 0; this.i < 5; this.i++)
			{
				index = this.i + this.currentLed;
				if (index < 0) index = nb_on - index + 1;
				if (index > nb_on) index = index - nb_on - 1;
				if (index < 0) index = 0;

				intensite = 0.25 + (5.0 - this.i) / 5.0 * 0.5;

				c = [parseInt(r * intensite),parseInt(g * intensite), parseInt(b * intensite)];
				this.frontLeds[index]= c;
				this.frontLeds[this.ledsNumber - (index) - 1]= c;

				this.backLeds[index]= c;
				this.backLeds[this.ledsNumber - (index) - 1]= c;

			}

			this.currentLed++;
			if (this.currentLed >= nb_on) this.currentLed = 0;

			this.setLeds();
		}
	},
	
	this.AnimPolice = function ()
	{
		if (this.lastAnim != 4)
		{
			this.lastAnim = 4;
			// Init
			this.currentLed = 0;
			this.currentLed2 = 0;
			this.centre = parseInt(this.ledsNumber/2);
		}

		this.chaseWait = 2; //100 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}
			
			if (this.currentLed2 < 5)
			{
				if (this.currentLed == 0 || this.currentLed == 2)
				{
					for (this.i  = this.centre + 3; this.i  < this.ledsNumber; this.i++)
					{
						this.backLeds[this.i] = [0, 51, 255];
						this.frontLeds[this.i] = [0, 51, 255];
					}
					for (this.i  = this.centre - 2; this.i  <= this.centre + 2; this.i++)
					{
						this.backLeds[this.i] = [255, 255, 255];
						this.frontLeds[this.i] = [255, 255, 255];
					}
				}
				
				if (this.currentLed == 4 || this.currentLed == 6)
				{
					for (this.i = 0; this.i  <= this.centre - 3; this.i++)
					{
						this.backLeds[this.i] = [204, 0, 0];
						this.frontLeds[this.i] = [204, 0, 0];
					}
					for (this.i = this.centre - 2; this.i  <= this.centre + 2; this.i++)
					{
						this.backLeds[this.i] = [255, 255, 255];
						this.frontLeds[this.i] = [255, 255, 255];
					}
				}
			}
			else if (this.currentLed2 < 10)
			{
				
				if (this.currentLed == 0)
				{
					for (this.i = this.centre + 10; this.i < this.ledsNumber; this.i++)
					{
						this.backLeds[this.i] = [0, 51, 255];
						this.frontLeds[this.i] = [0, 51, 255];
					}
					for (this.i = 0; this.i <= this.centre - 10; this.i++)
					{
						this.backLeds[this.i] = [204, 0, 0];
						this.frontLeds[this.i] = [204, 0, 0];
					}
				}
				if (this.currentLed == 2 || this.currentLed == 4)
				{
					for (this.i = this.centre - 10; this.i <= this.centre - 3; this.i++)
					{
						this.backLeds[this.i] = [204, 0, 0];
						this.frontLeds[this.i] = [204, 0, 0];
					}
					for (this.i = this.centre + 3; this.i <= this.centre + 10; this.i++)
					{
						this.backLeds[this.i] = [0, 51, 255];
						this.frontLeds[this.i] = [0, 51, 255];
					}
					for (this.i = this.centre - 2; this.i <= this.centre + 2; this.i++)
					{
						this.backLeds[this.i] = [255, 255, 255];
						this.frontLeds[this.i] = [255, 255, 255];
					}
				}
			}
			else
			{
				if (this.currentLed == 0 || this.currentLed == 2)
				{
					for (this.i = this.centre + 10; this.i < this.ledsNumber; this.i++)
					{
						this.backLeds[this.i] = [0, 51, 255];
						this.frontLeds[this.i] = [0, 51, 255];
					}
				}
				if (this.currentLed == 4 || this.currentLed == 6)
				{
					for (this.i = this.centre - 10; this.i <= this.centre - 3; this.i++)
					{
						this.backLeds[this.i] = [204, 0, 0];
						this.frontLeds[this.i] = [204, 0, 0];
					}
					for (this.i = this.centre + 3; this.i <= this.centre + 10; this.i++)
					{
						 this.backLeds[this.i] = [204, 0, 0];
						 this.frontLeds[this.i] = [204, 0, 0];
					}
					for (this.i = this.centre - 2; this.i <= this.centre + 2; this.i++)
					{
						this.backLeds[this.i] = [255, 255, 255];
						this.frontLeds[this.i] = [255, 255, 255];
					}
				}
				if (this.currentLed == 8 || this.currentLed == 10)
				{
					for (this.i = 0; this.i <= this.centre - 10; this.i++)
					{
						this.backLeds[this.i] = [204, 0, 0];
						this.frontLeds[this.i] = [204, 0, 0];
					}
				}
			}
			this.currentLed++;
			if (this.currentLed2 < 5)
			{
				if (this.currentLed > 8)
				{
					this.currentLed = 0;
					this.currentLed2++;
				}
			}
			else if (this.currentLed2 < 10)
			{
				if (this.currentLed > 6)
				{
					this.currentLed = 0;
					this.currentLed2++;
				}
			}
			else
			{
				if (this.currentLed > 10)
				{
					this.currentLed = 0;
					this.currentLed2++;
					if (this.currentLed2 >= 15) this.currentLed2 = 0;
				}
			}
			
			this.setLeds();
		}
	},
		
	this.AnimK2000 =  function(r, g, b)
	{
		if (this.lastAnim != 5)
		{
			this.lastAnim = 5;
			// Init
			this.currentLedLeft = 3;
			this.currentLedLeft1 = this.currentLedLeft - 1;
			this.currentLedLeft2 = this.currentLedLeft - 2;
			this.currentLedLeft3 = this.currentLedLeft - 3;

			this.directionK2000G1 = this.directionK2000G;
			this.directionK2000G2 = this.directionK2000G;
			this.directionK2000G3 = this.directionK2000G;
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}
			if (this.currentLedLeft3 >= 0)
			{
				this.backLeds[this.currentLedLeft3]= [(r * 25) >> 8, (g * 25) >> 8, (b * 25) >> 8];
				this.frontLeds[this.currentLedLeft3]= [(r * 25) >> 8, (g * 25) >> 8, (b * 25) >> 8];
			}
			if (this.currentLedLeft2 >= 0)
			{
				this.backLeds[this.currentLedLeft2]= [(r * 100) >> 8, (g * 100) >> 8, (b * 100) >> 8];
				this.frontLeds[this.currentLedLeft2]= [(r * 100) >> 8, (g * 100) >> 8, (b * 100) >> 8];
			}
			if (this.currentLedLeft1 >= 0)
			{
				this.backLeds[this.currentLedLeft1]= [(r * 200) >> 8, (g * 200) >> 8, (b * 200) >> 8];
				this.frontLeds[this.currentLedLeft1]= [(r * 200) >> 8, (g * 200) >> 8, (b * 200) >> 8];
			}

			this.backLeds[this.currentLedLeft]= [r, g, b];
			this.frontLeds[this.currentLedLeft]= [r, g, b];


			this.blinkK2000++;
			this.blinkK2000 %= 10;
			if (this.blinkK2000 == 0)
			{
				this.onBlinkK2000++;
				this.onBlinkK2000 %= 2;
			}

			// Left
			if (this.directionK2000G == 0)
			{
				this.currentLedLeft++;
				if (this.currentLedLeft >= this.ledsNumber -1 ) this.directionK2000G = 1;
			}
			else
			{
				this.currentLedLeft--;
				if (this.currentLedLeft <= 0) this.directionK2000G = 0;
			}
			if (this.directionK2000G1 == 0)
			{
				this.currentLedLeft1++;
				if (this.currentLedLeft1 >= this.ledsNumber -1) this.directionK2000G1 = 1;
			}
			else
			{
				this.currentLedLeft1--;
				if (this.currentLedLeft1 <= 0) this.directionK2000G1 = 0;
			}
			if (this.directionK2000G2 == 0)
			{
				this.currentLedLeft2++;
				if (this.currentLedLeft2 >= this.ledsNumber -1) this.directionK2000G2 = 1;
			}
			else
			{
				this.currentLedLeft2--;
				if (this.currentLedLeft2 <= 0) this.directionK2000G2 = 0;
			}
			if (this.directionK2000G3 == 0)
			{
				this.currentLedLeft3++;
				if (this.currentLedLeft3 >= this.ledsNumber -1) this.directionK2000G3 = 1;
			}
			else
			{
				this.currentLedLeft3--;
				if (this.currentLedLeft3 <= 0) this.directionK2000G3 = 0;
			}
			this.setLeds();
		}
	},
	
	this.AnimBlink =  function(r, g, b)
	{
		if (this.lastAnim != 8)
		{
			this.lastAnim = 8;
			// Init
			this.currentLedLeft = 0;
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

		if (this.counter > 0)
		{
			this.counter--;
		}
		else
		{
			this.counter = this.chaseWait;
			
			if (this.currentLedLeft < 4)
			{
				c = [r, g, b];
				this.i = 0;
				for (this.i = 0; this.i < this.ledsNumber; this.i++)
				{
					this.backLeds[this.i]= c;
					this.frontLeds[this.i]= c;
				}
			}
			else
			{
				c = [0, 0, 0];
				for (this.i = 0; this.i<this.ledsNumber; this.i++)
				{
					this.backLeds[this.i]= c;
					this.frontLeds[this.i]= c;
				}
			}

			this.currentLedLeft++;
			if (this.currentLedLeft >= 8) this.currentLedLeft = 0;
			this.setLeds();
		}
	},
	
	this.AnimBlink2 =  function(r, g, b)
	{
		if (this.lastAnim != 9)
		{
			this.lastAnim = 9;
			// Init
			this.currentLedLeft = 0;
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}
			c = [r, g, b];
			if (this.currentLedLeft < 4)
			{
				for (this.i = 0; this.i < 5; this.i++)
				{
					j = 0;
					while (this.i+j < this.ledsNumber)
					{
						this.backLeds[this.i+j]= c;
						this.frontLeds[this.ledsNumber - (this.i+j) - 1]= c;
						j += 10;
					}



				}
			}
			else
			{
				for (this.i = 0; this.i < 5; this.i++)
				{
					j = 5;
					while (this.i+j < this.ledsNumber)
					{
						this.backLeds[this.i+j]= c;
						this.frontLeds[this.ledsNumber - (this.i+j) - 1]= c;
						j += 10;
					}



				}
			}

			this.currentLedLeft++;
			if (this.currentLedLeft >= 8) this.currentLedLeft = 0;
			this.setLeds();
		}
	},
	
	this.AnimLight =  function(r, g, b)
	{
		if (this.lastAnim != 10)
		{
			this.lastAnim = 10;
			// Init
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

		if (this.counter > 0)
		{
			this.counter--;
		}
		else
		{
			this.counter = this.chaseWait;
			
			c = [r, g, b];
			this.i = 0;
			for (this.i = 0; this.i<this.ledsNumber; this.i++)
			{
				this.frontLeds[this.i]= c;
				this.backLeds[this.i] = c;
			}
			this.setLeds();
		}
	},
	
	this.AnimFade =  function(r, g, b)
	{
		if (this.lastAnim != 6)
		{
			this.lastAnim = 6;
			// Init
			this.luminosite = 50;
			this.directionAugmente = true;
		}

		this.chaseWait = 0;//50 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}
			// rouge
			c = [(r * this.luminosite)>> 8,(g * this.luminosite) >> 8, (b * this.luminosite) >> 8];
			
			for (this.i = 0; this.i<this.ledsNumber; this.i++)
			{
				this.frontLeds[this.i]= c;
				this.backLeds[this.i] = c;
			}


			if (this.directionAugmente)
				this.luminosite += 5;
			else
				this.luminosite -= 5;
			if (this.luminosite >= 200)
			{
				this.luminosite = 200;
				this.directionAugmente = false;
			}
			if (this.luminosite <= 50)
			{
				this.luminosite = 50;
				this.directionAugmente = true;
			}
			this.setLeds();
		}
	},
	
	this.AnimFadeFrFlag =  function()
	{
		if (this.lastAnim != 6)
		{
			this.lastAnim = 6;
			// Init
			luminosite = 50;
			directionAugmente = true;
		}

		this.chaseWait = 0;//150 * this.frequenceIT / 1000;

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
				this.frontLeds[this.i]= [0,0,0];
				this.backLeds[this.i] = [0,0,0];
			}
			// rouge
			c =[(238 * this.luminosite) >> 8, (40 * this.luminosite) >> 8, (57 * this.luminosite) >> 8];
			for (this.i = parseInt(this.ledsNumber / 3 * 2); this.i < this.ledsNumber; this.i++)
				this.frontLeds[this.i]= c;
			for (this.i = 0; this.i < parseInt(this.ledsNumber/3); this.i++)
				this.backLeds[this.i]= c;



			// blanc
			c =[(255 * this.luminosite) >> 8, (255 * this.luminosite) >> 8, (255 * this.luminosite) >> 8];
			for (this.i = parseInt(this.ledsNumber / 3); this.i < parseInt(this.ledsNumber / 3 * 2); this.i++)
			{
				this.frontLeds[this.i]= c;
				this.backLeds[this.i]= c;
			}

			// bleu
			c =[(1 * this.luminosite) >> 8, (37 * this.luminosite) >> 8, (151 * this.luminosite) >> 8];
			for (this.i = 0; this.i < parseInt(this.ledsNumber/3); this.i++)
				this.frontLeds[this.i]= c;
			for (this.i = parseInt(this.ledsNumber / 3 * 2); this.i < this.ledsNumber; this.i++)
				this.backLeds[this.i]= c;

			if (this.directionAugmente)
				this.luminosite += 5;
			else
				this.luminosite -= 5;
			if (this.luminosite >= 200)
			{
				this.luminosite = 200;
				this.directionAugmente = false;
			}
			if (this.luminosite <= 50)
			{
				this.luminosite = 50;
				this.directionAugmente = true;
			}
			this.setLeds();
		}
	},
	
	this.Wheel = function(WheelPos)
	{
		WheelPos = 255 - WheelPos;
		if (WheelPos < 85) {
			return [255 - WheelPos * 3, 0, WheelPos * 3];
		}
		if (WheelPos < 170) {
			WheelPos -= 85;
			return [0, WheelPos * 3, 255 - WheelPos * 3];
		}
		WheelPos -= 170;
		return [WheelPos * 3, 255 - WheelPos * 3, 0];
	}

	this.AnimRainbow = function()
	{
		if (this.lastAnim != 7)
		{
			this.lastAnim = 7;
			// Init
			this.rainbowColor = 0;
		}
		this.rainbowColor+=5;
		if (this.rainbowColor >= 256) this.rainbowColor = 0;

		for (this.i = 0; this.i<this.ledsNumber; this.i++)
			this.backLeds[this.i]= this.Wheel((this.i + this.rainbowColor) & 255);

		for (this.i = 0; this.i<this.ledsNumber; this.i++)
			this.frontLeds[this.i]= this.Wheel((this.ledsNumber + (this.ledsNumber - this.i) + this.rainbowColor) & 255);
			
	}
	
	this.AnimCustom =  function(custom)
	{
		this.i = 0;
		for (this.i = 0; this.i < this.ledsNumber*2; this.i++)
		{
			c = [custom.leds_colors[this.i].r, custom.leds_colors[this.i].g, custom.leds_colors[this.i].b];
			if (this.i < this.ledsNumber)
			{
				this.frontLeds[this.i] = c;
			}
			else
			{
				this.backLeds[this.i - this.ledsNumber] = c;
			}
		}
	}
	
	
	
	
	
	

}