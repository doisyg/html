//Javascript document
var form_sended = false; //Boolean pour disable a form "en traitement"
var selectedWifi = '';

var currentNameSiteExport = '';
var WycaBufferMapSaveElemName = '';

$(document).ready(function(e) {
	// ----------------------- SITE EXPORT ------------------------
		
	$(document).on('click', '#wyca_setup_export .bSiteExportElem', function(e) {
        $('#wyca_setup_export .bSiteExportElem').addClass('disabled');
		
		currentNameSiteExport = $(this).find('.societe').text();
		
		wycaApi.ExportSite($(this).data('id_site'), function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_export .bSiteExportElem').removeClass('disabled');
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
				$('#wyca_setup_export .bSiteExportElem').removeClass('disabled');
				ParseAPIAnswerError(data,textErrorExportSite);
			}							
		});
		
    });
	
	// ----------------------- MAPPING CONFIG THRESHOLDS ------------------------
	
	$('#wyca_setup_trinary .bResetValueThreshold').click(function(e) {
        e.preventDefault();
		
		$("#wyca_setup_trinary_threshold_free_slider").val(25);
		$("#wyca_setup_trinary_threshold_free_slider_elem").slider('value',25);
		$('#wyca_setup_trinary_threshold_free_output b').text( 25 );
		threshold_free_wyca = 25;
		
		$("#wyca_setup_trinary_threshold_occupied_slider").val(65);
		$("#wyca_setup_trinary_threshold_occupied_slider_elem").slider('value',65);
		$('#wyca_setup_trinary_threshold_occupied_output b').text( 65 );
		threshold_occupied_wyca = 65;
		
		$('#wyca_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
		CalculateMapTrinaryWyca();
    });
	
	$('#wyca_setup_trinary_threshold_free_slider').change(function() {
		$('#wyca_setup_trinary_threshold_free_output b').text( this.value );
		threshold_free_wyca = this.value;
		
		$('#wyca_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
		CalculateMapTrinaryWyca();
	});
	
	$('#wyca_setup_trinary_threshold_occupied_slider').change(function() {
		$('#wyca_setup_trinary_threshold_occupied_output b').text( this.value );
		threshold_occupied_wyca = this.value;
		
		$('#wyca_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
		CalculateMapTrinaryWyca();
	});
	
	$("#wyca_setup_trinary_threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#wyca_setup_trinary_threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#wyca_setup_trinary_threshold_occupied_output b").text(slideEvt.value); $("#wyca_setup_trinary_threshold_occupied_slider").val(slideEvt.value); });
	$("#wyca_setup_trinary_threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#wyca_setup_trinary_threshold_free_slider_elem").on("slide", function(slideEvt) { $("#wyca_setup_trinary_threshold_free_output b").text(slideEvt.value); $("#wyca_setup_trinary_threshold_free_slider").val(slideEvt.value); });
	
	$('#wyca_setup_trinary .bSaveTrinaryMap').click(function(e) {
		
		var canvasDessin = document.getElementById('wyca_setup_trinary_canvas_result_trinary');
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
						map.threshold_free = parseInt($('#wyca_setup_trinary_threshold_free_slider').val());
						map.threshold_occupied = parseInt($('#wyca_setup_trinary_threshold_occupied_slider').val());
						
						wycaApi.SetMap(map, function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR)
							{	
								success_wyca(textMapSaved);
							}
							else
							{
								ParseAPIAnswerError(data,textErrorSaveMap);
							}							
						});
					}
					else
					{
						alert_wyca(textErrorTrinary);
					}
									
					
				},
				error: function(e) {
					
					var img = document.getElementById("wyca_setup_trinary_img_map_saved_fin");
        			img.src = "assets/images/vide.png";
					
					alert_wyca(textErrorTrinary + ' ' + e.responseText);
				}
			});
		
	});
	
	// ----------------------- MAP ------------------------
	
	$('#wyca_edit_map .bSaveMapTestPoi').click(function(e) {
		e.preventDefault();
		
		$('#wyca_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#wyca_edit_map .bSaveMapTestPoi i').addClass('fa-spinner fa-pulse');
		
		id_poi_test = currentPoiWycaLongTouch.data('id_poi');
		i = GetPoiIndexFromID(currentPoiWycaLongTouch.data('id_poi'));
		
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
						landmarks = data.D.landmarks;
						augmented_poses = data.D.augmented_poses;
						
						$('#wyca_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
						
						largeurSlam = data.D.ros_width;
						hauteurSlam = data.D.ros_height;
						largeurRos = data.D.ros_width;
						hauteurRos = data.D.ros_height;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#wyca_edit_map_svg').attr('width', data.D.ros_width);
						$('#wyca_edit_map_svg').attr('height', data.D.ros_height);
						
						$('#wyca_edit_map_image').attr('width', data.D.ros_width);
						$('#wyca_edit_map_image').attr('height', data.D.ros_height);
						$('#wyca_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
					  
						$('#wyca_mapping_use .bUseThisMapNowYes').show();
						$('#wyca_mapping_use .bUseThisMapNowNo').show();
						$('#wyca_mapping_use .modalUseThisMapNowTitle1').show();
						$('#wyca_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#wyca_mapping_use .modalUseThisMapNowContent').hide();
						
						wycaHistoriques = Array();
						wycaHistoriqueIndex = -1;
						WycaRefreshHistorique();
						
						WycaInitMap();
						WycaResizeSVG();
						
						// On recherche le nouveau poi créé avec le bon id
						if (id_poi_test >= 300000)
						{
							$.each(pois, function( index, poi ) {
								
								if (poi.id_fiducial == id_fiducial_test && poi.final_pose_x == final_pose_x_test && poi.final_pose_y == final_pose_y_test && poi.final_pose_t == final_pose_t_test)
								{
									currentPoiWycaLongTouch = $('#wyca_edit_map_poi_robot_'+poi.id_poi);
								}
							});
						}
						
						$('#wyca_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#wyca_edit_map .bSaveMapTestPoi i').addClass('fa-check');
					}
					else
					{
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#wyca_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#wyca_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
			}
		});
    });
	
	$('#wyca_edit_map .bSaveMapTestAugmentedPose').click(function(e) {
		e.preventDefault();
		
		$('#wyca_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#wyca_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-spinner fa-pulse');
		
		id_augmented_pose_test = currentAugmentedPoseWycaLongTouch.data('id_augmented_pose');
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaLongTouch.data('id_augmented_pose'));
		
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
						landmarks = data.D.landmarks;
						augmented_poses = data.D.augmented_poses;
						
						$('#wyca_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
						
						largeurSlam = data.D.ros_width;
						hauteurSlam = data.D.ros_height;
						largeurRos = data.D.ros_width;
						hauteurRos = data.D.ros_height;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#wyca_edit_map_svg').attr('width', data.D.ros_width);
						$('#wyca_edit_map_svg').attr('height', data.D.ros_height);
						
						$('#wyca_edit_map_image').attr('width', data.D.ros_width);
						$('#wyca_edit_map_image').attr('height', data.D.ros_height);
						$('#wyca_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
					  
						$('#wyca_mapping_use .bUseThisMapNowYes').show();
						$('#wyca_mapping_use .bUseThisMapNowNo').show();
						$('#wyca_mapping_use .modalUseThisMapNowTitle1').show();
						$('#wyca_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#wyca_mapping_use .modalUseThisMapNowContent').hide();
						
						wycaHistoriques = Array();
						wycaHistoriqueIndex = -1;
						WycaRefreshHistorique();
						
						WycaInitMap();
						WycaResizeSVG();
						
						// On recherche le nouveau augmented_pose créé avec le bon id
						if (id_augmented_pose_test >= 300000)
						{
							$.each(augmented_poses, function( index, augmented_pose ) {
								
								if (augmented_pose.id_fiducial == id_fiducial_test && augmented_pose.final_pose_x == final_pose_x_test && augmented_pose.final_pose_y == final_pose_y_test && augmented_pose.final_pose_t == final_pose_t_test)
								{
									currentAugmentedPoseWycaLongTouch = $('#wyca_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
								}
							});
						}
						
						$('#wyca_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#wyca_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-check');
					}
					else
					{
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#wyca_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#wyca_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
			}
		});
    });
	
	$('#wyca_edit_map .bSaveMapTestDock').click(function(e) {
		e.preventDefault();
		
		
		$('#wyca_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#wyca_edit_map .bSaveMapTestDock i').addClass('fa-spinner fa-pulse');
		
		id_dock_test = currentDockWycaLongTouch.data('id_docking_station');
		i = GetDockIndexFromID(currentDockWycaLongTouch.data('id_docking_station'));
		
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
						landmarks = data.D.landmarks;
						augmented_poses = data.D.augmented_poses;
						
						$('#wyca_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
						
						largeurSlam = data.D.ros_width;
						hauteurSlam = data.D.ros_height;
						largeurRos = data.D.ros_width;
						hauteurRos = data.D.ros_height;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#wyca_edit_map_svg').attr('width', data.D.ros_width);
						$('#wyca_edit_map_svg').attr('height', data.D.ros_height);
						
						$('#wyca_edit_map_image').attr('width', data.D.ros_width);
						$('#wyca_edit_map_image').attr('height', data.D.ros_height);
						$('#wyca_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
					  
						$('#wyca_mapping_use .bUseThisMapNowYes').show();
						$('#wyca_mapping_use .bUseThisMapNowNo').show();
						$('#wyca_mapping_use .modalUseThisMapNowTitle1').show();
						$('#wyca_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#wyca_mapping_use .modalUseThisMapNowContent').hide();
						
						wycaHistoriques = Array();
						wycaHistoriqueIndex = -1;
						WycaRefreshHistorique();
						
						WycaInitMap();
						WycaResizeSVG();
						
						// On recherche le nouveau dock créé avec le bon id
						if (id_dock_test >= 300000)
						{
							$.each(docks, function( index, dock ) {
								
								if (dock.id_fiducial == id_fiducial_test)
								{
									currentDockWycaLongTouch = $('#wyca_edit_map_dock_'+dock.id_docking_station);
								}
							});
						}
						
						$('#wyca_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#wyca_edit_map .bSaveMapTestDock i').addClass('fa-check');
					}
					else
					{
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#wyca_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#wyca_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
			}
		});
    });
	
	$('#wyca_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!wycaCanChangeMenu)
		{
			alert_wyca(textConfirmActiveElement);
			$('#bCloseAlertWyca').click(WycaShakeActiveElement());
		}
		else
		{
			let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
			if(actions_searched.includes(wycaCurrentAction)){
				switch(wycaCurrentAction){
					case 'editPoi' :
						i = GetPoiIndexFromID(currentPoiWycaLongTouch.data('id_poi'));
						WycaBufferMapSaveElemName = pois[i].name;
					break;
					case 'editDock' :
						i = GetDockIndexFromID(currentDockWycaLongTouch.data('id_docking_station'));
						WycaBufferMapSaveElemName = docks[i].name;
					break;
					case 'editAugmentedPose' :
						i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaLongTouch.data('id_augmented_pose'));
						WycaBufferMapSaveElemName = augmented_poses[i].name;
					break;
					case 'editForbiddenArea' :
						i = GetForbiddenIndexFromID(currentForbiddenWycaLongTouch.data('id_area'));
						WycaBufferMapSaveElemName = forbiddens[i].name;
					break;
					case 'editArea' :
						i = GetAreaIndexFromID(currentAreaWycaLongTouch.data('id_area'));
						WycaBufferMapSaveElemName = areas[i].name;
					break;
					default: WycaBufferMapSaveElemName = ''; break;
				}
			}
			wycaCanChangeMenu = true;
			wycaCurrentAction = '';
			WycaHideMenus();
			
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#wyca_test_map .list_test li').remove();
				$('#wyca_test_map .wyca_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca(textMapSaved);
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapWyca();
					/*
					if (navLaunched && id_map == current_id_map)
					{
						wycaApi.NavigationReloadMaps(function(e) { if (e.A != wycaApi.AnswerCode.NO_ERROR) console.error(wycaApi.AnswerCodeToString(data.A)+ " " + data.M); });	
					}
					*/
				}
				else
				{
					$('#wyca_edit_map .burger_menu').removeClass('updatingMap');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});
		}
    });
	
	// --------------------------- FACTORY RESET ----------------------------------	
	
	$('#wyca_setup_reset .bReset').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_setup_reset_cbConfirm').is(':checked'))
		{
			$('#wyca_setup_reset .bGotoReset').click();
			wycaApi.FactoryDataReset(function(){
				resetCookies();
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
			alert_wyca(textConfirmCheckbox);
		}
		
    });	
	
	// ----------------------- MAP DOWNLOAD PNG ------------------------
		
	$(document).on('click', '#wyca_setup_download_map .bMapDownloadElem', function(e) {
        $('#wyca_setup_download_map .bMapDownloadElem').addClass('disabled');
		
		currentMapDownload = $(this).find('.societe').text();
		id_map = $(this).data('id_map');
		
		wycaApi.GetMap($(this).data('id_map'), function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_download_map .bMapDownloadElem').removeClass('disabled');
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				
				url = 'data:image/png;base64,' + data.D.image;
				a.href = url;
				a.download = 'map_'+currentMapDownload+'.png';
				a.click();
				window.URL.revokeObjectURL(url);
			}
			else
			{
				$('#wyca_setup_download_map .bMapDownloadElem').removeClass('disabled');
				ParseAPIAnswerError(data,textErrorDownloadMap);
			}							
		});
		
    });
});

// ----------------------- MAPPING CONFIG ------------------------

var threshold_free_wyca = 25;
var threshold_occupied_wyca = 65;

var color_free_wyca = 255;
var color_occupied_wyca = 0;
var color_unknow_wyca = 205;

function WycaInitTrinary()
{
	if (wycaApi.websocketAuthed)
	{
		WycaInitTrinaryDo();
	}
	else
	{
		setTimeout(WycaInitTrinary, 500);
	}
}

var current_map_obj = {};

function WycaInitTrinaryDo()
{
	$('#wyca_setup_trinary .loading_fin_create_map').show();
	$('#wyca_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
	
	img = document.getElementById("wyca_setup_trinary_img_map_saved_fin");
	img.src = 'assets/images/vide.png';
	
	wycaApi.GetCurrentMapComplete(function(data) {
		if (data.A == wycaApi.AnswerCode.NO_ERROR)
		{
			console.log(data);
			img_wyca = document.getElementById("wyca_setup_trinary_img_map_saved_fin");
			img_wyca.src = 'data:image/png;base64,' + data.D.image;
			
			current_map_obj = data.D;
			
			finalMapData = 'data:image/png;base64,' + data.D.image;
			
			threshold_free_wyca = data.D.threshold_free;
			threshold_occupied_wyca = data.D.threshold_occupied;
			
			setTimeout(function() {
				canvas_wyca = document.createElement('canvas');
				
				width_wyca = img.naturalWidth;
				height_wyca = img.naturalHeight;
				
				$('#wyca_setup_trinary_canvas_result_trinary').attr('width', img_wyca.naturalWidth);
				$('#wyca_setup_trinary_canvas_result_trinary').attr('height', img_wyca.naturalHeight);
				
				canvas_wyca.width = img_wyca.naturalWidth;
				canvas_wyca.height = img_wyca.naturalHeight;
				canvas_wyca.getContext('2d').drawImage(img_wyca, 0, 0, img_wyca.naturalWidth, img_wyca.naturalHeight);
				
				CalculateMapTrinaryWyca();
			}, 100);
		}
		else
		{
			ParseAPIAnswerError(data,textErrorGetMap);
		}
	});
}

function CalculateMapTrinaryWyca()
{
	if (timeoutCalcul_wyca != null)
	{
		clearTimeout(timeoutCalcul_wyca);
		timeoutCalcul_wyca = null;
	}
	timeoutCalcul_wyca = setTimeout(CalculateMapTrinaryDoWyca, 500);
}

function CalculateMapTrinaryDoWyca()
{
	var start = performance.now();

	$('#wyca_setup_trinary .loading_fin_create_map').show();
	threshold_free_255 = 255 - threshold_free_wyca / 100 * 255;
	threshold_occupied_255 = 255 - threshold_occupied_wyca / 100 * 255;
	
	buffer = new Uint8ClampedArray(width_wyca * height_wyca * 4); // have enough bytes
	
	var pixelsData = canvas_wyca.getContext('2d').getImageData(0, 0, width_wyca, height_wyca).data;

	for(var y = 0; y < height_wyca; y++)
	{
		for(var x = 0; x < width_wyca; x++)
		{
			var pos = (y * width_wyca + x) * 4; // position in buffer based on x and y
			
			if (pixelsData[pos+3] == 0) // Alpha 0
				color = color_unknow_wyca;
			else if (pixelsData[pos] > threshold_free_255)
				color = color_free;
			else if (pixelsData[pos] < threshold_occupied_255)
				color = color_occupied_wyca;
			else
				color = color_unknow_wyca;
			
			buffer[pos  ] = color;           // some R value [0, 255]
			buffer[pos+1] = color;           // some G value
			buffer[pos+2] = color;           // some B value
			if (color == color_unknow_wyca)
				buffer[pos+3] = 0;           // set alpha channel
			else
				buffer[pos+3] = 255;           // set alpha channel
		}
	}
	
	var canvasDessin = document.getElementById('wyca_setup_trinary_canvas_result_trinary'),
	ctx = canvasDessin.getContext('2d');
	
	var idata = ctx.createImageData(width_wyca, height_wyca);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
	
	$('#wyca_setup_trinary .loading_fin_create_map').hide();
	$('#wyca_setup_trinary .bSaveTrinaryMap ').removeClass('disabled');
}

var timeoutCalcul_wyca = null;

var img_wyca;
var canvas_wyca;

var width_wyca = 0;
var height_wyca = 0;

/* INSTALLATEUR WYCA.JS */
var create_new_site = false;
var id_site_to_delete = -1;
var id_site_to_switch = -1;
var id_map_to_switch = -1;
$(document).ready(function(e) {
	//----------------------- IMPORT SITE ----------------------------
	
	$('#pages_wyca_normal .file_import_site').change(function(){
		
		let fname = $(this)[0].files[0].name;
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_wyca_normal .file_import_site_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_wyca_normal .file_import_site_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_wyca_normal .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_wyca_normal .filename_import_site').html(fname);
		$('#pages_wyca_normal .filename_import_site').show();
		
	})
	
	$('#pages_wyca_normal a.bImportSiteDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_wyca_normal .file_import_site')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			
			$('#pages_wyca_normal .wyca_setup_import_loading').show();
			$('#pages_wyca_normal .wyca_setup_import_content').hide();
			
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.ImportSite(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						id_site = data.D;
						wycaApi.SetSiteAsCurrent(id_site,function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR)
							{
								wycaApi.GetCurrentMapData(function(data){
									if (data.A == wycaApi.AnswerCode.NO_ERROR)
									{
										if(data.D.docks.length <= 1){
											$('#pages_wyca_normal .wyca_setup_import_loading').hide();
											$('#pages_wyca_normal .wyca_setup_import_content').show();
											success_wyca(textSiteImported);
											$('#pages_wyca_normal .bImportSiteBack').click();
										}else{
											
											id_map = data.D.id_map;
											id_map_last = data.D.id_map;
								
											forbiddens = data.D.forbiddens;
											landmarks = data.D.landmarks;
											areas = data.D.areas;
											docks = data.D.docks;
											pois = data.D.pois;
											augmented_poses = data.D.augmented_poses; 
											
											InitMasterDockWyca();
										}
									}else{
										ParseAPIAnswerError(data);
										InitSiteImportWyca();
									}
								})
							}
							else
							{
								ParseAPIAnswerError(data);
								InitSiteImportWyca();
							}
						})
						
						
						
					}
					else
					{
						ParseAPIAnswerError(data);
						InitSiteImportWyca();
					}
				});
			};
			reader.readAsText(file);
		}else{
			let icon = $('#pages_wyca_normal .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	//----------------------- MASTER DOCK ----------------------------
	
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_wyca_normal #MasterDockList" ).on( 'click', '.MasterDockItem', function(e) {
		let id_master = $(this).attr('id');
		$.each(docks,function(idx,item){
			docks[idx].is_master=false;
			if(item.id_docking_station == id_master){
				docks[idx].is_master=true;
			}
		})
		data = GetDataMapToSave();
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#pages_wyca_normal .modalMasterDock .bCloseMasterDock').click();
				success_wyca(textSiteImported);
				$('#pages_wyca_normal #wyca_setup_import .bImportSiteBack').click();
			}else{
				$('#pages_wyca_normal .modalMasterDock .bCloseMasterDock').click();
				ParseAPIAnswerError(data);
				InitSiteImportWyca();
				
			}
		})		
	})
	
	// --------------------- ADD SITE --------------------
	
	$('#wyca_setup_sites .bAddSite').click(function(e) {
		e.preventDefault();
		
		create_new_site = true;
		setCookie('create_new_site',create_new_site); // SET COOKIES
		$('#pages_wyca_normal').removeClass('active');
		$('#pages_wyca_by_step section.page').hide();
		
		$('#pages_wyca_by_step').addClass('active');
		$('#wyca_by_step_site').show();
	});
	
	$(document).on('click', '#wyca_setup_sites .bSiteSetCurrentElem', function(e) {
		e.preventDefault();
		$('#wyca_setup_sites .btn-danger.confirm_delete').addClass('disabled');
		$('#wyca_setup_sites .bSiteSetCurrentElem').addClass('disabled');
		
		id_site_to_switch = parseInt($(this).closest('li').data('id_site'));
		str_site_to_switch =  $(this).parent().find('.societe').text();
		
		wycaApi.GetMapsList(id_site_to_switch,function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
				ParseAPIAnswerError(data,textErrorGetMaps);
			else
			{
				id_map_to_switch = -1;
				if(data.D.length >= 2){
					$('#wyca_setup_sites .modalSelectMap .list_maps').html('');
					$.each(data.D,function(idx,item){
						if(item.name != ''){
							let map_item="";
							map_item+='<div class="col-xs-6 text-center">';
							map_item+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
							map_item+='		<i class="fas fa-map-marked-alt"></i>';
							map_item+='		<p class="mapname">'+item.name+'</p>';
							map_item+='   </div>';
							map_item+='</div>';
							$('#wyca_setup_sites .modalSelectMap .list_maps').append(map_item);
						}
					});
					$('#wyca_setup_sites .modalSelectMap').modal('show');
				}else{
					if(str_site_to_switch != ''){
						if($('#modalConfirmSwitchSite').data('original_txt') == undefined)
							$('#modalConfirmSwitchSite').data('original_txt',$('#modalConfirmSwitchSite').find('h3').text());
						$('#modalConfirmSwitchSite').find('h3').html($('#modalConfirmSwitchSite').data('original_txt') + '<br><br><span><i class="fas fa-building"></i><br>' + str_site_to_switch + '</span>')
					}
					$('#modalConfirmSwitchSite').modal('show');
				}
			}
		});
	});
	
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_wyca_normal #wyca_setup_sites .modalSelectMap" ).on( 'click', '.SelectMapItem', function(e) {
		id_map_to_switch = parseInt($(this).attr('id'));
		str_map_to_switch = $(this).find('.mapname').html();
	
		if($('#modalConfirmSwitchSite').data('original_txt') == undefined)
			$('#modalConfirmSwitchSite').data('original_txt',$('#modalConfirmSwitchSite').find('h3').text());
		$('#modalConfirmSwitchSite').find('h3').html($('#modalConfirmSwitchSite').data('original_txt') + '<br><br><span><i class="fas fa-building"></i><br>' + str_site_to_switch + '<br><br><i class="fas fa-map-marked-alt"></i><br>' + str_map_to_switch+'</span>');
		
		$('#modalConfirmSwitchSite').modal('show');
		$('#wyca_setup_sites .modalSelectMap').modal('hide');
	})
	
	$('#wyca_setup_sites #modalConfirmSwitchSite .bModalConfirmSwitchSiteOk').click(function(e){
		if(id_site_to_switch != -1){
			wycaApi.SetSiteAsCurrent(id_site_to_switch, function(data) {
				if (data.A != wycaApi.AnswerCode.NO_ERROR) 
					ParseAPIAnswerError(data,textErrorSetSite);
				else
				{
					if(id_map_to_switch != -1){
						wycaApi.SetMapAsCurrent(id_map_to_switch, function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								if($('#wyca_dashboard_modalCurrentSite').data('original_txt') == undefined)
									$('#wyca_dashboard_modalCurrentSite').data('original_txt',$('#wyca_dashboard_modalCurrentSite').find('h3').text());
								$('#wyca_dashboard_modalCurrentSite').find('h3').html($('#wyca_dashboard_modalCurrentSite').data('original_txt') + '<br><br><span>' + $('#modalConfirmSwitchSite').find('h3').find('span').html() + '</span>');
								$('#wyca_setup_sites .bBackToDashboard').click();
								$('#wyca_dashboard_modalCurrentSite').modal('show');
							}else{
								ParseAPIAnswerError(data,textErrorSetMap);
								GetSitesWyca();
							}
							$('#pages_wyca_normal .modalSelectMap .bCloseSelectMap').click();
							$('#wyca_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
							$('#wyca_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
							id_map_to_switch = -1;
						})
					}else{
						if($('#wyca_dashboard_modalCurrentSite').data('original_txt') == undefined)
							$('#wyca_dashboard_modalCurrentSite').data('original_txt',$('#wyca_dashboard_modalCurrentSite').find('h3').text());
						$('#wyca_dashboard_modalCurrentSite').find('h3').html($('#wyca_dashboard_modalCurrentSite').data('original_txt') + '<br><br><span>' + $('#modalConfirmSwitchSite').find('h3').find('span').html() + '</span>');
						$('#wyca_setup_sites .bBackToDashboard').click();
						$('#wyca_dashboard_modalCurrentSite').modal('show');
						$('#wyca_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
						$('#wyca_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
					}
				}
				id_site_to_switch = -1;
			})
		}
	})
	
	$('#wyca_setup_sites #modalConfirmSwitchSite .bModalConfirmSwitchSiteClose').click(function(e){
		
		$('#wyca_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
		$('#wyca_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
		
	})
	
	$(document).on('click', '#wyca_setup_sites .bSiteDeleteElem', function(e) {
		e.preventDefault();
		$('#wyca_setup_sites .btn-danger.confirm_delete').addClass('disabled');
		$('#wyca_setup_sites .bSiteSetCurrentElem').addClass('disabled');
		
		id_site_to_delete = parseInt($(this).closest('li').data('id_site'));
		
		wycaApi.DeleteSite(id_site_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_sites_list_site_elem_'+id_site_to_delete).remove();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
			$('#wyca_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
			$('#wyca_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
		});
	});
	
	// --------------------- ADD MAP --------------------
	
	$('#wyca_setup_maps .bAddMap').click(function(e) {
		e.preventDefault();
		
		create_new_map = true;
		setCookie('create_new_map',create_new_map); // SET COOKIES
		$('#pages_wyca').removeClass('active');
		$('#pages_install_by_step section.page').hide();
		
		$('.title_section').html($('#pages_install_by_step #install_by_step_mapping > header > h2').text())
		$('#pages_install_by_step').addClass('active');
		$('#install_by_step_mapping').show();
	});
	
	$(document).on('click', '#wyca_setup_maps .bMapSetCurrentElem', function(e) {
		e.preventDefault();
		
		id_map = parseInt($(this).closest('li').data('id_map'));
		
		
		wycaApi.SetMapAsCurrent(id_map, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				ParseAPIAnswerError(data,textErrorStopNavigation);
			else
			{
				GetMapsWyca();
			}
		});
	});
	
	$(document).on('click', '#wyca_setup_maps .bMapDeleteElem', function(e) {
		e.preventDefault();
		
		id_map_to_delete = parseInt($(this).closest('li').data('id_map'));
		
		wycaApi.DeleteMap(id_map_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_maps_list_map_elem_'+id_map_to_delete).remove();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	//---------------------- SWITCH MAP WITH LANDMARK -----------------------
	$(document).on('click', '#wyca_switch_map_landmark .bMapSetCurrentElem',function(e) {
		e.preventDefault();
		id_map = parseInt($(this).closest('li').data('id_map'));
		
		/*INIT FEEDBACK DISPLAY*/
		$('#wyca_switch_map_landmark .switch_map_feedback .switch_map_step').css('opacity','0').hide();
		$('#wyca_switch_map_landmark .switch_map_feedback .switch_map_step .fa-check').hide();
		$('#wyca_switch_map_landmark .switch_map_feedback .switch_map_step .fa-pulse').show();
		
		wycaApi.on('onSwitchMapWithLandmarkFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 		target = '#wyca_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapScan';			break;
					case 'Init pose': 			target = '#wyca_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapPose';			break;
					case 'Switch map': 			target = '#wyca_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapSwitchMap';		break;
					case 'Stop navigation':		target = '#wyca_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapStopNav';		break;
					case 'Start navigation': 	target = '#wyca_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapStartNav';		break;
				}
				
				target = $(target);
				if(target.prevAll('.switch_map_step:visible').length > 0){
					target.prevAll('.switch_map_step:visible').find('.fa-check').show();
					target.prevAll('.switch_map_step:visible').find('.fa-pulse').hide();
				}
				target.css('opacity','1').show();
			}
		});
		
		wycaApi.on('onSwitchMapWithLandmarkResult', function(data) {
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				
				$('#wyca_switch_map_landmark .switch_map_step:visible').find('.fa-check').show();
				$('#wyca_switch_map_landmark .switch_map_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('#wyca_switch_map_landmark #wyca_switch_map_landmark_modalFeedback').modal('hide');
					success_wyca(textSwitchMapDone);
				},500)
			}
			else
			{
				$('#wyca_switch_map_landmark #wyca_switch_map_landmark_modalFeedback').modal('hide');
				ParseAPIAnswerError(data);
			}
			GetSwitchMapsWyca();
			// On rebranche l'ancienne fonction
			wycaApi.on('onSwitchMapWithLandmarkResult', onSwitchMapWithLandmarkResult);
			wycaApi.on('onSwitchMapWithLandmarkFeedback', onSwitchMapWithLandmarkFeedback);
		});
		
		//console.log('SwitchMapWithLandmark ',id_map,' is commented // ');
		
		wycaApi.SwitchMapWithLandmark(id_map, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				ParseAPIAnswerError(data,textErrorSwitchMap);
			else
			{
				$('#wyca_switch_map_landmark #wyca_switch_map_landmark_modalFeedback').modal('show');
			}
		});
	});
	
	$('#wyca_switch_map_landmark .bCancelSwitchMap').click(function(e) {
		$('#wyca_switch_map_landmark .bCancelSwitchMap').addClass('disabled');
		wycaApi.SwitchMapWithLandmarkCancel(function(data) {
			$('#wyca_switch_map_landmark .bCancelSwitchMap').removeClass('disabled');
		})
	})
	
	$('#wyca_switch_map_landmark .bTeleop').click(function() {
		$('#wyca_switch_map_landmark_modalTeleop').modal('show');
	});
	
	//------------------- SERVICE BOOK ------------------------
	
	$('#wyca_service_book .bAddServiceBook').click(function(e) {
	
		$('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_title').val('');
		$('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_comment').val('');
		
		$('#wyca_service_book .modalServiceBook').modal('show');
	});
	
	$('#wyca_service_book .modalServiceBook #wyca_service_book_bServiceBookSave').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_title').val() == "" )
		{
			alert_wyca(textTitleRequired);
		}
		else if ($('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_comment').val() == "" )
		{
			alert_wyca(textCommentRequired);
		}
		else
		{
			json_service_book = {
				"id_service_book": -1,
				"title": $('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_title').val(),
				"comment": $('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_comment').val()
			};
			
			wycaApi.SetServiceBook(json_service_book, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					let d = new Date(Date.now());
					let d_txt="";
					switch(lang){
						case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
						case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
						default: break;
					}
					// On ajoute le li
					$('#wyca_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+json_service_book.title+'</div>'+
						'	<div class="comment">'+json_service_book.comment+'</div>'+
						'</li>'
						);

					$('#wyca_service_book .modalServiceBook').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	//------------------- ACCOUNTS ------------------------
	//MANAGERS
	$('#wyca_manager .bHelpManagerOk').click(function(){boolHelpManager = !$('#wyca_manager .checkboxHelpManager').prop('checked');setCookie('boolHelpManagerI',boolHelpManager);});//ADD SAVING BDD / COOKIES ?
	
	$('#wyca_manager .bAddManager').click(function(e) {
	
		$('#wyca_manager .modalManager #wyca_manager_i_id_manager').val(-1);
		$('#wyca_manager .modalManager #wyca_manager_i_manager_email').val('').removeClass('success').removeClass('error');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_societe').val('');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_prenom').val('');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_nom').val('');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_password').val('').removeClass('success').removeClass('error');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#wyca_manager .modalManager').modal('show');
	});
	
	$('#wyca_manager .modalManager #wyca_manager_bManagerSave').click(function(e) {
        e.preventDefault();
	
		let pass = $('#wyca_manager .modalManager #wyca_manager_i_manager_password');
		let cpass = $('#wyca_manager .modalManager #wyca_manager_i_manager_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#wyca_manager_i_manager_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#wyca_manager .modalManager #wyca_manager_i_id_manager').val()),
				"company": $('#wyca_manager .modalManager #wyca_manager_i_manager_societe').val(),
				"lastname": $('#wyca_manager .modalManager #wyca_manager_i_manager_nom').val(),
				"firstname": $('#wyca_manager .modalManager #wyca_manager_i_manager_prenom').val(),
				"email": $('#wyca_manager .modalManager #wyca_manager_i_manager_email').val(),
				"pass": $('#wyca_manager .modalManager #wyca_manager_i_manager_password').val(),
				"id_group_user": wycaApi.GroupUser.MANAGER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#wyca_manager_list_manager_elem_'+id_user).length > 0)
					{
						$('#wyca_manager_list_manager_elem_'+id_user+' span.email').html(json_user.email);
						/*
						$('#wyca_manager_list_manager_elem_'+id_user+' span.societe').html(json_user.company);
						$('#wyca_manager_list_manager_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#wyca_manager_list_manager_elem_'+id_user+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#wyca_manager .list_managers').append('' +
							'<li id="wyca_manager_list_manager_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayManagerWyca();
					}
					
					$('#wyca_manager .modalManager').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#wyca_manager .bManagerDeleteElem', function(e) {
		e.preventDefault();
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_manager_list_manager_elem_'+id_user_to_delete).remove();
				RefreshDisplayManagerWyca();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#wyca_manager .bManagerEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#wyca_manager .modalManager #wyca_manager_i_id_manager').val(id_user);
		$('#wyca_manager .modalManager #wyca_manager_i_manager_email').val($('#wyca_manager_list_manager_elem_'+id_user+' span.email').html());
		$('#wyca_manager .modalManager #wyca_manager_i_manager_societe').val($('#wyca_manager_list_manager_elem_'+id_user+' span.societe').html());
		$('#wyca_manager .modalManager #wyca_manager_i_manager_prenom').val($('#wyca_manager_list_manager_elem_'+id_user+' span.prenom').html());
		$('#wyca_manager .modalManager #wyca_manager_i_manager_nom').val($('#wyca_manager_list_manager_elem_'+id_user+' span.nom').html());
		$('#wyca_manager .modalManager #wyca_manager_i_manager_password').val('');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_cpassword').val('');
		
		$('#wyca_manager .modalManager #wyca_manager_i_manager_email').removeClass('success').removeClass('error');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_password').removeClass('success').removeClass('error');
		$('#wyca_manager .modalManager #wyca_manager_i_manager_cpassword').removeClass('success').removeClass('error');
		
		$('#wyca_manager .modalManager').modal('show');
	});	
	
	$('#wyca_manager input#wyca_manager_i_manager_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_manager input#wyca_manager_i_manager_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_manager input#wyca_manager_i_manager_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#wyca_manager input#wyca_manager_i_manager_password').val() != ''){
			if($(this).val() == $('#wyca_manager input#wyca_manager_i_manager_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//USERS
	
	$('#wyca_user .bAddUser').click(function(e) {
	
		$('#wyca_user .modalUser #wyca_user_i_id_user').val(-1);
		$('#wyca_user .modalUser #wyca_user_i_user_email').val('').removeClass('success').removeClass('error');
		$('#wyca_user .modalUser #wyca_user_i_user_societe').val('');
		$('#wyca_user .modalUser #wyca_user_i_user_prenom').val('');
		$('#wyca_user .modalUser #wyca_user_i_user_nom').val('');
		$('#wyca_user .modalUser #wyca_user_i_user_password').val('').removeClass('success').removeClass('error');
		$('#wyca_user .modalUser #wyca_user_i_user_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#wyca_user .modalUser').modal('show');
	});
	
	$('#wyca_user .modalUser #wyca_user_bUserSave').click(function(e) {
        e.preventDefault();
	
		let pass = $('#wyca_user .modalUser #wyca_user_i_user_password');
		let cpass = $('#wyca_user .modalUser #wyca_user_i_user_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#wyca_user_i_user_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#wyca_user .modalUser #wyca_user_i_id_user').val()),
				"company": $('#wyca_user .modalUser #wyca_user_i_user_societe').val(),
				"lastname": $('#wyca_user .modalUser #wyca_user_i_user_nom').val(),
				"firstname": $('#wyca_user .modalUser #wyca_user_i_user_prenom').val(),
				"email": $('#wyca_user .modalUser #wyca_user_i_user_email').val(),
				"pass": $('#wyca_user .modalUser #wyca_user_i_user_password').val(),
				"id_group_user": wycaApi.GroupUser.USER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#wyca_user_list_user_elem_'+id_user).length > 0)
					{
						$('#wyca_user_list_user_elem_'+id_user+' span.email').html(json_user.email);
						/*
						$('#wyca_user_list_user_elem_'+id_user+' span.societe').html(json_user.company);
						$('#wyca_user_list_user_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#wyca_user_list_user_elem_'+id_user+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#wyca_user .list_users').append('' +
							'<li id="wyca_user_list_user_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bUserDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayUserWyca();
					}
					
					$('#wyca_user .modalUser').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#wyca_user .bUserDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_user_list_user_elem_'+id_user_to_delete).remove();
				RefreshDisplayUserWyca();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#wyca_user .bUserEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#wyca_user .modalUser #wyca_user_i_id_user').val(id_user);
		$('#wyca_user .modalUser #wyca_user_i_user_email').val($('#wyca_user_list_user_elem_'+id_user+' span.email').html());
		$('#wyca_user .modalUser #wyca_user_i_user_societe').val($('#wyca_user_list_user_elem_'+id_user+' span.societe').html());
		$('#wyca_user .modalUser #wyca_user_i_user_prenom').val($('#wyca_user_list_user_elem_'+id_user+' span.prenom').html());
		$('#wyca_user .modalUser #wyca_user_i_user_nom').val($('#wyca_user_list_user_elem_'+id_user+' span.nom').html());
		$('#wyca_user .modalUser #wyca_user_i_user_password').val('');
		$('#wyca_user .modalUser #wyca_user_i_user_cpassword').val('');
		
		$('#wyca_user .modalUser #wyca_user_i_user_email').removeClass('success').removeClass('error');
		$('#wyca_user .modalUser #wyca_user_i_user_password').removeClass('success').removeClass('error');
		$('#wyca_user .modalUser #wyca_user_i_user_cpassword').removeClass('success').removeClass('error');
		
		$('#wyca_user .modalUser').modal('show');
	});
	
	$('#wyca_user input#wyca_user_i_user_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_user input#wyca_user_i_user_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_user input#wyca_user_i_user_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#wyca_user input#wyca_user_i_user_password').val() != ''){
			if($(this).val() == $('#wyca_user input#wyca_user_i_user_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//WYCA
	
	$('#wyca_wyca .bAddWyca').click(function(e) {
	
		$('#wyca_wyca .modalWyca #wyca_wyca_i_id_wyca').val(-1);
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_email').val('').removeClass('success').removeClass('error');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_societe').val('');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_prenom').val('');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_nom').val('');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_password').val('').removeClass('success').removeClass('error');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#wyca_wyca .modalWyca').modal('show');
	});
	
	$('#wyca_wyca .modalWyca #wyca_wyca_bWycaSave').click(function(e) {
        e.preventDefault();
	
		let pass = $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_password');
		let cpass = $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#wyca_wyca_i_wyca_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#wyca_wyca .modalWyca #wyca_wyca_i_id_wyca').val()),
				"company": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_societe').val(),
				"lastname": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_nom').val(),
				"firstname": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_prenom').val(),
				"email": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_email').val(),
				"pass": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_password').val(),
				"id_group_user": wycaApi.GroupUser.WYCA,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_wyca = data.D;
					if ($('#wyca_wyca_list_wyca_elem_'+id_wyca).length > 0)
					{
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.email').html(json_user.email);
						/*
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.societe').html(json_user.company);
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.prenom').html(json_user.firstname);
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#wyca_wyca .list_wycas').append('' +
							'<li id="wyca_wyca_list_wyca_elem_'+id_wyca+'" data-id_wyca="'+id_wyca+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bWycaDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bWycaEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayWycaWyca();
					}
					
					$('#wyca_wyca .modalWyca').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#wyca_wyca .bWycaDeleteElem', function(e) {
		e.preventDefault();
		
		id_wyca_to_delete = parseInt($(this).closest('li').data('id_wyca'));
		
		wycaApi.DeleteUser(id_wyca_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_wyca_list_wyca_elem_'+id_wyca_to_delete).remove();
				RefreshDisplayWycaWyca();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#wyca_wyca .bWycaEditElem', function(e) {
		e.preventDefault();
		
		id_wyca = $(this).closest('li').data('id_wyca');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_id_wyca').val(id_wyca);
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_email').val($('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.email').html());
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_societe').val($('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.societe').html());
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_prenom').val($('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.prenom').html());
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_nom').val($('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.nom').html());
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_password').val('');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_cpassword').val('');
		
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_email').removeClass('success').removeClass('error');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_password').removeClass('success').removeClass('error');
		$('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_cpassword').removeClass('success').removeClass('error');
		
		$('#wyca_wyca .modalWyca').modal('show');
	});
	
	$('#wyca_wyca input#wyca_wyca_i_wyca_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_wyca input#wyca_wyca_i_wyca_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_wyca input#wyca_wyca_i_wyca_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#wyca_wyca input#wyca_wyca_i_wyca_password').val() != ''){
			if($(this).val() == $('#wyca_wyca input#wyca_wyca_i_wyca_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//INSTALLERS
	
	$('#wyca_installer .bAddInstaller').click(function(e) {
	
		$('#wyca_installer .modalInstaller #wyca_installer_i_id_installer').val(-1);
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_email').val('').removeClass('success').removeClass('error');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_societe').val('');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_prenom').val('');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_nom').val('');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_password').val('').removeClass('success').removeClass('error');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#wyca_installer .modalInstaller').modal('show');
	});
	
	$('#wyca_installer .modalInstaller #wyca_installer_bInstallerSave').click(function(e) {
        e.preventDefault();
	
		let pass = $('#wyca_installer .modalInstaller #wyca_installer_i_installer_password');
		let cpass = $('#wyca_installer .modalInstaller #wyca_installer_i_installer_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#wyca_installer_i_installer_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#wyca_installer .modalInstaller #wyca_installer_i_id_installer').val()),
				"company": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_societe').val(),
				"lastname": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_nom').val(),
				"firstname": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_prenom').val(),
				"email": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_email').val(),
				"pass": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_password').val(),
				"id_group_user": wycaApi.GroupUser.DISTRIBUTOR,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_installer = data.D;
					if ($('#wyca_installer_list_installer_elem_'+id_installer).length > 0)
					{
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.email').html(json_user.email);
						/*
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.societe').html(json_user.company);
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.prenom').html(json_user.firstname);
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#wyca_installer .list_installers').append('' +
							'<li id="wyca_installer_list_installer_elem_'+id_installer+'" data-id_installer="'+id_installer+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bInstallerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bInstallerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayInstallerWyca();
					}
					
					$('#wyca_installer .modalInstaller').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#wyca_installer .bInstallerDeleteElem', function(e) {
		e.preventDefault();
		
		id_installer_to_delete = parseInt($(this).closest('li').data('id_installer'));
		
		wycaApi.DeleteUser(id_installer_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_installer_list_installer_elem_'+id_installer_to_delete).remove();
				RefreshDisplayInstallerWyca();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#wyca_installer .bInstallerEditElem', function(e) {
		e.preventDefault();
		
		id_installer = $(this).closest('li').data('id_installer');
		$('#wyca_installer .modalInstaller #wyca_installer_i_id_installer').val(id_installer);
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_email').val($('#wyca_installer_list_installer_elem_'+id_installer+' span.email').html());
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_societe').val($('#wyca_installer_list_installer_elem_'+id_installer+' span.societe').html());
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_prenom').val($('#wyca_installer_list_installer_elem_'+id_installer+' span.prenom').html());
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_nom').val($('#wyca_installer_list_installer_elem_'+id_installer+' span.nom').html());
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_password').val('');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_cpassword').val('');
		
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_email').removeClass('success').removeClass('error');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_password').removeClass('success').removeClass('error');
		$('#wyca_installer .modalInstaller #wyca_installer_i_installer_cpassword').removeClass('success').removeClass('error');
		
		$('#wyca_installer .modalInstaller').modal('show');
	});
	
	$('#wyca_installer input#wyca_installer_i_installer_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_installer input#wyca_installer_i_installer_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_installer input#wyca_installer_i_installer_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#wyca_installer input#wyca_installer_i_installer_password').val() != ''){
			if($(this).val() == $('#wyca_installer input#wyca_installer_i_installer_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//------------------- SOUND ------------------------
	$('#wyca_setup_sound .sound_switch_ROS').change(function(){
		if(!$(this).prop('checked')){
			$('#wyca_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off').addClass('disabled');
			$('#wyca_setup_sound .sound_switch_app').prop('checked',false);
		}else{
			$('#wyca_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('disabled');
		}
	});
	
	$('#wyca_setup_sound .bSaveSound').click(function(e) {
		//console.log('here');
		//SOUND
		if($('#wyca_setup_sound .sound_switch_ROS').prop('checked')){
			//SOUND ON
			wycaApi.SetSoundIsOn(true,function(data){})
			
		}else{
			//SOUND OFF
			wycaApi.SetSoundIsOn(false,function(data){})
			
		}
		
		//APP SOUND
		if($('#wyca_setup_sound .sound_switch_app').prop('checked')){
			//APP SOUND ON
			$.ajax({
				type: "POST",
				url: 'ajax/app_sound_on.php',
				data: { },
				dataType: 'json',
				success: function(data) {
					wycaApi.options.sound_is_on = true;
					app_sound_is_on = true;
				},
				error: function(e) {
					if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
						$('#modalErrorSession').modal('show');
					}else{
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText );
					}
				}
			});
		}else{
			//APP SOUND OFF
			$.ajax({
				type: "POST",
				url: 'ajax/app_sound_off.php',
				data: { },
				dataType: 'json',
				success: function(data) {
					wycaApi.options.sound_is_on = false;
					app_sound_is_on = false;
				},
				error: function(e) {
					if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
						$('#modalErrorSession').modal('show');
					}else{
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText );
					}
				}
			});
		}
		RefreshGlobalVehiculePersistanteDataStorage();
	});
	
	
	//----------------------- WIFI ----------------------------
	
	$('#wyca_setup_wifi .refresh_wifi').click(function(e) {
		e.preventDefault();		
	});
	
	$( '#wyca_setup_wifi tbody' ).on( 'click', 'tr', function(e) {
		e.preventDefault();
		selectedWifi = $(this).data('ssid');
		
		$('#wyca_setup_wifi_password .wifi_connexion_error').html('');
		$('#wyca_setup_wifi_password .i_wifi_passwd_name').val('');
		$('#wyca_setup_wifi_password .wyca_setup_wifi_password_save').show();
		$('#wyca_setup_wifi_password .wifi_connexion_progress').hide();

		$('#wyca_setup_wifi .set_passwd_wifi').click();
	});
	
	$('#wyca_setup_wifi_password .wyca_setup_wifi_password_save').click(function(e) {
        e.preventDefault();
		
		$('#wyca_setup_wifi_password .wyca_setup_wifi_password_save').hide();
		$('#wyca_setup_wifi_password .wifi_connexion_progress').show();
		$('#wyca_setup_wifi_password .wifi_connexion_error').html('');
		
		wycaApi.WifiConnection(selectedWifi, $('#wyca_setup_wifi_password .i_wifi_passwd_name').val(), function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_wifi_password .wifi_connexion_error').html(data.M);
			}
			else
			{
				$('#wyca_setup_wifi_password .wyca_setup_wifi_password_back').click();
				$('#wyca_setup_wifi_password .wifi_connexion_error').html('');
				$('#wyca_setup_wifi_password .i_wifi_passwd_name').val('');
			}
			$('#wyca_setup_wifi_password .wyca_setup_wifi_password_save').show();
			$('#wyca_setup_wifi_password .wifi_connexion_progress').hide();
		});
    });
	
	//----------------------- EBL/MBL CONFIGURATION ----------------------------
	
	$('#pages_wyca_normal a.real_test').click(function(e) {
        e.preventDefault();
		$('#pages_wyca_normal .modalRealTest_loading').show();
		$('#pages_wyca_normal .modalRealTest_content').hide();
		$('#pages_wyca_normal .modalRealTest').modal('show');
		$('#pages_wyca_normal a.bRealTestDo').addClass('disabled');
		wycaApi.GetCurrentMapData(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				let n = 0;
				$('#pages_wyca_normal .modalRealTest_loading').hide();
				$('#pages_wyca_normal .modalRealTest_content').show();
				$('#pages_wyca_normal select.real_test_start > option').hide();
				$('#pages_wyca_normal select.real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('#pages_wyca_normal select.real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('#pages_wyca_normal select.real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
					n++;
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('#pages_wyca_normal select.real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('#pages_wyca_normal select.real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					n++;
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('#pages_wyca_normal select.real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					$('#pages_wyca_normal select.real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					n++;
				});
				
				id_map = data.D.id_map;
				id_map_last = data.D.id_map;
								
				if(n < 2){
					$('#pages_wyca_normal .modalRealTest').modal('hide');
					alert_wyca(textNoRealTest);
				}
			}
			else
			{
				$('#pages_wyca_normal .modalRealTest').modal('hide');
			}
			$('#pages_wyca_normal a.bRealTestDo').removeClass('disabled');
		})		
		
	});
	
	/* REAL TEST */
	
	$('#pages_wyca_normal a.bRealTestDo').click(function(e) {
        e.preventDefault();
		let start = $('#pages_wyca_normal select.real_test_start option:selected');
		let end = $('#pages_wyca_normal select.real_test_end option:selected');
		if(start.val()!='' && end.val()!='' && end.val()!=start.val()){
			$('#pages_wyca_normal .modalRealTest').modal('hide');
			$('#pages_wyca_normal .modalRealTestResult').modal('show');
			
			$("#pages_wyca_normal .modalRealTestResult .start_point").hide();
			$("#pages_wyca_normal .modalRealTestResult .end_point").hide();
			$("#pages_wyca_normal .modalRealTestResult .result_RealTest").hide();
			
			$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');			
			$("#pages_wyca_normal .modalRealTestResult .start_point_text").html(start.html());
			$("#pages_wyca_normal .modalRealTestResult .end_point_text").html(end.html());
			
			RealTestGotoStartWyca(start,end);
		}
	});
	
	$('#pages_wyca_normal .modalRealTestResult a.bUseRealTest').click(function(e) {
		e.preventDefault();
		let temp = battery_lvl_needed == 0?1:parseInt(battery_lvl_needed);
		let ebl = temp+5;
		let mbl = 2*temp;
		mbl < ebl ? mbl = ebl + 5:'';
		$('#wyca_setup_config_i_level_min_gotocharge').val(ebl)
		$('#wyca_setup_config_i_level_min_dotask').val(mbl)
		$('#pages_wyca_normal .modalRealTestResult').modal('hide')
    });
	
	$('section#wyca_setup_config a.bResetValueEblMbl').click(function(e) {
		
		$('#wyca_setup_config_i_level_min_gotocharge').val(15)
		$('#wyca_setup_config_i_level_min_dotask').val(20)
    });
		
	$('#pages_wyca_normal .bConfigurationSave').click(function(e) {
		let EBL = parseInt($('#wyca_setup_config_i_level_min_gotocharge').val());
		let MBL = parseInt($('#wyca_setup_config_i_level_min_dotask').val());
		EBL = EBL > 100 ? 15 : EBL;
		EBL = EBL < 0 ? 15 : EBL;
		MBL = MBL > 100 ? 20 : MBL;
		MBL = MBL < 0 ? 20 : MBL;
		wycaApi.SetEnergyConfiguration(EBL,MBL, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca(textBatteryConfigSaved);
				GetConfigurationsWyca();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
    });
	
	//----------------------- RECOVERY ----------------------------
	
	$('#wyca_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		$('#wyca_recovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#wyca_recovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#wyca_recovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#wyca_recovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#wyca_recovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#wyca_recovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#wyca_recovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#wyca_recovery .recovery_feedback .recovery_step.RecoveryNav';		break;
				}
				
				target = $(target);
				if(target.prevAll('.recovery_step:visible').length > 0){
					target.prevAll('.recovery_step:visible').find('.fa-check').show();
					target.prevAll('.recovery_step:visible').find('.fa-pulse').hide();
				}
				target.css('opacity','1').show();
			}
		});
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				
				$('#wyca_recovery .recovery_step:visible').find('.fa-check').show();
				$('#wyca_recovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#wyca_recovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#wyca_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
			// On rebranche l'ancienne fonction
			wycaApi.on('onRecoveryFromFiducialResult', onRecoveryFromFiducialResult);
			wycaApi.on('onRecoveryFromFiducialFeedback', onRecoveryFromFiducialFeedback);
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('.ifRecovery').show();
				$('.ifNRecovery').hide();
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#wyca_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#wyca_recovery .bCancelRecovery').click(function(e) {
		$('#wyca_recovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#wyca_recovery .bCancelRecovery').removeClass('disabled');
		})
	})
	
	//----------------------- LANGUE ----------------------------
	
	$('#pages_wyca_normal a.select_langue').click(function(e) {
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
					window.location.href = app_url; // equivalent window.location.reload()
			},
			error: function(e) {
				alert_wyca(textErrorLang + ' ' + e.responseText);
			}
		});
    });
	
	//------------------- AVAILABLES TOPS ------------------------
	
	$('#pages_wyca_normal .file_import_top').change(function(){
		
		let fname = $(this)[0].files[0].name;console.log(fname);
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_wyca_normal .file_import_top_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_wyca_normal .file_import_top_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_wyca_normal .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_wyca_normal .filename_import_top').html(fname);
		$('#pages_wyca_normal .filename_import_top').show();
		
	})
	
	$('#pages_wyca_normal a.bImportTopDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_wyca_normal .file_import_top')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			$('#pages_wyca_normal .modalImportTop_loading').show();
			$('#pages_wyca_normal .modalImportTop_content').hide();
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						
						$('#pages_wyca_normal .modalImportTop_loading').hide();
						$('#pages_wyca_normal .modalImportTop_content').show();
						
						$('#pages_wyca_normal .modalImportTop').modal('hide');
						InitTopsWyca();
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
			let icon = $('#pages_wyca_normal .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	$('#pages_wyca_normal a.import_top').click(function(e) {
        e.preventDefault();
		
		$('#pages_wyca_normal .modalImportTop_loading').hide();
		$('#pages_wyca_normal .modalImportTop_content').show();
		
		$('#pages_wyca_normal .modalImportTop').modal('show');
		InitTopImportWyca();
	});
	
	$( "#pages_wyca_normal #wyca_setup_tops .tuiles" ).on('click', 'a.is_checkbox[data-id_top]', function(e) {
		let arr = Array();
		$('#wyca_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
            arr.push($(this).data('id_top'));
        });
		let lg = arr.length;
		if(!$(this).hasClass('active'))
			lg = $(this).hasClass('checked')? lg-1 : lg+1; // ADD OR REMOVE ITEM CLICKED ONLY IF NOT ACTIVE TOP (UNREMOVABLE)
		let btnSelectActiveTop = $('#wyca_setup_tops a[data-goto="wyca_setup_top"]');
		if(lg == 1)
			btnSelectActiveTop.addClass('disabled');
		else
			btnSelectActiveTop.removeClass('disabled');
	})
	
	$('#pages_wyca_normal a.save_tops').click(function(e) {
        e.preventDefault();
		
		listAvailableTops = Array();
		//$('#pages_wyca_normal #wyca_setup_tops li').hide();
		$('#wyca_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_wyca_normal #wyca_setup_tops .bTop'+$(this).data('id_top')).show();
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
	
	$( '#pages_wyca_normal' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();
		
		/*INIT FEEDBACK DISPLAY*/
		$('#wyca_setup_top .set_active_top_feedback').hide();
		$('#wyca_setup_top .set_active_top_feedback .set_active_top_step').css('opacity','0').hide();
		$('#wyca_setup_top .set_active_top_feedback .set_active_top_step .fa-check').hide();
		$('#wyca_setup_top .set_active_top_feedback .set_active_top_step .fa-pulse').show();
		
		wycaApi.on('onSetActiveTopFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case '1/2': target = '#wyca_setup_top .set_active_top_feedback .set_active_top_step.SetActiveTopRemoveCurrent';	break;
					case '2/2': target = '#wyca_setup_top .set_active_top_feedback .set_active_top_step.SetActiveTopSetNew';			break;
				}
				target = $(target);
				if(target.prevAll('.set_active_top_step:visible').length > 0){
					target.prevAll('.set_active_top_step:visible').find('.fa-check').show();
					target.prevAll('.set_active_top_step:visible').find('.fa-pulse').hide();
				}
				target.css('opacity','1').show();
			}
		})
		
		wycaApi.on('onSetActiveTopResult', function(data) {
			
			
			timerSetActiveTop = 90;
			statusSetActiveTop = 2;
			$('#wyca_setup_top .modalSetActiveTop').modal('hide');
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca(textTopNowActive);
				$('#wyca_setup_top .bBackToDashboardSetup').click();
			}
			else
			{
				InitTopsActiveWyca();
				ParseAPIAnswerError(data);
			}
			wycaApi.on('onSetActiveTopResult', onSetActiveTopResult);
			wycaApi.on('onSetActiveTopFeedback', onSetActiveTopFeedback);
		});
		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_top .modalSetActiveTop').modal('show');
				$('#wyca_setup_top .set_active_top_feedback').show();
			}
			else
			{
				wycaApi.on('onSetActiveTopResult', onSetActiveTopResult);
				wycaApi.on('onSetActiveTopFeedback', onSetActiveTopFeedback);
				ParseAPIAnswerError(data);
				InitTopsActiveWyca();
			}	
		});		
	});
});

//------------------- CONFIGURATION EBL/MBL ------------------------
	
/* FONCTION PROGRESS BAR REAL TEST */	/* REAL TEST */
	
function TimerRealTestWyca(step){
	if(step=='start'){			
		if(statusRealTestStart > 0){
			if(statusRealTestStart == 2 && timerRealTestStart==100){
				statusRealTestStart=0;
				timerRealTestStart=0;
				$('#wyca_setup_config .modalRealTestResult .checkStart').show('fast');
			}else{
				$('#wyca_setup_config .modalRealTestResult .checkStart').hide();
				delay = statusRealTestStart == 2 ? 1 : 200;
				timerRealTestStart++;
				if(timerRealTestStart == 101)timerRealTestStart=0;
				$('#wyca_setup_config .startRealTestprogress .progress-bar').css('width', timerRealTestStart+'%').attr('aria-valuenow', timerRealTestStart); 
				setTimeout(TimerRealTestWyca,delay,step);
			}
		}
	}else if(step=='end'){			
		if(statusRealTestEnd > 0){
			if(statusRealTestEnd == 2 && timerRealTestEnd==100){
				$('#wyca_setup_config .modalRealTestResult .stop_move').css('opacity',1);
				statusRealTestEnd=0;
				timerRealTestEnd=0;
				$('#wyca_setup_config .modalRealTestResult .checkEnd').show('fast');
			}else{
				$('#wyca_setup_config .modalRealTestResult .checkEnd').hide();
				delay = statusRealTestEnd == 2 ? 1 : 200;
				timerRealTestEnd++;
				if(timerRealTestEnd == 101)timerRealTestEnd=0;
				$('#wyca_setup_config .endRealTestprogress .progress-bar').css('width', timerRealTestEnd+'%').attr('aria-valuenow', timerRealTestEnd); 
				setTimeout(TimerRealTestWyca,delay,step);
			}
		}
	}
}

function RealTestGotoStartWyca(start,end){
	
	//console.log('Go to start');
	//console.log(start.data('type'),' id ',start.data('id'));
	
	switch(start.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndWyca(end);
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='poi') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = start.data('id');
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_normal .modalRealTestResult .start_point").show();
					
					$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWyca('start');
					$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
			})
		break;
		case 'dock':
			//AJOUTER ECOUTER RESULT + REBIND OLD FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToChargeResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndWyca(end);
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='dock') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_normal .modalRealTestResult .start_point").show();
					$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWyca('start');
					$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
			})
		break;
		case 'augmented_pose':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndWyca(end);
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='augmented_pose') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_normal .modalRealTestResult .start_point").show();
					$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWyca('start');
					$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	
}

function RealTestGotoEndWyca(end){
	//console.log('Go to end');
	//console.log(end.data('type'),' id ',end.data('id'));
	$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',0);
	statusRealTestStart = 2;
	statusRealTestEnd = 1;
	timerRealTestEnd = 0;
	TimerRealTestWyca('end');						
	switch(end.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					statusRealTestEnd = 2;
					battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
					textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
					$('#pages_wyca_normal .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca_normal .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
					
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_normal .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
			})
		break;
		case 'dock':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToChargeResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					statusRealTestEnd = 2;
					battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
					textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
					$('#pages_wyca_normal .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca_normal .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_normal .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
			})
			
		break;
		case 'augmented_pose':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					statusRealTestEnd = 2;
					battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
					textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
					$('#pages_wyca_normal .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca_normal .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_normal .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	// LAUNCH PROGRESS BAR ANIM
}		

//------------------- ACTIVE TOP ------------------------

var statusSetActiveTop = 0;
var timerSetActiveTop = 0;
	
function TimerActiveTopWyca(){
	if(statusSetActiveTop > 0){
		if(statusSetActiveTop == 2 && timerSetActiveTop==100){
			statusSetActiveTop=0;
			timerSetActiveTop=0;
			
		}else{
			delay = statusSetActiveTop == 2 ? 1 : 100;
			timerSetActiveTop++;
			if(timerSetActiveTop == 101)timerSetActiveTop=0;
			$('#wyca_setup_top .modalSetActiveTop .progressSetActiveTop .progress-bar').css('width', timerSetActiveTop+'%').attr('aria-valuenow', timerSetActiveTop); 
			setTimeout(TimerActiveTopWyca,delay);
		}
	}
}

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


//------------------- MANAGERS ------------------------	

function RefreshDisplayManagerWyca(){
	if($('#wyca_manager ul.list_managers li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#wyca_manager a.bAddManager').show();
		$('#wyca_manager .bAddManagerTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#wyca_manager a.bAddManager').hide();
		$('#wyca_manager .bAddManagerTuile').show();
	}
	
}

//------------------- USERS ------------------------	

function RefreshDisplayUserWyca(){
	if($('#wyca_user ul.list_users li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#wyca_user a.bAddUser').show();
		$('#wyca_user .bAddUserTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#wyca_user a.bAddUser').hide();
		$('#wyca_user .bAddUserTuile').show();
	}
	
}

//------------------- INSTALLATEUR ------------------------	

function RefreshDisplayInstallerWyca(){
	if($('#wyca_installer ul.list_installers li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#wyca_installer a.bAddInstaller').show();
		$('#wyca_installer .bAddInstallerTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#wyca_installer a.bAddInstaller').hide();
		$('#wyca_installer .bAddInstallerTuile').show();
	}
	
}

//------------------- WYCA ------------------------	

function RefreshDisplayWycaWyca(){
	if($('#wyca_wyca ul.list_wycas li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#wyca_wyca a.bAddWyca').show();
		$('#wyca_wyca .bAddWycaTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#wyca_wyca a.bAddWyca').hide();
		$('#wyca_wyca .bAddWycaTuile').show();
	}
	
}


//-----------------------------------------------------------
//-------------------- DEMO FUNCTIONS  ----------------------
//-----------------------------------------------------------

var indexLiActions = 0;
var dataStorage = {};

function InitWycaDemoState()
{
	$('#wyca_demo_mode_start_stop .wyca_demo_mode_start_stop_loading').show();
	$('#wyca_demo_mode_start_stop .loaded').hide();
	let need_redirect_demo = false ;
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetGlobalVehiculePersistanteDataStorage(function(data){
			if (data.D == '')
			{
				dataStorage = {};
				need_redirect_demo = true;
			}
			else if(!JSON.parse(data.D).wycaDemo.length > 0)
			{
				need_redirect_demo = true;				
			}
			else
			{
				dataStorage = JSON.parse(data.D);
				
				$('#wyca_demo_mode_start_stop .tuiles a').addClass('todo');
				if (typeof dataStorage.wycaDemoStarted != "undefined" && dataStorage.wycaDemoStarted)
				{
					$('#wyca_demo_mode_start_stop #wyca_demo_mode_start_stop_bStop').removeClass('todo');
				}
				else
				{
					$('#wyca_demo_mode_start_stop #wyca_demo_mode_start_stop_bStart').removeClass('todo');
				}
				
				$('#wyca_demo_mode_start_stop .wyca_demo_mode_start_stop_loading').hide();
				$('#wyca_demo_mode_start_stop .loaded').show();
			}
			if(need_redirect_demo){
				
				warning_wyca(textDemoNeedActions);
				$('#wyca_demo_mode_start_stop .wyca_demo_mode_start_stop_config').click();
			}
		});
	}
	else
	{
		setTimeout(InitWycaDemoState, 500);
	}
}

function InitWycaDemo()
{
	$('#wyca_demo_mode_config .wyca_demo_mode_config_loading').show();
	$('#wyca_demo_mode_config .loaded').hide();
	$('#wyca_demo_mode_config .list_actions li').remove();
	$('#wyca_demo_mode_config .list_all_poi li').remove();
	$('#wyca_demo_mode_config .list_all_dock li').remove();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetGlobalVehiculePersistanteDataStorage(function(data){
			
			if (data.D == '')
				dataStorage = {};
			else
				dataStorage = JSON.parse(data.D);
			
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
					landmarks = data.D.landmarks;
					augmented_poses = data.D.augmented_poses;
					
					largeurSlam = data.D.ros_width;
					hauteurSlam = data.D.ros_height;
					largeurRos = data.D.ros_width;
					hauteurRos = data.D.ros_height;
					
					ros_largeur = data.D.ros_width;
					ros_hauteur = data.D.ros_height;
					ros_resolution = data.D.ros_resolution;
					
					indexLiAction = 0;
					
					if(typeof dataStorage.min_goto_charge != "undefined")
					{
						$('#wyca_demo_mode_config_min_goto_charge').val(dataStorage.min_goto_charge);
					}
					else
					{
						$('#wyca_demo_mode_config_min_goto_charge').val(75);
					}
					
					if(typeof dataStorage.min_goto_demo != "undefined")
					{
						$('#wyca_demo_mode_config_min_goto_demo').val(dataStorage.min_goto_demo);
					}
					else
					{
						$('#wyca_demo_mode_config_min_goto_demo').val(80);
					}
					
					if(typeof dataStorage.wycaDemo != "undefined")
					{
						$.each(dataStorage.wycaDemo, function(indexInArray, element){
							
							indexLiActions++;
							
							if (element.type == 'Poi')
							{
								// On cherche le poi
								$.each(pois, function(indexInArray, poi){
									if (poi.id_poi == element.id)
									{
										$('#wyca_demo_mode_config .list_actions').append('' +
											'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Poi" data-id="' + poi.id_poi + '">'+
											'	<span>' + poi.name + '</span>'+
											'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
											'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
											'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
											'</li>'
											);
									}
								});
							}
							else if (element.type == 'Dock')
							{
								// On cherche le dock
								$.each(docks, function(indexInArray, dock){
									if (dock.id_docking_station == element.id)
									{
										$('#wyca_demo_mode_config .list_actions').append('' +
											'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Dock" data-id="' + dock.id_docking_station + '">'+
											'	<span>' + dock.name + '</span>'+
											'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
											'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
											'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
											'</li>'
											);
									}
								});
							}
							else if (element.type == 'Wait')
							{
								$('#wyca_demo_mode_config .list_actions').append('' +
									'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Wait" data-duration="' + element.duration + '">'+
									'	<span>'+(typeof(textDemoWait) != 'undefined' ? textDemoWait : 'Wait' )+' '+ element.duration + ' ' +(typeof(textDemosecondes) != 'undefined' ? textDemosecondes : 'secondes') +'</span>'+
									'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
									'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
									'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-down"></i></a>'+
									'	<a href="#" class="bEditWait btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-pencil"></i></a>'+
									'</li>'
									);
							}
							
						});
					}
					
					
					var indexLi = 0;
					
					if (pois.length > 0)
					{
						$.each(pois, function(indexInArray, poi){
							indexLi++;
							$('#wyca_demo_mode_config .list_all_poi').append('' +
								'<li id="list_all_poi_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Poi" data-id="' + poi.id_poi + '">'+
								'	<a href="#" class="bAddToAction btn btn-sm btn-circle btn-primary pull-right"><i class="fa fa-plus"></i></a>'+
								'	<span>' + poi.name + '</span>'+
								'</li>'
								);
						});
					}
					
					if (docks.length > 0)
					{
						$.each(docks, function(indexInArray, dock){
							indexLi++;
							$('#wyca_demo_mode_config .list_all_dock').append('' +
								'<li id="list_all_poi_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Dock" data-id="' + dock.id_docking_station + '">'+
								'	<a href="#" class="bAddToAction btn btn-sm btn-circle btn-primary pull-right"><i class="fa fa-plus"></i></a>'+
								'	<span>' + dock.name + '</span>'+
								'</li>'
								);
						});
					}
					
					$('#wyca_demo_mode_config .wyca_demo_mode_config_loading').hide();
					$('#wyca_demo_mode_config .loaded').show();
					
				}
				else
				{
					ParseAPIAnswerError(data,textErrorGetMap);
				}
			});
		});
		
	}
	else
	{
		setTimeout(InitWycaDemo, 500);
	}
}

$(document).ready(function(e) {
	
	$('#wyca_demo_mode_start_stop_bStart').click(function(e) {
        e.preventDefault();
		
		if (!$(this).hasClass('todo'))
		{
			dataStorage.wycaDemoStarted = true;
			wycaApi.SetGlobalVehiculePersistanteDataStorage(JSON.stringify(dataStorage));
			InitWycaDemoState();
		}
    });
	
	$('#wyca_demo_mode_start_stop_bStop').click(function(e) {
        e.preventDefault();
		
		if (!$(this).hasClass('todo'))
		{
			dataStorage.wycaDemoStarted = false;
			wycaApi.SetGlobalVehiculePersistanteDataStorage(JSON.stringify(dataStorage));
			InitWycaDemoState();
		}
    });
	
	$('.bSaveDemoMode').click(function(e) {
        e.preventDefault();
       
	    dataStorage.wycaDemo = [];
	    $('#wyca_demo_mode_config .list_actions li').each(function(index, element) {
		   
		   obj = $('#'+element.id);
		   
		   if (obj.data('type') == 'Poi')
		   	dataStorage.wycaDemo.push({'type': 'Poi', 'id':obj.data('id')});
		   else if (obj.data('type') == 'Dock')
		   	dataStorage.wycaDemo.push({'type': 'Dock', 'id':obj.data('id')});
		   else if (obj.data('type') == 'Wait')
		   	dataStorage.wycaDemo.push({'type': 'Wait', 'duration':obj.data('duration')});
			
	    });
	   
	    dataStorage.min_goto_charge  = $('#wyca_demo_mode_config_min_goto_charge').val();
	    dataStorage.min_goto_demo = $('#wyca_demo_mode_config_min_goto_demo').val();
        	
		wycaApi.SetGlobalVehiculePersistanteDataStorage(JSON.stringify(dataStorage));
	   
    });
	
	$('#wyca_demo_mode_config_bSaveWait').click(function(e) {
        indexLiActions++;
		
		index_li = $('#wyca_demo_mode_config_id_li_wait').val();
		if (index_li == -1)
		{
			$('#wyca_demo_mode_config .list_actions').append('' +
					'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Wait" data-duration="' + $('#wyca_demo_mode_config_duration').val() + '">'+
					'	<span>'+(typeof(textDemoWait) != 'undefined' ? textDemoWait : 'Wait' )+' '+$('#wyca_demo_mode_config_duration').val() + ' ' +(typeof(textDemosecondes) != 'undefined' ? textDemosecondes : 'secondes') +'</span>'+
					'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
					'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-down"></i></a>'+
					'	<a href="#" class="bEditWait btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
		}
		else
		{
			$('#list_all_poi_'+index_li).data('duration', $('#wyca_demo_mode_config_duration').val());
			$('#list_all_poi_'+index_li+' span').html((typeof(textDemoWait) != 'undefined' ? textDemoWait : 'Wait' )+' '+ $('#wyca_demo_mode_config_duration').val() + ' secondes');
		}
			
		$('#wyca_demo_mode_config_duration').val('');
        $('#wyca_demo_mode_config_id_li_wait').val(-1);
		
    });
	
	$('#wyca_demo_mode_config_bCancelWait').click(function(e) {
        $('#wyca_demo_mode_config_duration').val('');
        $('#wyca_demo_mode_config_id_li_wait').val(-1);
		
		
    });
	
	$('#wyca_demo_mode_config').on( 'click', '.bUpToAction', function(e) {
        e.preventDefault();
		
		li = $(this).closest('li');
		li.after(li.prev().clone());
	    li.prev().remove();
	});
	
	$('#wyca_demo_mode_config').on( 'click', '.bDownToAction', function(e) {
        e.preventDefault();
		
		li = $(this).closest('li');
		li.next().after(li.clone());
	    li.remove();
	});
	$('#wyca_demo_mode_config').on( 'click', '.bDeleteToAction', function(e) {
        e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$('#wyca_demo_mode_config').on( 'click', '.bEditWait', function(e) {
		
        $('#wyca_demo_mode_config_id_li_wait').val($(this).parent().data('index_li'));
		$('#wyca_demo_mode_config_duration').val($(this).parent().data('duration'));
		$('#wyca_demo_mode_config_modalWaitOptions').modal('show');
		
	});
		
	$('#wyca_demo_mode_config').on( 'click', '.bAddToAction', function(e) {
        e.preventDefault();
		
		indexLiActions++;
			
		id = $(this).parent().data('id');
		if ($(this).parent().data('type') == 'Poi')
		{
			$('#wyca_demo_mode_config .list_actions').append('' +
				'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Poi" data-id="' + id + '">'+
				'	<span>' + $(this).parent().children('span').html() + '</span>'+
				'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
				'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
				'</li>'
				);
		}
		else
		{
			$('#wyca_demo_mode_config .list_actions').append('' +
				'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Dock" data-id="' + id + '">'+
				'	<span>' + $(this).parent().children('span').html() + '</span>'+
				'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
				'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
				'</li>'
				);
		}
    });
	
	// RESTART BROWSER
	
	$('#wyca_bRestartBrowerTrue').click(function(e) {
        e.preventDefault();
		wycaApi.DoBrowserRestart(true,function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				success_wyca(textBrowserRestartedFullscreen);			
			}else{
				ParseAPIAnswerError(data);
			}
		})
    });
	
	$('#wyca_bRestartBrowerFalse').click(function(e) {
        e.preventDefault();
		wycaApi.DoBrowserRestart(false,function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				success_wyca(textBrowserRestartedWindowed);			
			}else{
				ParseAPIAnswerError(data);
			}
		})
    });
	
});
