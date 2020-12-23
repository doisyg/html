
$(document).ready(function(e) {
	$('#user_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		
		$('#user_recovery .bRecovery').addClass('disabled');
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#user_recovery .bRecovery').removeClass('disabled');
				success_wyca(textRecoveryDone);
			}
			else
			{
				$('#user_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				$('#user_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#user_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!userCanChangeMenu)
		{
			alert_wyca(textConfirmActiveElement);
		}
		else
		{
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#user_test_map .list_test li').remove();
				$('#user_test_map .user_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
				
			console.log(data);
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca(textMapSaved);
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapUser();
					/*
					if (navLaunched && id_map == current_id_map)
					{
						wycaApi.NavigationReloadMaps(function(e) { if (e.A != wycaApi.AnswerCode.NO_ERROR) console.error(wycaApi.AnswerCodeToString(data.A)+ " " + data.M); });	
					}
					*/
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
});
