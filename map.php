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
    <div class="row">
        <div class="" style="height:calc(100vh - 100px);">
            <div id="container_all" class="row" style="position:relative; height:calc(100vh - 100px);">
            
            	    <div id="zoom_carte_container">
                        <div id="zoom_carte">
                        	<img src="data:image/png;base64,<?php echo $plan->image;?>"  class="img-responsive" style="max-width:100%; max-height:100%;" />
                            <div id="zone_zoom" style="position:absolute; border:1px solid #00F;"></div>
                            <div id="zone_zoom_click" style="position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;"></div>
                        </div>
                    </div>
                
                    <div id="all" style="position:relative; margin:auto; width:100%; height:calc(100vh - 100px);">
                        <div id="map_navigation" class="zoom" style="position:relative; width:100%; height:calc(100vh - 100px); margin:auto; border:1px solid #000;">
                            <svg id="svg" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                            	<image  xlink:href="data:image/png;base64,<?php echo $plan->image;?>" x="0" y="0" height="<?php echo $plan->ros_hauteur*5;?>" width="<?php echo $plan->ros_largeur*5;?>" />
                            </svg>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    </div>
                </div>
            
                <div class="btn-group dropup"  style="position:absolute; bottom:20px; right:10px;">
                    <button type="button" class="mb-xs mt-xs mr-xs btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-plus"></i></button>
                    <ul class="dropdown-menu" role="menu" style="left:auto; right:0;">
                        <li><a href="#"><?php echo __('Forbidden area');?></a></li>
                        <li><a href="#"><?php echo __('Area');?></a></li>
                        <li class="divider"></li>
                        <li><a href="#" data-toggle="modal" data-target="#modalCreateFromWhere"><?php echo __('Docking station');?></a></li>
                        <li><a href="#" data-toggle="modal" data-target="#modalCreateFromWhere"><?php echo __('POI');?></a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>

<div id="modalCreateFromWhere" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                    
                    	<ul class="listBoutons">
                            <li><a class="btn btn-primary" data-dismiss="modal" href="#"><?php echo __('At the current robot pose');?></a></li>
                            <li><a class="btn btn-primary" data-dismiss="modal" href="#"><?php echo __('By clicking on the map');?></a></li>
                        </ul>
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:100%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>


<?php 
include ('template/footer.php');
?>

<script>
var isDown = false;

var largeurSlam = <?php echo $plan->ros_largeur;?>;
var hauteurSlam = <?php echo $plan->ros_hauteur;?>;
var largeurRos = <?php echo $plan->ros_largeur;?>;
var hauteurRos = <?php echo $plan->ros_hauteur;?>;

var start = true;


function Resize()
{
	saveScrollLeft = document.getElementById('container_all').scrollLeft;
	saveScrollTop = document.getElementById('container_all').scrollTop;
	
	/*
    $('#map_navigation').height($('#map_navigation').width() * hauteurSlam / largeurSlam);
    $('#boxsmap').width($('#map_navigation').width());
    $('#boxsmap').height($('#map_navigation').width() * hauteurSlam / largeurSlam);
	
	document.getElementById('container_all').scrollLeft = saveScrollLeft;
	document.getElementById('container_all').scrollTop = saveScrollTop;
	*/
    //PositionneRobot(lastCoordRobot);
}

function distance(x1, y1, x2, y2)
{
    return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}


var canvas;
var canvasWidth;
var canvasHeight;
var ctx;
var canvasData;
var zoom = 1.5;

var ros_resolution = <?php echo $plan->ros_resolution;?>;
var id_plan = <?php echo $plan->id_plan;?>;

var positions = Array();


$( window ).resize(function() {
    setTimeout(Resize, 10);
});

var xObject = 0;
var yObject = 0;

var zoom_carte = 1;

var polys = Array();
<?php 
$polys = $plan->GetAreas();
foreach($polys as $poly)
{
	$poly->GetPoints();
	?>polys.push(<?php echo json_encode($poly);?>);
<?php
}
?>

function diff(x, y) {
	var centerItem = $('#robotDestination'),Fin
		centerLoc = centerItem.offset();
	var dx = x - (centerLoc.left + (centerItem.width() / 2));
		dy = y - (centerLoc.top + (centerItem.height() / 2));
	return Math.atan2(dy, dx) * (180 / Math.PI);
}

</script>
<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/svg-pan-zoom.js"></script>
<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/hammer.js"></script>
<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map_actions.js?v=20191210_2"></script>
<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map_svg.js?v=20191210_2"></script>

<script>
  // Don't use window.onLoad like this in production, because it can only listen to one function.
  window.onload = function() {
	var eventsHandler;

	eventsHandler = {
	  haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
	, init: function(options) {
		var instance = options.instance
		  , initialScale = 1
		  , pannedX = 0
		  , pannedY = 0

		// Init Hammer
		// Listen only for pointer and touch events
		this.hammer = Hammer(options.svgElement, {
		  inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
		})

		// Enable pinch
		this.hammer.get('pinch').set({enable: true})

		// Handle double tap
		this.hammer.on('doubletap', function(ev){
		  instance.zoomIn()
		})

		// Handle pan
		this.hammer.on('panstart panmove', function(ev){
		  // On pan start reset panned variables
		  if (ev.type === 'panstart') {
			pannedX = 0
			pannedY = 0
		  }

		  // Pan only the difference
		  instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
		  pannedX = ev.deltaX
		  pannedY = ev.deltaY
		})

		// Handle pinch
		this.hammer.on('pinchstart pinchmove', function(ev){
		  // On pinch start remember initial zoom
		  if (ev.type === 'pinchstart') {
			initialScale = instance.getZoom()
			instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
		  }

		  instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
		})

		// Prevent moving the page on some devices when panning over SVG
		options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
	  }

	, destroy: function(){
		this.hammer.destroy()
	  }
	}

	// Expose to window namespace for testing purposes
	window.panZoom = svgPanZoom('#svg', {
	  zoomEnabled: true
	, controlIconsEnabled: true
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandler
	});
  };
</script>