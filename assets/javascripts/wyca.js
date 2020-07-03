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


var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh+'px');

window.addEventListener('resize', () => {
  // We execute the same script as before
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh+'px');
});

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


$(document).ready(function(e) {
	
	history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:'' }, $('.menu_groupe .active').html(), "/#"+$('.menu_groupe .active').html());
	
	$('.popup_error .panel-heading .fa-times').click(function(e) {
        e.preventDefault();
		$(this).closest('.popup_error').hide();
    });
	
	
	var elementCss = {
		'perspective': 'outerWidth',
		"transition": "all .2s ease-out"
	  };
	$('ul.tuiles a').css(elementCss);
	
	$('section:not(".active") .anim_tuiles').css({ transform: 'rotatey(90deg)', "z-index": "0" });
	
	$('body').on('click', '.is_checkbox', function(e) {
        e.preventDefault();
		if (!$(this).hasClass('no_update'))
	        $(this).toggleClass('checked');
    });
	
	$('#bCloseAlertWyca').click(function(e) {
        e.preventDefault();
		$('#alert_wyca p').html('');
		$('#alert_wyca').hide();
    });
	
	$('#bCloseSuccessWyca').click(function(e) {
        e.preventDefault();
		$('#success_wyca p').html('');
		$('#success_wyca').hide();
    });
	
	$('.bUndock').click(function(e) {
        e.preventDefault();
		wycaApi.Undock(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				alert_wyca(wycaApi.AnswerCodeToString(data.A));
			}
		});
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
		
		next = $(this).data('goto');
		if (next == 'install_by_step_wifi') InitInstallWifiPageByStep();
		if (next == 'install_by_step_tops') InitTopsByStep();
		if (next == 'install_by_step_top') InitTopsActiveByStep();
		if (next == 'install_by_step_config') GetConfigurationsByStep();
		if (next == 'install_by_step_manager') GetManagersByStep();
		if (next == 'install_by_step_service_book') GetServiceBooksByStep();
		
		
		if (next == 'install_normal_setup_tops') InitTopsNormal();
		if (next == 'install_normal_setup_top') InitTopsActiveNormal();
		if (next == 'install_normal_setup_vehicule') GetConfigurationsNormal();
		if (next == 'install_normal_setup_wifi') InitInstallWifiPageNormal();
		if (next == 'install_normal_manager') GetManagersNormal();
		if (next == 'install_normal_service_book') GetServiceBooksNormal();
		if (next == 'install_normal_edit_map') GetInfosCurrentMapNormal();
		
		if (next == 'manager_edit_map') GetInfosCurrentMapManager();
		if (next == 'manager_top') InitTopsActiveManager();
		if (next == 'manager_users') GetUsers();
		if (next == 'user_edit_map') GetInfosCurrentMapUser();
		
		
		
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
		
		
		InitJoystick();
    });
});


function GetServiceBooksNormal()
{
	$('.install_normal_service_book_loading').show();
	$('#install_normal_service_book .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetServiceBooksList(function(data) {
			
			$('#install_normal_service_book .list_service_books').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				
				var date = new Date(value.date * 1000);
				
				$('#install_normal_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+date.toLocaleDateString("en-US") +'</div>'+
						'	<div class="title">'+value.title+'</div>'+
						'	<div class="comment">'+value.comment+'</div>'+
						'</li>'
						);
			});
			
			$('.install_normal_service_book_loading').hide();
			$('#install_normal_service_book .loaded').show();
		});
	}
	else
	{
		setTimeout(GetServiceBooksNormal, 500);
	}
}

function GetServiceBooksByStep()
{
	$('.install_by_step_service_book_loading').show();
	$('#install_by_step_service_book .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetServiceBooksList(function(data) {
			
			$('#install_by_step_service_book .list_service_books').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				$('#install_by_step_service_book .list_service_books').append('' +
						'<li>'+
						'	<div class="title">'+value.title+'</div>'+
						'	<div class="comment">'+value.comment+'</div>'+
						'</li>'
						);
			});
			
			$('.install_by_step_service_book_loading').hide();
			$('#install_by_step_service_book .loaded').show();
		});
	}
	else
	{
		setTimeout(GetServiceBooksByStep, 500);
	}
}

function GetUsers()
{
	$('.manager_users_loading').show();
	$('#manager_users .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#manager_users .list_users').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == 4)
				{
					$('#manager_users .list_users').append('' +
						'<li id="manager_users_list_user_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="societe">'+value.company+'</span><br /><span class="prenom">'+value.firstname+'</span> <span class="nom">'+value.lastname+'</span><br /><span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bUserDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bUserEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.manager_users_loading').hide();
			$('#manager_users .loaded').show();
		});
	}
	else
	{
		setTimeout(GetUsers, 500);
	}

}

function GetManagersNormal()
{
	$('.install_normal_manager_loading').show();
	$('#install_normal_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#install_normal_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == 3)
				{
					$('#install_normal_manager .list_managers').append('' +
						'<li id="install_normal_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="societe">'+value.company+'</span><br /><span class="prenom">'+value.firstname+'</span> <span class="nom">'+value.lastname+'</span><br /><span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_normal_manager_loading').hide();
			$('#install_normal_manager .loaded').show();
		});
	}
	else
	{
		setTimeout(GetManagersNormal, 500);
	}
}

function GetManagersByStep()
{
	$('.install_by_step_manager_loading').show();
	$('#install_by_step_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#install_by_step_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == 3)
				{
					$('#install_by_step_manager .list_managers').append('' +
						'<li id="install_by_step_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="societe">'+value.company+'</span><br /><span class="prenom">'+value.firstname+'</span> <span class="nom">'+value.lastname+'</span><br /><span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_by_step_manager_loading').hide();
			$('#install_by_step_manager .loaded').show();
		});
	}
	else
	{
		setTimeout(GetManagersByStep, 500);
	}
}

function GetConfigurationsNormal()
{
	$('.install_normal_setup_vehicule_loading').show();
	$('#install_normal_setup_vehicule .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#install_normal_setup_vehicule #install_normal_setup_vehicule_i_level_min_gotocharge').val(data.D.EBL);
			$('#install_normal_setup_vehicule #install_normal_setup_vehicule_i_level_min_dotask').val(data.D.MBL);
			$('.install_normal_setup_vehicule_loading').hide();
			$('#install_normal_setup_vehicule .loaded').show();
		});
	}
	else
	{
		setTimeout(GetConfigurationsNormal, 500);
	}
}

function GetConfigurationsByStep()
{
	$('.install_by_step_config_loading').show();
	$('#install_by_step_config .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#install_by_step_config #install_by_step_config_i_level_min_gotocharge').val(data.D.EBL);
			$('#install_by_step_config #install_by_step_config_i_level_min_dotask').val(data.D.MBL);
			$('.install_by_step_config_loading').hide();
			$('#install_by_step_config .loaded').show();
		});
	}
	else
	{
		setTimeout(GetConfigurationsByStep, 500);
	}
}

function InitTopsNormal()
{
	$('.install_normal_setup_tops_loading').show();
	$('#install_normal_setup_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			console.log(data);
			$.each(data.D,function(index, value){
				$('#install_normal_setup_tops .tuiles').append('<li class="col-xs-4">'+
				'	<a class="is_checkbox '+(value.active?'active no_update':'')+' '+(value.available?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" href="#">'+
				'		<i class="fa fa-check"></i>'+
				'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
				'	</a>'+
				'</li>');
			});
			$('.install_normal_setup_tops_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsNormal, 500);
	}
}


function InitTopsActiveManager()
{
	$('.manager_top_loading').show();
	$('#manager_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			console.log(data);
			$.each(data.D,function(index, value){
				if (value.available)
				{
					$('#manager_top .tuiles').append('<li class="col-xs-4 bTop' + value.id_top + '">'+
					'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
					'		<i class="fa fa-check"></i>'+
					'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
					'	</a>'+
					'</li>');
				}
			});
			$('.manager_top_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsActiveManager, 500);

	}
}

function InitTopsActiveNormal()
{
	$('.install_normal_setup_top_loading').show();
	$('#install_normal_setup_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			console.log(data);
			$.each(data.D,function(index, value){
				if (value.available)
				{
					$('#install_normal_setup_top .tuiles').append('<li class="col-xs-4 bTop' + value.id_top + '">'+
					'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
					'		<i class="fa fa-check"></i>'+
					'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
					'	</a>'+
					'</li>');
				}
			});
			$('.install_normal_setup_top_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsActiveNormal, 500);

	}
}

function InitTopsByStep()
{
	$('.install_by_step_tops_loading').show();
	$('#install_by_step_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
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
		setTimeout(InitTopsByStep, 500);
	}
}


function InitTopsActiveByStep()
{
	$('.install_by_step_top_loading').show();
	$('#install_by_step_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
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
		setTimeout(InitTopsActiveByStep, 500);

	}
}


function InitInstallWifiPageNormal()
{
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetWifiList(function(data) {
			$('#install_normal_setup_wifi tr').hide();
			if (data.D.length > 0)
			{
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if ($('#install_normal_setup_wifi .wifi'+value.bssid).length > 0)
					{
						$('#install_normal_setup_wifi tr').show();
						$('#install_normal_setup_wifi .wifi'+value.bssid+' img').attr('src', 'assets/images/signal-'+signal+'.png');
						if (value.state == 'active')
						{
							$('#install_normal_setup_wifi tr').removeClass('active');
							$('#install_normal_setup_wifi .wifi'+value.bssid).addClass('active');
						}
					}
					else
					{
						$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}
				});
			}
		});
		
		if ($('#install_normal_wifi').is(':visible'))
			setTimeout(InitInstallWifiPageNormal, 3000);
	}
	else
	{
		setTimeout(InitInstallWifiPageNormal, 500);
	}
}

function InitInstallWifiPageByStep()
{
	if (wycaApi.websocketAuthed)
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
			setTimeout(InitInstallWifiPageByStep, 3000);
	}
	else
	{
		setTimeout(InitInstallWifiPageByStep, 500);
	}
}


function alert_wyca(text)
{
	$('#alert_wyca p').html(text);
	$('#alert_wyca').show();
}


function success_wyca(text)
{
	$('#success_wyca p').html(text);
	$('#success_wyca').show();
}


function DisplayError(text)
{
	 $('.popup_error .panel-body').html(text);
	 $('.popup_error').show();
}
