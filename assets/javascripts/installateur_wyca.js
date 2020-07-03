
$(document).ready(function(e) {
	
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
							'	<a href="#" class="bManagerDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
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
	
	$('#pages_install_normal a.bImportTopDo').click(function(e) {
        e.preventDefault();
		
		$('.modalImportTop_loading').hide();
		$('.modalImportTop_content').show();
		
		file = $('#pages_install_normal .file_import_top')[0].files[0];
		var reader = new FileReader();
		reader.onload = function(event) { 
			wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('.modalImportTop_loading').hide();
					$('.modalImportTop_content').show();
					
					$('#pages_install_normal .modalImportTop').modal('hide');
					InitTopsNormal();
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
    });
	
	$('#pages_install_normal a.import_top').click(function(e) {
        e.preventDefault();
		
		$('.modalImportTop_loading').hide();
		$('.modalImportTop_content').show();
		
		$('#pages_install_normal .modalImportTop').modal('show');
	});
	$('#pages_install_normal a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		$('#pages_install_normal .install_by_step_top li').hide();
		$(this).parent().find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_install_normal .install_by_step_top .bTop'+$(this).data('id_top')).show();
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
				}
				else
				{
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						success_wyca('Recovery done !');
					}
					else
					{
						console.log(JSON.stringify(data)); 
						text = wycaApi.AnswerCodeToString(data.A);
						if (data.M != '') text += '<br />'+data.M;
						alert_wyca(text);
					}
				}
			});
		}
    });
	
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