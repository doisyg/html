<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";


if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

if (isset($_POST['todo']) && $_POST['todo'] == 'saveMapping')
{
	$plan = new Plan();
	$plan->id_site = $currentIdSite;
	if (strlen($_POST['image']) > 22)
		$plan->image = substr($_POST['image'], 22);
	
	if (strlen($_POST['image_tri']) > 22)
		$plan->image_tri = substr($_POST['image_tri'], 22);
	$plan->nom = $_POST['nom'];
	$plan->ros_resolution = 5;
	$plan->ros_hauteur = $_POST['ros_hauteur'];
	$plan->ros_largeur = $_POST['ros_largeur'];
	$plan->Save();
}

if (isset($_GET['um']))
{
	$plan = new Plan($_GET['um']);
	if ($plan->id_plan > 0 && $plan->id_site == $currentSite->id_site)
	{
		$plan->SetAsActive();
		
		// A REVOIR
		// On sauve les images directement dans le dossier de config sur le robot
		
		$dossier_config = $_CONFIG['CONFIG_PATH'];
		
		$last_config = RobotConfig::GetLastConfig();
		
		$value = $last_config->GetValue('/map', 'map_amcl.png');
		if (isset($value->data)) file_put_contents($dossier_config.'map/map_amcl.png', base64_decode($value->data));
		
		$value = $last_config->GetValue('/map', 'map_forbidden.png');
		if (isset($value->data)) file_put_contents($dossier_config.'map/map_forbidden.png', base64_decode($value->data));
		
		$value = $last_config->GetValue('/map', 'map_areas.png');
		if (isset($value->data)) file_put_contents($dossier_config.'map/map_areas.png', base64_decode($value->data));
		
		$value = $last_config->GetValue('/map', 'map_areas.yaml');
		if (isset($value->data)) file_put_contents($dossier_config.'map/map_areas.yaml', $value->data);
		
		$value = $last_config->GetValue('/map', 'areas.yaml');
		if (isset($value->data)) file_put_contents($dossier_config.'map/areas.yaml', $value->data);
		
		
		header('location:maps.php');
	}
}

$titre = __('Maps tool');

$canEditAdmin = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete');

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
        <div class="col-md-12">
            <div class="row">
                <?php 
				$maps = $currentSite->GetPlans('nom', 'ASC');
				?>
                
                <div class="panel-body">
                
                	<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
                    <a id="bOpenModalCreateMap" class="btn btn-primary btn-sm btn-grad" href="#" data-toggle="modal" data-target="#modalCreateMap" title="<?php echo __('Create new map');?>"><i class="fa fa-plus"></i> <?php echo __('Create new map');?></a>
                    <div style="clear:both; height:20px;"></div>
                    <?php }?>
                
					<table border="0" width="100%" cellpadding="0" cellspacing="0" id="sortable-table" class="table table-sortable table-bordered table-striped mb-none">
                    <thead>
                        <tr>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Plan');?></th>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Nom');?></th>
                            <th class="table-header-repeat line-left minwidth-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $canEdit = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit');
					$canDelete = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete');
					
                    foreach ($maps as $plan)
					{
						$current = $currentIdPlan == $plan->id_plan;
						?>
						<tr>
	                        <td><img src="data:image/png;base64,<?php echo $plan->image_tri;?>" style="max-height:40px; max-width:150px;" /></td>
							<td><?php echo $plan->nom;?></td>
							<td>
								<?php if ($canEdit) {?><a href="map.php?id_plan=<?php echo $plan->id_plan;?>" class="btn btn-primary" title="<?php echo __('Edit map');?>"><i class="fa fa-map-marker"></i></a><?php }?>
                                <?php if (!$current) {?><a href="#" class="btn btn-xs btn-primary bUseThisMap" data-id_plan="<?php echo $plan->id_plan;?>" title="<?php echo __('Use this map on robot');?>"><i class="fa fa-upload"></i> <?php echo __('Use this');?></a><?php }?>
                                <?php if ($canDelete && !$current){?><a href="#" class="btn btn-xs btn-danger" title="<?php echo __('Delete');?>"><i class="fa fa-times"></i></a><?php }?>
          
                                <?php if ($canEdit) {?><a href="map_tri.php?id_plan=<?php echo $plan->id_plan;?>" class="btn btn-primary" title="<?php echo __('Set map trinary');?>"><i class="fa fa-tasks"></i></a><?php }?>
							</td>
						</tr>
						<?php
					}	
                    ?>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>


<div id="modalUseMap" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                        <h2><?php echo __('Use this map ?');?></h2>
                        
                        <p class="aide"><?php echo __('Change the configuration of the robot to use this map.');?></p>
                        
                    </div>
                    <div style="clear:both;"></div>
 
 
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('No');?></a>
                                       
                    <a href="#" id="bUseMap" data-id_plan="" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Yes');?></a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
<div id="modalCreateMap" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                    	<div class="row" style="margin-bottom:20px;">
                            <a href="#" id="bMappingStart" class="btn btn-primary"><i class="fa fa-play"></i> <?php echo __('Start mapping');?></a>
                            <a href="#" id="bMappingStop" data-dismiss="modal" class="btn btn-primary bCloseModalCreateMap" style="display:none;"><i class="fa fa-stop"></i> <?php echo __('Stop mapping');?></a>
                        </div>
                    
                        <div id="mapping_view" style="height:152px; width:100%; margin:10px 0; border:1px solid #EFEFEF; position:relative; overflow:hidden; background-color:lightblue;">
                            <img id="mapping_robot" src="assets/images/robot-dessus.png" width="6" style="position:absolute; bottom:50px; margin-left:-3px; z-index:300;" />
                            <!--<div id="img_map_div" style="position:absolute; z-index:200"><img id="img_map_saved" src="" /></div>-->
                            <canvas id="laser_scan" style="position:absolute; left:0px; bottom:0px; z-index:250; width:100%; height:150px;"></canvas>
                            <img class="map_dyn" id="img_map_saved" src="" style="position:absolute; z-index:200" />
                        </div>
                        
                        
                    	<div id="mapping_trinary_view" style="height:152px; width:100%; margin:10px 0; border:1px solid #EFEFEF; position:relative; overflow:hidden;">
                            <img id="mapping_trinary_robot" src="assets/images/robot-dessus.png" width="6" style="position:absolute; bottom:50px; margin-left:-3px; z-index:300;" />
                            <img class="map_dyn" id="img_map_trinary_saved" src="" style="position:absolute; z-index:200" />
                        </div>
                        
                        <!--<?php echo __('Enable joystick');?> <a href="#" class="bToggleJosytick"><i class="ico_jotick fa fa-toggle-off" style="font-size:30px;"></i></a>-->
                        
                        <div style="clear:both; height:10px;"></div>
                        
                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                            <div class="fond"></div>
                            <div class="curseur"></div>
                        </div>
                        
                        
                    </div>
                    <div style="clear:both;"></div>
         
         			
                    <a href="#" id="bMappingCancelMap" class="btn btn-warning bCloseModalCreateMap" data-dismiss="modal" style="position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>         
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modalFinCreateMap" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                    
                    	<form id="form_mapping" method="post">
                        	<input type="hidden" name="todo" value="saveMapping" />
                            <input type="hidden" id="form_mapping_image" name="image" value="" />
                            <input type="hidden" id="form_mapping_image_tri" name="image_tri" value="" />
                            <input type="hidden" id="form_mapping_ros_hauteur" name="ros_hauteur" value="" />
                            <input type="hidden" id="form_mapping_ros_largeur" name="ros_largeur" value="" />
	                    	<input type="text" id="form_mapping_name" name="nom" placeholder="<?php echo __('Map name')?>" class="form-control" style="margin-bottom:20px;" />
                    	</form>
                    
                        <div id="fin_mapping_view" style="height:65vh; width:100%; margin:10px 0; border:1px solid #EFEFEF; position:relative;">
	                        <img id="img_fin_map_saved" src="" style="z-index:200; display:none; max-width:100%;" />
                            <div id="divOption">
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
                            <div id="divResult">
                                <div style="height:80vh; overflow:auto;">
                                	<i id="loading_fin_create_map" style="font-size:60px;" class="fa fa-spinner fa-pulse"></i>
                                    <canvas id="canvas_result" width="" height="" style="max-width:100%; max-height:65vh;"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div style="clear:both; height:10px;"></div>
                        
                    </div>
                    <div style="clear:both;"></div>
         
         			
                    <a href="#" id="bMappingCancelMap" class="btn btn-warning" data-dismiss="modal" style="position:absolute; width:50%; left:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>           
                    <a href="#" id="bMappingSaveMap" class="btn btn-primary" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modalUseThisMapNow" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                        
                        <h2 id="modalUseThisMapNowTitle1"><?php echo 'Do you want to use this map now ?';?></h2>
                        <h2 id="modalUseThisMapNowTitle2" style="display:none;"><?php echo 'Configure map on robot';?></h2>
                        
                        <div id="modalUseThisMapNowContent" style="display:none;">
                            <i style="font-size:60px;" class="fa fa-spinner fa-pulse"></i>
                            <div id="modalUseThisMapNowContentDetails" style="font-size:18px;"></div>
                        </div>
                    </div>
         			
                    <a href="#" id="bUseThisMapNowNo" class="btn btn-warning" data-dismiss="modal" style="position:absolute; width:50%; left:0; bottom:0px; font-size:30px;"><?php echo __('No');?></a>           
                    <a href="#" id="bUseThisMapNowYes" class="btn btn-primary" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Yes');?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
}?>

<script>
optionsWyca = {
        onMappingRobotPoseChange: function(data){
            mappingLastPose = data;
            InitPosCarteMapping();
		},
        onMapInConstruction: function(data){
            var img = document.getElementById("img_map_saved");
            img.src = 'data:image/png;base64,' + data.map.data;
            mappingLastOrigin = {'x':data.x_origin, 'y':data.y_origin };
			
			
            var img = document.getElementById("img_map_trinary_saved");
            img.src = 'data:image/png;base64,' + data.map_trinary.data;
        },
        onSensorsLaserScan: function(data)
        {
            if ($('#laser_scan:visible').length > 0)
            if (!drawLaserInProgress)
            {
                drawLaserInProgress = true;

                var canvas = document.getElementById('laser_scan');
                var ctx = canvas.getContext('2d');
                var zoom = 10;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0088CC';
                angle = data.angle_min;
                i = 0;
                while (angle <= data.angle_max)
                {
                    x = Math.cos(data.angle_max + data.angle_min - angle + Math.PI/2) * data.ranges[i] * zoom;
                    y = Math.sin(data.angle_max + data.angle_min - angle + Math.PI/2) * data.ranges[i] * zoom;
                    ctx.fillRect(canvas.width/2 + x, canvas.height - 50 - 4 - y, 1, 1);
                    i++;
                    angle += data.angle_increment;
                }

                drawLaserInProgress = false;
            }
        }
};
</script>
<?php 
include ('template/footer.php');
?>
<script>
var mappingStarted = false;
var intervalMap = null;

var viewer;
var gridClient;

var threshold_free = 25;
var threshold_occupied = 65;

var color_free = 255;
var color_occupied = 0;
var color_unknow = 200;

var timeoutCalcul = null;

var img;
var canvas;

var width = 0;
var height = 0;


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

var finalMapData = '';
var id_map_last = -1;

(function( $ ) {

	'use strict';
	
	$('.bUseThisMap').click(function(e) {
        e.preventDefault();
		$('#bUseMap').data('id_plan', $(this).data('id_plan'));
		$('#modalUseMap').modal('show');
    });
	
	$('#bUseMap').click(function(e) {
		location.href = 'maps.php?um=' + $('#bUseMap').data('id_plan');
	});
	
	$(".map_dyn").on("load", function() {
           InitPosCarteMapping();
        })
	
	$('#bUseThisMapNowYes').click(function(e) {
        
		$('#bUseThisMapNowYes').hide();
		$('#bUseThisMapNowNo').hide();
		$('#modalUseThisMapNowTitle1').hide();
		$('#modalUseThisMapNowTitle2').show();
		$('#modalUseThisMapNowContent').show();
		
		$('#modalUseThisMapNowContentDetails').html('Building the map');
		
		$.ajax({
			type: "POST",
			url: 'ajax/export_map_to_robot.php',
			data: {
				'id_plan': id_map_last
			},
			dataType: 'json',
			success: function(data) {
				id_map_last = data.id_map;
			  
				$('#modalUseThisMapNowContentDetails').html('Start autonmous navigation');
			  	wycaApi.NavigationStart(true, function(r) {
					if (!r.success) alert(r.message);
					$('#modalUseThisMapNow').modal('hide');
					location.href = location.href;
				});
			},
			error: function(e) {
				alert(e.responseText);
				$('#modalUseThisMapNowContentDetails').modal('hide');
			}
		});
		
		
		
    });
	
	$('#form_mapping').submit(function(e) {
        e.preventDefault();
    });
	
	$('#bMappingSaveMap').click(function(e) {
		if ($('#form_mapping_name').val() == '')
		{
			alert('<?php echo __('You must indicate a name');?>');
			e.preventDefault();
		}
		else
		{
			var canvasDessin = document.getElementById('canvas_result');
		
			$('bMappingCancelMap').hide();
			$('bMappingSaveMap').hide();
		
			$('#form_mapping_image').val(finalMapData);
			$('#form_mapping_image_tri').val(canvasDessin.toDataURL());
			$('#form_mapping_ros_largeur').val($('#img_fin_map_saved').prop('naturalWidth'));
			$('#form_mapping_ros_hauteur').val($('#img_fin_map_saved').prop('naturalHeight'));
			//$('#form_mapping').submit();
			
			$.ajax({
				type: "POST",
				url: 'ajax/saveMapping.php',
				data: $('#form_mapping').serialize(),
				dataType: 'json',
				success: function(data) {
					id_map_last = data.id_plan;
				  
				  	$('#modalFinCreateMap').modal('hide');
					
					$('#bUseThisMapNowYes').show();
					$('#bUseThisMapNowNo').show();
					$('#modalUseThisMapNowTitle1').show();
					$('#modalUseThisMapNowTitle2').hide();
					$('#modalUseThisMapNowContent').hide();
					
					$('#modalUseThisMapNow').modal('show');
				  
				},
				error: function(e) {
					alert(e.responseText);
					$('#modalFinCreateMap').modal('hide');
				}
			});
			
			
		}
	});
	
	$('#bMappingStart').click(function(e) {
		e.preventDefault();
		if (navLaunched) 
			wycaApi.NavigationStop();
			
		wycaApi.MappingStart(function(r) { });
		mappingStarted = true;
		$('#bMappingStart').hide();
		$('#bMappingStop').show();
		
		if (intervalMap != null)
		{
			clearInterval(intervalMap);
			intervalMap = null;
		}
		//intervalMap = setInterval(GetMap, 1000);
		
	});
	$('#bMappingStop').click(function(e) {
		e.preventDefault();
		
		$('#loading_fin_create_map').show();
		img = document.getElementById("img_fin_map_saved");
        img.src = "";
		
		wycaApi.MappingStop(function(data) {
			$('#loading_fin_create_map').hide();
			var img = document.getElementById("img_fin_map_saved");
            img.src = 'data:image/png;base64,' + data.final_map.data;
			
			finalMapData = 'data:image/png;base64,' + data.final_map.data;
			
			setTimeout(function() {
				canvas = document.createElement('canvas');
				
				width = img.naturalWidth;
				height = img.naturalHeight;
				
				console.log(img.naturalWidth, img.naturalHeight);
				
				$('#canvas_result').attr('width', img.naturalWidth);
				$('#canvas_result').attr('height', img.naturalHeight);
				
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				canvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
				
				CalculateMap();
			}, 100);
		});
		mappingStarted = false;
		$('#bMappingStop').hide();
		$('#bMappingStart').show();
		
		$('#bMappingCancelMap').show();
		
		$('#modalFinCreateMap').modal('show');
		
		if (intervalMap != null)
		{
			clearInterval(intervalMap);
			intervalMap = null;
		}
	});

	var datatableInit = function() {

		$('.table-sortable').dataTable({
			"language": {
                "url": "/lang/js/datatables.<?php echo $_COOKIE['lang'];?>.json"
            },
			"aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 0, 2 ] }
			],
		});

	};

	$(function() {
		datatableInit();
	});
	
}).apply( this, [ jQuery ]);

function GetMap()
{
	//$('#map_mapping').attr('src', 'get_mapping.php?v=' + Date.now());
	$('#map_mapping').attr('src', 'http://192.168.100.170/get_mapping.php?v=' + Date.now());	
}
</script>

