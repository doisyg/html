var currentNameSiteExport = '';
var NormalBufferMapSaveElemName = '';
$(document).ready(function(e) {
	
	$(document).on('click', '#install_normal_setup_export .bSiteExportElem', function(e) {
        $('#install_normal_setup_export .bSiteExportElem').addClass('disabled');
		
		currentNameSiteExport = $(this).find('.societe').text();
		
		wycaApi.ExportSite($(this).data('id_site'), function(data){
			console.log(data);
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_export .bSiteExportElem').removeClass('disabled');
				var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					
					var blob = new Blob([data.D], {type: "octet/stream"}),
					url = window.URL.createObjectURL(blob);
					a.href = url;
					a.download = 'export_site_'+currentNameSiteExport+'.wyca';
					a.click();
					window.URL.revokeObjectURL(url);
			}
			else
			{
				$('#install_normal_setup_export .bSiteExportElem').removeClass('disabled');
				alert_wyca('Save map error : ' + wycaApi.AnswerCodeToString(data.A) + '<br>'+ data.M);
			}							
		});
		
    });
	
	// ----------------------- MAPPING CONFIG THRESHOLDS ------------------------
	
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
						map.image_amcl = data_img.image;
						map.image_tri = '';
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
			console.log(bystepCurrentAction);
			$('#bCloseAlertWyca').click(NormalShakeActiveElement());
		}
		else
		{
			let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
			if(actions_searched.includes(normalCurrentAction)){
				switch(normalCurrentAction){
					case 'editPoi' :
						i = GetPoiIndexFromID(currentPoiNormalLongTouch.data('id_poi'));
						NormalBufferMapSaveElemName = pois[i].name;
					break;
					case 'editDock' :
						i = GetDockIndexFromID(currentDockNormalLongTouch.data('id_docking_station'));
						NormalBufferMapSaveElemName = docks[i].name;
					break;
					case 'editAugmentedPose' :
						i = GetAugmentedPoseIndexFromID(currentAugmentedPoseNormalLongTouch.data('id_augmented_pose'));
						NormalBufferMapSaveElemName = augmented_poses[i].name;
					break;
					case 'editForbiddenArea' :
						i = GetForbiddenIndexFromID(currentForbiddenNormalLongTouch.data('id_area'));
						NormalBufferMapSaveElemName = forbiddens[i].name;
					break;
					case 'editArea' :
						i = GetAreaIndexFromID(currentAreaNormalLongTouch.data('id_area'));
						NormalBufferMapSaveElemName = areas[i].name;
					break;
					default: NormalBufferMapSaveElemName = ''; break;
				}
			}
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
	
	// --------------------------- FACTORY RESET ----------------------------------	
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
						window.location.href = (use_ssl?'https':'http') + '://wyca.run/login.php';
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


// ----------------------- MAPPING CONFIG ------------------------
	

var threshold_free_normal = 25;
var threshold_occupied_normal = 65;

var color_free_normal = 255;
var color_occupied_normal = 0;
var color_unknow_normal = 205;

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

var timeoutCalcul_normal = null;

var img_normal;
var canvas_normal;

var width_normal = 0;
var height_normal = 0;

/* INSTALLATEUR WYCA.JS */

$(document).ready(function(e) {
	//----------------------- IMPORT SITE ----------------------------
	
	$('#pages_install_normal .file_import_site').change(function(){
		//console.log('here');
		$('#pages_install_normal .filename_import_site').html($(this)[0].files[0].name);
		$('#pages_install_normal .filename_import_site').show();
		$('#pages_install_normal .file_import_site_wrapper').css('background-color','#47a4476e');
		
	})
	
	$('#pages_install_normal a.bImportSiteDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_install_normal .file_import_site')[0].files[0];
		if(file != undefined){
			
			$('#pages_install_normal .install_normal_setup_import_loading').show();
			$('#pages_install_normal .install_normal_setup_import_content').hide();
			
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.ImportSite(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						$('#pages_install_normal .install_normal_setup_import_loading').hide();
						$('#pages_install_normal .install_normal_setup_import_content').show();
						
						success_wyca('Imported');
						
						$('.bImportSiteBack').click();
					}
					else
					{
						console.log(JSON.stringify(data)); 
						text = wycaApi.AnswerCodeToString(data.A);
						if (data.M != '') text += '<br />'+data.M;
						alert_wyca(text);
					}
				});
			};
			reader.readAsText(file);
		}else{
			let icon = $('#pages_install_normal .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	// --------------------- ADD SITE --------------------
	$('#install_normal_setup_sites .bAddSite').click(function(e) {
		e.preventDefault();
		
		create_new_site = true;
		setCookie('create_new_site',create_new_site); // SET COOKIES
		$('#pages_install_normal').removeClass('active');
		$('#pages_install_by_step section.page').hide();
		
		$('#pages_install_by_step').addClass('active');
		$('#install_by_step_site').show();
	});
	
	$(document).on('click', '#install_normal_setup_sites .bSiteSetCurrentElem', function(e) {
		e.preventDefault();
		
		id_site = parseInt($(this).closest('li').data('id_site'));
		
		
		wycaApi.SetSiteAsCurrent(id_site, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				alert_wyca('Error navigation stop ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);
			else
			{
				GetSitesNormal();
			}
		});
	});
	
	$(document).on('click', '#install_normal_setup_sites .bSiteDeleteElem', function(e) {
		e.preventDefault();
		
		id_site_to_delete = parseInt($(this).closest('li').data('id_site'));
		
		wycaApi.DeleteSite(id_site_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_sites_list_site_elem_'+id_site_to_delete).remove();
			}
			else
			{
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
	});
	
	$('#install_normal_service_book .bAddServiceBook').click(function(e) {
	
		$('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_title').val('');
		$('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_comment').val('');
		
		$('#install_normal_service_book .modalServiceBook').modal('show');
	});
	
	$('#install_normal_service_book .modalServiceBook #install_normal_service_book_bServiceBookSave').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_title').val() == "" )
		{
			alert_wyca('Title is required');
		}
		else if ($('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_comment').val() == "" )
		{
			alert_wyca('Comment is required');
		}
		else
		{
			json_service_book = {
				"id_service_book": -1,
				"title": $('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_title').val(),
				"comment": $('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_comment').val()
			};
			
			wycaApi.SetServiceBook(json_service_book, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					$('#install_normal_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="title">'+json_service_book.title+'</div>'+
						'	<div class="comment">'+json_service_book.comment+'</div>'+
						'</li>'
						);

					$('#install_normal_service_book .modalServiceBook').modal('hide');
				}
				else
				{
					console.log(JSON.stringify(data)); 
					text = wycaApi.AnswerCodeToString(data.A);
					if (data.M != '') text += '<br />'+data.M;
					alert_wyca(text);
				}
			});
		}
    });
	
	$('#install_normal_manager .bAddManager').click(function(e) {
	
		$('#install_normal_manager .modalManager #install_normal_manager_i_id_manager').val(-1);
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_email').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_societe').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_prenom').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_nom').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_cpassword').val('');
		
		$('#install_normal_manager .modalManager').modal('show');
	});
	
	$('#install_normal_manager .modalManager #install_normal_manager_bManagerSave').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').val() != $('#install_normal_manager .modalManager #install_normal_manager_i_manager_cpassword').val())
		{
			alert_wyca('Invalid password or confirm');
		}
		else if ($('#install_normal_manager .modalManager #install_normal_manager_i_manager_societe').val() == "" )
		{
			alert_wyca('Company is required');
		}
		else if ($('#install_normal_manager .modalManager #install_normal_manager_i_manager_prenom').val() == "" )
		{
			alert_wyca('Firstname is required');
		}
		else if ($('#install_normal_manager .modalManager #install_normal_manager_i_manager_nom').val() == "" )
		{
			alert_wyca('Lastname is required');
		}
		else
		{
			json_user = {
				"id_user": parseInt($('#install_normal_manager .modalManager #install_normal_manager_i_id_manager').val()),
				"company": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_societe').val(),
				"lastname": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_nom').val(),
				"firstname": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_prenom').val(),
				"email": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_email').val(),
				"pass": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').val(),
				"id_group_user": 3,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#install_normal_manager_list_manager_elem_'+id_user).length > 0)
					{
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.email').html(json_user.email);
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.societe').html(json_user.company);
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.nom').html(json_user.lastname);
					}
					else
					{
						$('#install_normal_manager .list_managers').append('' +
							'<li id="install_normal_manager_list_manager_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="societe">'+json_user.company+'</span><br /><span class="prenom">'+json_user.firstname+'</span> <span class="nom">'+json_user.lastname+'</span><br /><span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bManagerDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
					}
					
					$('#install_normal_manager .modalManager').modal('hide');
				}
				else
				{
					console.log(JSON.stringify(data)); 
					text = wycaApi.AnswerCodeToString(data.A);
					if (data.M != '') text += '<br />'+data.M;
					alert_wyca(text);
				}
			});
		}
    });
	
	$(document).on('click', '#install_normal_manager .bManagerDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_manager_list_manager_elem_'+id_user_to_delete).remove();
			}
			else
			{
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
	});
	
	$(document).on('click', '#install_normal_manager .bManagerEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#install_normal_manager .modalManager #install_normal_manager_i_id_manager').val(id_user);
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_email').val($('#install_normal_manager_list_manager_elem_'+id_user+' span.email').html());
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_societe').val($('#install_normal_manager_list_manager_elem_'+id_user+' span.societe').html());
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_prenom').val($('#install_normal_manager_list_manager_elem_'+id_user+' span.prenom').html());
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_nom').val($('#install_normal_manager_list_manager_elem_'+id_user+' span.nom').html());
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_cpassword').val('');
		
		$('#install_normal_manager .modalManager').modal('show');
	});
	
	//----------------------- WIFI ----------------------------
	
	$('#install_normal_setup_wifi .refresh_wifi').click(function(e) {
		e.preventDefault();		
	});
	
	$( '#install_normal_setup_wifi tbody' ).on( 'click', 'tr', function(e) {
		e.preventDefault();
		selectedWifi = $(this).data('ssid');
		
		$('#install_normal_setup_wifi_password .wifi_connexion_error').html('');
		$('#install_normal_setup_wifi_password .install_normal_setup_wifi_password_save').show();
		$('#install_normal_setup_wifi_password .wifi_connexion_progress').hide();

		$('#install_normal_setup_wifi .set_passwd_wifi').click();
	});
	
	$('#install_normal_setup_wifi_password .install_normal_setup_wifi_password_save').click(function(e) {
        e.preventDefault();
		
		$('#install_normal_setup_wifi_password .install_normal_setup_wifi_password_save').hide();
		$('#install_normal_setup_wifi_password .wifi_connexion_progress').show();
		$('#install_normal_setup_wifi_password .wifi_connexion_error').html('');
		
		wycaApi.WifiConnection(selectedWifi, $('#install_normal_setup_wifi_password .i_wifi_passwd_name').val(), function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_wifi_password .wifi_connexion_error').html(data.M);
			}
			else
			{
				$('#install_normal_setup_wifi_password .skip_wifi').click();
				$('#install_normal_setup_wifi_password .wifi_connexion_error').html('');
			}
			$('#install_normal_setup_wifi_password .install_normal_setup_wifi_password_save').show();
			$('#install_normal_setup_wifi_password .wifi_connexion_progress').hide();
		});
    });
	
	$('#install_normal_setup_vehicule .bConfigurationSave').click(function(e) {
		wycaApi.SetEnergyConfiguration(parseInt($('#install_normal_setup_vehicule #install_normal_setup_vehicule_i_level_min_gotocharge').val()), parseInt($('#install_normal_setup_vehicule #install_normal_setup_vehicule_i_level_min_dotask').val()), function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca('Saved');
			}
			else
			{
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
    });
	
	$('#install_normal_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		
		$('#install_normal_recovery .bRecovery').addClass('disabled');
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				success_wyca('Recovery done !');
			}
			else
			{
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
    });
	
	$('#pages_install_normal a.select_langue').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/set_langue.php',
			data: {
				'id_lang': $(this).data('id_lang')
			},
			dataType: 'json',
			success: function(data) {
				if (data.need_restart == 1)
					window.location.href = window.location.href;
			},
			error: function(e) {
				alert_wyca('Error set lang ; ' + e.responseText);
			}
		});
    });
	
	//------------------- AVAILABLES TOPS ------------------------
	
	$('#pages_install_normal .file_import_top').change(function(){
		//console.log('here');
		$('#pages_install_normal .filename_import_top').html($(this)[0].files[0].name);
		$('#pages_install_normal .filename_import_top').show();
		$('#pages_install_normal .file_import_top_wrapper').css('background-color','#47a4476e');
		
	})
	
	$('#pages_install_normal a.bImportTopDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_install_normal .file_import_top')[0].files[0];
		if(file != undefined){
			$('#pages_install_normal .modalImportTop_loading').show();
			$('#pages_install_normal .modalImportTop_content').hide();
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						
						$('#pages_install_normal .modalImportTop_loading').hide();
						$('#pages_install_normal .modalImportTop_content').show();
						
						$('#pages_install_normal .modalImportTop').modal('hide');
						InitTopsNormal();
					}
					else
					{
						ParseAPIAnswerError(data);
					}
					
					
				});
			};
			reader.readAsText(file);
		}else{
			//NO FILE UPLOADED AND CLICK ON BTN => SHAKE ICON
			let icon = $('#pages_install_normal .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	$('#pages_install_normal a.import_top').click(function(e) {
        e.preventDefault();
		
		$('#pages_install_normal .modalImportTop_loading').hide();
		$('#pages_install_normal .modalImportTop_content').show();
		
		$('#pages_install_normal .modalImportTop').modal('show');
		InitNormalTopImport();
	});
	
	$('#pages_install_normal a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		console.log($(this))
		console.log($(this).parent())
		//$('#pages_install_normal #install_normal_setup_tops li').hide();
		$('#install_normal_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_install_normal #install_normal_setup_tops .bTop'+$(this).data('id_top')).show();
        });
		
		if (listAvailableTops.length == 0)
		{
			alert_wyca(textSelectOnOrMoreTops);
		}
		else
		{
			wycaApi.SetAvailableTops(listAvailableTops, function(data){
				
				if (listAvailableTops.length == 1)
				{
					wycaApi.SetActiveTop(listAvailableTops[0], function(data){
						if (data.A == wycaApi.AnswerCode.NO_ERROR)
						{
							success_wyca(textAvailablesTopsSaved);
						}
						else
						{
							ParseAPIAnswerError(data);
						}
					});
				}
				else
				{
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						success_wyca(textAvailablesTopsSaved);
					}
					else
					{
						ParseAPIAnswerError(data);
					}
				}
			});
		}
    });
	
	//------------------- ACTIVE TOP ------------------------
	
	$( '#pages_install_normal' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();
		
		wycaApi.on('onSetActiveTopResult', function(data) {
			
			InitTopsActiveNormal();
			$('#install_normal_setup_top .modalSetActiveTop').modal('hide');
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca('Top is now active !');
			}
			else
			{
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				//success_wyca('Recovery done !');
				$('#install_normal_setup_top .modalSetActiveTop').modal('show');
				$('#install_normal_setup_top .modalSetActiveTop a').addClass('disabled');
				timerSetActiveTop = 10;
				timerSetActiveTopCurrent = 10;
				$('#pages_install_normal .progressSetActiveTop').show();
				NextTimerSetActiveTop();
			}
			else
			{
				InitTopsActiveNormal();
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}	
		});		
	});
	
	
});

//------------------- ACTIVE TOP ------------------------

var timerSetActiveTop = 10;
var timerSetActiveTopCurrent = 10;
var timeoutTimerSetActiveTopInterval = null;

function NextTimerSetActiveTop()
{
	if (timerSetActiveTopCurrent < 0)
	{
		setTimeout(function() {
			$('.progressSetActiveTop').hide();
			
			if (intervalMap != null)
			{
				clearInterval(intervalMap);
				intervalMap = null;
			}
			//intervalMap = setInterval(GetMap, 1000);
		}, 500);
	}
	else	
	{	
		valeur = 100-parseInt(timerSetActiveTopCurrent / timerSetActiveTop * 100);

		$('.setActiveTopProgress .progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur); 
	
		timerSetActiveTopCurrent -= 0.1;	
		timerSetActiveTopCurrent = parseInt(timerSetActiveTopCurrent*10)/10;
		
		setTimeout(NextTimerSetActiveTop, 100);
	}
}