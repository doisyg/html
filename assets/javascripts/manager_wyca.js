
$(document).ready(function(e) {
	$('#manager_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		
		$('#manager_recovery .bRecovery').addClass('disabled');
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_recovery .bRecovery').removeClass('disabled');
				success_wyca('Recovery done !');
			}
			else
			{
				$('#manager_recovery .bRecovery').removeClass('disabled');
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
				$('#manager_recovery .bRecovery').removeClass('disabled');
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
    });
	
	$('#manager_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!managerCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
		}
		else
		{
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#manager_test_map .list_test li').remove();
				$('#manager_test_map .manager_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
				
			console.log(data);
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca("Map saved !");
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapManager();
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
	
	$('#manager_top' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();
		
		wycaApi.on('onSetActiveTopResult', function(data) {
			
			InitTopsActiveManager();
			$('#manager_top .modalSetActiveTop').modal('hide');
			
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
				$('#manager_top .modalSetActiveTop').modal('show');
				$('#manager_top .modalSetActiveTop a').addClass('disabled');
				timerSetActiveTop = 10;
				timerSetActiveTopCurrent = 10;
				$('#manager_top .progressSetActiveTop').show();
				NextTimerSetActiveTop();
			}
			else
			{
				InitTopsActiveManager();
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}	
		});		
	});
	
	
	$('#manager_users .bAddUser').click(function(e) {
	
		$('#manager_users .modalUser #manager_users_i_id_user').val(-1);
		$('#manager_users .modalUser #manager_users_i_user_email').val('');
		$('#manager_users .modalUser #manager_users_i_user_societe').val('');
		$('#manager_users .modalUser #manager_users_i_user_prenom').val('');
		$('#manager_users .modalUser #manager_users_i_user_nom').val('');
		$('#manager_users .modalUser #manager_users_i_user_password').val('');
		$('#manager_users .modalUser #manager_users_i_user_cpassword').val('');
		
		$('#manager_users .modalUser').modal('show');
	});
	
	$('#manager_users .modalUser #manager_users_bUserSave').click(function(e) {
        e.preventDefault();
		
		if ($('#manager_users .modalUser #manager_users_i_user_password').val() != $('#manager_users .modalUser #manager_users_i_user_cpassword').val())
		{
			alert_wyca('Invalid password or confirm');
		}
		else if ($('#manager_users .modalUser #manager_users_i_user_societe').val() == "" )
		{
			alert_wyca('Company is required');
		}
		else if ($('#manager_users .modalUser #manager_users_i_user_prenom').val() == "" )
		{
			alert_wyca('Firstname is required');
		}
		else if ($('#manager_users .modalUser #manager_users_i_user_nom').val() == "" )
		{
			alert_wyca('Lastname is required');
		}
		else
		{
			json_user = {
				"id_user": parseInt($('#manager_users .modalUser #manager_users_i_id_user').val()),
				"company": $('#manager_users .modalUser #manager_users_i_user_societe').val(),
				"lastname": $('#manager_users .modalUser #manager_users_i_user_nom').val(),
				"firstname": $('#manager_users .modalUser #manager_users_i_user_prenom').val(),
				"email": $('#manager_users .modalUser #manager_users_i_user_email').val(),
				"pass": $('#manager_users .modalUser #manager_users_i_user_password').val(),
				"id_group_user": 4,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#manager_users_list_user_elem_'+id_user).length > 0)
					{
						$('#manager_users_list_user_elem_'+id_user+' span.email').html(json_user.email);
						$('#manager_users_list_user_elem_'+id_user+' span.societe').html(json_user.company);
						$('#manager_users_list_user_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#manager_users_list_user_elem_'+id_user+' span.nom').html(json_user.lastname);
					}
					else
					{
						$('#manager_users .list_users').append('' +
							'<li id="manager_users_list_user_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="societe">'+json_user.company+'</span><br /><span class="prenom">'+json_user.firstname+'</span> <span class="nom">'+json_user.lastname+'</span><br /><span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bUserDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bUserEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
					}
					
					$('#manager_users .modalUser').modal('hide');
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
	
	$(document).on('click', '#manager_users .bUserDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_users_list_user_elem_'+id_user_to_delete).remove();
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
	
	$(document).on('click', '#manager_users .bUserEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#manager_users .modalUser #manager_users_i_id_user').val(id_user);
		$('#manager_users .modalUser #manager_users_i_user_email').val($('#manager_users_list_user_elem_'+id_user+' span.email').html());
		$('#manager_users .modalUser #manager_users_i_user_societe').val($('#manager_users_list_user_elem_'+id_user+' span.societe').html());
		$('#manager_users .modalUser #manager_users_i_user_prenom').val($('#manager_users_list_user_elem_'+id_user+' span.prenom').html());
		$('#manager_users .modalUser #manager_users_i_user_nom').val($('#manager_users_list_user_elem_'+id_user+' span.nom').html());
		$('#manager_users .modalUser #manager_users_i_user_password').val('');
		$('#manager_users .modalUser #manager_users_i_user_cpassword').val('');
		
		$('#manager_users .modalUser').modal('show');
	});
});
