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
	
	if ($('#install_by_step_check').is(':visible')) setTimeout(StartAnimCheckComposantInstall, 2000);
	
	var elementCss = {
		'perspective': 'outerWidth',
		"transition": "all .2s ease-out"
	  };
	$('ul.tuiles a').css(elementCss);
	
	$('section:not(".active") .anim_tuiles').css({ transform: 'rotatey(90deg)', "z-index": "0" });
	
	$('.is_checkbox').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('checked');
    });
	
	$('#bCloseAlertWyca').click(function(e) {
        e.preventDefault();
		$('#alert_wyca p').html('');
		$('#alert_wyca').hide();
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
	
	$('.button_goto').click(function(e) {
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
			$.ajax({
				type: "POST",
				url: 'ajax/install_by_step_save_tops.php',
				data: { 
					id_tops: listAvailableTops
				},
				dataType: 'json',
				success: function(data) {
					if (data.error != '')
						alert_wyca(textSelectOnOrMoreTops);
					else if (data.next_step == 'select')
						$('#pages_install_by_step a.save_tops_next_select').click();
					else
					{
						$('#pages_install_by_step a.save_tops_next_check').click();
						setTimeout(StartAnimCheckComposantInstall, 2000);
					}
				},
				error: function(e) {
					alert(e.responseText);
				}
			});
		}
    });
	
	
	$('#pages_install_by_step a.set_top').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_set_top.php',
			data: { 
				id_top: $(this).data('id_top')
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
			$.ajax({
				type: "POST",
				url: 'ajax/install_by_step_site.php',
				data: { 
					name : $('#pages_install_by_step .i_site_name').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.error != '')
						alert_wyca(textIndicateAName);
					else
						$('#pages_install_by_step a.install_by_step_site_next').click();
				},
				error: function(e) {
					alert(e.responseText);
				}
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
            img.src = 'data:image/png;base64,' + data.final_map.data;
			
			finalMapData = 'data:image/png;base64,' + data.final_map.data;
			
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
		alert('A FAIRE'); return;
		if ($('.form_mapping_name').val() == '')
		{
			alert(textIndicateAName);
			e.preventDefault();
		}
		else
		{
			var canvasDessin = document.getElementById('canvas_result');
		
			$('#bMappingCancelMap2').hide();
			$('#bMappingSaveMap').hide();
		
			$('#form_mapping_image').val(finalMapData);
			//$('#form_mapping_image_tri').val(finalMapData);
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
				  
				  	var img = document.getElementById("img_fin_map_saved");
        			img.src = "assets/images/vide.png";
				},
				error: function(e) {
					
					var img = document.getElementById("img_fin_map_saved");
        			img.src = "assets/images/vide.png";
					
					alert(e.responseText);
					$('#modalFinCreateMap').modal('hide');
				}
			});
			
			
		}
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
		
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_wifi_connect.php',
			data: {
				'ssid': selectedWifi,
				'passwd': $('#install_by_step_wifi_password .i_wifi_passwd_name').val()
			},
			dataType: 'json',
			success: function(data) {
				if (data.error)
				{
					$('#install_by_step_wifi_password .wifi_connexion_error').html(data.message);
				}
				else
				{
					$('#install_by_step_wifi_password .skip_wifi').click();
					$('#install_by_step_wifi_password .wifi_connexion_error').html('');
				}
				
				$('#install_by_step_wifi_password .install_by_step_wifi_password_save').show();
				$('#install_by_step_wifi_password .wifi_connexion_progress').hide();
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
    });
	
	$("#threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#threshold_occupied_output b").text(slideEvt.value); $("#threshold_occupied_slider").val(slideEvt.value); });
	$("#threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#threshold_free_slider_elem").on("slide", function(slideEvt) { $("#threshold_free_output b").text(slideEvt.value); $("#threshold_free_slider").val(slideEvt.value); });
	
});


function InitInstallWifiPage()
{
	$.ajax({
		type: "POST",
		url: 'ajax/install_by_step_get_wifi.php',
		data: { },
		dataType: 'json',
		success: function(data) {
			if (data.list.length > 0)
			{
				$('#install_by_step_wifi tr').hide();
				$.each(data.list,function(index, value){
					signal = parseInt(value.signal/5);
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
						$('.tbody_wifi').append('<tr data-ssid="'+value.bssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}
				});
			}
		},
		error: function(e) {
			alert(e.responseText);
		}
	});
	
	if ($('#install_by_step_wifi').is(':visible'))
		setTimeout(InitInstallWifiPage, 3000);
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
var id_map_last = -1;

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