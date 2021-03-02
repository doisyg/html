
/* ZOOM FUNCS*/

function WycaGetZoom()
{
	var obj = $('#wyca_edit_map_svg g');
	obj.attr('id', 'wyca_edit_map_svg_g');
	 var transformMatrix = obj.css("-webkit-transform") ||
	   obj.css("-moz-transform")    ||
	   obj.css("-ms-transform")     ||
	   obj.css("-o-transform")      ||
	   obj.css("transform");
	   
	if (transformMatrix == undefined && typeof(window.panZoomWyca) != 'undefined' )
	 	return  ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom()
	if(transformMatrix != undefined){
		var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
	 
	 
		return 1 / parseFloat(matrix[0]);
	}else{
		return 1;
	}
}

function WycaInitSVG()
{
}

/* TRACE FUNCS */

function WycaTraceSection(x1, y1, x2, y2)
{
	$('#wyca_edit_map_svg .selection').remove();
	
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
	svgWyca.appendChild(path);
}

function WycaTraceCurrentGomme(gomme, index)
{
	points = gomme.points;
	$('#wyca_edit_map_svg .gomme_elem_current_'+index).remove();
	
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
								  
		svgWyca.appendChild(path);
		$('#wyca_edit_map_svg .gomme_elem_current_'+index).insertAfter($('#wyca_edit_map_svg image'));
		
	}
}

function WycaTraceForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	if (forbidden.deleted) { $('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	is_active = false;
	if ($('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area).length > 0)
	{
		t = $('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area);
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
		$('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove();		  
	
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
		
		$('#wyca_edit_map_svg #wyca_edit_map_forbidden_'+forbidden.id_area).remove();
		
		path = makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'poly forbidden forbidden_root poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'wyca_edit_map_forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(255,0,0,0.3)';
		svgWyca.appendChild(path);
		
		lastPointIndex = points.length-1;
		lastPoint = points[lastPointIndex];
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || (index_point_movable != indexPoint || index_point_movable != lastPointIndex))
			{
				$('#wyca_edit_map_svg #wyca_edit_map_forbidden_trait_'+forbidden.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				x2 = lastPoint.x * 100 / ros_resolution;
				y2 = ros_hauteur - (lastPoint.y * 100 / ros_resolution);
				
				path = makeSVGElement('line', { x1: x, y1:y, x2:x2, y2:y2,
							   'stroke-width': downOnMovable?1:5,
							   'class':'secable poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id': 'wyca_edit_map_forbidden_trait_'+forbidden.id_area+'_'+indexPoint,
							   'data-id_area': forbidden.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'forbidden',
							   'data-element': 'forbidden'
							  });
				svgWyca.appendChild(path);
			}
			
			lastPointIndex = indexPoint;
			lastPoint = point;
		});
		
		$.each(points, function( indexPoint, point ) {
			/*
			x = (point.x * 100 / ros_resolution) / largeurRos * $('#wyca_edit_map_mapBox').width();
			y = $('#wyca_edit_map_mapBox').height() - ((point.y * 100 / ros_resolution) / largeurRos * $('#wyca_edit_map_mapBox').width());
			*/
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#wyca_edit_map_svg #wyca_edit_map_forbidden_'+forbidden.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				let	pointActiveClass = '';
				if(typeof(currentPointWycaLongTouch) != 'undefined' && currentPointWycaLongTouch != null){
					pointActiveClass = indexPoint == currentPointWycaLongTouch.data('index_point') ? ' editing_point' : '' ;
				}
				
				path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable point_deletable poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area+pointActiveClass,
							   'id': 'wyca_edit_map_forbidden_'+forbidden.id_area+'_'+indexPoint,
							   'data-id_area': forbidden.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'forbidden',
							   'data-element': 'forbidden'
							  });
				svgWyca.appendChild(path);
			}
			
			lastPoint = point;
		});
		
		if (is_active)
			AddClass('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
	}
}

function WycaTraceArea(indexArea)
{
	area = areas[indexArea];
	if (area.deleted) { $('#wyca_edit_map_svg .area_elem_'+area.id_area).remove(); return; }
	
	is_active = false;
	if ($('#wyca_edit_map_svg .area_elem_'+area.id_area).length > 0)
	{
		t = $('#wyca_edit_map_svg .area_elem_'+area.id_area);
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
		$('#wyca_edit_map_svg .area_elem_'+area.id_area).remove();
	
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
		
		$('#wyca_edit_map_svg #wyca_edit_map_area_'+area.id_area).remove();
		
		path = makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'poly area area_root poly_elem area_elem area_elem_'+area.id_area,
							   'id':'wyca_edit_map_area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.color_r+','+area.color_g+','+area.color_b+',0.5)'
		svgWyca.appendChild(path);
		
		lastPointIndex = points.length-1;
		lastPoint = points[lastPointIndex];
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || (index_point_movable != indexPoint || index_point_movable != lastPointIndex))
			{
				$('#wyca_edit_map_svg #wyca_edit_map_area_trait_'+area.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				x2 = lastPoint.x * 100 / ros_resolution;
				y2 = ros_hauteur - (lastPoint.y * 100 / ros_resolution);
				
				path = makeSVGElement('line', { x1: x, y1:y, x2:x2, y2:y2,
							   'stroke-width': downOnMovable?1:5,
							   'class':'secable poly_elem area_elem area_elem_'+area.id_area,
							   'id': 'wyca_edit_map_area_trait_'+area.id_area+'_'+indexPoint,
							   'data-id_area': area.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'area',
							   'data-element': 'area'
							  });
				svgWyca.appendChild(path);
			}
			
			lastPointIndex = indexPoint;
			lastPoint = point;
		});
		
		
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#wyca_edit_map_svg #wyca_edit_map_area_'+area.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				let	pointActiveClass = '';
				if(typeof(currentPointWycaLongTouch) != 'undefined' && currentPointWycaLongTouch != null){
					pointActiveClass = indexPoint == currentPointWycaLongTouch.data('index_point') ? ' editing_point' : '' ;
				}
				
				
				path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable point_deletable poly_elem area_elem area_elem_'+area.id_area+pointActiveClass,
							   'id': 'wyca_edit_map_area_'+area.id_area+'_'+indexPoint,
							   'data-id_area': area.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'area',
							   'data-element': 'area'
							  });
				svgWyca.appendChild(path);
			}
		});
		
		if (is_active)
			AddClass('#wyca_edit_map_svg .area_elem_'+area.id_area, 'active');
	}
}

function WycaTraceCurrentDock(pose)
{
	$('#wyca_edit_map_svg .dock_elem_current').remove();
	
	x = pose.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - pose.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'movable dock_elem dock_elem_current'
				  });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'orange',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_current'
				  });
	svgWyca.appendChild(path);
}

function WycaTraceDock(indexDock)
{
	dock = docks[indexDock];
	if (dock.deleted != undefined && dock.deleted) { $('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station).remove(); return; }
	
	is_active = false;
	if ($('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station).length > 0)
	{
		t = $('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station);
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
		$('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station).remove();
	
	x = dock.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - dock.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_fond dock_elem_'+dock.id_docking_station,
				   'id': 'wyca_edit_map_dock_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_'+dock.id_docking_station,
				   'id': 'wyca_edit_map_dock_connect_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgWyca.appendChild(path);
	
	x = dock.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.final_pose_y * 100 / ros_resolution);
	angle = 0 - dock.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'dock_elem dock_elem_circle dock_elem_'+dock.id_docking_station,
								   'id': 'wyca_edit_map_dock_secure_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgWyca.appendChild(path);
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.60,
								   'class': 'dock_elem dock_elem_robot dock_elem_fond dock_elem_'+dock.id_docking_station,
								   'id': 'wyca_edit_map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'dock_elem dock_elem_'+dock.id_docking_station,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'wyca_edit_map_dock_sens_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgWyca.appendChild(path);
	
	if (is_active)
		AddClass('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
}

/*
function WycaTraceCurrentPoi(pose)
{
	$('#wyca_edit_map_svg .poi_elem_current').remove();
	
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
	svgWyca.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgWyca.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgWyca.appendChild(path);
}
*/

function WycaTracePoi(indexPoi)
{
	poi = pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted) { $('#wyca_edit_map_svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	is_active = false;
	if ($('#wyca_edit_map_svg .poi_elem_'+poi.id_poi).length > 0)
	{
		t = $('#wyca_edit_map_svg .poi_elem_'+poi.id_poi);
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
		$('#wyca_edit_map_svg .poi_elem_'+poi.id_poi).remove();
	
	x = poi.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (poi.final_pose_y * 100 / ros_resolution);	
	angle = 0 - poi.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_circle poi_elem_'+poi.id_poi,
								   'id': 'wyca_edit_map_poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'wyca_edit_map_poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_'+poi.id_poi,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'wyca_edit_map_poi_sens_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgWyca.appendChild(path);
	
	if (is_active)
		AddClass('#wyca_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
}

/*
function WycaTraceCurrentAugmentedPose(pose)
{
	$('#wyca_edit_map_svg .augmented_pose_elem_current').remove();
	
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
	svgWyca.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgWyca.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgWyca.appendChild(path);
}
*/

function WycaTraceAugmentedPose(indexAugmentedPose)
{
	augmented_pose = augmented_poses[indexAugmentedPose];
	if (augmented_pose.deleted != undefined && augmented_pose.deleted) { $('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove(); return; }
	
	is_active = false;
	if ($('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).length > 0)
	{
		t = $('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose);
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
		$('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove();
	
	x = augmented_pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (augmented_pose.final_pose_y * 100 / ros_resolution);	
	angle = 0 - augmented_pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'augmented_pose_elem augmented_pose_elem_circle augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'wyca_edit_map_augmented_pose_secure_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'augmented_pose_elem augmented_pose_elem_fond augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'wyca_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'augmented_pose_elem augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'wyca_edit_map_augmented_pose_sens_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgWyca.appendChild(path);
	
	if (is_active)
		AddClass('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
}

function WycaTraceGoToPose(x,y)
{
	path = makeSVGElement('circle', { cx: x,
									cy: y,
									r: rayonRobot*0.9,
									'class': 'go_to_pose_elem',
									'id': 'go_to_pose_elem_circle',
									});
	svgWyca.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
									r: rayonRobot*0.1,
									'class': 'go_to_pose_elem',
									'id': 'go_to_pose_elem_dot',
									});
	svgWyca.appendChild(path);

	path = makeSVGElement('line', { x1: x+(rayonRobot*0.9)  + rayonRobot/3 , y1:y, x2:x+(rayonRobot*0.9)  - rayonRobot/3, y2:y,
						   'class':'go_to_pose_elem go_to_pose_elem_line',
						   'id': 'go_to_pose_elem_line_left',
						  });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('line', { x1: x-(rayonRobot*0.9)  + rayonRobot/3 , y1:y, x2:x-(rayonRobot*0.9)  - rayonRobot/3, y2:y,
						   'class':'go_to_pose_elem go_to_pose_elem_line',
						   'id': 'go_to_pose_elem_line_right',
						  });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('line', { x1: x  , y1:y  -(rayonRobot*0.9)  + rayonRobot/3 , x2:x  , y2:y-(rayonRobot*0.9)  - rayonRobot/3,
						   'class':'go_to_pose_elem go_to_pose_elem_line',
						   'id': 'go_to_pose_elem_line_bottom',
						  });
	svgWyca.appendChild(path);
	
	path = makeSVGElement('line', { x1: x , y1:y  +(rayonRobot*0.9)  + rayonRobot/3 , x2:x  , y2:y+(rayonRobot*0.9)  - rayonRobot/3,
						   'class':'go_to_pose_elem go_to_pose_elem_line',
						   'id': 'go_to_pose_elem_line_top',
						  });
	svgWyca.appendChild(path);
}

var robot_traced_wyca = false;

function WycaTraceRobot(robot_x, robot_y, robot_theta)
{
	if(robot_x == robot_y && robot_y == robot_theta && robot_x == 0 ){
		$('#wyca_edit_map_tRobotNotLocalised').show();
		$('#wyca_edit_map_robot_circle').remove();
		$('#wyca_edit_map_robot_sens').remove();
	}else{
		x = robot_x * 100 / ros_resolution;
		y = ros_hauteur - (robot_y * 100 / ros_resolution);	
		angle = 0 - robot_theta * 180 / Math.PI;
		
		rayonRobot = (26 / ros_resolution);
		
		if (!robot_traced_wyca)
		{
			robot_traced_wyca = true;
			
			path = makeSVGElement('circle', { cx: x,
											cy: y,
										   r: rayonRobot,
										   'class': 'robot_elem robot_elem_fond',
										   'id': 'wyca_edit_map_robot_circle',
										   'data-element_type': 'robot',
										   'data-element': 'robot'
										   });
			svgWyca.appendChild(path);
		}
		else
		{
			$('#wyca_edit_map_robot_circle').attr("cx", x);
			$('#wyca_edit_map_robot_circle').attr("cy", y);
		}
		
		$('#wyca_edit_map_robot_sens').remove();
		path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
										'stroke':'#FFFFFF',
										'stroke-width':1,
										'fill':'none',
										'stroke-linejoin':'round',
										'stroke-linecap':'round',
									   'class': 'robot_elem',
									   'transform':'rotate('+angle+', '+x+', '+y+')',
									   'id': 'wyca_edit_map_robot_sens',
									   'data-element_type': 'robot',
									   'data-element': 'robot'
									   });
		$('#wyca_edit_map_robot_circle').after(path);
	}
}

function WycaResizeSVG()
{	
	WycaTraceRobot(lastRobotPose.X, lastRobotPose.Y, lastRobotPose.T);
	
	$('#wyca_edit_map_svg .gomme_elem').remove();
	$.each(gommes, function( index, gomme ) {
		WycaTraceCurrentGomme(gomme, index)
	});
	
	$('#wyca_edit_map_svg .forbidden_elem').remove();
	$.each(forbiddens, function( index, forbidden ) {
		WycaTraceForbidden(index);
	});
	$('#wyca_edit_map_svg .area_elem').remove();
	$.each(areas, function( index, area ) {
		WycaTraceArea(index);
	});
	$('#wyca_edit_map_svg .dock_elem').remove();
	$.each(docks, function( index, dock ) {
		WycaTraceDock(index);
	});
	$('#wyca_edit_map_svg .poi_elem').remove();
	$.each(pois, function( index, poi ) {
		WycaTracePoi(index);
	});
	$('#wyca_edit_map_svg .augmented_pose_elem').remove();
	$.each(augmented_poses, function( index, augmented_pose ) {
		WycaTraceAugmentedPose(index);
	});
}
