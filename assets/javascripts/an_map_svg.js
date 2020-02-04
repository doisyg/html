var downOnMovable = false;
var minStokeWidth = 1;
var maxStokeWidth = 5;

var lastElementAdded = null;

function an_AppliquerZoom()
{
	//$('#all').width(saveWidth * zoom_carte);
	//Resize();
	//$('#boxsmap').resize();
	
	an_ResizeSVG();
	
	//RefreshZoomView();
	//setTimeout(RefreshZoomView, 100);
}

function an_InitSVG()
{
}

function an_GetCenterForbidden(indexForbidden)
{
	forbidden = an_forbiddens[indexForbidden];
	
	minX = 10000;
	minY = 10000;
	maxX = 0;
	maxY = 0;
	
	points = forbidden.points;
	$.each(points, function( indexPoint, point ) {
		if (point.x < minX) minX = point.x;
		if (point.x > maxX) maxX = point.x;
		if (point.y < minY) minY = point.y;
		if (point.y > maxY) maxY = point.y;
	});
	
	x = minX + (maxX-minX)/2;
	y = minY + (maxY-minY)/2;
	
	return { "x":x, "y":y};
}
function an_TraceForbidden(indexForbidden)
{
	forbidden = an_forbiddens[indexForbidden];
	if (forbidden.deleted == 1) { $('#an_svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	if (downOnMovable && movableDown.data('element_type') == 'forbidden')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#an_svg .forbidden_elem_'+forbidden.id_area).remove();		  
	
	points = forbidden.points;
	if (points.length > 1)
	{
		forbidden_point = '';
		$.each(points, function( indexPoint, point ) {
			if (forbidden_point != '') forbidden_point += ' ';
			
			x = point.x * 100 / an_ros_resolution;
			y = an_ros_hauteur - (point.y * 100 / an_ros_resolution);
			
			forbidden_point += x+','+y;
		});
		
		$('#an_svg #forbidden_'+forbidden.id_area).remove();
		
		path = an_makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'poly forbidden poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(0,0,0,0.5)'
		an_svg.appendChild(path);
		$('#an_svg #forbidden_'+forbidden.id_area).insertAfter(lastElementAdded);
		lastElementAdded = $('#an_svg #forbidden_'+forbidden.id_area);
		
		$.each(points, function( indexPoint, point ) {
			
			/*
			x = (point.x * 100 / an_ros_resolution) / largeurRos * $('#an_svg #mapBox').width();
			y = $('#an_svg #mapBox').height() - ((point.y * 100 / an_ros_resolution) / largeurRos * $('#an_svg #mapBox').width());
			*/
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#an_svg #forbidden_'+forbidden.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / an_ros_resolution;
				y = an_ros_hauteur - (point.y * 100 / an_ros_resolution);
				
				path = an_makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id': 'forbidden_'+forbidden.id_area+'_'+indexPoint,
							   'data-id_area': forbidden.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'forbidden',
							   'data-element': 'forbidden'
							  });
				an_svg.appendChild(path);
				$('#an_svg #forbidden_'+forbidden.id_area+'_'+indexPoint).insertAfter(lastElementAdded);
				lastElementAdded = $('#an_svg #forbidden_'+forbidden.id_area+'_'+indexPoint);
				
			}
		});
	}
}


function an_GetCenterArea(indexArea)
{
	area = an_areas[indexArea];
	
	minX = 10000;
	minY = 10000;
	maxX = 0;
	maxY = 0;
	
	points = area.points;
	$.each(points, function( indexPoint, point ) {
		if (point.x < minX) minX = point.x;
		if (point.x > maxX) maxX = point.x;
		if (point.y < minY) minY = point.y;
		if (point.y > maxY) maxY = point.y;
	});
	
	x = minX + (maxX-minX)/2;
	y = minY + (maxY-minY)/2;
	
	return { "x":x, "y":y};
}
function an_TraceArea(indexArea)
{
	area = an_areas[indexArea];
	if (area.deleted == 1) { $('#an_svg .area_elem_'+area.id_area).remove(); return; }
	
	if (downOnMovable && movableDown.data('element_type') == 'area')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#an_svg .area_elem_'+area.id_area).remove();
	
	points = area.points;
	if (points.length > 1)
	{
		area_point = '';
		$.each(points, function( indexPoint, point ) {
			if (area_point != '') area_point += ' ';
			
			x = point.x * 100 / an_ros_resolution;
			y = an_ros_hauteur - (point.y * 100 / an_ros_resolution);
			
			area_point += x+','+y;
		});
		
		$('#an_svg #area_'+area.id_area).remove();
		
		path = an_makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'poly area poly_elem area_elem area_elem_'+area.id_area,
							   'id':'area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.couleur_r+','+area.couleur_g+','+area.couleur_b+',0.5)'
		an_svg.appendChild(path);
		$('#an_svg #area_'+area.id_area).insertAfter(lastElementAdded);
		lastElementAdded = $('#an_svg #area_'+area.id_area);
		
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#an_svg #area_'+area.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / an_ros_resolution;
				y = an_ros_hauteur - (point.y * 100 / an_ros_resolution);
				
				path = an_makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable poly_elem area_elem area_elem_'+area.id_area,
							   'id': 'area_'+area.id_area+'_'+indexPoint,
							   'data-id_area': area.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'area',
							   'data-element': 'area'
							  });
				an_svg.appendChild(path);
				$('#an_svg #area_'+area.id_area+'_'+indexPoint).insertAfter(lastElementAdded);
				lastElementAdded = $('#an_svg #area_'+area.id_area+'_'+indexPoint);
			}
		});
	}
}

function an_TraceDock(indexDock)
{
	dock = an_docks[indexDock];
	if (dock.deleted != undefined && dock.deleted == 1) { $('#an_svg .dock_elem_'+dock.id_station_recharge).remove(); return; }
	
	if (downOnMovable && movableDown.data('element_type') == 'dock')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#an_svg .dock_elem_'+dock.id_station_recharge).remove();
	
	x = dock.x_ros * 100 / an_ros_resolution;
	y = an_ros_hauteur - (dock.y_ros * 100 / an_ros_resolution);
	
	angle = 0 - dock.t_ros * 180 / Math.PI - 90;
	
	path = an_makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_fond dock_elem_'+dock.id_station_recharge,
				   'id': 'dock_'+dock.id_station_recharge,
				   'data-id_station_recharge': dock.id_station_recharge,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	an_svg.appendChild(path);
	$('#an_svg #dock_'+dock.id_station_recharge).insertAfter(lastElementAdded);
	lastElementAdded = $('#an_svg #dock_'+dock.id_station_recharge);
	
	path = an_makeSVGElement('line', { 'x1': x-1, 'y1':y-1, 'x2': x+1, 'y2':y-1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'orange',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_'+dock.id_station_recharge,
				   'id': 'dock_connect_'+dock.id_station_recharge,
				   'data-id_station_recharge': dock.id_station_recharge,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	an_svg.appendChild(path);
	$('#an_svg #dock_connect_'+dock.id_station_recharge).insertAfter(lastElementAdded);
	lastElementAdded = $('#an_svg #dock_connect_'+dock.id_station_recharge);
}

function an_TracePoi(indexPoi)
{
	poi = an_pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted == 1) { $('#an_svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	if (downOnMovable && movableDown.data('element_type') == 'poi')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#an_svg .poi_elem_'+poi.id_poi).remove();
	
	x = poi.x_ros * 100 / an_ros_resolution;
	y = an_ros_hauteur - (poi.y_ros * 100 / an_ros_resolution);	
	angle = 0 - poi.t_ros * 180 / Math.PI;
	
	rayonRobot = (26 / an_ros_resolution);
	rayonRobotSecure = ((26+15) / an_ros_resolution);
	
	path = an_makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_secure poi_elem_'+poi.id_poi,
								   'id': 'poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	an_svg.appendChild(path);
	$('#an_svg #poi_secure_'+poi.id_poi).insertAfter(lastElementAdded);
	lastElementAdded = $('#an_svg #poi_secure_'+poi.id_poi);
	
	path = an_makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	an_svg.appendChild(path);
	$('#an_svg #poi_robot_'+poi.id_poi).insertAfter(lastElementAdded);
	lastElementAdded = $('#an_svg #poi_robot_'+poi.id_poi);
	
	path = an_makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_'+poi.id_poi,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'poi_sens_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	an_svg.appendChild(path);
	$('#an_svg #poi_sens_'+poi.id_poi).insertAfter(lastElementAdded);
	lastElementAdded = $('#an_svg #poi_sens_'+poi.id_poi);
	
}

function an_ResizeSVG()
{
	lastElementAdded = $('#an_svg #an_plan');
	
	$.each(an_forbiddens, function( index, forbidden ) {
		an_TraceForbidden(index);
	});
	$.each(an_areas, function( index, area ) {
		an_TraceArea(index);
	});
	$.each(an_docks, function( index, dock ) {
		an_TraceDock(index);
	});
	$.each(an_pois, function( index, poi ) {
		an_TracePoi(index);
	});
}

function an_makeSVGElement(tag, attrs, texte='')
{
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
	
	if (texte != '')
	{
		txt = document.createTextNode(texte);
		el.appendChild(txt);
	}
	
    return el;
}

function an_RefreshZoomView()
{
	pSVG = $('#an_svg').position();
	pImg = $('#an_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	zoom = an_ros_largeur / $('#an_svg').width() / window.panZoomAn.getZoom();
	
	wZoom = $('#an_zoom_carte').width();
	hZoom = $('#an_zoom_carte').height();
	
	wNew = 0;
	hNew = 0;
	tNew = 0;
	lNew = 0;
	
	if (pImg.left > 0)
		lNew = 0;
	else
		lNew = -(pImg.left*zoom) / an_ros_largeur * wZoom;
	if (pImg.top > 0)
		tNew = 0;
	else
		tNew = -(pImg.top*zoom) / an_ros_largeur * wZoom;
	
	hNew = $('#an_svg').height() * zoom  / an_ros_largeur * wZoom;
	wNew = $('#an_svg').width() * zoom  / an_ros_largeur * wZoom;
	
	if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#an_zone_zoom').width(wNew);
	$('#an_zone_zoom').height(hNew);
				
	$('#an_zone_zoom').css('top', tNew - 1);
	$('#an_zone_zoom').css('left', lNew - 1);
	
}

function AnGetDockFromID(id)
{
	ret = null;
	$.each(an_docks, function(indexInArray, dock){
		if (dock.id_station_recharge == id)
		{
			ret = dock;
			return ret;
		}
	});
	return ret;
}
function AnGetDockIndexFromID(id)
{
	ret = null;
	$.each(an_docks, function(indexInArray, dock){
		if (dock.id_station_recharge == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function AnGetPoiFromID(id)
{
	ret = null;
	$.each(an_pois, function(indexInArray, poi){
		if (poi.id_poi == id)
		{
			ret = poi;
			return ret;
		}
	});
	return ret;
}
function AnGetPoiIndexFromID(id)
{
	ret = null;
	$.each(an_pois, function(indexInArray, poi){
		if (poi.id_poi == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}