// JavaScript Document
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var minStokeWidth = 1;
var maxStokeWidth = 5;

var currentUpdateMode = 'manuel';
var currentIdZoneSelected = 0;
var currentRegion = '';
var currentItem = '';
var currentItemNum = 20;

var canvas;
var dessin;

var currentAction = '';
var currentStep = '';

var svg;

var previewDisplayed = false;
var currentRayonId = -1;
var currentRayonIndex;
var currentPathIndex = -1;
var saveCurrentPath = null;
var saveCurrentShelf = null;
var currentRayonUpdated = false;
var currentPolyIndex = -1;
var saveCurrentPoly = null;
var currentTextIndex = -1;
var saveCurrentText = null;
var currentInfoIndex = -1;
var saveCurrentInfo = null;
var currentIdJob = -1;
var currentIdMultiPath = -1;

var downOnZoomClick = false;
var downOnSVG = false;
var downOnSVG_x = 0;
var downOnSVG_y = 0;
var downOnSVG_x_scroll = 0;
var downOnSVG_y_scroll = 0;
var downOnMovable = false;
var movableDown = null;
var currentPolyPoints = Array();
var ctrlZ = false;
var previewInProgress = false;
var displayHelpAddShelf = true;

var canChangeMenu = true;

var currentSelectedItem = Array();
var ctrlClickIsPressed = false;
var cPressed = false;

var clickSelectSVG = false;
var clickSelectSVG_x = 0;
var clickSelectSVG_y = 0;
var clickSelectSVG_x_last = -1;
var clickSelectSVG_y_last = -1;

var currentModePath;

var timerSaveUserOptions = null;
var timerOpenInfo = null;
var id_info_to_open = -1;
var info_to_open_x = -1;
var info_to_open_y = -1;

var intervalRefreshConn = null;

var timerCantChange = null;
function AvertCantChange()
{
	$('#bModalCancelEdit').click();
}

function CloseSelect()
{
	currentAction = '';
	currentStep = '';
}


function HideCurrentMenu()
{
	/*
	if (currentAction == 'export') CloseExport();
	if (currentAction == 'jobs') CloseJobs();
	if (currentAction == 'select') CloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	currentAction = '';
	currentStep = '';
}


function HideCurrentMenuNotSelect()
{
	if (currentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	currentAction = '';
	currentStep = '';
}

function SetModeSelect()
{
	$('body').addClass('select');
	currentAction = 'select';
	currentStep = '';
}

$(document).ready(function() {
	
	
	if ($( window ).width() > 1920)
	{
		minStokeWidth = 3;
		maxStokeWidth = 7;
	}
		
	$('body').addClass('no_current');
	
  	if (!isChrome)
	{
		window.addEventListener('wheel', function (e) {
			// Firefox
		  if (event.ctrlKey) {
				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
				
				x_decallage = (e.offsetX - document.getElementById('container_all').scrollLeft);
				y_decallage = (e.offsetY - document.getElementById('container_all').scrollTop);
				
				x_centre = (e.offsetX) / zoom_carte;
				y_centre = (e.offsetY) / zoom_carte;
				
				if (e.deltaY > 0)
				{
					zoom_carte--;
					if (zoom_carte < 1) zoom_carte = 0.5;
					AppliquerZoom();
				}
				else
				{
					zoom_carte++;
					if (zoom_carte % 1 == 0.5) zoom_carte = parseInt(zoom_carte);
					if (zoom_carte>10) zoom_carte = 10;
					AppliquerZoom();
				}
				
				$("#zoom_slider").slider('value',zoom_carte);
				handle.text( zoom_carte );
				
				x_centre = x_centre * zoom_carte;
				y_centre = y_centre * zoom_carte;
							
				w = $('#container_all').width();
				h = $('#container_all').height();
				
				wAll = $('#all').width();
				hAll = $('#all').height();
				
				wOver = $('#container_all').width();
				hOver = $('#container_all').height();
				
				wZoom = $('#zone_zoom').width();
				hZoom = $('#zone_zoom').height();
				
				
				x_centre -= x_decallage;
				y_centre -= y_decallage;
				
				$('#container_all').scrollLeft(x_centre);
				$('#container_all').scrollTop(y_centre);
					
				t = document.getElementById('container_all').scrollTop;
				l = document.getElementById('container_all').scrollLeft;
						
				$('#zone_zoom').css('top', t/hAll * h - 1);
				$('#zone_zoom').css('left', l/wAll * w -1);
		  }
		});
	}
	else
	{
		window.addEventListener('mousewheel', function(e){
			if (e.ctrlKey)
			{
				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
				
				x_decallage = (e.offsetX - document.getElementById('container_all').scrollLeft);
				y_decallage = (e.offsetY - document.getElementById('container_all').scrollTop);
				
				x_centre = (e.offsetX) / zoom_carte;
				y_centre = (e.offsetY) / zoom_carte;
				
				if (e.deltaY > 0)
				{
					zoom_carte--;
					if (zoom_carte < 1) zoom_carte = 0.5;
					AppliquerZoom();
				}
				else
				{
					zoom_carte++;
					if (zoom_carte % 1 == 0.5) zoom_carte = parseInt(zoom_carte);
					if (zoom_carte>10) zoom_carte = 10;
					AppliquerZoom();
				}
				
				$("#zoom_slider").slider('value',zoom_carte);
				handle.text( zoom_carte );
				
				x_centre = x_centre * zoom_carte;
				y_centre = y_centre * zoom_carte;
							
				w = $('#container_all').width();
				h = $('#container_all').height();
				
				wAll = $('#all').width();
				hAll = $('#all').height();
				
				wOver = $('#container_all').width();
				hOver = $('#container_all').height();
				
				wZoom = $('#zone_zoom').width();
				hZoom = $('#zone_zoom').height();
				
				
				x_centre -= x_decallage;
				y_centre -= y_decallage;
				
				$('#container_all').scrollLeft(x_centre);
				$('#container_all').scrollTop(y_centre);
					
				t = document.getElementById('container_all').scrollTop;
				l = document.getElementById('container_all').scrollLeft;
						
				$('#zone_zoom').css('top', t/hAll * h - 1);
				$('#zone_zoom').css('left', l/wAll * w -1);
			}
		}, { passive: false });
	}
	
	
	svg = document.querySelector('#svg');
	InitSVG();
	
	$('*').mouseup(function(e) {
        //e.preventDefault();
		downOnZoomClick = false;
		downOnSVG = false;
		downOnMovable = false;
		
		if (clickSelectSVG && currentAction == 'select' && clickSelectSVG_x_last != -1)
		{
			$('.selection').remove();
			
			x1 = (clickSelectSVG_x * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			y1 = (($('#mapBox').height() - clickSelectSVG_y) * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			x2 = (clickSelectSVG_x_last * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			y2 = (($('#mapBox').height() - clickSelectSVG_y_last) * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			
			if (x1 < x2){	xRos1 = x1; xRos2 = x2; }
			else { xRos1 = x2; xRos2 = x1; }
			
			if (y1 < y2) { yRos1 = y1; yRos2 = y2; }
			else { yRos1 = y2; yRos2 = y1; }
			
			// On cherche ^les éléments qui ont au moins un point dans la sélection
			if (!e.ctrlKey)
			{
				currentSelectedItem = Array();
			}
						
			
			$.each(polys, function( index, poly ) {
				selected = false;
				
				$.each(poly.points, function( index, point ) {
					if (xRos1 <= point.x && point.x <= xRos2 && yRos1 <= point.y && point.y <= yRos2)
						selected = true;
				});
				
				if (selected)
				{
					trouve = false;
					cur_id = poly.id_area;
					$.each(currentSelectedItem, function(index, value){
						if (value.type == 'poly' && value.id == cur_id)
						{
							trouve = true;
							currentSelectedItem.splice(index, 1);
							return false;
						}
					});
					
					if (!trouve)
						currentSelectedItem.push({'type':'poly', 'id':poly.id_area});
				}
				
			});
			
			clickSelectSVG = false;
			clickSelectSVG_x_last = -1;
			clickSelectSVG_y_last = -1;
			
			ResfreshMultipleSelection();
			HideCurrentMenuNotSelect();
		}
		clickSelectSVG = false;
		
    });
	
	$('*').keyup(function(e) {
		if (!e.altKey)
			$('.btn-group .badge').hide();
		if (!e.ctrlKey) ctrlClickIsPressed = false;
		if (e.keyCode == 67) // c
		{
			cPressed = false;
		}
	});
	
	var downOnLabeledElem = undefined;
	$(document).on('mousedown', '.movable', function(e) {
		if ($(this).data('label_active') != undefined)
		{
			downOnLabeledElem = $(this);
		}
    });
	
	$(document).on('mouseover', '.movable', function(e) {
		if ($(this).data('label_active') != undefined)
		{
			$($(this).data('label_active')).addClass('active');
		}
    });
	
	$(document).on('mouseup', function(e) {
		if (downOnLabeledElem != undefined && e.toElement.id != downOnLabeledElem.attr('id'))
		{
			$(downOnLabeledElem.data('label_active')).removeClass('active');
			downOnLabeledElem = undefined;
		}
    });	
	$(document).on('mouseout', '.movable', function(e) {
		if ($(this).data('label_active') != undefined)
		{
			$($(this).data('label_active')).removeClass('active');
		}
    });
	
	$(document).on('mousedown', '.movable', function(e) {
		e.preventDefault();
		downOnMovable = true;
		movableDown = $(this);
		
		downOnSVG_x = e.pageX;
		downOnSVG_y = e.pageY;
		
		canChangeMenu = false;
    });
	
	$('#svg').mousedown(function(e) {

       	e.preventDefault();
	    downOnSVG = true;
		downOnSVG_x = e.pageX;
		downOnSVG_y = e.pageY;
		downOnSVG_x_scroll = document.getElementById('container_all').scrollLeft;
		downOnSVG_y_scroll = document.getElementById('container_all').scrollTop;
		
		if (currentAction == 'select')
		{
			clickSelectSVG = true;
			
			clickSelectSVG_x = e.offsetX;
			clickSelectSVG_y = e.offsetY;
		}
		else if (currentAction == 'addPoly' && currentStep=='trace')
		{
			if (e.button != 2)
			{
				x = e.offsetX;
				y = $('#mapBox').height() - e.offsetY;
					
				xRos = (x * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
				yRos = (y * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
				
				
				currentPolyPoints.pop(); // Point du curseur
				currentPolyPoints.push({x:xRos, y:yRos});
				currentPolyPoints.push({x:xRos, y:yRos}); // Point du curseur
				TraceCurrentPoly(currentPolyPoints);
				
				canChangeMenu = false;
			}
		}
    });
	
	$('#svg').on('contextmenu', function (e) {
		if (currentAction == 'addPoly' && currentStep=='trace')
		{
			currentStep = '';
			currentPolyPoints.pop(); // Point du curseur
			TraceCurrentPoly(currentPolyPoints);
			return false;
		}
    });
	
	$('#svg').mouseup(function(e) {
		
	});
	
	$('#svg').mousemove(function(e) {
       e.preventDefault();
	  
	  	if (clickSelectSVG && currentAction == 'select')
		{
			clickSelectSVG_x_last = e.offsetX;
			clickSelectSVG_y_last = e.offsetY;
			
			TraceSection(clickSelectSVG_x, clickSelectSVG_y, clickSelectSVG_x_last, clickSelectSVG_y_last);
		}
	   else if (currentAction == 'addPoly' && currentStep=='trace')
	   {
			x = e.offsetX;
			y = $('#mapBox').height() - e.offsetY;
				
			xRos = (x * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			yRos = (y * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			
			currentPolyPoints[currentPolyPoints.length-1].x = xRos;
			currentPolyPoints[currentPolyPoints.length-1].y = yRos;
			TraceCurrentPoly(currentPolyPoints);
	   }
	   else if (currentAction == 'mesure' && currentStep=='start_ok')
	   {
		   rx1 = parseFloat($('#mesureStartX').html());
		   ry1 = parseFloat($('#mesureStartY').html());
		   
		    rx2 = e.offsetX;
			ry2 = $('#mapBox').height() - e.offsetY;
			
			rx2 = (rx2 * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
			ry2 = (ry2 * largeurRos / $('#mapBox').width()) * ros_resolution / 100;

			x1 = (rx1 * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
			y1 = $('#mapBox').height() - ((ry1 * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
			x2 = (rx2 * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
			y2 = $('#mapBox').height() - ((ry2 * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
			
			path = $('#mesure_add');
			path.attr('d', 'M' + [x1, y1] + ' L '+[x2, y2]);
			
			path = $('#mesure_start_add');
			path.attr('x', x1 -5);
		    path.attr('y', y1 - 5);
			
			path = $('#mesure_end_add');
			path.attr('x', x2 -5);
		    path.attr('y', y2 - 5);
			
			$('#mesureEndX').html(rx2.toFixed(2));
			$('#mesureEndY').html(ry2.toFixed(2));
			
			CalculDistanceMesure();
		   
	   }
	   else if (downOnMovable)
	   {
		   if (movableDown.data('element_type') == 'mesure')
		   {
			   if (currentAction == 'mesure')
			   {
				   rx1 = parseFloat($('#mesureStartX').html());
				   ry1 = parseFloat($('#mesureStartY').html());
				   rx2 = parseFloat($('#mesureEndX').html());
				   ry2 = parseFloat($('#mesureEndY').html());
				   if(movableDown.data('element') == 'start')
				   {
					   delta = ((downOnSVG_x - e.pageX) / $('#mapBox').width() * largeurRos) * ros_resolution / 100;
					   rx1 -= delta;
					   delta = ((downOnSVG_y - e.pageY) / $('#mapBox').width() * largeurRos) * ros_resolution / 100;
					   ry1 += delta;
					   
					   $('#mesureStartX').html(rx1.toFixed(2));
					   $('#mesureStartY').html(ry1.toFixed(2));
				   }
				   else if(movableDown.data('element') == 'end')
				   {
					  delta = ((downOnSVG_x - e.pageX) / $('#mapBox').width() * largeurRos) * ros_resolution / 100;
					  rx2 -= delta;
					  delta = ((downOnSVG_y - e.pageY) / $('#mapBox').width() * largeurRos) * ros_resolution / 100;
					  ry2 += delta;
					   $('#mesureEndX').html(rx2.toFixed(2));
					   $('#mesureEndY').html(ry2.toFixed(2));
					}
				   
				    x1 = (rx1 * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
					y1 = $('#mapBox').height() - ((ry1 * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
					x2 = (rx2 * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
					y2 = $('#mapBox').height() - ((ry2 * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
					
					path = $('#mesure_add');
					path.attr('d', 'M' + [x1, y1] + ' L '+[x2, y2]);
					
					path = $('#mesure_start_add');
					path.attr('x', x1 -5);
					path.attr('y', y1 - 5);
					
					path = $('#mesure_end_add');
					path.attr('x', x2 -5);
					path.attr('y', y2 - 5);
					
					CalculDistanceMesure();					
					
					downOnSVG_x = e.pageX;
					downOnSVG_y = e.pageY;
			   }
		   }
		   else if (movableDown.data('element_type') == 'poly')
		   {
			   poly = GetPolyFromID(movableDown.data('id_area'));
			   
			   	movableDown.attr('x', parseInt(movableDown.attr('x')) - (downOnSVG_x - e.pageX));
				movableDown.attr('y', parseInt(movableDown.attr('y')) - (downOnSVG_y - e.pageY)); 
				  
				delta = ((downOnSVG_x - e.pageX) / $('#mapBox').width() * largeurRos) * ros_resolution / 100;
				poly.points[movableDown.data('index_point')].x = parseFloat(poly.points[movableDown.data('index_point')].x) - delta;
				delta = ((downOnSVG_y - e.pageY) / $('#mapBox').width() * largeurRos) * ros_resolution / 100;
				poly.points[movableDown.data('index_point')].y = parseFloat(poly.points[movableDown.data('index_point')].y) + delta;
			   
			    TracePoly(GetPolyIndexFromID(movableDown.data('id_area')));
			   
				downOnSVG_x = e.pageX;
				downOnSVG_y = e.pageY;
		   }
	   }
	   else if (downOnSVG)
	   {
			$('#container_all').scrollLeft(downOnSVG_x_scroll + ((downOnSVG_x - e.pageX)));
			$('#container_all').scrollTop(downOnSVG_y_scroll + ((downOnSVG_y - e.pageY)));
	   }
    });
	
	$('#container_all').scroll(function(e) {
		RefreshZoomView();
	});
	
	$('#zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	$('#zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#zoom_carte').width();
			h = $('#zoom_carte').height();
			
			wAll = $('#all').width();
			hAll = $('#all').height();
			
			wOver = $('#container_all').width();
			hOver = $('#container_all').height();
			
			wZoom = $('#zone_zoom').width();
			hZoom = $('#zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
			
			$('#container_all').scrollLeft(x / w * wAll);
			$('#container_all').scrollTop(y / h * hAll);
		
			t = document.getElementById('container_all').scrollTop;
			l = document.getElementById('container_all').scrollLeft;
					
			$('#zone_zoom').css('top', t/hAll * h - 1);
			$('#zone_zoom').css('left', l/wAll * w -1);
	   }
    });
	
	$('#zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#zoom_carte').width();
		h = $('#zoom_carte').height();
		
		wAll = $('#all').width();
		hAll = $('#all').height();
		
		wOver = $('#container_all').width();
		hOver = $('#container_all').height();
		
		wZoom = $('#zone_zoom').width();
		hZoom = $('#zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
		
		$('#container_all').scrollLeft(x / w * wAll);
		$('#container_all').scrollTop(y / h * hAll);
	
		t = document.getElementById('container_all').scrollTop;
		l = document.getElementById('container_all').scrollLeft;
				
		$('#zone_zoom').css('top', t/hAll * h - 1);
		$('#zone_zoom').css('left', l/wAll * w -1);
		
	});
	
	$(document).on('click', '.poly_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addPoly' && currentStep == 'trace')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('.active', 'active');
			RemoveClass('.activ_select', 'activ_select'); 
			
			if ((e.ctrlKey != undefined && e.ctrlKey) || (e.ctrlKey == undefined && ctrlClickIsPressed))
			{
				trouve = false;
				cur_id = $(this).data('id_area');
				$.each(currentSelectedItem, function(index, value){
					if (value.type == 'poly' && value.id == cur_id)
					{
						trouve = true;
						currentSelectedItem.splice(index, 1);
						return false;
					}
				});
				
				if (!trouve)
					currentSelectedItem.push({'type':'poly', 'id':$(this).data('id_area')});
				ResfreshMultipleSelection();
			}
			else
			{	
				currentSelectedItem = Array();
				currentSelectedItem.push({'type':'poly', 'id':$(this).data('id_area')});	
				HideCurrentMenuNotSelect();
				
				$('body').removeClass('show_rayon');
				$('body').removeClass('no_current select');
				$('.select').css("strokeWidth", minStokeWidth);
				
				$('#blocElements').addClass('active');
				$('#blocElements li').removeClass('active');
				$('#li_poly_'+$(this).data('id_area')).addClass('active');
				
				currentAction = 'editPoly';	
				currentStep = '';
				
				currentPolyIndex = GetPolyIndexFromID($(this).data('id_area'));
				poly = polys[currentPolyIndex];
				saveCurrentPoly = JSON.stringify(poly);
				
				AddClass('.poly_elem_'+poly.id_area, 'active');
				
				$('#infoAddPoly h2').html('Edit Area');
				$('#infoAddPoly .btndelete').show();
				$('#infoAddPoly').show();
				$('#infoAddPoly .todo_text').html('');
				
				$('#infoAddPoly_nom').val(poly.nom);
				$('#infoAddPoly_comment').val(poly.comment);
				
			}
		}
		else
			AvertCantChange();
	});
	
	$('#bDeletePoly').click(function(e) {
        if (confirm('Are you sure you want to delete this block?'))
		{
			//location.href = 'plan-trax.php?id_plan='+id_plan+'&deletePoly='+polys[currentPolyIndex].id_area;
			DeletePoly(currentPolyIndex);
		}
    });
	
	$('#bSelect').click(function(e) {
        e.preventDefault();
		if (canChangeMenu)
		{
			HideCurrentMenu();
			
			$('#bSelect').addClass('btn-primary');
			$('.select').css("strokeWidth", maxStokeWidth);
			
			$('body').addClass('select');
			//$('body').removeClass('no_current select');
			
			currentAction = 'select';
			currentStep = '';
		}
		else if (currentAction == 'select')
		{
			$('.btn-mode-gene').removeClass('btn-primary');
			$('body').removeClass('select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentAction = '';
			currentStep = '';
		}
		else
			AvertCantChange();
	});
	
	$('#bAddPoly').click(function(e) {
        e.preventDefault();
		if (canChangeMenu)
		{
			HideCurrentMenu();
			
			$('#bAddPoly').addClass('btn-primary');
		
			currentAction = 'addPoly';	
			currentStep = 'trace';
			
			$('#infoAddPoly h2').html('Add Area');
			$('#infoAddPoly .btndelete').hide();
			$('#infoAddPoly').show();
			$('#infoAddPoly_comment').val('');
			$('#infoAddPoly .todo_text').html('Click on the map to create forbidden area.');
			
			$('body').removeClass('no_current');
			$('body').addClass('addPoly');
			
			currentPolyPoints = Array();
			currentPolyPoints.push({x:0, y:0}); // Point du curseur
		}
		else
			AvertCantChange();
	});
	$('#infoAddPoly .save').click(function(e) {
        e.preventDefault();
		
		$('.poly_elem_current').remove();
		
		if (currentAction == 'addPoly')
		{
			jQuery.ajax({
				url: 'ajax/addArea.php',
				type: "post",
				dataType: "json",
				data: { 
						'id_plan':id_plan,
						'nom':$('#infoAddPoly_nom').val(),
						'couleur':$('#infoAddPoly_couleur').val(),
						'comment':$('#infoAddPoly_comment').val(),
						'points':JSON.stringify(currentPolyPoints)
					},
				error: function(jqXHR, textStatus, errorThrown) {
					},
				success: function(data, textStatus, jqXHR) {
					
					canChangeMenu = true;
					
					polys.push(data);
					TracePoly(polys.length-1);
					
					RemoveClass('.active', 'active');
					
					currentAction = '';
					currentStep = '';
					
					$('#infoAddPoly_nom').val('');
					$('#infoAddPoly_couleur').val('#FF0000');
					$('#infoAddPoly_comment').val('');
					
					$('#infoAddPoly').hide();
					$('#infoAddPoly .todo_text').html('');
				
					$('body').addClass('no_current');
					
					copie = $('#li_poly_vide').clone();
					copie.attr('id', 'li_poly_'+data.id_area);
					copie.data('id', data.id_area);
					copie.attr('title', data.comment);
					
					copie.find('i.fa-info-circle').attr('title', data.comment);
					if (data.comment == '')
						copie.find('i.fa-info-circle').hide();
					else
						copie.find('i.fa-info-circle').show();
					
					copie.find('.eye').attr('id', 'eye_poly_'+data.id_area);
					copie.find('.eye').data('id', data.id_area);
					copie.find('.carre').css('background-color','rgba('+data.couleur_r+','+data.couleur_g+','+data.couleur_b+',0.5)');
					copie.find('.titre').html('Area '+data.id_area);
					
					copie.appendTo('#listElemPoly ul');
			
					$('.btn-mode-gene').removeClass('btn-primary');
					$('.btn-mode-gene').addClass('btn-default');
					
					SetModeSelect();
					}
			});
		}
		else if (currentAction == 'editPoly')
		{
			jQuery.ajax({
				url: 'ajax/editArea.php',
				type: "post",
				dataType: "json",
				data: { 
						'id_area':polys[currentPolyIndex].id_area,
						'id_plan':id_plan,
						'nom':$('#infoAddPoly_nom').val(),
						'couleur':$('#infoAddPoly_couleur').val(),
						'comment':$('#infoAddPoly_comment').val(),
						'points':JSON.stringify(polys[currentPolyIndex].points)
					},
				error: function(jqXHR, textStatus, errorThrown) {
					},
				success: function(data, textStatus, jqXHR) {
					currentAction = '';
					currentStep = '';
					
					canChangeMenu = true;
					
					polys[currentPolyIndex] = data;
					TracePoly(currentPolyIndex);
					
					RemoveClass('.active', 'active');
					
					$('#infoAddPoly_nom').val('');
					$('#infoAddPoly_couleur').val('#FF0000');
					$('#infoAddPoly_comment').val('');
					
					$('#infoAddPoly').hide();
					$('#infoAddPoly .todo_text').html('');
					
					
					$('#li_poly_'+data.id_area).attr('title', data.comment);
					
					$('#li_poly_'+data.id_area+' i.fa-info-circle').attr('title', data.comment);
					if (data.comment == '')
						$('#li_poly_'+data.id_area+' i.fa-info-circle').hide();
					else
						$('#li_poly_'+data.id_area+' i.fa-info-circle').show();
				
					$('body').addClass('no_current');
			
					$('.btn-mode-gene').removeClass('btn-primary');
					$('.btn-mode-gene').addClass('btn-default');
					
					SetModeSelect();
					}
			});
		}
    });
	$('#infoAddPoly .cancel').click(function(e) {
        e.preventDefault();
		
		canChangeMenu = true;
		
		$('.poly_elem_current').remove();
		
		$('.btn-mode-gene').removeClass('btn-primary');
		$('.btn-mode-gene').addClass('btn-default');
		
		$('#infoAddPoly_nom').val('');
		$('#infoAddPoly_couleur').val('#FF0000');
		$('#infoAddPoly_comment').val('');
		
		$('#infoAddPoly').hide();
		$('#infoAddPoly .todo_text').html('');
		
		RemoveClass('.active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addPoly')
		{
			$('.poly_elem_0').remove();
			//polys.pop();
		}
		else if (currentAction == 'editPoly')
		{
			polys[currentPolyIndex] = JSON.parse(saveCurrentPoly);
			TracePoly(currentPolyIndex);
		}
		currentAction = '';
		currentStep = '';
		
		SetModeSelect();
	});
	
	$('#svg').click(function(e) {
        e.preventDefault();
		
		if (!e.target.classList.contains('info'))
			$('#blocInfoOpened').hide();
		
		if (cPressed)
		{
			// Center view
			$('#container_all').scrollLeft(e.offsetX - $('#container_all').width()/2);
			$('#container_all').scrollTop(e.offsetY - $('#container_all').height()/2);
			e.stopPropagation();
		}
		else if (currentAction == 'mesure')
		{
			if (currentStep == '')
			{
				// Add start
				canChangeMenu = false;
				$('#infoMesure .cancel').css('visibility', 'visible');
				
				x = e.offsetX;
				y = $('#mapBox').height() - e.offsetY;
				 
				xRos = (x * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
				yRos = (y * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
				
				$('#mesureStartX').html(xRos.toFixed(2));
				$('#mesureStartY').html(yRos.toFixed(2));
				
				x1 = x2 = x;
				y1 = y2 = e.offsetY;
				
				path = makeSVGElement('path', { d: 'M' + [x1, y1] + ' L '+[x2, y2],
						   'stroke-width': minStokeWidth,
						   'class': 'rayon select rayon_elem mesure_elem_add active',
						   'id': 'mesure_add',
						   'data-id_rayon': -1,
						   'data-element_type': 'mesure',
						   'data-element': 'mesure'
						   });
				svg.appendChild(path);
				
				path = makeSVGElement('rect', { x: x1-5, y:y1-5, height:10, width:10,
						   'stroke-width': minStokeWidth,
						   'class':'rayon movable rayon_elem mesure_elem_add',
						   'id': 'mesure_start_add',
						   'data-id_rayon': -1,
						   'data-element_type': 'mesure',
						   'data-element': 'start'
						  });
				svg.appendChild(path);
				
				path = makeSVGElement('rect', { x: x2-5, y:y2-5, height:10, width:10,
									   'stroke-width': minStokeWidth,
									   'class':'rayon movable rayon_elem mesure_elem_add',
									   'id': 'mesure_end_add',
									   'data-id_rayon': -1,
									   'data-element_type': 'mesure',
									   'data-element': 'end'
									  });
				svg.appendChild(path);
				
				$('.mesure_elem_add').show();
				currentStep = 'start_ok';
			}
			else if (currentStep == 'start_ok')
			{
				// Add start
				canChangeMenu = false;
				
				x = e.offsetX;
				y = $('#mapBox').height() - e.offsetY;
				 
				xRos = (x * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
				yRos = (y * largeurRos / $('#mapBox').width()) * ros_resolution / 100;
				
				$('#mesureEndX').html(xRos.toFixed(2));
				$('#mesureEndY').html(yRos.toFixed(2));
				
				currentStep = 'end_ok';
				
				CalculDistanceMesure();
			}
		}
    });
	
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	SetModeSelect();
});

function InitTaille()
{
	// Save scroll
	saveScrollLeft = document.getElementById('container_all').scrollLeft;
	saveScrollTop = document.getElementById('container_all').scrollTop;
	
	
	saveHeight = $('body').height();
	$('#all').width('auto');
    saveWidth = $('#all').width()-40;
    
    rotation = false;
	
    if (rotation)
    {
        t = hauteurSlam;
        hauteurSlam = largeurSlam;
        largeurSlam = t;
        $('#mapBoxRotate').show();
        $('#mapBox').hide();
    }
    else
    {
        $('#mapBoxRotate').hide();
        $('#mapBox').show();
    }
    
	/*
    $('#map_navigation').height($('#map_navigation').width() * hauteurSlam / largeurSlam);

    if (rotation)
    {
        if (saveHeight < $('#map_navigation').height())
        {
            $('#map_navigation').height(saveHeight);	
            $('#boxsmap').width($('#map_navigation').height() * largeurSlam / hauteurSlam);
            $('#boxsmap').height($('#map_navigation').height());
        }
        else
        {
            $('#boxsmap').width($('#map_navigation').width());
            $('#boxsmap').height($('#map_navigation').width() * hauteurSlam / largeurSlam);
        }
    }
    else
    {
        if (saveHeight < $('#map_navigation').height())
        {
            $('#map_navigation').height(saveHeight);	
            $('#boxsmap').width($('#map_navigation').height() * largeurSlam / hauteurSlam);
            $('#boxsmap').height($('#map_navigation').height());
        }
        else
        {
            $('#boxsmap').width($('#map_navigation').width());
            $('#boxsmap').height($('#map_navigation').width() * hauteurSlam / largeurSlam);
        }
    }
	
	document.getElementById('container_all').scrollLeft = saveScrollLeft;
	document.getElementById('container_all').scrollTop = saveScrollTop;
	*/
}

function RefreshAllPath()
{
}

function RefreshZoomView()
{
	w = $('#zoom_carte').width();
	h = $('#zoom_carte').height();
	
	wAll = $('#all').width();
	hAll = $('#all').height();
	
	wOver = $('#container_all').width();
	hOver = $('#container_all').height();
	
	wNew = w * wOver/wAll;
	if (wNew > w) wNew = w;
	hNew = h * hOver/hAll;
	if (hNew > h) hNew = h;
	
	$('#zone_zoom').width(wNew);
	$('#zone_zoom').height(hNew);
	
	t = document.getElementById('container_all').scrollTop;
	l = document.getElementById('container_all').scrollLeft;
			
	$('#zone_zoom').css('top', t/hAll * h - 1);
	$('#zone_zoom').css('left', l/wAll * w -1);
	
}

function RemoveClass(query_element, class_to_delete)
{
	$(query_element).each(function(index, element) {
		if ($(this).attr('class') != undefined)
	        $(this).attr('class',  $(this).attr('class').replace(class_to_delete, ''));
    });
}
function AddClass(query_element, class_to_add)
{
	$(query_element).each(function(index, element) {
		if ($(this).attr('class') != undefined)
	        $(this).attr('class',  $(this).attr('class') + ' ' + class_to_add);
		else
	        $(this).attr('class',  class_to_add);
    });
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function sortUL(selector) {
    $(selector).children("li").sort(function(a, b) {
        var upA = $(a).text().toUpperCase();
        var upB = $(b).text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);
}


function DeletePoly(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	data = polys[indexInArray];
	
	DeletePolyIHM(indexInArray);
	
	RemoveClass('.active', 'active');
	
	currentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	SetModeSelect();
	
	jQuery.ajax({
		url: 'ajax/deleteArea.php',
		type: "post",
		dataType: "json",
		data: { 
				'id_plan':id_plan,
				'indexInArray':indexInArray,
				'id_area':data.id_area,
			},
		error: function(jqXHR, textStatus, errorThrown) {
			},
		success: function(data, textStatus, jqXHR) {
			
			
			}
	});
}

function DeletePolyIHM(index)
{
	data = polys[index];
	
	$('.poly_elem_'+data.id_area).remove();
	$('#li_poly_'+data.id_area).remove();
	
	polys.splice(index, 1);
}

function GetPolyFromID(id)
{
	ret = null;
	$.each(polys, function(indexInArray, poly){
		if (poly.id_area == id)
		{
			ret = poly;
			return ret;
		}
	});
	return ret;
}

function GetPolyIndexFromID(id)
{
	ret = null;
	$.each(polys, function(indexInArray, poly){
		if (poly.id_area == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}