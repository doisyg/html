function HideTuile(element)
{
	element.css({ transform: 'rotatey(90deg)', "z-index": "0" });
}
function ShowTuile(element)
{
	element.css({ transform: 'rotatey(0deg)', "z-index": "0" });
}

function change(state) {
	if(state === null) { // initial page
	}
	else
	{
		if ($('.menu_groupe .active').attr('id') != state.current_groupe)
		{
			$('#'+state.current_groupe).click();
		}
		else
		{
			$('section:visible .bBackButton').click();
		}
	}
}

$(window).on("popstate", function(e) {
    change(e.originalEvent.state);
});

(function(original) { // overwrite history.pushState so that it also calls
                      // the change function when called
    history.pushState = function(state) {
        //change(state);
        return original.apply(this, arguments);
    };
})(history.pushState);

var selectedWifi = '';

$(document).ready(function(e) {
	
	history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:'' }, $('.menu_groupe .active').html(), "/#"+$('.menu_groupe .active').html());
	
	$('.popup_error .panel-heading .fa-times').click(function(e) {
        e.preventDefault();
		$(this).closest('.popup_error').hide();
    });
	
	if ($('#install_by_step_check').is(':visible')) setTimeout(StartAnimCheckComposantInstall, 2000);
	
	var elementCss = {
		'perspective': 'outerWidth',
		"transition": "all .2s ease-out"
	  };
	$('ul.tuiles a').css(elementCss);
	
	$('section:not(".active") .anim_tuiles').css({ transform: 'rotatey(90deg)', "z-index": "0" });
	
	$('body').on('click', '.is_checkbox', function(e) {
        e.preventDefault();
        $(this).toggleClass('checked');
    });
	
	$('#bCloseAlertWyca').click(function(e) {
        e.preventDefault();
		$('#alert_wyca p').html('');
		$('#alert_wyca').hide();
    });
	
	$('.bUndock').click(function(e) {
        e.preventDefault();
		wycaApi.Undock();
    });
	
	$('.btn_change_group').click(function(e) {
        e.preventDefault();
		
		history.pushState({ current_groupe:$(this).attr('id'), current_page:'' }, $(this).html(), "/#"+$(this).html());
		
		$('.menu_groupe .active').addClass('btn-default');
		$('.menu_groupe .active').removeClass('btn-danger btn-warning btn-primary btn-success active');
		
		$(this).removeClass('btn-default');
		$(this).addClass($(this).data('btn_class')+ ' active');
		
		$('.global_page.active').fadeOut(500, function() {
		   $(this).removeClass('active');
		});
		$('#'+$(this).data('groupe')).fadeIn(500, function() {
		   $(this).addClass('active');
		});
    });
	
	$( 'body' ).on( 'click', '.button_goto', function(e) {
        e.preventDefault();
		
		history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:$(this).data('goto')}, $(this).data('goto'), "/#"+$(this).data('goto'));
		
		// Anim HIDE
		var startShowAfter = 0;
		if ($(this).closest('section').hasClass('hmi_tuile'))
		{
			nbTuiles = $(this).closest('section').find('.anim_tuiles').length;
			delay = 70;
			for (i=1; i <= nbTuiles; i++)
			{
				setTimeout(HideTuile, delay * (i - 1), $(this).closest('section').find('.tuile' + (nbTuiles - i + 1)));
			}
			
			startShowAfter = nbTuiles * 70;
			$(this).closest('section').delay(startShowAfter+250).fadeOut(500, function() {
               $(this).removeClass('active');
            });
		}
		else
		{
			$(this).closest('section').fadeOut(500);
		}
		
		// Anim SHOW
		next = $(this).data('goto');
		if ($('#'+next).hasClass('hmi_tuile'))
		{
			nbTuiles = $('#'+next).find('.anim_tuiles').length;
			delay = 70;
			for (i=1; i <= nbTuiles; i++)
			{
				setTimeout(ShowTuile, 700 + delay * (i - 1), $('#'+next).find('.tuile' + i));
			}
			
			$('#'+next).delay(startShowAfter+250).fadeIn(500, function() {
               $(this).addClass('active');
            });
		}
		else
		{
			$('#'+next).delay(startShowAfter).fadeIn(500, function() {
               $(this).addClass('active');
            });
		}
		
		if (next == 'install_by_step_wifi') InitInstallWifiPage();
		if (next == 'install_by_step_tops') InitTops();
		if (next == 'install_by_step_top') InitTopsActive();
		
		InitJoystick();
    });
	
	$('#pages_install_by_step a.select_langue').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_set_langue.php',
			data: {
				'id_lang': $(this).data('id_lang')
			},
			dataType: 'json',
			success: function(data) {
				if (data.need_restart == 1)
					window.location.href = window.location.href;
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
    });
	
	
	$('#pages_install_by_step a.skip_wifi').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_skip_wifi.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step a.save_date').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_save_date.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step a#bImportTopDo').click(function(e) {
        e.preventDefault();
		
		$('.modalImportTop_loading').hide();
		$('.modalImportTop_content').show();
		
		file = $('#pages_install_by_step #file_import_top')[0].files[0];
		var reader = new FileReader();
		reader.onload = function(event) { 
			wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					
					$('.modalImportTop_loading').hide();
					$('.modalImportTop_content').show();
					
					$('#pages_install_by_step .modalImportTop').modal('hide');
					InitTops();
				}
				else
				{
					console.log(JSON.stringify(data)); 
					alert(wycaApi.AnswerCodeToString(data.A));
				}
				
				
			});
		};
		reader.readAsText(file);
    });
	
	$('#pages_install_by_step a.import_top').click(function(e) {
        e.preventDefault();
		
		$('.modalImportTop_loading').hide();
		$('.modalImportTop_content').show();
		
		$('#pages_install_by_step .modalImportTop').modal('show');
	});
	$('#pages_install_by_step a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		$('#pages_install_by_step .install_by_step_top li').hide();
		$(this).parent().find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_install_by_step .install_by_step_top .bTop'+$(this).data('id_top')).show();
        });
		
		if (listAvailableTops.length == 0)
		{
			alert_wyca(textSelectOnOrMoreTops);
		}
		else
		{
			wycaApi.SetAvailableTops(listAvailableTops, function(data){
				
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_save_tops.php',
					data: { 
						nb_tops: listAvailableTops.length
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert(e.responseText);
					}
				});
				
				if (listAvailableTops.length == 1)
				{
					wycaApi.SetActiveTop(listAvailableTops[0], function(data){
						$('#pages_install_by_step a.save_tops_next_check').click();
						setTimeout(StartAnimCheckComposantInstall, 2000);
					});
				}
				else
					$('#pages_install_by_step a.save_tops_next_select').click();
			});
		}
    });
	
	$( '#pages_install_by_step' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){});		
		
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_set_top.php',
			data: { 
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
		
		setTimeout(StartAnimCheckComposantInstall, 2000);
    });
	
	$('#pages_install_by_step a.install_by_step_check_next').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_check.php',
			data: { 
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step form.form_site').submit(function(e) {
        e.preventDefault();
		if ($('#pages_install_by_step .i_site_name').val() == '')
		{
			alert_wyca(textIndicateAName);
		}
		else
		{
			wycaApi.GetCurrentSite(function(data) {
				data.D.name = $('#pages_install_by_step .i_site_name').val();
				wycaApi.SetSite(data.D, function(data){
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_site.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert(e.responseText);
						}
					});
					$('#pages_install_by_step a.install_by_step_site_next').click();
				});
			});
		}
	});
	
	
	$(".map_dyn").on("load", function() {  InitPosCarteMapping(); });
	
	$('#install_by_step_mapping .bMappingStart').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping .bMappingStart').hide();
		
		if (navLaunched)
		{
			wycaApi.NavigationStop(function(r) { if (!r.success) alert(r.message);});
			
			$('#install_by_step_mapping .progressStartMapping h3').html(textStopNavigation);
			timerCreateMap = 10;
			timerCreateMapCurrent = 10;
			$('#install_by_step_mapping .progressStartMapping').show();
			NextTimerCreateMap();
		}
		else
		{
			if (!mappingLaunched)
			{
				wycaApi.MappingStart(function(r) { 
					mappingStarted = true;
				});
				
				$('#install_by_step_mapping .progressStartMapping h3').html(textStartMapping);
				timerCreateMap = 5;
				timerCreateMapCurrent = 5;
				$('.progressStartMapping').show();
				NextTimerCreateMap();
			}
			else
			{
				$('#install_by_step_mapping .progressStartMapping').hide();
				$('#install_by_step_mapping .bMappingStop').show();
				$('#install_by_step_mapping .mapping_view').show();
					
				img = document.getElementById("install_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
			}
		}
	});
	$('#install_by_step_mapping .bMappingStop').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping_fin .loading_fin_create_map').show();
		
		img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
        img.src = 'assets/images/vide.png';
		
		wycaApi.MappingStop(function(data) {
			$('#install_by_step_mapping_fin .loading_fin_create_map').hide();
			var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
            img.src = 'data:image/png;base64,' + data.D;
			
			finalMapData = 'data:image/png;base64,' + data.D;
			
			setTimeout(function() {
				canvas = document.createElement('canvas');
				
				width = img.naturalWidth;
				height = img.naturalHeight;
				
				$('#canvas_result_trinary').attr('width', img.naturalWidth);
				$('#canvas_result_trinary').attr('height', img.naturalHeight);
				
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				canvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
				
				CalculateMapTrinary();
			}, 100);
		});
		mappingStarted = false;
		$('#install_by_step_mapping .bMappingStop').hide();
		$('#install_by_step_mapping .mapping_view').hide();
		$('#install_by_step_mapping .bMappingStart').show();
		
		$('#install_by_step_mapping_fin .bMappingCancelMap').show();
		
		if (intervalMap != null)
		{
			clearInterval(intervalMap);
			intervalMap = null;
		}
	});
	
	$('#install_by_step_mapping_fin .bMappingSaveMap').click(function(e) {
		if ($('#install_by_step_mapping_from_name').val() == '')
		{
			alert_wyca(textIndicateAName);
			e.preventDefault();
		}
		else
		{
			var canvasDessin = document.getElementById('canvas_result_trinary');
		
			$('#install_by_step_mapping_fin .bMappingCancelMap2').hide();
			$('#install_by_step_mapping_fin .bMappingSaveMap').hide();
		
			$('#install_by_step_mapping_from_image').val(finalMapData);
			$('#install_by_step_mapping_from_image_tri').val(canvasDessin.toDataURL());
			$('#install_by_step_mapping_from_ros_largeur').val($('#install_by_step_mapping_img_map_saved_fin').prop('naturalWidth'));
			$('#install_by_step_mapping_from_ros_hauteur').val($('#install_by_step_mapping_img_map_saved_fin').prop('naturalHeight'));
			$('#install_by_step_mapping_from_threshold_free').val($('#threshold_free_slider').val());
			$('#install_by_step_mapping_from_threshold_occupied').val($('#threshold_occupied_slider').val());
			//$('#form_mapping').submit();
			
			$.ajax({
				type: "POST",
				url: 'ajax/get_map_tri.php',
				data: {
					'image_tri':canvasDessin.toDataURL()
				},
				dataType: 'json',
				success: function(data) {
					if (!data.error)
					{
						map = {
							'id_map': -1,
							'id_site': -1,
							'name': $('#install_by_step_mapping_from_name').val(),
							'comment': '',
							'image': finalMapData,
							'image_tri': data.image,
							'ros_resolution': 5,
							'ros_width': $('#install_by_step_mapping_img_map_saved_fin').prop('naturalWidth'),
							'ros_height': $('#install_by_step_mapping_img_map_saved_fin').prop('naturalHeight'),
							'threshold_free': parseInt($('#threshold_free_slider').val()),
							'threshold_occupied': parseInt($('#threshold_occupied_slider').val())
						};
						
						wycaApi.SetMap(map, function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR)
							{
								id_map_last = data.D;
								id_map = data.D;
								wycaApi.GetMapComplete(id_map, function(data){
									if (data.A == wycaApi.AnswerCode.NO_ERROR)
									{
										forbiddens = data.D.forbiddens;
										areas = data.D.areas;
										gommes = Array();
										docks = data.D.docks;
										pois = data.D.pois;
										
										$('#install_by_step_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
										
										largeurSlam = data.D.ros_width;
										hauteurSlam = data.D.ros_height;
										largeurRos = data.D.ros_width;
										hauteurRos = data.D.ros_height;
										
										ros_largeur = data.D.ros_width;
										ros_hauteur = data.D.ros_height;
										ros_resolution = data.D.ros_resolution;
										
										$('#install_by_step_edit_map_svg').attr('width', data.D.ros_width);
										$('#install_by_step_edit_map_svg').attr('height', data.D.ros_height);
										
										$('#install_by_step_edit_map_image').attr('width', data.D.ros_width);
										$('#install_by_step_edit_map_image').attr('height', data.D.ros_height);
										$('#install_by_step_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
									  
										$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
										$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
										$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
										$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
										$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
										
										$('#install_by_step_mapping_fin .install_by_step_mapping_fin_next').click();
										
										InitMap();
									  
										var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
										img.src = "assets/images/vide.png";
										
										
										$.ajax({
											type: "POST",
											url: 'ajax/install_by_step_save_mapping.php',
											data: {},
											dataType: 'json',
											success: function(data) {
											},
											error: function(e) {
											}
										});
									}
									else
									{
										alert('Get map error : ' + wycaApi.AnswerCodeToString(data.A));
									}		
									
								});
							}
							else
							{
								alert('Save map error : ' + wycaApi.AnswerCodeToString(data.A));
							}							
						});
					}
									
					
				},
				error: function(e) {
					
					var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
        			img.src = "assets/images/vide.png";
					
					alert(e.responseText);
				}
			});
		}
	});
	
	$('#install_by_step_mapping_use .bUseThisMapNowYes').click(function(e) {
		e.preventDefault();
        
		$('#install_by_step_mapping_use .bUseThisMapNowYes').hide();
		$('#install_by_step_mapping_use .bUseThisMapNowNo').hide();
		$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').hide();
		$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').show();
		$('#install_by_step_mapping_use .modalUseThisMapNowContent').show();
		
		$('#install_by_step_mapping_use .modalUseThisMapNowContentDetails').html(textBuildingMap);
		
		wycaApi.SetMapAsCurrent(id_map, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_by_step_mapping_use .modalUseThisMapNowContentDetails').html(textStartAutonomous);
				wycaApi.NavigationStartFromMapping(function(r) {
					if (!r.success) alert_wyca(r.message);
					$('#install_by_step_mapping_use .install_by_step_mapping_use_next').click();
					
					console.log('TODO : Mettre à jour liste des maps !');
				});
			}
			else
			{
				if (data.M != '')
					alert_wyca(data.M);
				else
					alert_wyca(wycaApi.AnswerCodeToString(data.A));
				
				$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
				$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
				$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
				$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
				$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
			}
		});
		
		
    });
	
	$('#install_by_step_mapping_fin .bResetValueThreshold').click(function(e) {
        e.preventDefault();
		
		$("#threshold_free_slider").val(25);
		$("#threshold_free_slider_elem").slider('value',25);
		$('#threshold_free_output b').text( 25 );
		threshold_free = 25;
		
		$("#threshold_occupied_slider").val(65);
		$("#threshold_occupied_slider_elem").slider('value',65);
		$('#threshold_occupied_output b').text( 65 );
		threshold_occupied = 65;
		
		CalculateMapTrinary();
    });
	
	$('#threshold_free_slider').change(function() {
		$('#threshold_free_output b').text( this.value );
		threshold_free = this.value;
		
		CalculateMapTrinary();
	});
	$('#threshold_occupied_slider').change(function() {
		$('#threshold_occupied_output b').text( this.value );
		threshold_occupied = this.value;
		
		CalculateMapTrinary();
	});
		
	$('#install_by_step_wifi .refresh_wifi').click(function(e) {
		e.preventDefault();		
	});
	
	$( '#install_by_step_wifi tbody' ).on( 'click', 'tr', function(e) {
		e.preventDefault();
		selectedWifi = $(this).data('ssid');
		
		$('#install_by_step_wifi_password .wifi_connexion_error').html('');
		$('#install_by_step_wifi_password .install_by_step_wifi_password_save').show();
		$('#install_by_step_wifi_password .wifi_connexion_progress').hide();

		$('#install_by_step_wifi .set_passwd_wifi').click();
	});
	
	$('#install_by_step_wifi_password .install_by_step_wifi_password_save').click(function(e) {
        e.preventDefault();
		
		$('#install_by_step_wifi_password .install_by_step_wifi_password_save').hide();
		$('#install_by_step_wifi_password .wifi_connexion_progress').show();
		$('#install_by_step_wifi_password .wifi_connexion_error').html('');
		
		wycaApi.WifiConnection(selectedWifi, $('#install_by_step_wifi_password .i_wifi_passwd_name').val(), function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_by_step_wifi_password .wifi_connexion_error').html(data.M);
			}
			else
			{
				$('#install_by_step_wifi_password .skip_wifi').click();
				$('#install_by_step_wifi_password .wifi_connexion_error').html('');
			}
			$('#install_by_step_wifi_password .install_by_step_wifi_password_save').show();
			$('#install_by_step_wifi_password .wifi_connexion_progress').hide();
		});
    });
	
	$("#threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#threshold_occupied_output b").text(slideEvt.value); $("#threshold_occupied_slider").val(slideEvt.value); });
	$("#threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#threshold_free_slider_elem").on("slide", function(slideEvt) { $("#threshold_free_output b").text(slideEvt.value); $("#threshold_free_slider").val(slideEvt.value); });
	
	$('#install_by_step_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		data = {};
		
		data.forbiddens = forbiddens;
		$.each(data.forbiddens, function(indexInArray, forbidden){
			if (forbidden.id_area >= 300000)
			{
				data.forbiddens[indexInArray].id_area = -1;
			}
		});
		data.areas = areas;
		$.each(data.areas, function(indexInArray, area){
			if (area.id_area >= 300000)
			{
				data.areas[indexInArray].id_area = -1;
			}
		});
		data.gommes = gommes;
		data.docks = docks;
		$.each(data.docks, function(indexInArray, dock){
			if (dock.id_docking_station >= 300000)
			{
				data.docks[indexInArray].id_docking_station = -1;
			}
		});
		data.pois = pois;
		$.each(data.pois, function(indexInArray, poi){
			if (poi.id_poi >= 300000)
			{
				data.pois[indexInArray].id_poi = -1;
			}
		});
		
		console.log(JSON.stringify(data));
		
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				/*
				if (navLaunched && id_map == current_id_map)
				{
					wycaApi.NavigationReloadMaps(function(e) { if (e.A != wycaApi.AnswerCode.NO_ERROR) console.error(wycaApi.AnswerCodeToString(data.A)+ " " + data.M); });	
				}
				*/
				alert_wyca("Save ok");
			}
			else
			{
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
});

function InitTops()
{
	$('.install_by_step_tops_loading').show();
	$('#install_by_step_tops .tuiles').html('');
	if (wycaApi.socketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			console.log(data);
			$.each(data.D,function(index, value){
				$('#install_by_step_tops .tuiles').append('<li class="col-xs-4">'+
				'	<a class="is_checkbox '+(value.available?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" href="#">'+
				'		<i class="fa fa-check"></i>'+
				'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
				'	</a>'+
				'</li>');
			});
			$('.install_by_step_tops_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTops, 500);
	}
}


function InitTopsActive()
{
	$('.install_by_step_top_loading').show();
	$('#install_by_step_top .tuiles').html('');
	if (wycaApi.socketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			$.each(data.D,function(index, value){
				if (value.available)
				{
					$('#install_by_step_top .tuiles').append('<li class="col-xs-4 bTop' + value.id_top + '">'+
					'	<a href="#" class="set_top button_goto anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" data-goto="install_by_step_check">'+
					'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
					'	</a>'+
					'</li>');
				}
			});
			$('.install_by_step_top_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsActive, 500);
	}
}


function InitInstallWifiPage()
{
	if (wycaApi.socketAuthed)
	{
		wycaApi.GetWifiList(function(data) {
			$('#install_by_step_wifi tr').hide();
			if (data.D.length > 0)
			{
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if ($('#install_by_step_wifi .wifi'+value.bssid).length > 0)
					{
						$('#install_by_step_wifi tr').show();
						$('#install_by_step_wifi .wifi'+value.bssid+' img').attr('src', 'assets/images/signal-'+signal+'.png');
						if (value.state == 'active')
						{
							$('#install_by_step_wifi tr').removeClass('active');
							$('#install_by_step_wifi .wifi'+value.bssid).addClass('active');
						}
					}
					else
					{
						$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}
				});
			}
		});
		
		if ($('#install_by_step_wifi').is(':visible'))
			setTimeout(InitInstallWifiPage, 3000);
	}
	else
	{
		setTimeout(InitInstallWifiPage, 500);
	}
}

function StartAnimCheckComposantInstall()
{
	if ($('#install_by_step_check .test').length > 0)
	{
		$('#install_by_step_check .test').addClass('checked');
		$('#install_by_step_check .test').removeClass('test');
		
		if ($('#install_by_step_check div.is_checkbox:not(".checked")').length > 0)
		{
			$('#install_by_step_check div.is_checkbox:not(".checked")').first().addClass('test');
			setTimeout(StartAnimCheckComposantInstall, Math.floor(Math.random() * 1500 + 500));
		}
		else
		{
			$('#install_by_step_check .install_by_step_check_next').show();
		}
	}	
}

function alert_wyca(text)
{
	$('#alert_wyca p').html(text);
	$('#alert_wyca').show();
}

var finalMapData = '';

var timerCreateMap = 5;
var timerCreateMapCurrent = 5;
var timeoutTimerCreateInterval = null;

function NextTimerCreateMap()
{
	if (timerCreateMapCurrent < 0)
	{
		setTimeout(function() {
			$('.progressStartMapping').hide();
			$('.bMappingStop').show();
			$('.mapping_view').show();
				
			img = document.getElementById("install_by_step_mapping_img_map_saved");
			img.src = "assets/images/vide.png";
			
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
		if (timerCreateMapCurrent == 5 && timerCreateMap == 10) // Stop navigation before
		{
			wycaApi.MappingStart(function(r) { 
				mappingStarted = true;
			});
			
			$('.progressStartMapping h3').html(textStartMapping);
		}
		
		valeur = 100-parseInt(timerCreateMapCurrent / timerCreateMap * 100);

		$('.createMapProgress .progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur); 
	
		timerCreateMapCurrent -= 0.1;	
		timerCreateMapCurrent = parseInt(timerCreateMapCurrent*10)/10;
		
		setTimeout(NextTimerCreateMap, 100);
	}
}

var threshold_free = 25;
var threshold_occupied = 65;

var color_free = 255;
var color_occupied = 0;
var color_unknow = 205;

var timeoutCalcul = null;

var img;
var canvas;

var width = 0;
var height = 0;


function CalculateMapTrinary()
{
	if (timeoutCalcul != null)
	{
		clearTimeout(timeoutCalcul);
		timeoutCalcul = null;
	}
	timeoutCalcul = setTimeout(CalculateMapTrinaryDo, 500);
}

function CalculateMapTrinaryDo()
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
			if (color == color_unknow)
				buffer[pos+3] = 0;           // set alpha channel
			else
				buffer[pos+3] = 255;           // set alpha channel
		}
	}
	
	var canvasDessin = document.getElementById('canvas_result_trinary'),
	ctx = canvasDessin.getContext('2d');
	
	var idata = ctx.createImageData(width, height);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
}


function DisplayError(text)
{
	 $('.popup_error .panel-body').html(text);
	 $('.popup_error').show();
}
