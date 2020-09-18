$(document).ready(function(e) {
	
	$('#install_normal_setup_trinary .bSaveTrinaryMap').click(function(e) {
		
		var canvasDessin = document.getElementById('install_normal_setup_trinary_canvas_result_trinary');
		$.ajax({
				type: "POST",
				url: 'ajax/get_map_tri.php',
				data: {
					'image_tri':canvasDessin.toDataURL()
				},
				dataType: 'json',
				success: function(data_img) {
					if (!data_img.error)
					{
						data = GetDataMapToSave();
						
						map = current_map_obj;
						map.image_tri = data_img.image;
						map.threshold_free = parseInt($('#install_normal_setup_trinary_threshold_free_slider').val());
						map.threshold_occupied = parseInt($('#install_normal_setup_trinary_threshold_occupied_slider').val());
						
						wycaApi.SetMap(map, function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR)
							{	
								success_wyca('Map saved')
							}
							else
							{
								alert_wyca('Save map error : ' + wycaApi.AnswerCodeToString(data.A) + '<br>'+ data.M);
							}							
						});
					}
					else
					{
						alert_wyca('Error save image trinary');
					}
									
					
				},
				error: function(e) {
					
					var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
        			img.src = "assets/images/vide.png";
					
					alert_wyca('Error get map trinary ; ' + e.responseText);
				}
			});
		
	});
	
	$('#install_normal_edit_map .bSaveMapTestPoi').click(function(e) {
		e.preventDefault();
		
		$('#install_normal_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#install_normal_edit_map .bSaveMapTestPoi i').addClass('fa-spinner fa-pulse');
		
		id_poi_test = currentPoiNormalLongTouch.data('id_poi');
		i = GetPoiIndexFromID(currentPoiNormalLongTouch.data('id_poi'));
		
		id_fiducial_test = pois[i].id_fiducial;
		final_pose_x_test = pois[i].final_pose_x;
		final_pose_y_test = pois[i].final_pose_y;
		final_pose_t_test = pois[i].final_pose_t;
	
		data = GetDataMapToSave();
		gotoTest = false;
		
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{	
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						console.log(data.D); 
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						gommes = Array();
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$('#install_normal_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
						
						largeurSlam = data.D.ros_width;
						hauteurSlam = data.D.ros_height;
						largeurRos = data.D.ros_width;
						hauteurRos = data.D.ros_height;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#install_normal_edit_map_svg').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_svg').attr('height', data.D.ros_height);
						
						$('#install_normal_edit_map_image').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_image').attr('height', data.D.ros_height);
						$('#install_normal_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
					  
						$('#install_normal_mapping_use .bUseThisMapNowYes').show();
						$('#install_normal_mapping_use .bUseThisMapNowNo').show();
						$('#install_normal_mapping_use .modalUseThisMapNowTitle1').show();
						$('#install_normal_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#install_normal_mapping_use .modalUseThisMapNowContent').hide();
						
						normalHistoriques = Array();
						normalHistoriqueIndex = -1;
						NormalRefreshHistorique();
						
						NormalInitMap();
						NormalResizeSVG();
						
						// On recherche le nouveau poi créé avec le bon id
						if (id_poi_test >= 300000)
						{
							$.each(pois, function( index, poi ) {
								
								if (poi.id_fiducial == id_fiducial_test && poi.final_pose_x == final_pose_x_test && poi.final_pose_y == final_pose_y_test && poi.final_pose_t == final_pose_t_test)
								{
									currentPoiNormalLongTouch = $('#install_normal_edit_map_poi_robot_'+poi.id_poi);
								}
							});
						}
						
						$('#install_normal_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#install_normal_edit_map .bSaveMapTestPoi i').addClass('fa-check');
					}
					else
					{
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#install_normal_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_normal_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#install_normal_edit_map .bSaveMapTestAugmentedPose').click(function(e) {
		e.preventDefault();
		
		$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-spinner fa-pulse');
		
		id_augmented_pose_test = currentAugmentedPoseNormalLongTouch.data('id_augmented_pose');
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseNormalLongTouch.data('id_augmented_pose'));
		
		id_fiducial_test = augmented_poses[i].id_fiducial;
		final_pose_x_test = augmented_poses[i].final_pose_x;
		final_pose_y_test = augmented_poses[i].final_pose_y;
		final_pose_t_test = augmented_poses[i].final_pose_t;
	
		data = GetDataMapToSave();
		gotoTest = false;
		
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{	
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						console.log(data.D); 
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						gommes = Array();
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$('#install_normal_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
						
						largeurSlam = data.D.ros_width;
						hauteurSlam = data.D.ros_height;
						largeurRos = data.D.ros_width;
						hauteurRos = data.D.ros_height;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#install_normal_edit_map_svg').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_svg').attr('height', data.D.ros_height);
						
						$('#install_normal_edit_map_image').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_image').attr('height', data.D.ros_height);
						$('#install_normal_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
					  
						$('#install_normal_mapping_use .bUseThisMapNowYes').show();
						$('#install_normal_mapping_use .bUseThisMapNowNo').show();
						$('#install_normal_mapping_use .modalUseThisMapNowTitle1').show();
						$('#install_normal_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#install_normal_mapping_use .modalUseThisMapNowContent').hide();
						
						normalHistoriques = Array();
						normalHistoriqueIndex = -1;
						NormalRefreshHistorique();
						
						NormalInitMap();
						NormalResizeSVG();
						
						// On recherche le nouveau augmented_pose créé avec le bon id
						if (id_augmented_pose_test >= 300000)
						{
							$.each(augmented_poses, function( index, augmented_pose ) {
								
								if (augmented_pose.id_fiducial == id_fiducial_test && augmented_pose.final_pose_x == final_pose_x_test && augmented_pose.final_pose_y == final_pose_y_test && augmented_pose.final_pose_t == final_pose_t_test)
								{
									currentAugmentedPoseNormalLongTouch = $('#install_normal_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
								}
							});
						}
						
						$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-check');
					}
					else
					{
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#install_normal_edit_map .bSaveMapTestDock').click(function(e) {
		e.preventDefault();
		
		
		$('#install_normal_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#install_normal_edit_map .bSaveMapTestDock i').addClass('fa-spinner fa-pulse');
		
		id_dock_test = currentDockNormalLongTouch.data('id_docking_station');
		i = GetDockIndexFromID(currentDockNormalLongTouch.data('id_docking_station'));
		
		id_fiducial_test = docks[i].id_fiducial;
	
		data = GetDataMapToSave();
		gotoTest = false;
		
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{	
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						console.log(data.D); 
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						gommes = Array();
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$('#install_normal_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
						
						largeurSlam = data.D.ros_width;
						hauteurSlam = data.D.ros_height;
						largeurRos = data.D.ros_width;
						hauteurRos = data.D.ros_height;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#install_normal_edit_map_svg').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_svg').attr('height', data.D.ros_height);
						
						$('#install_normal_edit_map_image').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_image').attr('height', data.D.ros_height);
						$('#install_normal_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
					  
						$('#install_normal_mapping_use .bUseThisMapNowYes').show();
						$('#install_normal_mapping_use .bUseThisMapNowNo').show();
						$('#install_normal_mapping_use .modalUseThisMapNowTitle1').show();
						$('#install_normal_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#install_normal_mapping_use .modalUseThisMapNowContent').hide();
						
						normalHistoriques = Array();
						normalHistoriqueIndex = -1;
						NormalRefreshHistorique();
						
						NormalInitMap();
						NormalResizeSVG();
						
						// On recherche le nouveau dock créé avec le bon id
						if (id_dock_test >= 300000)
						{
							$.each(docks, function( index, dock ) {
								
								if (dock.id_fiducial == id_fiducial_test)
								{
									currentDockNormalLongTouch = $('#install_normal_edit_map_dock_'+dock.id_docking_station);
								}
							});
						}
						
						$('#install_normal_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#install_normal_edit_map .bSaveMapTestDock i').addClass('fa-check');
					}
					else
					{
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#install_normal_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_normal_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#install_normal_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!normalCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
		}
		else
		{
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#install_normal_test_map .list_test li').remove();
				$('#install_normal_test_map .install_normal_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca("Map saved !");
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapNormal();
					/*
					if (navLaunched && id_map == current_id_map)
					{
						wycaApi.NavigationReloadMaps(function(e) { if (e.A != wycaApi.AnswerCode.NO_ERROR) console.error(wycaApi.AnswerCodeToString(data.A)+ " " + data.M); });	
					}
					*/
				}
				else
				{
					alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
				}
			});
		}
    });
	
	
	$('#install_normal_setup_trinary .bResetValueThreshold').click(function(e) {
        e.preventDefault();
		
		$("#install_normal_setup_trinary_threshold_free_slider").val(25);
		$("#install_normal_setup_trinary_threshold_free_slider_elem").slider('value',25);
		$('#install_normal_setup_trinary_threshold_free_output b').text( 25 );
		threshold_free_normal = 25;
		
		$("#install_normal_setup_trinary_threshold_occupied_slider").val(65);
		$("#install_normal_setup_trinary_threshold_occupied_slider_elem").slider('value',65);
		$('#install_normal_setup_trinary_threshold_occupied_output b').text( 65 );
		threshold_occupied_normal = 65;
		
		CalculateMapTrinaryNormal();
    });
	
	$('#install_normal_setup_trinary_threshold_free_slider').change(function() {
		$('#install_normal_setup_trinary_threshold_free_output b').text( this.value );
		threshold_free_normal = this.value;
		
		CalculateMapTrinaryNormal();
	});
	$('#install_normal_setup_trinary_threshold_occupied_slider').change(function() {
		$('#install_normal_setup_trinary_threshold_occupied_output b').text( this.value );
		threshold_occupied_normal = this.value;
		
		CalculateMapTrinaryNormal();
	});
	
	$("#install_normal_setup_trinary_threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#install_normal_setup_trinary_threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#install_normal_setup_trinary_threshold_occupied_output b").text(slideEvt.value); $("#install_normal_setup_trinary_threshold_occupied_slider").val(slideEvt.value); });
	$("#install_normal_setup_trinary_threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#install_normal_setup_trinary_threshold_free_slider_elem").on("slide", function(slideEvt) { $("#install_normal_setup_trinary_threshold_free_output b").text(slideEvt.value); $("#install_normal_setup_trinary_threshold_free_slider").val(slideEvt.value); });
	
	
	
	$('#install_normal_setup_reset .bReset').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_setup_reset_cbConfirm').is(':checked'))
		{
			$('#install_normal_setup_reset .bGotoReset').click();
			wycaApi.FactoryDataReset(function(){
				
				$.ajax({
					type: "POST",
					url: 'ajax/reset.php',
					data: {
					},
					dataType: 'json',
					success: function(data) {
						window.location.href = 'https://elodie.wyca-solutions.com';
					},
					error: function(e) {
					}
				});
			});
		}
		else
		{
			alert_wyca('You must confirm by checking the checkbox');
		}
		
    });
	
});


function NormalInitTrinary()
{
	if (wycaApi.websocketAuthed)
	{
		NormalInitTrinaryDo();
	}
	else
	{
		setTimeout(NormalInitTrinary, 500);
	}
}

var current_map_obj = {};

function NormalInitTrinaryDo()
{
	$('#install_normal_setup_trinary .loading_fin_create_map').show();
		
	img = document.getElementById("install_normal_setup_trinary_img_map_saved_fin");
	img.src = 'assets/images/vide.png';
	
	wycaApi.GetCurrentMapComplete(function(data) {
		if (data.A == wycaApi.AnswerCode.NO_ERROR)
		{
			console.log(data);
			img_normal = document.getElementById("install_normal_setup_trinary_img_map_saved_fin");
			img_normal.src = 'data:image/png;base64,' + data.D.image;
			
			current_map_obj = data.D;
			
			finalMapData = 'data:image/png;base64,' + data.D.image;
			
			threshold_free_normal = data.D.threshold_free;
			threshold_occupied_normal = data.D.threshold_occupied;
			
			setTimeout(function() {
				canvas_normal = document.createElement('canvas');
				
				width_normal = img.naturalWidth;
				height_normal = img.naturalHeight;
				
				$('#install_normal_setup_trinary_canvas_result_trinary').attr('width', img_normal.naturalWidth);
				$('#install_normal_setup_trinary_canvas_result_trinary').attr('height', img_normal.naturalHeight);
				
				canvas_normal.width = img_normal.naturalWidth;
				canvas_normal.height = img_normal.naturalHeight;
				canvas_normal.getContext('2d').drawImage(img_normal, 0, 0, img_normal.naturalWidth, img_normal.naturalHeight);
				
				CalculateMapTrinaryNormal();
			}, 100);
		}
		else
		{
			alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
		}
	});
}


var threshold_free_normal = 25;
var threshold_occupied_normal = 65;

var color_free_normal = 255;
var color_occupied_normal = 0;
var color_unknow_normal = 205;

var timeoutCalcul_normal = null;

var img_normal;
var canvas_normal;

var width_normal = 0;
var height_normal = 0;


function CalculateMapTrinaryNormal()
{
	if (timeoutCalcul_normal != null)
	{
		clearTimeout(timeoutCalcul_normal);
		timeoutCalcul_normal = null;
	}
	timeoutCalcul_normal = setTimeout(CalculateMapTrinaryDoNormal, 500);
}

function CalculateMapTrinaryDoNormal()
{
	var start = performance.now();

	$('#install_normal_setup_trinary .loading_fin_create_map').show();
	threshold_free_255 = 255 - threshold_free_normal / 100 * 255;
	threshold_occupied_255 = 255 - threshold_occupied_normal / 100 * 255;
	
	buffer = new Uint8ClampedArray(width_normal * height_normal * 4); // have enough bytes
	
	var pixelsData = canvas_normal.getContext('2d').getImageData(0, 0, width_normal, height_normal).data;

	for(var y = 0; y < height_normal; y++)
	{
		for(var x = 0; x < width_normal; x++)
		{
			var pos = (y * width_normal + x) * 4; // position in buffer based on x and y
			
			if (pixelsData[pos+3] == 0) // Alpha 0
				color = color_unknow_normal;
			else if (pixelsData[pos] > threshold_free_255)
				color = color_free;
			else if (pixelsData[pos] < threshold_occupied_255)
				color = color_occupied_normal;
			else
				color = color_unknow_normal;
			
			buffer[pos  ] = color;           // some R value [0, 255]
			buffer[pos+1] = color;           // some G value
			buffer[pos+2] = color;           // some B value
			if (color == color_unknow_normal)
				buffer[pos+3] = 0;           // set alpha channel
			else
				buffer[pos+3] = 255;           // set alpha channel
		}
	}
	
	var canvasDessin = document.getElementById('install_normal_setup_trinary_canvas_result_trinary'),
	ctx = canvasDessin.getContext('2d');
	
	var idata = ctx.createImageData(width_normal, height_normal);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
	
	$('#install_normal_setup_trinary .loading_fin_create_map').hide();
}