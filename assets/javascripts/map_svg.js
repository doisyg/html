
function AppliquerZoom()
{
	//$('#all').width(saveWidth * zoom_carte);
	//Resize();
	//$('#boxsmap').resize();
	
	ResizeSVG();
	
	//RefreshZoomView();
	//setTimeout(RefreshZoomView, 100);
}

function InitSVG()
{
}

function TraceSection(x1, y1, x2, y2)
{
	$('#svg .selection').remove();
	
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
	svg.appendChild(path);
}

function TraceCurrentGomme(points, index)
{
	$('#svg .gomme_elem_current_'+index).remove();
	
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
								   'stroke-width': 2,
								   'stroke': '#FFF',
								   'fill': 'none',
								   'class':'gomme_elem gomme_elem_current_'+index,
								   'data-index': 'current'
								  });
								  
		svg.appendChild(path);
		$('#svg .gomme_elem_current_'+index).insertAfter($('#svg image'));
		
		path = makeSVGElement('polyline', { points: gomme_point,
								   'stroke-width': 2,
								   'stroke': '#FFF',
								   'fill': 'none',
								   'class':'gomme_elem gomme_elem_current_'+index,
								   'data-index': 'current'
								  });
								  
		svg.appendChild(path);
		$('#svg .gomme_elem_current_'+index).insertAfter($('#svg image'));
	}
}

function TraceCurrentForbidden(points)
{
	$('#svg .forbidden_elem_current').remove();
	
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
			svg.appendChild(path);
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
			svg.appendChild(path);
		}
	}
}

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
function TraceForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	if (forbidden.deleted == 1) { $('#svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	is_active = false;
	if ($('#svg .forbidden_elem_'+forbidden.id_area).length > 0)
	{
		t = $('#svg .forbidden_elem_'+forbidden.id_area);
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
		$('#svg .forbidden_elem_'+forbidden.id_area).remove();		  
	
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
		
		$('#svg #forbidden_'+forbidden.id_area).remove();
		
		path = makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'poly forbidden poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(0,0,0,0.5)'
		svg.appendChild(path);
		
		$.each(points, function( indexPoint, point ) {
			
			/*
			x = (point.x * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
			y = $('#mapBox').height() - ((point.y * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
			*/
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#svg #forbidden_'+forbidden.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id': 'forbidden_'+forbidden.id_area+'_'+indexPoint,
							   'data-id_area': forbidden.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'forbidden',
							   'data-element': 'forbidden'
							  });
				svg.appendChild(path);
			}
		});
		
		if (is_active)
			AddClass('#svg .forbidden_elem_'+forbidden.id_area, 'active');
	}
}

function TraceCurrentArea(points)
{
	$('#svg .area_elem_current').remove();
	
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
			svg.appendChild(path);
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
			svg.appendChild(path);
		}
	}
}

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
function TraceArea(indexArea)
{
	area = areas[indexArea];
	if (area.deleted == 1) { $('#svg .area_elem_'+area.id_area).remove(); return; }
	
	is_active = false;
	if ($('#svg .area_elem_'+area.id_area).length > 0)
	{
		t = $('#svg .area_elem_'+area.id_area);
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
		$('#svg .area_elem_'+area.id_area).remove();
	
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
		
		$('#svg #area_'+area.id_area).remove();
		
		path = makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'poly area poly_elem area_elem area_elem_'+area.id_area,
							   'id':'area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.couleur_r+','+area.couleur_g+','+area.couleur_b+',0.5)'
		svg.appendChild(path);
		
		$.each(points, function( indexPoint, point ) {
			
			if (!downOnMovable || index_point_movable != indexPoint)
			{
				$('#svg #area_'+area.id_area+'_'+indexPoint).remove();
				
				x = point.x * 100 / ros_resolution;
				y = ros_hauteur - (point.y * 100 / ros_resolution);
				
				path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
							   'stroke-width': minStokeWidth,
							   'class':'movable poly_elem area_elem area_elem_'+area.id_area,
							   'id': 'area_'+area.id_area+'_'+indexPoint,
							   'data-id_area': area.id_area,
							   'data-index_point': indexPoint,
							   'data-element_type': 'area',
							   'data-element': 'area'
							  });
				svg.appendChild(path);
			}
		});
		
		if (is_active)
			AddClass('#svg .area_elem_'+area.id_area, 'active');
	}
}

function TraceCurrentDock(pose)
{
	$('#svg .dock_elem_current').remove();
	
	x = pose.x_ros * 100 / ros_resolution;
	y = ros_hauteur - (pose.y_ros * 100 / ros_resolution);
	
	angle = 0 - pose.t_ros * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'movable dock_elem dock_elem_current'
				  });
	svg.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y-1, 'x2': x+1, 'y2':y-1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'orange',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_current'
				  });
	svg.appendChild(path);
}
function TraceDock(indexDock)
{
	dock = docks[indexDock];
	if (dock.deleted != undefined && dock.deleted == 1) { $('#svg .dock_elem_'+dock.id_station_recharge).remove(); return; }
	
	is_active = false;
	if ($('#svg .dock_elem_'+dock.id_station_recharge).length > 0)
	{
		t = $('#svg .dock_elem_'+dock.id_station_recharge);
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
		$('#svg .dock_elem_'+dock.id_station_recharge).remove();
	
	x = dock.x_ros * 100 / ros_resolution;
	y = ros_hauteur - (dock.y_ros * 100 / ros_resolution);
	
	angle = 0 - dock.t_ros * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_fond dock_elem_'+dock.id_station_recharge,
				   'id': 'dock_'+dock.id_station_recharge,
				   'data-id_station_recharge': dock.id_station_recharge,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svg.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y-1, 'x2': x+1, 'y2':y-1,
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
	svg.appendChild(path);
	
	if (is_active)
		AddClass('#svg .dock_elem_'+dock.id_station_recharge, 'active');
}

function TraceCurrentPoi(pose)
{
	$('#svg .poi_elem_current').remove();
	
	x = pose.x_ros * 100 / ros_resolution;
	y = ros_hauteur - (pose.y_ros * 100 / ros_resolution);
	angle = 0 - pose.t_ros * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#AAAAAA';
	svg.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#589FB1';
	svg.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svg.appendChild(path);
}
function TracePoi(indexPoi)
{
	poi = pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted == 1) { $('#svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	is_active = false;
	if ($('#svg .poi_elem_'+poi.id_poi).length > 0)
	{
		t = $('#svg .poi_elem_'+poi.id_poi);
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
		$('#svg .poi_elem_'+poi.id_poi).remove();
	
	x = poi.x_ros * 100 / ros_resolution;
	y = ros_hauteur - (poi.y_ros * 100 / ros_resolution);	
	angle = 0 - poi.t_ros * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_secure poi_elem_'+poi.id_poi,
								   'id': 'poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svg.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svg.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
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
	svg.appendChild(path);
	
	if (is_active)
		AddClass('#svg .poi_elem_'+poi.id_poi, 'active');
}

function ResizeSVG()
{
	$.each(forbiddens, function( index, forbidden ) {
		TraceForbidden(index);
	});
	$.each(areas, function( index, area ) {
		TraceArea(index);
	});
	$.each(docks, function( index, dock ) {
		TraceDock(index);
	});
	$.each(pois, function( index, poi ) {
		TracePoi(index);
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

function ExportSVG() {

	var rawSVG = $("#svg").outerHTML;;
	
	var myCanvas = document.getElementById("canvas_export_svg");
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
	var myCanvas = document.getElementById("canvas_export_svg");
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
	
	saveExportScrollTop = document.getElementById('container_all').scrollTop;
	saveExportScrollLeft = document.getElementById('container_all').scrollLeft;
	
	saveExportZoom = zoom_carte;
	zoom_carte=1;
	AppliquerZoom();
	
	
	svgTemp = document.getElementById("svg");
		
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
	imgFond.setAttribute("src", $('#svg #mapBox').attr('src'));
	imgFond.onload = function() {
		ctx.globalAlpha = 0.4;
		ctx.drawImage(imgFond, 0, 0, svgSize.width*3, svgSize.height*3);
		ctx.globalAlpha = 1;
		DrawImgUser();
	
	};	
}

function DrawImgUser()
{
	if ($('#lien_download_fond').attr('href') != '')
	{
		imgUser = document.createElement("img");
		imgUser.setAttribute("src", $('#lien_download_fond').attr('href'));
		imgUser.onload = function() {
			ctx.globalAlpha = user_options.background_opacity / 100;
			ctx.drawImage(imgUser, 0, 0, svgSize.width*3, svgSize.height*3);
			ctx.globalAlpha = 1;
			DrawSVG();
		};	
	}
	else
		DrawSVG();
	
	
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
			
		$('#container_all').scrollLeft(saveExportScrollLeft);
		$('#container_all').scrollTop(saveExportScrollTop);
		
		
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
    $('#bExportSVG').click(function(e) {
        e.preventDefault();
		
		DrawFond();
		
    });
});




function CalculDistanceMesure()
{
	x1 = parseFloat($('#mesureStartX').html());
	y1 = parseFloat($('#mesureStartY').html());
	x2 = parseFloat($('#mesureEndX').html());
	y2 = parseFloat($('#mesureEndY').html());
	
	distance = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
	
	$('#infoMesure .distance').html(distance.toFixed(2));
}