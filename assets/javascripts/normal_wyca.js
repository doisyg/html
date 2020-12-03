//Javascript document
var form_sended = false; //Boolean pour disable a form "en traitement"
var selectedWifi = '';

var currentNameSiteExport = '';
var NormalBufferMapSaveElemName = '';

$(document).ready(function(e) {
	// ----------------------- SITE EXPORT ------------------------
		
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
			console.log(normalCurrentAction);
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
var create_new_site = false;
var id_site_to_delete = -1;

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
						id_site = data.D;
						wycaApi.SetSiteAsCurrent(id_site,function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR)
							{
								wycaApi.GetCurrentMapData(function(data){
									if (data.A == wycaApi.AnswerCode.NO_ERROR)
									{
										if(data.D.docks.length <= 1){
											$('#pages_install_normal .install_normal_setup_import_loading').hide();
											$('#pages_install_normal .install_normal_setup_import_content').show();
											success_wyca(textSiteImported);
											$('#pages_install_normal .bImportSiteBack').click();
										}else{
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
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#pages_install_normal .modalMasterDock .bCloseMasterDock').click();
				success_wyca(textSiteImported);
				$('#pages_install_normal #install_normal_setup_import .bImportSiteBack').click();
			}else{
				$('#pages_install_normal .modalMasterDock .bCloseMasterDock').click();
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
	
	//------------------- ACCOUNTS ------------------------
	//MANAGERS
	$('#install_normal_manager .bHelpManagerOk').click(function(){boolHelpManager = !$('#install_normal_manager .checkboxHelpManager').prop('checked')});//ADD SAVING BDD / COOKIES ?
	
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
		}else if (!$('#install_normal_manager_i_manager_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
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
							'	<a href="#" class="bManagerDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
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
		}else if (!$('#install_normal_user_i_user_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}
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
							'	<a href="#" class="bUserDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
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
				$('#pages_install_normal .modalRealTest_loading').hide();
				$('#pages_install_normal .modalRealTest_content').show();
				$('#pages_install_normal select.real_test_start > option').hide();
				$('#pages_install_normal select.real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('#pages_install_normal select.real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('#pages_install_normal select.real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('#pages_install_normal select.real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('#pages_install_normal select.real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('#pages_install_normal select.real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					$('#pages_install_normal select.real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
				});
				
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
		let ebl = temp+5;
		let mbl = 2*temp;
		mbl < ebl ? mbl = ebl + 5:'';
		$('#install_normal_setup_config_i_level_min_gotocharge').val(ebl)
		$('#install_normal_setup_config_i_level_min_dotask').val(mbl)
		$('#pages_install_normal .modalRealTestResult').modal('hide')
    });
	
	$('section#install_normal_setup_config a.bResetValueEblMbl').click(function(e) {
		
		$('#install_normal_setup_config_i_level_min_gotocharge').val(15)
		$('#install_normal_setup_config_i_level_min_dotask').val(20)
    });
		
	$('#pages_install_normal .bConfigurationSave').click(function(e) {
		let EBL = parseInt($('#install_normal_setup_config_i_level_min_gotocharge').val());
		let MBL = parseInt($('#install_normal_setup_config_i_level_min_dotask').val());
		EBL = EBL > 100 ? 15 : EBL;
		EBL = EBL < 0 ? 15 : EBL;
		MBL = MBL > 100 ? 20 : MBL;
		MBL = MBL < 0 ? 20 : MBL;
		wycaApi.SetEnergyConfiguration(EBL,MBL, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca('Saved');
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
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				success_wyca('Recovery done !');
			}
			else
			{
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				$('#install_normal_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
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
		InitTopImportNormal();
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
				ParseAPIAnswerError(data);
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
				ParseAPIAnswerError(data);
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
