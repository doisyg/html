<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";


if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

$titre = __('Maps tool');

$plan = new Plan((int)$_GET['id_plan']);

include ('template/header.php');
?>

<div class="inner-wrapper">

	<?php include ('template/gauche.php');?>


<section role="main" class="content-body">
    <header class="page-header">
        <h2><?php echo $titre;?></h2>
    
        <div class="right-wrapper pull-right">
            <ol class="breadcrumbs" style="margin-right:20px;">
                <li>
                    <a href="index.php">
                        <i class="fa fa-home"></i>
                    </a>
                </li>
                <li><span><?php echo $titre;?></span></li>
            </ol>
    
            <!--<a class="sidebar-right-toggle" data-open="sidebar-right"><i class="fa fa-chevron-left"></i></a>-->
        </div>
    </header>

	<?php include ('template/alertes.php');?>

    <!-- start: page -->
    <div class="row" style=" position:relative;">
    	<div id="divNative" class="col-md-3 hidden-xs">
        	<h3>Native map</h3>
            <img id="image" src="data:image/png;base64,<?php echo $plan->image;?>" width="<?php echo $plan->ros_largeur;?>" />
        </div>
    	<div id="divNative" class="col-md-3 hidden-xs">
        	<h3>Trinary map</h3>
            <img id="image_tri" src="data:image/png;base64,<?php echo $plan->image_tri;?>" width="<?php echo $plan->ros_largeur;?>" />
        </div>
    	<div id="divOption" class="col-md-3">
        	<h3>Options</h3>
            
            <section class="panel">
                <div class="panel-body">

                    <div class="mt-lg mb-lg slider-primary" data-plugin-slider data-plugin-options='{ "value": 25, "range": "min", "max": 100 }' data-plugin-slider-output="#threshold_free_slider">
                        <input id="threshold_free_slider" type="hidden" value="25" />
                    </div>
                    <p id="threshold_free_output">Threshold free: <b>25</b></p>
                                        
                    <div class="mt-lg mb-lg slider-primary" data-plugin-slider data-plugin-options='{ "value": 65, "range": "min", "max": 100 }' data-plugin-slider-output="#threshold_occupied_slider">
                        <input id="threshold_occupied_slider" type="hidden" value="65" />
                    </div>
                    <p id="threshold_occupied_output">Threshold occupied: <b>65</b></p>
                </div>
            </section>
            
        </div>
    	<div id="divResult" class="col-md-3">
        	<h3>Result</h3>
            <div style="height:80vh; overflow:auto;">
	        	<canvas id="canvas_result" width="<?php echo $plan->ros_largeur;?>" height="<?php echo $plan->ros_hauteur;?>"></canvas>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>


<?php 
include ('template/footer.php');
?>

<script>

	var threshold_free = 25;
	var threshold_occupied = 65;
	
	var color_free = 255;
	var color_occupied = 0;
	var color_unknow = 200;
	
	var timeoutCalcul = null;

	var img;
	var canvas;
	
	var width = <?php echo $plan->ros_largeur;?>;
	var height = <?php echo $plan->ros_hauteur;?>;
	
	
	function CalculateMap()
	{
		if (timeoutCalcul != null)
		{
			clearTimeout(timeoutCalcul);
			timeoutCalcul = null;
		}
		timeoutCalcul = setTimeout(CalculateMapDo, 500);
	}
	
	function CalculateMapDo()
	{
		threshold_free_255 = 255 - threshold_free / 100 * 255;
		threshold_occupied_255 = 255 - threshold_occupied / 100 * 255;
		
		buffer = new Uint8ClampedArray(width * height * 4); // have enough bytes
		
		for(var y = 0; y < height; y++)
		{
			for(var x = 0; x < width; x++)
			{
				var pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
				
				var pos = (y * width + x) * 4; // position in buffer based on x and y
				
				if (pixelData[3] == 0) // Alpha 0
					color = color_unknow;
				else if (pixelData[0] > threshold_free_255)
					color = color_free;
				else if (pixelData[0] < threshold_occupied_255)
					color = color_occupied;
				else
					color = color_unknow;
				
				buffer[pos  ] = color;           // some R value [0, 255]
				buffer[pos+1] = color;           // some G value
				buffer[pos+2] = color;           // some B value
				buffer[pos+3] = 255;           // set alpha channel
			}
		}
		
		var canvasDessin = document.getElementById('canvas_result'),
		ctx = canvasDessin.getContext('2d');
		
		var idata = ctx.createImageData(width, height);
		idata.data.set(buffer);
		ctx.putImageData(idata, 0, 0);
	}

	(function() {
		
		img = document.getElementById('image');
		canvas = document.createElement('canvas');
		
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
		
		CalculateMap();
		
		$('#threshold_free_slider').change(function() {
			$('#threshold_free_output b').text( this.value );
			threshold_free = this.value;
			
			CalculateMap();
		});
		$('#threshold_occupied_slider').change(function() {
			$('#threshold_occupied_output b').text( this.value );
			threshold_occupied = this.value;
			
			CalculateMap();
		});
	})();
</script>