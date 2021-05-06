//Javascript document
var form_sended = false; //Boolean pour disable a form "en traitement"
var selectedWifi = '';

var currentNameSiteExport = '';
var NormalBufferMapSaveElemName = '';

$(document).ready(function(e) {
	// ----------------------- USER MANUAL DOWNLOAD ------------------------
		
	$(document).on('click', '#install_normal_dashboard .bDownloadUserManual', function(e) {
        $('#install_normal_dashboard .bDownloadUserManual').addClass('disabled');
		//GROUP USER INSTALLATEUR => 2
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
	
		a.href = 'assets/pdfs/user_manual_2_'+lang+'.pdf';
		a.download = 'user_manual_'+lang+'.pdf';
		a.click();		
		
		$('#install_normal_dashboard .bDownloadUserManual').removeClass('disabled');
    });
	// ----------------------- SITE EXPORT ------------------------
		
	$(document).on('click', '#install_normal_setup_export .bSiteExportElem', function(e) {
        $('#install_normal_setup_export .bSiteExportElem').addClass('disabled');
		
		currentNameSiteExport = $(this).find('.societe').text();
		
		wycaApi.ExportSite($(this).data('id_site'), function(data){
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
				ParseAPIAnswerError(data,textErrorExportSite);
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
		
		$('#install_normal_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
		CalculateMapTrinaryNormal();
    });
	
	$('#install_normal_setup_trinary_threshold_free_slider').change(function() {
		$('#install_normal_setup_trinary_threshold_free_output b').text( this.value );
		threshold_free_normal = this.value;
		
		$('#install_normal_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
		CalculateMapTrinaryNormal();
	});
	
	$('#install_normal_setup_trinary_threshold_occupied_slider').change(function() {
		$('#install_normal_setup_trinary_threshold_occupied_output b').text( this.value );
		threshold_occupied_normal = this.value;
		
		$('#install_normal_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
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
								success_wyca(textMapSaved)
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
					
					var img = document.getElementById("install_normal_setup_trinary_img_map_saved_fin");
        			img.src = "assets/images/vide.png";
					
					alert_wyca(textErrorTrinary + ' ' + e.responseText);
				}
			});
		
	});
	
	// ----------------------- MAP ------------------------
	
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
						landmarks = data.D.landmarks;
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
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
			}
			else
			{
				$('#install_normal_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_normal_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap)
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
						landmarks = data.D.landmarks;
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
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_normal_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
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
						landmarks = data.D.landmarks;
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
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#install_normal_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_normal_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
			}
		});
    });
	
	$('#install_normal_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!normalCanChangeMenu)
		{
			alert_wyca(textConfirmActiveElement);
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
			normalCanChangeMenu = true;
			normalCurrentAction = '';
			NormalHideMenus();
			
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
					success_wyca(textMapSaved);
					
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
					$('#install_normal_edit_map .burger_menu').removeClass('updatingMap');
					ParseAPIAnswerError(data);
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
	
	$(document).on('click', '#install_normal_setup_download_map .bMapDownloadElem', function(e) {
        $('#install_normal_setup_download_map .bMapDownloadElem').addClass('disabled');
		
		currentMapDownload = $(this).find('.societe').text();
		id_map = $(this).data('id_map');
		
		wycaApi.GetMap($(this).data('id_map'), function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_download_map .bMapDownloadElem').removeClass('disabled');
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
				$('#install_normal_setup_download_map .bMapDownloadElem').removeClass('disabled');
				ParseAPIAnswerError(data,textErrorDownloadMap);
			}							
		});
		
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
	$('#install_normal_setup_trinary .bSaveTrinaryMap ').addClass('disabled');
	
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
			
			$('#install_normal_setup_trinary_threshold_free_slider').val(threshold_free_normal).change();
			$('#install_normal_setup_trinary_threshold_occupied_slider').val(threshold_occupied_normal).change();
			
			setTimeout(function() {
				canvas_normal = document.createElement('canvas');
				
				width_normal = img.naturalWidth;
				height_normal = img.naturalHeight;
				
				$('#install_normal_setup_trinary_canvas_result_trinary').attr('width', img_normal.naturalWidth);
				$('#install_normal_setup_trinary_canvas_result_trinary').attr('height', img_normal.naturalHeight);
				
				canvas_normal.width = img_normal.naturalWidth;
				canvas_normal.height = img_normal.naturalHeight;
				canvas_normal.getContext('2d').drawImage(img_normal, 0, 0, img_normal.naturalWidth, img_normal.naturalHeight);
				
				//SVG MAP TRINARY
				$('#install_normal_setup_trinary_svg').attr('width', data.D.ros_width);
				$('#install_normal_setup_trinary_svg').attr('height', data.D.ros_height);
				
				$('#install_normal_setup_trinary_image').attr('width', data.D.ros_width);
				$('#install_normal_setup_trinary_image').attr('height', data.D.ros_height);
				
				NormalInitTrinaryMap();
				CalculateMapTrinaryNormal();
			}, 100);
		}
		else
		{
			ParseAPIAnswerError(data,textErrorGetMap);
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
	//MAP TRINARY
	
	$('#install_normal_setup_trinary_image').attr('xlink:href', canvasDessin.toDataURL());
	
	$('#install_normal_setup_trinary .img-responsive').attr('src',canvasDessin.toDataURL());
	
	$('#install_normal_setup_trinary .loading_fin_create_map').hide();
	$('#install_normal_setup_trinary .bSaveTrinaryMap ').removeClass('disabled');
}

var timeoutCalcul_normal = null;

var img_normal;
var canvas_normal;

var width_normal = 0;
var height_normal = 0;

/* INSTALLATEUR WYCA.JS */
var create_new_site = false;
var create_new_map = false;
var id_site_to_delete = -1;
var id_map_to_delete = -1;

$(document).ready(function(e) {
	//----------------------- IMPORT SITE ----------------------------
	
	$('#pages_install_normal .file_import_site').change(function(){
		
		let fname = $(this)[0].files[0].name;
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_install_normal .file_import_site_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_install_normal .file_import_site_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_install_normal .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_install_normal .filename_import_site').html(fname);
		$('#pages_install_normal .filename_import_site').show();
		
	})
	
	$('#pages_install_normal a.bImportSiteDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_install_normal .file_import_site')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			
			$('#pages_install_normal .install_normal_setup_import_loading').show();
			$('#pages_install_normal .install_normal_setup_import_content').hide();
			
			var reader = new FileReader();
			reader.onload = function(event) {
				wycaApi.ImportSite(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						id_site = data.D;
						wycaApi.SetSiteAsCurrent(id_site,function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR)
							{
								wycaApi.GetMapsList(id_site,function(data){
									let nb_maps_w_name = 0;
									data.D.forEach((element) => {if(element.name != '')nb_maps_w_name++;});
									if(nb_maps_w_name <= 1){
										// IF ONLY ONE MAP
										wycaApi.GetCurrentMapData(function(data){
											if (data.A == wycaApi.AnswerCode.NO_ERROR)
											{
												if(data.D.docks.length <= 1){
													$('#pages_install_normal .install_normal_setup_import_loading').hide();
													$('#pages_install_normal .install_normal_setup_import_content').show();
													success_wyca(textSiteImported);
													$('#pages_install_normal .bImportSiteBack').click();
												}else{
													id_map = data.D.id_map;
													id_map_last = data.D.id_map;
													forbiddens = data.D.forbiddens;
													areas = data.D.areas;
													docks = data.D.docks;
													pois = data.D.pois;
													augmented_poses = data.D.augmented_poses; 
													
													InitMasterDockNormal();
												}
											}else{
												ParseAPIAnswerError(data);
												InitSiteImportNormal();
											}
										})
									}else{
										// IF MULTIPLES MAP
										InitSiteImportSelectMapNormal();
									}
								})
							}
							else
							{
								ParseAPIAnswerError(data);
								InitSiteImportNormal();
							}
						})
					}
					else
					{
						ParseAPIAnswerError(data);
						InitSiteImportNormal();
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
	
	//----------------------- SELECT MAP ----------------------------
	
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_install_normal #install_normal_setup_import .modalSelectMap #ImportSiteMapList" ).on( 'click', '.SelectMapItem', function(e) {
		let id_map_import = parseInt($(this).attr('id'));
		wycaApi.SetMapAsCurrent(id_map_import,function(){
			wycaApi.GetCurrentMapData(function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					if(data.D.docks.length <= 1){
						$('#pages_install_normal .install_normal_setup_import_loading').hide();
						$('#pages_install_normal .install_normal_setup_import_content').show();
						success_wyca(textSiteImported);
						$('#pages_install_normal .bImportSiteBack').click();
					}else{
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						$( "#pages_install_normal #install_normal_setup_import .modalSelectMap").modal('hide');
						InitMasterDockNormal();
					}
				}else{
					ParseAPIAnswerError(data);
					InitSiteImportNormal();
				}
			})
		})
	})
	
	//----------------------- MASTER DOCK ----------------------------
	
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_install_normal #MasterDockList" ).on( 'click', '.MasterDockItem', function(e) {
		let id_master = $(this).attr('id');
		$.each(docks,function(idx,item){
			docks[idx].is_master=false;
			if(item.id_docking_station == id_master){
				docks[idx].is_master=true;
			}
		})
		data = GetDataMapToSave();
		wycaApi.SetCurrentMapData(data, function(data){
			$('#pages_install_normal .modalMasterDock').modal('hide');
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca(textSiteImported);
				$('#pages_install_normal #install_normal_setup_import .bImportSiteBack').click();
			}else{
				ParseAPIAnswerError(data);
				InitSiteImportNormal();
			}
		})		
	})
	
	// --------------------- ADD SITE --------------------
	
	$('#install_normal_setup_sites .bAddSite').click(function(e) {
		e.preventDefault();
		
		create_new_site = true;
		setCookie('create_new_site',create_new_site); // SET COOKIES
		$('#pages_install_normal').removeClass('active');
		$('#pages_install_by_step section.page').hide();
		
		$('.title_section').html($('#pages_install_by_step #install_by_step_site > header > h2').text())
		$('#pages_install_by_step').addClass('active');
		$('#install_by_step_site').show();
	});
	
	$(document).on('click', '#install_normal_setup_sites .bSiteSetCurrentElem', function(e) {
		e.preventDefault();
		$('#install_normal_setup_sites .btn-danger.confirm_delete').addClass('disabled');
		$('#install_normal_setup_sites .bSiteSetCurrentElem').addClass('disabled');
		
		id_site_to_switch = parseInt($(this).closest('li').data('id_site'));
		str_site_to_switch =  $(this).parent().find('.societe').text();
		
		wycaApi.GetMapsList(id_site_to_switch,function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
				ParseAPIAnswerError(data,textErrorGetMaps);
			else
			{
				id_map_to_switch = -1;
				let nb_maps_w_name = 0;
				data.D.forEach((element) => {if(element.name != '')nb_maps_w_name++;});
				if(nb_maps_w_name >= 2){
					$('#install_normal_setup_sites .modalSelectMap .list_maps').html('');
					$.each(data.D,function(idx,item){
						if(item.name != ''){
							let map_item="";
							map_item+='<div class="col-xs-6 text-center">';
							map_item+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
							map_item+='		<i class="fas fa-map-marked-alt"></i>';
							map_item+='		<p class="mapname">'+item.name+'</p>';
							map_item+='   </div>';
							map_item+='</div>';
							$('#install_normal_setup_sites .modalSelectMap .list_maps').append(map_item);
						}
					});
					$('#install_normal_setup_sites .modalSelectMap').modal('show');
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
	$( "#pages_install_normal #install_normal_setup_sites .modalSelectMap" ).on( 'click', '.SelectMapItem', function(e) {
		id_map_to_switch = parseInt($(this).attr('id'));
		str_map_to_switch = $(this).find('.mapname').html();
	
		if($('#modalConfirmSwitchSite').data('original_txt') == undefined)
			$('#modalConfirmSwitchSite').data('original_txt',$('#modalConfirmSwitchSite').find('h3').text());
		$('#modalConfirmSwitchSite').find('h3').html($('#modalConfirmSwitchSite').data('original_txt') + '<br><br><span><i class="fas fa-building"></i><br>' + str_site_to_switch + '<br><br><i class="fas fa-map-marked-alt"></i><br>' + str_map_to_switch+'</span>');
		
		$('#modalConfirmSwitchSite').modal('show');
		$('#install_normal_setup_sites .modalSelectMap').modal('hide');
	})
	
	$('#install_normal_setup_sites #modalConfirmSwitchSite .bModalConfirmSwitchSiteOk').click(function(e){
		if(id_site_to_switch != -1){
			wycaApi.SetSiteAsCurrent(id_site_to_switch, function(data) {
				if (data.A != wycaApi.AnswerCode.NO_ERROR) 
					ParseAPIAnswerError(data,textErrorSetSite);
				else
				{
					if(id_map_to_switch != -1){
						wycaApi.SetMapAsCurrent(id_map_to_switch, function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								if($('#install_normal_dashboard_modalCurrentSite').data('original_txt') == undefined)
									$('#install_normal_dashboard_modalCurrentSite').data('original_txt',$('#install_normal_dashboard_modalCurrentSite').find('h3').text());
								$('#install_normal_dashboard_modalCurrentSite').find('h3').html($('#install_normal_dashboard_modalCurrentSite').data('original_txt') + '<br><br><span>' + $('#modalConfirmSwitchSite').find('h3').find('span').html() + '</span>');
								$('#install_normal_setup_sites .bBackToDashboard').click();
								$('#install_normal_dashboard_modalCurrentSite').modal('show');
							}else{
								ParseAPIAnswerError(data,textErrorSetMap);
								GetSitesinstall_normal();
							}
							$('#pages_install_normal .modalSelectMap .bCloseSelectMap').click();
							$('#install_normal_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
							$('#install_normal_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
							id_map_to_switch = -1;
						})
					}else{
						if($('#install_normal_dashboard_modalCurrentSite').data('original_txt') == undefined)
							$('#install_normal_dashboard_modalCurrentSite').data('original_txt',$('#install_normal_dashboard_modalCurrentSite').find('h3').text());
						$('#install_normal_dashboard_modalCurrentSite').find('h3').html($('#install_normal_dashboard_modalCurrentSite').data('original_txt') + '<br><br><span>' + $('#modalConfirmSwitchSite').find('h3').find('span').html() + '</span>');
						$('#install_normal_setup_sites .bBackToDashboard').click();
						$('#install_normal_dashboard_modalCurrentSite').modal('show');
						$('#install_normal_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
						$('#install_normal_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
					}
				}
				id_site_to_switch = -1;
			})
		}
	})
	
	$('#install_normal_setup_sites #modalConfirmSwitchSite .bModalConfirmSwitchSiteClose').click(function(e){
		
		$('#install_normal_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
		$('#install_normal_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
		
	})
	
	$(document).on('click', '#install_normal_setup_sites .bSiteDeleteElem', function(e) {
		e.preventDefault();
		$('#install_normal_setup_sites .btn-danger.confirm_delete').addClass('disabled');
		$('#install_normal_setup_sites .bSiteSetCurrentElem').addClass('disabled');
		
		id_site_to_delete = parseInt($(this).closest('li').data('id_site'));
		
		wycaApi.DeleteSite(id_site_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_sites_list_site_elem_'+id_site_to_delete).remove();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
			$('#install_normal_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
			$('#install_normal_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
		});
		
	});
	
	// --------------------- ADD MAP --------------------
	
	$('#install_normal_setup_maps .bAddMap').click(function(e) {
		e.preventDefault();
		
		create_new_map = true;
		setCookie('create_new_map',create_new_map); // SET COOKIES
		$('#pages_install_normal').removeClass('active');
		$('#pages_install_by_step section.page').hide();
		
		//CHECK JOYSTICK TO START/STOP TELEOP ON NEXT PAGE
		if($('#pages_install_by_step #install_by_step_mapping').find('.joystickDiv').length > 0){
			if(!teleopEnable || teleopEnable == 'not_init'){
				teleopEnable = true;
				wycaApi.TeleopStart();
			}
		}
		else
		{
			if(teleopEnable || teleopEnable == 'not_init'){
				teleopEnable = false;
				wycaApi.TeleopStop();
			}
		}
		
		$('.title_section').html($('#pages_install_by_step #install_by_step_mapping > header > h2').text())
		$('#pages_install_by_step').addClass('active');
		$('#install_by_step_mapping').show();
	});
	
	$(document).on('click', '#install_normal_setup_maps .bMapSetCurrentElem', function(e) {
		e.preventDefault();
		
		id_map = parseInt($(this).closest('li').data('id_map'));
		
		
		wycaApi.SetMapAsCurrent(id_map, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				ParseAPIAnswerError(data,textErrorStopNavigation);
			else
			{
				GetMapsNormal();
			}
		});
	});
	
	$(document).on('click', '#install_normal_setup_maps .bMapDeleteElem', function(e) {
		e.preventDefault();
		
		id_map_to_delete = parseInt($(this).closest('li').data('id_map'));
		
		wycaApi.DeleteMap(id_map_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_maps_list_map_elem_'+id_map_to_delete).remove();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	//---------------------- SWITCH MAP WITH LANDMARK -----------------------
	$(document).on('click', '#install_normal_switch_map_landmark .bMapSetCurrentElem',function(e) {
		e.preventDefault();
		id_map = parseInt($(this).closest('li').data('id_map'));
		
		/*INIT FEEDBACK DISPLAY*/
		$('#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step').css('opacity','0').hide();
		$('#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step .fa-check').hide();
		$('#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step .fa-pulse').show();
		
		wycaApi.on('onSwitchMapWithLandmarkFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 		target = '#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapScan';			break;
					case 'Init pose': 			target = '#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapPose';			break;
					case 'Switch map': 			target = '#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapSwitchMap';		break;
					case 'Stop navigation':		target = '#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapStopNav';		break;
					case 'Start navigation': 	target = '#install_normal_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapStartNav';		break;
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
				
				$('#install_normal_switch_map_landmark .switch_map_step:visible').find('.fa-check').show();
				$('#install_normal_switch_map_landmark .switch_map_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('#install_normal_switch_map_landmark #install_normal_switch_map_landmark_modalFeedback').modal('hide');
					success_wyca(textSwitchMapDone);
				},500)
			}
			else
			{
				$('#install_normal_switch_map_landmark #install_normal_switch_map_landmark_modalFeedback').modal('hide');
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
				$('#install_normal_switch_map_landmark #install_normal_switch_map_landmark_modalFeedback').modal('show');
			}
		});
	});
	
	$('#install_normal_switch_map_landmark .bCancelSwitchMap').click(function(e) {
		$('#install_normal_switch_map_landmark .bCancelSwitchMap').addClass('disabled');
		wycaApi.SwitchMapWithLandmarkCancel(function(data) {
			$('#install_normal_switch_map_landmark .bCancelSwitchMap').removeClass('disabled');
		})
	})
	
	$('#install_normal_switch_map_landmark .bTeleop').click(function() {
		$('#install_normal_switch_map_landmark_modalTeleop').modal('show');
	});
	
	//------------------- SERVICE BOOK ------------------------
	
	$('#install_normal_service_book .bAddServiceBook').click(function(e) {
	
		$('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_title').val('');
		$('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_comment').val('');
		
		$('#install_normal_service_book .modalServiceBook').modal('show');
	});
	
	$('#install_normal_service_book .modalServiceBook #install_normal_service_book_bServiceBookSave').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_title').val() == "" )
		{
			alert_wyca(textTitleRequired);
		}
		else if ($('#install_normal_service_book .modalServiceBook #install_normal_service_book_i_service_book_comment').val() == "" )
		{
			alert_wyca(textCommentRequired);
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
					let d = new Date(Date.now());
					let d_txt="";
					switch(lang){
						case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
						case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
						default: break;
					}
					// On ajoute le li
					$('#install_normal_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+json_service_book.title+'</div>'+
						'	<div class="comment">'+json_service_book.comment+'</div>'+
						'</li>'
						);

					$('#install_normal_service_book .modalServiceBook').modal('hide');
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
	
	$('#install_normal_manager .bHelpManagerOk').click(function(){boolHelpManager = !$('#install_normal_manager .checkboxHelpManager').prop('checked');setCookie('boolHelpManagerI',boolHelpManager);});//ADD SAVING BDD / COOKIES ?
	
	$('#install_normal_manager .bAddManager').click(function(e) {
	
		$('#install_normal_manager .modalManager #install_normal_manager_i_id_manager').val(-1);
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_email').val('').removeClass('success').removeClass('error');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_societe').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_prenom').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_nom').val('');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').val('').removeClass('success').removeClass('error');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#install_normal_manager .modalManager').modal('show');
	});
	
	$('#install_normal_manager .modalManager #install_normal_manager_bManagerSave').click(function(e) {
        e.preventDefault();
	
		let pass = $('#install_normal_manager .modalManager #install_normal_manager_i_manager_password');
		let cpass = $('#install_normal_manager .modalManager #install_normal_manager_i_manager_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#install_normal_manager_i_manager_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#install_normal_manager .modalManager #install_normal_manager_i_id_manager').val()),
				"company": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_societe').val(),
				"lastname": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_nom').val(),
				"firstname": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_prenom').val(),
				"email": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_email').val(),
				"pass": $('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').val(),
				"id_group_user": wycaApi.GroupUser.MANAGER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#install_normal_manager_list_manager_elem_'+id_user).length > 0)
					{
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.email').html(json_user.email);
						/*
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.societe').html(json_user.company);
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#install_normal_manager_list_manager_elem_'+id_user+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#install_normal_manager .list_managers').append('' +
							'<li id="install_normal_manager_list_manager_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayManagerNormal();
					}
					
					$('#install_normal_manager .modalManager').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
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
				RefreshDisplayManagerNormal();
			}
			else
			{
				ParseAPIAnswerError(data);
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
		
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_email').removeClass('success').removeClass('error');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_password').removeClass('success').removeClass('error');
		$('#install_normal_manager .modalManager #install_normal_manager_i_manager_cpassword').removeClass('success').removeClass('error');
		
		$('#install_normal_manager .modalManager').modal('show');
	});	
	
	$('#install_normal_manager input#install_normal_manager_i_manager_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#install_normal_manager input#install_normal_manager_i_manager_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#install_normal_manager input#install_normal_manager_i_manager_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#install_normal_manager input#install_normal_manager_i_manager_password').val() != ''){
			if($(this).val() == $('#install_normal_manager input#install_normal_manager_i_manager_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//USERS
	
	$('#install_normal_user .bAddUser').click(function(e) {
	
		$('#install_normal_user .modalUser #install_normal_user_i_id_user').val(-1);
		$('#install_normal_user .modalUser #install_normal_user_i_user_email').val('').removeClass('success').removeClass('error');
		$('#install_normal_user .modalUser #install_normal_user_i_user_societe').val('');
		$('#install_normal_user .modalUser #install_normal_user_i_user_prenom').val('');
		$('#install_normal_user .modalUser #install_normal_user_i_user_nom').val('');
		$('#install_normal_user .modalUser #install_normal_user_i_user_password').val('').removeClass('success').removeClass('error');
		$('#install_normal_user .modalUser #install_normal_user_i_user_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#install_normal_user .modalUser').modal('show');
	});
	
	$('#install_normal_user .modalUser #install_normal_user_bUserSave').click(function(e) {
        e.preventDefault();
	
		let pass = $('#install_normal_user .modalUser #install_normal_user_i_user_password');
		let cpass = $('#install_normal_user .modalUser #install_normal_user_i_user_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#install_normal_user_i_user_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#install_normal_user .modalUser #install_normal_user_i_id_user').val()),
				"company": $('#install_normal_user .modalUser #install_normal_user_i_user_societe').val(),
				"lastname": $('#install_normal_user .modalUser #install_normal_user_i_user_nom').val(),
				"firstname": $('#install_normal_user .modalUser #install_normal_user_i_user_prenom').val(),
				"email": $('#install_normal_user .modalUser #install_normal_user_i_user_email').val(),
				"pass": $('#install_normal_user .modalUser #install_normal_user_i_user_password').val(),
				"id_group_user": wycaApi.GroupUser.USER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#install_normal_user_list_user_elem_'+id_user).length > 0)
					{
						$('#install_normal_user_list_user_elem_'+id_user+' span.email').html(json_user.email);
						/*
						$('#install_normal_user_list_user_elem_'+id_user+' span.societe').html(json_user.company);
						$('#install_normal_user_list_user_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#install_normal_user_list_user_elem_'+id_user+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#install_normal_user .list_users').append('' +
							'<li id="install_normal_user_list_user_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bUserDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayUserNormal();
					}
					
					$('#install_normal_user .modalUser').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#install_normal_user .bUserDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_user_list_user_elem_'+id_user_to_delete).remove();
				RefreshDisplayUserNormal();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#install_normal_user .bUserEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#install_normal_user .modalUser #install_normal_user_i_id_user').val(id_user);
		$('#install_normal_user .modalUser #install_normal_user_i_user_email').val($('#install_normal_user_list_user_elem_'+id_user+' span.email').html());
		$('#install_normal_user .modalUser #install_normal_user_i_user_societe').val($('#install_normal_user_list_user_elem_'+id_user+' span.societe').html());
		$('#install_normal_user .modalUser #install_normal_user_i_user_prenom').val($('#install_normal_user_list_user_elem_'+id_user+' span.prenom').html());
		$('#install_normal_user .modalUser #install_normal_user_i_user_nom').val($('#install_normal_user_list_user_elem_'+id_user+' span.nom').html());
		$('#install_normal_user .modalUser #install_normal_user_i_user_password').val('');
		$('#install_normal_user .modalUser #install_normal_user_i_user_cpassword').val('');
		
		$('#install_normal_user .modalUser #install_normal_user_i_user_email').removeClass('success').removeClass('error');
		$('#install_normal_user .modalUser #install_normal_user_i_user_password').removeClass('success').removeClass('error');
		$('#install_normal_user .modalUser #install_normal_user_i_user_cpassword').removeClass('success').removeClass('error');
		
		$('#install_normal_user .modalUser').modal('show');
	});
	
	$('#install_normal_user input#install_normal_user_i_user_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#install_normal_user input#install_normal_user_i_user_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#install_normal_user input#install_normal_user_i_user_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#install_normal_user input#install_normal_user_i_user_password').val() != ''){
			if($(this).val() == $('#install_normal_user input#install_normal_user_i_user_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//------------------- SOUND ------------------------
	
	$('#install_normal_setup_sound .sound_switch_ROS').change(function(){
		if(!$(this).prop('checked')){
			$('#install_normal_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off').addClass('disabled');
			$('#install_normal_setup_sound .sound_switch_app').prop('checked',false);
		}else{
			$('#install_normal_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('disabled');
		}
	});
	
	$('#install_normal_setup_sound .bSaveSound').click(function(e) {
		//console.log('here');
		//SOUND
		if($('#install_normal_setup_sound .sound_switch_ROS').prop('checked')){
			//SOUND ON
			wycaApi.SetSoundIsOn(true,function(data){})
			
		}else{
			//SOUND OFF
			wycaApi.SetSoundIsOn(false,function(data){})
			
		}
		
		//APP SOUND
		if($('#install_normal_setup_sound .sound_switch_app').prop('checked')){
			
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
	
	$('#install_normal_setup_wifi .refresh_wifi').click(function(e) {
		e.preventDefault();		
	});
	
	$( '#install_normal_setup_wifi tbody' ).on( 'click', 'tr', function(e) {
		e.preventDefault();
		selectedWifi = $(this).data('ssid');
		
		$('#install_normal_setup_wifi_password .wifi_connexion_error').html('');
		$('#install_normal_setup_wifi_password .i_wifi_passwd_name').val('');
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
				$('#install_normal_setup_wifi_password .install_normal_setup_wifi_password_back').click();
				$('#install_normal_setup_wifi_password .wifi_connexion_error').html('');
				$('#install_normal_setup_wifi_password .i_wifi_passwd_name').val('');
			}
			$('#install_normal_setup_wifi_password .install_normal_setup_wifi_password_save').show();
			$('#install_normal_setup_wifi_password .wifi_connexion_progress').hide();
		});
    });
	
	//----------------------- EBL/MBL CONFIGURATION ----------------------------
	
	$('#pages_install_normal a.real_test').click(function(e) {
        e.preventDefault();
		$('#pages_install_normal .modalRealTest_loading').show();
		$('#pages_install_normal .modalRealTest_content').hide();
		$('#pages_install_normal .modalRealTest').modal('show');
		$('#pages_install_normal a.bRealTestDo').addClass('disabled');
		wycaApi.GetCurrentMapData(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				let n = 0;
				$('#pages_install_normal .modalRealTest_loading').hide();
				$('#pages_install_normal .modalRealTest_content').show();
				$('#pages_install_normal select.real_test_start > option').hide();
				$('#pages_install_normal select.real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('#pages_install_normal select.real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('#pages_install_normal select.real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
					n++;
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('#pages_install_normal select.real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('#pages_install_normal select.real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					n++;
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('#pages_install_normal select.real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					$('#pages_install_normal select.real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					n++;
				});
				
				id_map = data.D.id_map;
				id_map_last = data.D.id_map;
				
				if(n < 2){
					$('#pages_install_normal .modalRealTest').modal('hide');
					alert_wyca(textNoRealTest);
				}
			}
			else
			{
				$('#pages_install_normal .modalRealTest').modal('hide');
			}
			$('#pages_install_normal a.bRealTestDo').removeClass('disabled');
		})		
		
	});
	
	/* REAL TEST */
	
	$('#pages_install_normal a.bRealTestDo').click(function(e) {
        e.preventDefault();
		let start = $('#pages_install_normal select.real_test_start option:selected');
		let end = $('#pages_install_normal select.real_test_end option:selected');
		if(start.val()!='' && end.val()!='' && end.val()!=start.val()){
			$('#pages_install_normal .modalRealTest').modal('hide');
			$('#pages_install_normal .modalRealTestResult').modal('show');
			
			$("#pages_install_normal .modalRealTestResult .start_point").hide();
			$("#pages_install_normal .modalRealTestResult .end_point").hide();
			$("#pages_install_normal .modalRealTestResult .result_RealTest").hide();
			
			$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');			
			$("#pages_install_normal .modalRealTestResult .start_point_text").html(start.html());
			$("#pages_install_normal .modalRealTestResult .end_point_text").html(end.html());
			
			RealTestGotoStartNormal(start,end);
		}
	});
	
	$('#pages_install_normal .modalRealTestResult a.bUseRealTest').click(function(e) {
		e.preventDefault();
		let temp = battery_lvl_needed == 0?1:parseInt(battery_lvl_needed);
		let EBL = temp+5;
		let MBL = 2*temp;
		MBL < EBL ? MBL = EBL + 5:'';
		$('#install_normal_setup_config_i_level_min_gotocharge').val(EBL);
		$('#install_normal_setup_config_i_level_min_dotask').val(MBL);
		$('#pages_install_normal .modalRealTestResult').modal('hide');
    });
	
	$('section#install_normal_setup_config a.bResetValueEblMbl').click(function(e) {
		
		$('#install_normal_setup_config_i_level_min_gotocharge').val((typeof(defaultEBL) != 'undefined'? defaultEBL : 15));
		$('#install_normal_setup_config_i_level_min_dotask').val((typeof(defaultMBL) != 'undefined'? defaultMBL : 20));
    });
		
	$('#pages_install_normal .bConfigurationSave').click(function(e) {
		let EBL = parseInt($('#install_normal_setup_config_i_level_min_gotocharge').val());
		let MBL = parseInt($('#install_normal_setup_config_i_level_min_dotask').val());
		/*EBL = EBL > 100 ? 15 : EBL;
		EBL = EBL < 0 ? 15 : EBL;
		MBL = MBL > 100 ? 20 : MBL;
		MBL = MBL < 0 ? 20 : MBL;*/
		wycaApi.SetEnergyConfiguration(EBL,MBL, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca(textBatteryConfigSaved);
				GetConfigurationsNormal();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
    });
	
	//----------------------- RECOVERY ----------------------------
	
	$('#install_normal_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		$('#install_normal_recovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#install_normal_recovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#install_normal_recovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#install_normal_recovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#install_normal_recovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#install_normal_recovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#install_normal_recovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#install_normal_recovery .recovery_feedback .recovery_step.RecoveryNav';		break;
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
				
				$('#install_normal_recovery .recovery_step:visible').find('.fa-check').show();
				$('#install_normal_recovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#install_normal_recovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
					$('#install_normal_recovery .bRecovery').removeClass('disabled');
					$('#install_normal_recovery .install_normal_recovery_next').click();
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
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
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#install_normal_recovery .bCancelRecovery').click(function(e) {
		$('#install_normal_recovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#install_normal_recovery .bCancelRecovery').removeClass('disabled');
		})
	})
	
	
	//----------------------- LANGUE ----------------------------
	
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
					window.location.href = app_url; // equivalent window.location.reload()
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorLang) != 'undefined'? textErrorLang : 'Error lang') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorLang) != 'undefined'? textErrorLang : 'Error lang') + ' ' + e.responseText );
				}
			}
		});
    });
	
	//------------------- AVAILABLES TOPS ------------------------
	
	$('#pages_install_normal .file_import_top').change(function(){
		
		let fname = $(this)[0].files[0].name;console.log(fname);
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_install_normal .file_import_top_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_install_normal .file_import_top_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_install_normal .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_install_normal .filename_import_top').html(fname);
		$('#pages_install_normal .filename_import_top').show();
		
	})
	
	$('#pages_install_normal a.bImportTopDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_install_normal .file_import_top')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
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
		InitTopImportNormal();
	});
	
	$( "#pages_install_normal #install_normal_setup_tops .tuiles" ).on('click', 'a.is_checkbox[data-id_top]', function(e) {
		let arr = Array();
		$('#install_normal_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
            arr.push($(this).data('id_top'));
        });
		let lg = arr.length;
		if(!$(this).hasClass('active'))
			lg = $(this).hasClass('checked')? lg-1 : lg+1; // ADD OR REMOVE ITEM CLICKED ONLY IF NOT ACTIVE TOP (UNREMOVABLE)
		let btnSelectActiveTop = $('#install_normal_setup_tops a[data-goto="install_normal_setup_top"]');
		if(lg == 1)
			btnSelectActiveTop.addClass('disabled');
		else
			btnSelectActiveTop.removeClass('disabled');
	})
	
	$('#pages_install_normal a.save_tops').click(function(e) {
        e.preventDefault();
		
		listAvailableTops = Array();
		
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
		
		/*INIT FEEDBACK DISPLAY*/
		$('#install_normal_setup_top .set_active_top_feedback').hide();
		$('#install_normal_setup_top .set_active_top_feedback .set_active_top_step').css('opacity','0').hide();
		$('#install_normal_setup_top .set_active_top_feedback .set_active_top_step .fa-check').hide();
		$('#install_normal_setup_top .set_active_top_feedback .set_active_top_step .fa-pulse').show();
		
		wycaApi.on('onSetActiveTopFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case '1/2': target = '#install_normal_setup_top .set_active_top_feedback .set_active_top_step.SetActiveTopRemoveCurrent';	break;
					case '2/2': target = '#install_normal_setup_top .set_active_top_feedback .set_active_top_step.SetActiveTopSetNew';			break;
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
			$('#install_normal_setup_top .modalSetActiveTop').modal('hide');
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca(textTopNowActive);
				$('#install_normal_setup_top .bBackToDashboardSetup').click();
			}
			else
			{
				InitTopsActiveNormal();
				ParseAPIAnswerError(data);
			}
			wycaApi.on('onSetActiveTopResult', onSetActiveTopResult);
			wycaApi.on('onSetActiveTopFeedback', onSetActiveTopFeedback);
		});
		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_setup_top .modalSetActiveTop').modal('show');
				$('#install_normal_setup_top .set_active_top_feedback').show();
			}
			else
			{
				wycaApi.on('onSetActiveTopResult', onSetActiveTopResult);
				wycaApi.on('onSetActiveTopFeedback', onSetActiveTopFeedback);
				ParseAPIAnswerError(data);
				InitTopsActiveNormal();
			}	
		});		
	});
});

//------------------- CONFIGURATION EBL/MBL ------------------------
	
/* FONCTION PROGRESS BAR REAL TEST */	/* REAL TEST */
	
function TimerRealTestNormal(step){
	if(step=='start'){			
		if(statusRealTestStart > 0){
			if(statusRealTestStart == 2 && timerRealTestStart==100){
				statusRealTestStart=0;
				timerRealTestStart=0;
				$('#install_normal_setup_config .modalRealTestResult .checkStart').show('fast');
			}else{
				$('#install_normal_setup_config .modalRealTestResult .checkStart').hide();
				delay = statusRealTestStart == 2 ? 1 : 200;
				timerRealTestStart++;
				if(timerRealTestStart == 101)timerRealTestStart=0;
				$('#install_normal_setup_config .startRealTestprogress .progress-bar').css('width', timerRealTestStart+'%').attr('aria-valuenow', timerRealTestStart); 
				setTimeout(TimerRealTestNormal,delay,step);
			}
		}
	}else if(step=='end'){			
		if(statusRealTestEnd > 0){
			if(statusRealTestEnd == 2 && timerRealTestEnd==100){
				$('#install_normal_setup_config .modalRealTestResult .stop_move').css('opacity',1);
				statusRealTestEnd=0;
				timerRealTestEnd=0;
				$('#install_normal_setup_config .modalRealTestResult .checkEnd').show('fast');
			}else{
				$('#install_normal_setup_config .modalRealTestResult .checkEnd').hide();
				delay = statusRealTestEnd == 2 ? 1 : 200;
				timerRealTestEnd++;
				if(timerRealTestEnd == 101)timerRealTestEnd=0;
				$('#install_normal_setup_config .endRealTestprogress .progress-bar').css('width', timerRealTestEnd+'%').attr('aria-valuenow', timerRealTestEnd); 
				setTimeout(TimerRealTestNormal,delay,step);
			}
		}
	}
}

function RealTestGotoStartNormal(start,end){
	
	//console.log('Go to start');
	//console.log(start.data('type'),' id ',start.data('id'));
	
	switch(start.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndNormal(end);
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='poi') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = start.data('id');
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_normal .modalRealTestResult .start_point").show();
					
					$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestNormal('start');
					$('#install_normal_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
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
					RealTestGotoEndNormal(end);
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='dock') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_normal .modalRealTestResult .start_point").show();
					$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestNormal('start');
					$('#install_normal_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
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
					RealTestGotoEndNormal(end);
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='augmented_pose') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_normal .modalRealTestResult .start_point").show();
					$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestNormal('start');
					$('#install_normal_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	
}

function RealTestGotoEndNormal(end){
	//console.log('Go to end');
	//console.log(end.data('type'),' id ',end.data('id'));
	$('#install_normal_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',0);
	statusRealTestStart = 2;
	statusRealTestEnd = 1;
	timerRealTestEnd = 0;
	TimerRealTestNormal('end');						
	switch(end.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					statusRealTestEnd = 2;
					battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
					textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
					$('#pages_install_normal .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_install_normal .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
					
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_normal .modalRealTestResult .end_point").show()
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
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
					$('#pages_install_normal .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_install_normal .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_normal .modalRealTestResult .end_point").show()
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
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
					$('#pages_install_normal .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_install_normal .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_install_normal .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_normal .modalRealTestResult .end_point").show()
				}else{
					$('#pages_install_normal .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	// LAUNCH PROGRESS BAR ANIM
}		

//------------------- ACTIVE TOP ------------------------
/*
var statusSetActiveTop = 0;
var timerSetActiveTop = 0;
	
function TimerActiveTopNormal(){
	if(statusSetActiveTop > 0){
		if(statusSetActiveTop == 2 && timerSetActiveTop==100){
			statusSetActiveTop=0;
			timerSetActiveTop=0;
			
		}else{
			delay = statusSetActiveTop == 2 ? 1 : 100;
			timerSetActiveTop++;
			if(timerSetActiveTop == 101)timerSetActiveTop=0;
			$('#install_normal_setup_top .modalSetActiveTop .progressSetActiveTop .progress-bar').css('width', timerSetActiveTop+'%').attr('aria-valuenow', timerSetActiveTop); 
			setTimeout(TimerActiveTopNormal,delay);
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
*/

//------------------- MANAGERS ------------------------	

function RefreshDisplayManagerNormal(){
	if($('#install_normal_manager ul.list_managers li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#install_normal_manager a.bAddManager').show();
		$('#install_normal_manager .bAddManagerTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#install_normal_manager a.bAddManager').hide();
		$('#install_normal_manager .bAddManagerTuile').show();
	}
	
}

//------------------- USERS ------------------------	

function RefreshDisplayUserNormal(){
	if($('#install_normal_user ul.list_users li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#install_normal_user a.bAddUser').show();
		$('#install_normal_user .bAddUserTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#install_normal_user a.bAddUser').hide();
		$('#install_normal_user .bAddUserTuile').show();
	}
	
}
