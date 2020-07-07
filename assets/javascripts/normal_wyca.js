$(document).ready(function(e) {
	
	$('#install_normal_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!normalCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
		}
		else
		{
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
						window.location.href = 'https://elodie.wyca-solutions.com';
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


var threshold_free_normal = 25;
var threshold_occupied_normal = 65;

var color_free_normal = 255;
var color_occupied_normal = 0;
var color_unknow_normal = 205;

var timeoutCalcul_normal = null;

var img_normal;
var canvas_normal;

var width_normal = 0;
var height_normal = 0;


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