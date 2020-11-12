function AppliquerZoom()
{
	//$('#all').width(saveWidth * zoom_carte);
	//Resize();
	//$('#boxsmap').resize();
	
	if ($('#install_by_step_edit_map').is(':visible')) ByStepResizeSVG();
	if ($('#install_normal_edit_map').is(':visible')) NormalResizeSVG();
	
	//RefreshZoomView();
	//setTimeout(RefreshZoomView, 100);
}

function InitSVG()
{
}

function ByStepGetZoom()
{
	var obj = $('#install_by_step_edit_map_svg g');
	obj.attr('id', 'install_by_step_edit_map_svg_g');
	 var transformMatrix = obj.css("-webkit-transform") ||
	   obj.css("-moz-transform")    ||
	   obj.css("-ms-transform")     ||
	   obj.css("-o-transform")      ||
	   obj.css("transform");
	   
	 if (transformMatrix == undefined)
	 	return  ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom()
	 
	 var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
	 
	 
	 return 1 / parseFloat(matrix[0]);
}

function ByStepTraceSection(x1, y1, x2, y2)
{
	$('#install_by_step_edit_map_svg .selection').remove();
	
	if (x1 < x2){	x = x1; w = x2-x1; }
	else { x = x2; w = x1-x2; }
	
	if (y1 < y2) { y = y1; h = y2-y1; }
	else { y = y2; h = y1-y2; }
	
	path = makeSVGElement('rect', { x: x, y:y, height:h, width:w,
				   'stroke-width': minStokeWidth,
				   'stroke-dasharray':'5, 5',
				   'class':'selection',
				   'id': 'selection',
				  });
	svgByStep.appendChild(path);
}

function ByStepTraceCurrentGomme(gomme, index)
{
	points = gomme.points;
	$('#install_by_step_edit_map_svg .gomme_elem_current_'+index).remove();
	
	if (points.length > 1)
	{
		gomme_point = '';
		$.each(points, function( indexPoint, point ) {
			if (gomme_point != '') gomme_point += ' ';
			
			x = (point.x * 100 / ros_resolution);
			y = ros_hauteur - ((point.y * 100 / ros_resolution));
			gomme_point += x+','+y;
		});
		
		path = makeSVGElement('polyline', { points: gomme_point,
								  'stroke-width': gomme.size,
								   'stroke': '#FFF',
								   'fill': 'none',
								   'class':'gomme_elem gomme_elem_current_'+index,
								   'data-index': 'current',
								   'shape-rendering': 'crispEdges' // anti aliasing
								  });
								  
		svgByStep.appendChild(path);
		$('#install_by_step_edit_map_svg .gomme_elem_current_'+index).insertAfter($('#install_by_step_edit_map_svg image'));
		
		path = makeSVGElement('polyline', { points: gomme_point,
								   'stroke-width': gomme.size,
								   'stroke': '#FFF',
								   'fill': 'none',
								   'class':'gomme_elem gomme_elem_current_'+index,
								   'data-index': 'current'
								  });
								  
		svgByStep.appendChild(path);
		$('#install_by_step_edit_map_svg .gomme_elem_current_'+index).insertAfter($('#install_by_step_edit_map_svg image'));
	}
}

/*
function ByStepTraceCurrentForbidden(points)
{
	$('#install_by_step_edit_map_svg .forbidden_elem_current').remove();
	
	if (points.length >= 1)
	{
		if (points.length <= 2)
		{
			point = points[0];
			x = (point.x * 100 / ros_resolution);
			y = ros_hauteur - ((point.y * 100 / ros_resolution));
				
			path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'poly forbidden_elem_current',
							   'data-index': 'current'
							  });
			svgByStep.appendChild(path);
		}
		else
		{
			forbidden_point = '';
			$.each(points, function( indexPoint, point ) {
				if (forbidden_point != '') forbidden_point += ' ';
				
				x = (point.x * 100 / ros_resolution);
				y = ros_hauteur - ((point.y * 100 / ros_resolution));
				
				forbidden_point += x+','+y;
			});
			
			path = makeSVGElement('polygon', { points: forbidden_point,
									   'stroke-width': minStokeWidth,
									   'class':'poly forbidden_elem_current',
									   'data-index': 'current'
									  });
			svgByStep.appendChild(path);
		}
	}
}
*/

function GetCenterForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	
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

function ByStepTraceForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	if (forbidden.deleted) { $('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	is_active = false;
	if ($('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area).length > 0)
	{
		t = $('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
		
	if (downOnMovable && movableDown.data('element_type') == 'forbidden')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove();		  
	
	points = forbidden.points;
	if (points.length > 1)
	{
		forbidden_point = '';
		$.each(points, function( indexPoint, point ) {
			if (forbidden_point != '') forbidden_point += ' ';
			
			x = point.x * 100 / ros_resolution;
			y = ros_hauteur - (point.y * 100 / ros_resolution);
			
			forbidden_point += x+','+y;
		});
		
		$('#install_by_step_edit_map_svg #install_by_step_edit_map_forbidden_'+forbidden.id_area).remove();
		
		path = makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'poly forbidden forbidden_root poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'install_by_step_edit_map_forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(255,0,0,0.3)'
		svgByStep.appendChild(path);
		
		lastPointIndex = points.length-1;
		lastPoint = points[lastPointIndex];
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || (index_point_movable != indexPoint || index_point_movable != lastPointIndex))
			{
				$('#install_by_step_edit_map_svg #install_by_step_edit_map_forbidden_trait_'+forbidden.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				x2 = lastPoint.x * 100 / ros_resolution;
				y2 = ros_hauteur - (lastPoint.y * 100 / ros_resolution);
				
				path = makeSVGElement('line', { x1: x, y1:y, x2:x2, y2:y2,
							   'stroke-width': downOnMovable?1:5,
							   'class':'secable poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id': 'install_by_step_edit_map_forbidden_trait_'+forbidden.id_area+'_'+indexPoint,
							   'data-id_area': forbidden.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'forbidden',
							   'data-element': 'forbidden'
							  });
				svgByStep.appendChild(path);
			}
			
			lastPointIndex = indexPoint;
			lastPoint = point;
		});
		
		$.each(points, function( indexPoint, point ) {
			/*
			x = (point.x * 100 / ros_resolution) / largeurRos * $('#install_by_step_edit_map_mapBox').width();
			y = $('#install_by_step_edit_map_mapBox').height() - ((point.y * 100 / ros_resolution) / largeurRos * $('#install_by_step_edit_map_mapBox').width());
			*/
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#install_by_step_edit_map_svg #install_by_step_edit_map_forbidden_'+forbidden.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable point_deletable poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id': 'install_by_step_edit_map_forbidden_'+forbidden.id_area+'_'+indexPoint,
							   'data-id_area': forbidden.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'forbidden',
							   'data-element': 'forbidden'
							  });
				svgByStep.appendChild(path);
			}
			
			lastPoint = point;
		});
		
		if (is_active)
			AddClass('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
	}
}

/*
function ByStepTraceCurrentArea(points)
{
	$('#install_by_step_edit_map_svg .area_elem_current').remove();
	
	if (points.length >= 1)
	{
		
		if (points.length <= 2)
		{
			point = points[0];
			x = (point.x * 100 / ros_resolution);
			y = ros_hauteur - ((point.y * 100 / ros_resolution));
				
			path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'poly forbidden_elem_current',
							   'data-index': 'current'
							  });
			svgByStep.appendChild(path);
		}
		else
		{
			area_point = '';
			$.each(points, function( indexPoint, point ) {
				if (area_point != '') area_point += ' ';
				
				x = (point.x * 100 / ros_resolution);
				y = ros_hauteur - ((point.y * 100 / ros_resolution));
				
				area_point += x+','+y;
			});
			
			path = makeSVGElement('polygon', { points: area_point,
									   'stroke-width': minStokeWidth,
									   'class':'poly area_elem_current',
									   'data-index': 'current'
									  });
			svgByStep.appendChild(path);
		}
	}
}
*/

function GetCenterArea(indexArea)
{
	area = areas[indexArea];
	
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

function ByStepTraceArea(indexArea)
{
	area = areas[indexArea];
	if (area.deleted) { $('#install_by_step_edit_map_svg .area_elem_'+area.id_area).remove(); return; }
	
	is_active = false;
	if ($('#install_by_step_edit_map_svg .area_elem_'+area.id_area).length > 0)
	{
		t = $('#install_by_step_edit_map_svg .area_elem_'+area.id_area);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'area')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#install_by_step_edit_map_svg .area_elem_'+area.id_area).remove();
	
	points = area.points;
	if (points.length > 1)
	{
		area_point = '';
		$.each(points, function( indexPoint, point ) {
			if (area_point != '') area_point += ' ';
			
			x = point.x * 100 / ros_resolution;
			y = ros_hauteur - (point.y * 100 / ros_resolution);
			
			area_point += x+','+y;
		});
		
		$('#install_by_step_edit_map_svg #install_by_step_edit_map_area_'+area.id_area).remove();
		
		path = makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'poly area area_root poly_elem area_elem area_elem_'+area.id_area,
							   'id':'install_by_step_edit_map_area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.color_r+','+area.color_g+','+area.color_b+',0.5)'
		svgByStep.appendChild(path);
		
		lastPointIndex = points.length-1;
		lastPoint = points[lastPointIndex];
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || (index_point_movable != indexPoint || index_point_movable != lastPointIndex))
			{
				$('#install_by_step_edit_map_svg #install_by_step_edit_map_area_trait_'+area.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				x2 = lastPoint.x * 100 / ros_resolution;
				y2 = ros_hauteur - (lastPoint.y * 100 / ros_resolution);
				
				path = makeSVGElement('line', { x1: x, y1:y, x2:x2, y2:y2,
							   'stroke-width': downOnMovable?1:5,
							   'class':'secable poly_elem area_elem area_elem_'+area.id_area,
							   'id': 'install_by_step_edit_map_area_trait_'+area.id_area+'_'+indexPoint,
							   'data-id_area': area.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'area',
							   'data-element': 'area'
							  });
				svgByStep.appendChild(path);
			}
			
			lastPointIndex = indexPoint;
			lastPoint = point;
		});
		
		
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#install_by_step_edit_map_svg #install_by_step_edit_map_area_'+area.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable point_deletable poly_elem area_elem area_elem_'+area.id_area,
							   'id': 'install_by_step_edit_map_area_'+area.id_area+'_'+indexPoint,
							   'data-id_area': area.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'area',
							   'data-element': 'area'
							  });
				svgByStep.appendChild(path);
			}
		});
		
		if (is_active)
			AddClass('#install_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
	}
}

function ByStepTraceCurrentDock(pose)
{
	$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	
	x = pose.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - pose.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'movable dock_elem dock_elem_current'
				  });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'orange',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_current'
				  });
	svgByStep.appendChild(path);
}

function ByStepTraceDock(indexDock)
{
	dock = docks[indexDock];
	if (dock.deleted != undefined && dock.deleted) { $('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station).remove(); return; }
	
	is_active = false;
	if ($('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station).length > 0)
	{
		t = $('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'dock')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station).remove();
	
	x = dock.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - dock.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_fond dock_elem_'+dock.id_docking_station,
				   'id': 'install_by_step_edit_map_dock_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_'+dock.id_docking_station,
				   'id': 'install_by_step_edit_map_dock_connect_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgByStep.appendChild(path);
	
	x = dock.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.final_pose_y * 100 / ros_resolution);
	angle = 0 - dock.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
		
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'dock_elem dock_elem_circle dock_elem_'+dock.id_docking_station,
								   'id': 'install_by_step_edit_map_dock_secure_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgByStep.appendChild(path);
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.60,
								   'class': 'dock_elem dock_elem_robot dock_elem_fond dock_elem_'+dock.id_docking_station,
								   'id': 'install_by_step_edit_map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'dock_elem dock_elem_'+dock.id_docking_station,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'install_by_step_edit_map_dock_sens_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgByStep.appendChild(path);
	
	if (is_active)
		AddClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
}

function ByStepTraceCurrentPoi(pose)
{
	$('#install_by_step_edit_map_svg .poi_elem_current').remove();
	
	x = pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.final_pose_y * 100 / ros_resolution);
	angle = 0 - pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#AAAAAA';
	svgByStep.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgByStep.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgByStep.appendChild(path);
}

function ByStepTracePoi(indexPoi)
{
	poi = pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted) { $('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	is_active = false;
	if ($('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi).length > 0)
	{
		t = $('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'poi')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi).remove();
	
	x = poi.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (poi.final_pose_y * 100 / ros_resolution);	
	angle = 0 - poi.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	/*
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_secure poi_elem_'+poi.id_poi,
								   'id': 'install_by_step_edit_map_poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgByStep.appendChild(path);
	*/
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_circle poi_elem_'+poi.id_poi,
								   'id': 'install_by_step_edit_map_poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'install_by_step_edit_map_poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_'+poi.id_poi,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'install_by_step_edit_map_poi_sens_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgByStep.appendChild(path);
	
	if (is_active)
		AddClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
}

function ByStepTraceCurrentAugmentedPose(pose)
{
	$('#install_by_step_edit_map_svg .augmented_pose_elem_current').remove();
	
	x = pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.final_pose_y * 100 / ros_resolution);
	angle = 0 - pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   });
	path.style.fill = '#AAAAAA';
	svgByStep.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgByStep.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgByStep.appendChild(path);
}

function ByStepTraceAugmentedPose(indexAugmentedPose)
{
	augmented_pose = augmented_poses[indexAugmentedPose];
	if (augmented_pose.deleted != undefined && augmented_pose.deleted) { $('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove(); return; }
	
	is_active = false;
	if ($('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).length > 0)
	{
		t = $('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'augmented_pose')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove();
	
	x = augmented_pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (augmented_pose.final_pose_y * 100 / ros_resolution);	
	angle = 0 - augmented_pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	/*path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'augmented_pose_elem augmented_pose_elem_secure augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'install_by_step_edit_map_augmented_pose_secure_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgByStep.appendChild(path);*/
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'augmented_pose_elem augmented_pose_elem_circle augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'install_by_step_edit_map_augmented_pose_secure_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'augmented_pose_elem augmented_pose_elem_fond augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'install_by_step_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgByStep.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'augmented_pose_elem augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'install_by_step_edit_map_augmented_pose_sens_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgByStep.appendChild(path);
	
	if (is_active)
		AddClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
}

var robot_traced = false;

function ByStepTraceRobot(robot_x, robot_y, robot_theta)
{
	x = robot_x * 100 / ros_resolution;
	y = ros_hauteur - (robot_y * 100 / ros_resolution);	
	angle = 0 - robot_theta * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	
	if (!robot_traced)
	{
		robot_traced = true;
		
		path = makeSVGElement('circle', { cx: x,
										cy: y,
									   r: rayonRobot,
									   'class': 'robot_elem robot_elem_fond',
									   'id': 'install_by_step_edit_map_robot_circle',
									   'data-element_type': 'robot',
									   'data-element': 'robot'
									   });
		svgByStep.appendChild(path);
	}
	else
	{
		$('#install_by_step_edit_map_robot_circle').attr("cx", x);
		$('#install_by_step_edit_map_robot_circle').attr("cy", y);
	}
	
	$('#install_by_step_edit_map_robot_sens').remove();
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'robot_elem',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'install_by_step_edit_map_robot_sens',
								   'data-element_type': 'robot',
								   'data-element': 'robot'
								   });
	$('#install_by_step_edit_map_robot_circle').after(path);
}

function ByStepResizeSVG()
{	
	ByStepTraceRobot(lastRobotPose.X, lastRobotPose.Y, lastRobotPose.T);
	
	$('#install_by_step_edit_map_svg .forbidden_elem').remove();
	$.each(forbiddens, function( index, forbidden ) {
		ByStepTraceForbidden(index);
	});
	$('#install_by_step_edit_map_svg .area_elem').remove();
	$.each(areas, function( index, area ) {
		ByStepTraceArea(index);
	});
	$('#install_by_step_edit_map_svg .dock_elem').remove();
	$.each(docks, function( index, dock ) {
		ByStepTraceDock(index);
	});
	$('#install_by_step_edit_map_svg .poi_elem').remove();
	$.each(pois, function( index, poi ) {
		ByStepTracePoi(index);
	});
	$('#install_by_step_edit_map_svg .augmented_pose_elem').remove();
	$.each(augmented_poses, function( index, augmented_pose ) {
		ByStepTraceAugmentedPose(index);
	});
}

function makeSVGElement(tag, attrs, texte='')
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

function ExportSVG()
{

	var rawSVG = $("#install_by_step_edit_map_svg").outerHTML;;
	
	var myCanvas = document.getElementById("install_by_step_edit_map_canvas_export_svg");
    var ctxt = myCanvas.getContext("2d");

    var svgTemp = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"}),
        domURL = self.URL || self.webkitURL || self,
        url = domURL.createObjectURL(svgTemp),
        img = new Image;

    img.onload = function () {
        ctx.drawImage(this, 0, 0);     
        domURL.revokeObjectURL(url);
        SaveImg();
    };

    img.src = url;
}

function SaveImg()
{
	var myCanvas = document.getElementById("install_by_step_edit_map_canvas_export_svg");
}

function svg_to_png_data(target) {
  var ctx, mycanvas, svg_data, img, child;

  // Flatten CSS styles into the SVG
  for (i = 0; i < target.childNodes.length; i++) {
    child = target.childNodes[i];
    var cssStyle = window.getComputedStyle(child);
    if(cssStyle){
       child.style.cssText = cssStyle.cssText;
    }
  }

  // Construct an SVG image
  svg_data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + target.offsetWidth +
             '" height="' + target.offsetHeight + '">' + target.innerHTML + '</svg>';
  img = new Image();
  img.src = "data:image/svg+xml," + encodeURIComponent(svg_data);

  // Draw the SVG image to a canvas
  mycanvas = document.createElement('canvas');
  mycanvas.width = target.offsetWidth;
  mycanvas.height = target.offsetHeight;
  ctx = mycanvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Return the canvas's data
  return mycanvas.toDataURL("image/png");
}

// Takes an SVG element as target
function svg_to_png_replace(target) {
  var data, img;
  data = svg_to_png_data(target);
  img = new Image();
  img.src = data;
  
  target.parentNode.replaceChild(img, target);
}

var svgTemp;
var svgData;
var canvas;
var svgSize;
var ctx;
var imgUser;
var imgFond;

var saveExportZoom = 1;
var saveExportScrollLeft = 0;
var saveExportScrollTop = 0;

function DrawFond()
{
	
	saveExportScrollTop = document.getElementById('install_by_step_edit_map_container_all').scrollTop;
	saveExportScrollLeft = document.getElementById('install_by_step_edit_map_container_all').scrollLeft;
	
	saveExportZoom = zoom_carte;
	zoom_carte=1;
	AppliquerZoom();
	
	
	svgTemp = document.getElementById("install_by_step_edit_map_svg");
		
	for (i = 0; i < svgTemp.childNodes.length; i++) {
		child = svgTemp.childNodes[i];
		child.oldFill = child.style.fill;
		
		var cssStyle = window.getComputedStyle(child);
		if(cssStyle){
			child.style.cssText = cssStyle.cssText;
		}
	  }
	  
	svgData = new XMLSerializer().serializeToString(svgTemp);
	canvas = document.createElement("canvas");
	svgSize = svgTemp.getBoundingClientRect();
	
	canvas.width = svgSize.width * 3;
	canvas.height = svgSize.height * 3;
	canvas.style.width = svgSize.width;
	canvas.style.height = svgSize.height;
	ctx = canvas.getContext("2d");
	
	imgFond = document.createElement("img");
	imgFond.setAttribute("src", $('#install_by_step_edit_map_svg #install_by_step_edit_map_mapBox').attr('src'));
	imgFond.onload = function() {
		ctx.globalAlpha = 0.4;
		ctx.drawImage(imgFond, 0, 0, svgSize.width*3, svgSize.height*3);
		ctx.globalAlpha = 1;
		DrawImgUser();
	
	};	
}

function DrawImgUser()
{
}

function DrawSVG()
{
	var canvasdata = canvas.toDataURL("image/png", 1);
		
	var pngimg = '<img src="' + canvasdata + '">';
	//d3.select("#pngdataurl").html(pngimg);
	
	var img = document.createElement("img");
	img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
	img.onload = function() {
		ctx.scale(3, 3);
		ctx.drawImage(img, 0, 0);
	
		zoom_carte = saveExportZoom;
		AppliquerZoom();
			
		$('#install_by_step_edit_map_container_all').scrollLeft(saveExportScrollLeft);
		$('#install_by_step_edit_map_container_all').scrollTop(saveExportScrollTop);
		
		
		for (i = 0; i < svgTemp.childNodes.length; i++) {
			child = svgTemp.childNodes[i];
			child.style.fill = child.oldFill;
	  	}
		
		DownloadFile();
		
	};	
}

function DownloadFile()
{
	var canvasdata = canvas.toDataURL("image/png", 1);
	
	var pngimg = '<img src="' + canvasdata + '">';
	
	var a = document.createElement("a");
	a.download = "download_img" + ".png";
	a.href = canvasdata;
	document.body.appendChild(a);
	a.click();
}

$(document).ready(function(e) {
    $('#install_by_step_edit_map_bExportSVG').click(function(e) {
        e.preventDefault();
		
		DrawFond();
		
    });
});