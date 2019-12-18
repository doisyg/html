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
                        <svg id="svg" width="<?php echo $plan->ros_largeur;?>" height="<?php echo $plan->ros_hauteur;?>" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                            <image  xlink:href="data:image/png;base64,<?php echo $plan->image;?>" x="0" y="0" height="<?php echo $plan->ros_hauteur;?>" width="<?php echo $plan->ros_largeur;?>" />
                        </svg>
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </div>
        </div>
        
        <div id="zoom_popup" style="position:absolute; top:20px; left:20px; width:100px; height:100px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
        	<img id="img_svg" style="position:absolute; top:0; left:0;" width="<?php echo $plan->ros_largeur*10;?>" />
        </div>
        
        
        <div id="message_aide"></div>
        
        <div id="boutonsRotate" style="position:absolute; display:none;">
        	<a href="#" id="bRotateLeft" style="margin-right:6px;"><img src="assets/images/rotate_bl.png" /></a>
            <a href="#" id="bRotateRight" style="margin-left:6px;"><img src="assets/images/rotate_br.png" /></a>
        </div>
        
        <div id="boutonsDock" style="display:none;">
            <a href="#" id="bDockSave" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:10px;"><i class="fa fa-save"></i></a>
            <a href="#" id="bDockCancel" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:45px;"><i class="fa fa-times"></i></a>
            <a href="#" id="bDockDirection" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:80px;"><i class="fa fa-rotate-right"></i></a>
            <a href="#" id="bDockDelete" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:130px;"><i class="fa fa-trash"></i></a>
        </div>
        <div id="boutonsPoi" style="display:none;">
            <a href="#" id="bPoiSave" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:10px;"><i class="fa fa-save"></i></a>
            <a href="#" id="bPoiCancel" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:45px;"><i class="fa fa-times"></i></a>
            <a href="#" id="bPoiDirection" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:80px;"><i class="fa fa-rotate-right"></i></a>
            <a href="#" id="bPoiDelete" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:130px;"><i class="fa fa-trash"></i></a>
        </div>	
        <div id="boutonsForbidden" style="display:none;">
            <a href="#" id="bForbiddenSave" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:10px;"><i class="fa fa-save"></i></a>
            <a href="#" id="bForbiddenCancel" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:45px;"><i class="fa fa-times"></i></a>
            <a href="#" id="bForbiddenDelete" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:80px;"><i class="fa fa-trash"></i></a>
        </div>	
        <div id="boutonsArea" style="display:none;">
            <a href="#" id="bAreaSave" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:10px;"><i class="fa fa-save"></i></a>
            <a href="#" id="bAreaCancel" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:45px;"><i class="fa fa-times"></i></a>
            <a href="#" id="bAreaDelete" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:80px;"><i class="fa fa-trash"></i></a>
            <a href="#" id="bAreaOptions" class="btn btn-default btn-circle" style="position:absolute; bottom:40px; left:115px;" data-toggle="modal" data-target="#modalAreaOptions"><i class="fa fa-list"></i></a>
        </div>	
        <div id="boutonsStandard">
            <a href="#" id="bUndo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:40px; left:10px;"><i class="fa fa-mail-reply"></i></a>
            <a href="#" id="bRedo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:40px; left:45px;"><i class="fa fa-mail-forward"></i></a>
            
            <a href="#" id="bSaveMap" class="btn btn-default btn-circle" style="position:absolute; bottom:110px; right:10px;"><i class="fa fa-save"></i></a>
            <a href="#" id="bGomme" class="btn btn-default btn-circle" style="position:absolute; bottom:75px; right:10px;"><i class="fa fa-eraser"></i></a>
            <div class="btn-group dropup" style="position:absolute; bottom:40px; right:10px;">
                <button type="button" class="btn btn-default btn-circle dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-plus"></i></button>
                <ul class="dropdown-menu" role="menu" style="left:auto; right:0;">
                    <li><a href="#" id="bAddForbiddenArea"><?php echo __('Forbidden area');?></a></li>
                    <li><a href="#" id="bAddArea"><?php echo __('Area');?></a></li>
                    <li class="divider"></li>
                    <li><a href="#" data-toggle="modal" data-target="#modalCreateDockFromWhere"><?php echo __('Docking station');?></a></li>
                    <li><a href="#" data-toggle="modal" data-target="#modalCreatePoiFromWhere"><?php echo __('POI');?></a></li>
                </ul>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>

<div id="modalAreaOptions" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                	<div style="height:calc(100vh - 160px); overflow:auto">
                    	<form>
                        	<div class="form-group">
                                <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('LED Color');?></label>
                                <div class="col-xs-8">
                                    <select id="led_color_mode" name="led_color_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                        <option value="Automatic"><?php echo __('Automatic');?></option>
                                        <option value="Manual"><?php echo __('Manual');?></option>
                                    </select>
                                </div>
                            </div>
                            <div id="led_color_group" class="form-group">
                                <label class="col-xs-4 control-label">Select color</label>
                                <div class="col-xs-7">
                                    <div id="led_color_elem" class="input-group color" data-color="rgb(255, 146, 180)" data-color-format="rgb" data-plugin-colorpicker>
                                        <span class="input-group-addon"><i></i></span>
                                        <input id="led_color" name="led_color" type="text" class="form-control" style="width:0; padding:0;">
                                    </div>
                                </div>
                            </div>
                        	<div class="form-group">
                                <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('LED Animation');?></label>
                                <div class="col-xs-8">
                                    <select id="led_animation_mode" name="led_animation_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                        <option value="Automatic"><?php echo __('Automatic');?></option>
                                        <option value="Manual"><?php echo __('Manual');?></option>
                                    </select>
                                </div>
                            </div>
                        	<div id="led_animation_group" class="form-group">
                                <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Animation');?></label>
                                <div class="col-xs-8">
                                    <select id="led_animation" name="led_animation" class="form-control input-sm mb-md">
                                        <option value="1"><?php echo __('Progress');?></option>
                                        <option value="2"><?php echo __('Progress from center');?></option>
                                        <option value="3"><?php echo __('Rainbow');?></option>
                                        <option value="4"><?php echo __('K2000');?></option>
                                        <option value="5"><?php echo __('Blink');?></option>
                                        <option value="6"><?php echo __('Blink 2');?></option>
                                        <option value="7"><?php echo __('Police');?></option>
                                        <option value="8"><?php echo __('Fade');?></option>
                                        <option value="9"><?php echo __('Move');?></option>
                                        <option value="10"><?php echo __('Light');?></option>
                                    </select>
                                </div>
                            </div>
                        	<div class="form-group">
                                <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Max speed');?></label>
                                <div class="col-xs-8">
                                    <select id="max_speed_mode" name="max_speed_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                        <option value="Automatic"><?php echo __('Automatic');?></option>
                                        <option value="Manual"><?php echo __('Manual');?></option>
                                    </select>
                                </div>
                            </div>
                        	<div id="max_speed_group" class="form-group">
                                <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Max speed');?></label>
                                <div class="col-xs-8">
                                    <input type="number" id="max_speed" name="max_speed" class="form-control input-sm mb-md" />
                                </div>
                            </div>
                        </form>
                    </div>
                    </div>
                    <div style="clear:both;"></div>
                   
                    <a href="#" id="bAreaSaveConfig" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>


<div id="modalCreateDockFromWhere" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                    
                    	<ul class="listBoutons">
                            <li><a class="btn btn-primary" id="bDockCreateFromPose" data-dismiss="modal" href="#"><?php echo __('At the current robot pose');?></a></li>
                            <li><a class="btn btn-primary" id="bDockCreateFromMap" data-dismiss="modal" href="#"><?php echo __('By clicking on the map');?></a></li>
                        </ul>
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:100%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>


<div id="modalCreatePoiFromWhere" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                    
                    	<ul class="listBoutons">
                            <li><a class="btn btn-primary" id="bPoiCreateFromPose" data-dismiss="modal" href="#"><?php echo __('At the current robot pose');?></a></li>
                            <li><a class="btn btn-primary" id="bPoiCreateFromMap" data-dismiss="modal" href="#"><?php echo __('By clicking on the map');?></a></li>
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

var ros_largeur = <?php echo $plan->ros_largeur;?>;
var ros_hauteur = <?php echo $plan->ros_hauteur;?>;
var ros_resolution = <?php echo $plan->ros_resolution;?>;

var textClickOnMapPose = '<?php echo __('Click on map to set the position');?>';
var textClickOnMapDir = '<?php echo __('Click on map to set the direction');?>';

var id_plan = <?php echo $plan->id_plan;?>;

var positions = Array();


$( window ).resize(function() {
    setTimeout(Resize, 10);
});

var xObject = 0;
var yObject = 0;

var zoom_carte = 1;

var nextIdArea = 300000;
var nextIdDock = 300000;
var nextIdPoi = 300000;
var forbiddens = Array();
var areas = Array();
var gommes = Array();
var docks = Array();
var pois = Array();

<?php 
$forbiddens = $plan->GetForbiddenAreas();
foreach($forbiddens as $forbidden)
{
	$forbidden->GetPoints();
	?>forbiddens.push(<?php echo json_encode($forbidden);?>);
<?php
}
$areas = $plan->GetAreas();
foreach($areas as $area)
{
	$area->GetPoints();
	$area->GetConfigs();
	?>areas.push(<?php echo json_encode($area);?>);
<?php
}
$docks = $plan->GetStationRecharges();
foreach($docks as $dock)
{
	?>docks.push(<?php echo json_encode($dock);?>);
<?php
}
$pois = $plan->GetPois();
foreach($pois as $poi)
{
	?>pois.push(<?php echo json_encode($poi);?>);
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
<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map_actions.js?v=20191214"></script>
<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map_svg.js?v=20191214"></script>

<script>
var svgTemp;
var svgData;
var imgForSVG;
$(document).ready(function(e) {
		
	svgTemp = document.getElementById("svg");
	svgData = new XMLSerializer().serializeToString(svgTemp);
	var imgForSVG = document.getElementById("img_svg");
	imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
	
	$('#svg').on('touchend', function(e) { $('#zoom_popup').hide(); });
    $('#svg').on('touchmove', function(e) {
		if (blockZoom)
		{
			//svgData = new XMLSerializer().serializeToString(svgTemp);
			//imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
						
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
			
			$('#img_svg').css('left',(-x*zoom) * 10 + 50);
			$('#img_svg').css('top', (-y*zoom) * 10 + 50);
			
			l = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50;
			if (l + 100 > $('#all').width()) l -= 200;
			t = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150;
			if (t + 100 > $('#all').height()) t -= 300;
			if (t < 20) t = 20;
			$('#zoom_popup').css('left', l);
			$('#zoom_popup').css('top', t);
			$('#zoom_popup').show();
			/*
			
			$('#svg_copy').html($('#svg .svg-pan-zoom_viewport').html());
			
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
					
			$('#svg_copy').css('left', -x*zoom + 50);
			$('#svg_copy').css('top', -y*zoom + 50);
			
			$('#zoom_popup').css('left', (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50);
			$('#zoom_popup').css('top', (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150);
			$('#zoom_popup').show();
			*/
		}
		else
		{
			$('#zoom_popup').hide();
		}
	});
	
	
	
});
</script>

<script>
	var blockZoom = false;
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
		options.svgElement.addEventListener('touchmove', function(e){ /*e.preventDefault(); */ });
	  }

	, destroy: function(){
		this.hammer.destroy()
	  }
	}

	// Expose to window namespace for testing purposes
	
	window.panZoom = svgPanZoom('#svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandler
	, RefreshMap: function() { setTimeout(RefreshZoomView, 10); }
	});
	
	svg = document.querySelector('.svg-pan-zoom_viewport');
	
	//window.panZoom = {};
	//window.panZoom.getZoom = function () { return 1; }
	RefreshZoomView();
  };
</script>