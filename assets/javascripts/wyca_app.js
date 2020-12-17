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
				ParseAPIAnswerError(data,'Exporting site : ');
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
		
		CalculateMapTrinaryWyca();
    });
	
	$('#wyca_setup_trinary_threshold_free_slider').change(function() {
		$('#wyca_setup_trinary_threshold_free_output b').text( this.value );
		threshold_free_wyca = this.value;
		
		CalculateMapTrinaryWyca();
	});
	
	$('#wyca_setup_trinary_threshold_occupied_slider').change(function() {
		$('#wyca_setup_trinary_threshold_occupied_output b').text( this.value );
		threshold_occupied_wyca = this.value;
		
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
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#wyca_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#wyca_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
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
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#wyca_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#wyca_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
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
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#wyca_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#wyca_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#wyca_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!wycaCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
			console.log(wycaCurrentAction);
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
					success_wyca("Map saved !");
					
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
					alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
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
			alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
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
}

var timeoutCalcul_wyca = null;

var img_wyca;
var canvas_wyca;

var width_wyca = 0;
var height_wyca = 0;

/* INSTALLATEUR WYCA.JS */
var create_new_site = false;
var id_site_to_delete = -1;

$(document).ready(function(e) {
	//----------------------- IMPORT SITE ----------------------------
	
	$('#pages_wyca .file_import_site').change(function(){
		
		let fname = $(this)[0].files[0].name;
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_wyca .file_import_site_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_wyca .file_import_site_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_wyca .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_wyca .filename_import_site').html(fname);
		$('#pages_wyca .filename_import_site').show();
		
	})
	
	$('#pages_wyca a.bImportSiteDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_wyca .file_import_site')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			
			$('#pages_wyca .wyca_setup_import_loading').show();
			$('#pages_wyca .wyca_setup_import_content').hide();
			
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
											$('#pages_wyca .wyca_setup_import_loading').hide();
											$('#pages_wyca .wyca_setup_import_content').show();
											success_wyca(textSiteImported);
											$('#pages_wyca .bImportSiteBack').click();
										}else{
											forbiddens = data.D.forbiddens;
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
			let icon = $('#pages_wyca .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	//----------------------- MASTER DOCK ----------------------------
	
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_wyca #MasterDockList" ).on( 'click', '.MasterDockItem', function(e) {
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
				$('#pages_wyca .modalMasterDock .bCloseMasterDock').click();
				success_wyca(textSiteImported);
				$('#pages_wyca #wyca_setup_import .bImportSiteBack').click();
			}else{
				$('#pages_wyca .modalMasterDock .bCloseMasterDock').click();
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
		$('#pages_wyca').removeClass('active');
		$('#pages_install_by_step section.page').hide();
		
		$('#pages_install_by_step').addClass('active');
		$('#install_by_step_site').show();
	});
	
	$(document).on('click', '#wyca_setup_sites .bSiteSetCurrentElem', function(e) {
		e.preventDefault();
		
		id_site = parseInt($(this).closest('li').data('id_site'));
		
		
		wycaApi.SetSiteAsCurrent(id_site, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				alert_wyca('Error navigation stop ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);
			else
			{
				GetSitesWyca();
			}
		});
	});
	
	$(document).on('click', '#wyca_setup_sites .bSiteDeleteElem', function(e) {
		e.preventDefault();
		
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
		});
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
			alert_wyca('Title is required');
		}
		else if ($('#wyca_service_book .modalServiceBook #wyca_service_book_i_service_book_comment').val() == "" )
		{
			alert_wyca('Comment is required');
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
		}else if (!$('#wyca_manager_i_manager_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}
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
		}else if (!$('#wyca_user_i_user_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}
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
		}else if (!$('#wyca_wyca_i_wyca_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}
		else
		{
			json_wyca = {
				"id_wyca": parseInt($('#wyca_wyca .modalWyca #wyca_wyca_i_id_wyca').val()),
				"company": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_societe').val(),
				"lastname": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_nom').val(),
				"firstname": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_prenom').val(),
				"email": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_email').val(),
				"pass": $('#wyca_wyca .modalWyca #wyca_wyca_i_wyca_password').val(),
				"id_group_user": wycaApi.GroupUser.WYCA,
			};
			
			wycaApi.SetUser(json_wyca, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_wyca = data.D;
					if ($('#wyca_wyca_list_wyca_elem_'+id_wyca).length > 0)
					{
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.email').html(json_wyca.email);
						/*
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.societe').html(json_wyca.company);
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.prenom').html(json_wyca.firstname);
						$('#wyca_wyca_list_wyca_elem_'+id_wyca+' span.nom').html(json_wyca.lastname);
						*/
					}
					else
					{
						$('#wyca_wyca .list_wycas').append('' +
							'<li id="wyca_wyca_list_wyca_elem_'+id_wyca+'" data-id_wyca="'+id_wyca+'">'+
							'	<span class="email">'+json_wyca.email+'</span>'+
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
		}else if (!$('#wyca_installer_i_installer_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}
		else
		{
			json_installer = {
				"id_installer": parseInt($('#wyca_installer .modalInstaller #wyca_installer_i_id_installer').val()),
				"company": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_societe').val(),
				"lastname": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_nom').val(),
				"firstname": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_prenom').val(),
				"email": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_email').val(),
				"pass": $('#wyca_installer .modalInstaller #wyca_installer_i_installer_password').val(),
				"id_group_user": wycaApi.GroupUser.DISTRIBUTOR,
			};
			
			wycaApi.SetUser(json_installer, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_installer = data.D;
					if ($('#wyca_installer_list_installer_elem_'+id_installer).length > 0)
					{
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.email').html(json_installer.email);
						/*
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.societe').html(json_installer.company);
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.prenom').html(json_installer.firstname);
						$('#wyca_installer_list_installer_elem_'+id_installer+' span.nom').html(json_installer.lastname);
						*/
					}
					else
					{
						$('#wyca_installer .list_installers').append('' +
							'<li id="wyca_installer_list_installer_elem_'+id_installer+'" data-id_installer="'+id_installer+'">'+
							'	<span class="email">'+json_installer.email+'</span>'+
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
	
	$('#pages_wyca a.real_test').click(function(e) {
        e.preventDefault();
		$('#pages_wyca .modalRealTest_loading').show();
		$('#pages_wyca .modalRealTest_content').hide();
		$('#pages_wyca .modalRealTest').modal('show');
		$('#pages_wyca a.bRealTestDo').addClass('disabled');
		wycaApi.GetCurrentMapData(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				let n = 0;
				$('#pages_wyca .modalRealTest_loading').hide();
				$('#pages_wyca .modalRealTest_content').show();
				$('#pages_wyca select.real_test_start > option').hide();
				$('#pages_wyca select.real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('#pages_wyca select.real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('#pages_wyca select.real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
					n++;
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('#pages_wyca select.real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('#pages_wyca select.real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					n++;
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('#pages_wyca select.real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					$('#pages_wyca select.real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					n++;
				});
				
				if(n < 2){
					$('#pages_wyca .modalRealTest').modal('hide');
					alert_wyca(textNoRealTest);
				}
			}
			else
			{
				$('#pages_wyca .modalRealTest').modal('hide');
			}
			$('#pages_wyca a.bRealTestDo').removeClass('disabled');
		})		
		
	});
	
	/* REAL TEST */
	
	$('#pages_wyca a.bRealTestDo').click(function(e) {
        e.preventDefault();
		let start = $('#pages_wyca select.real_test_start option:selected');
		let end = $('#pages_wyca select.real_test_end option:selected');
		if(start.val()!='' && end.val()!='' && end.val()!=start.val()){
			$('#pages_wyca .modalRealTest').modal('hide');
			$('#pages_wyca .modalRealTestResult').modal('show');
			
			$("#pages_wyca .modalRealTestResult .start_point").hide();
			$("#pages_wyca .modalRealTestResult .end_point").hide();
			$("#pages_wyca .modalRealTestResult .result_RealTest").hide();
			
			$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');			
			$("#pages_wyca .modalRealTestResult .start_point_text").html(start.html());
			$("#pages_wyca .modalRealTestResult .end_point_text").html(end.html());
			
			RealTestGotoStartWyca(start,end);
		}
	});
	
	$('#pages_wyca .modalRealTestResult a.bUseRealTest').click(function(e) {
		e.preventDefault();
		let temp = battery_lvl_needed == 0?1:parseInt(battery_lvl_needed);
		let ebl = temp+5;
		let mbl = 2*temp;
		mbl < ebl ? mbl = ebl + 5:'';
		$('#wyca_setup_config_i_level_min_gotocharge').val(ebl)
		$('#wyca_setup_config_i_level_min_dotask').val(mbl)
		$('#pages_wyca .modalRealTestResult').modal('hide')
    });
	
	$('section#wyca_setup_config a.bResetValueEblMbl').click(function(e) {
		
		$('#wyca_setup_config_i_level_min_gotocharge').val(15)
		$('#wyca_setup_config_i_level_min_dotask').val(20)
    });
		
	$('#pages_wyca .bConfigurationSave').click(function(e) {
		let EBL = parseInt($('#wyca_setup_config_i_level_min_gotocharge').val());
		let MBL = parseInt($('#wyca_setup_config_i_level_min_dotask').val());
		EBL = EBL > 100 ? 15 : EBL;
		EBL = EBL < 0 ? 15 : EBL;
		MBL = MBL > 100 ? 20 : MBL;
		MBL = MBL < 0 ? 20 : MBL;
		wycaApi.SetEnergyConfiguration(EBL,MBL, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca('Saved');
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
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_recovery .bRecovery').removeClass('disabled');
				success_wyca('Recovery done !');
			}
			else
			{
				$('#wyca_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				$('#wyca_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	//----------------------- LANGUE ----------------------------
	
	$('#pages_wyca a.select_langue').click(function(e) {
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
				alert_wyca('Error set lang ; ' + e.responseText);
			}
		});
    });
	
	//------------------- AVAILABLES TOPS ------------------------
	
	$('#pages_wyca .file_import_top').change(function(){
		
		let fname = $(this)[0].files[0].name;console.log(fname);
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_wyca .file_import_top_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_wyca .file_import_top_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_wyca .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_wyca .filename_import_top').html(fname);
		$('#pages_wyca .filename_import_top').show();
		
	})
	
	$('#pages_wyca a.bImportTopDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_wyca .file_import_top')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			$('#pages_wyca .modalImportTop_loading').show();
			$('#pages_wyca .modalImportTop_content').hide();
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						
						$('#pages_wyca .modalImportTop_loading').hide();
						$('#pages_wyca .modalImportTop_content').show();
						
						$('#pages_wyca .modalImportTop').modal('hide');
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
			let icon = $('#pages_wyca .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	$('#pages_wyca a.import_top').click(function(e) {
        e.preventDefault();
		
		$('#pages_wyca .modalImportTop_loading').hide();
		$('#pages_wyca .modalImportTop_content').show();
		
		$('#pages_wyca .modalImportTop').modal('show');
		InitTopImportWyca();
	});
	
	$('#pages_wyca a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		console.log($(this))
		console.log($(this).parent())
		//$('#pages_wyca #wyca_setup_tops li').hide();
		$('#wyca_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_wyca #wyca_setup_tops .bTop'+$(this).data('id_top')).show();
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
	
	$( '#pages_wyca' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();
		
		wycaApi.on('onSetActiveTopResult', function(data) {
			
			InitTopsActiveWyca();
			timerSetActiveTop = 90;
			statusSetActiveTop = 2;
			setTimeout(function(){
				$('#wyca_setup_top .modalSetActiveTop').modal('hide');
				$('#wyca_setup_top .modalSetActiveTop a').removeClass('disabled');
				
			},750);
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				setTimeout(success_wyca,750,textTopNowActive);
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_setup_top .modalSetActiveTop').modal('show');
				$('#wyca_setup_top .modalSetActiveTop a').addClass('disabled');
				statusSetActiveTop = 1;
				timerSetActiveTop = 0;

				//$('#pages_wyca .progressSetActiveTop').show();
				TimerActiveTopWyca();
			}
			else
			{
				InitTopsActiveWyca();
				ParseAPIAnswerError(data);
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
					$('#pages_wyca .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='poi') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = start.data('id');
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca .modalRealTestResult .start_point").show();
					
					$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWyca('start');
					$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
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
					$('#pages_wyca .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='dock') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca .modalRealTestResult .start_point").show();
					$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWyca('start');
					$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
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
					$('#pages_wyca .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='augmented_pose') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca .modalRealTestResult .start_point").show();
					$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWyca('start');
					$('#wyca_setup_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
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
					$('#pages_wyca .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
					
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
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
					$('#pages_wyca .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
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
					$('#pages_wyca .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca .modalRealTestResult').modal('hide');
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

