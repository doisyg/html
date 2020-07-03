
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
});
