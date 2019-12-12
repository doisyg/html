
function AppliquerZoom()
{
	$('#all').width(saveWidth * zoom_carte);
	Resize();
	$('#boxsmap').resize();
	
	ResizeSVG();
	
	RefreshZoomView();
	setTimeout(RefreshZoomView, 100);
}

function InitSVG()
{
}

function TraceSection(x1, y1, x2, y2)
{
	$('.selection').remove();
	
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

function TraceCurrentPoly(points)
{
	$('.poly_elem_current').remove();
	
	if (points.length > 1)
	{
		poly_point = '';
		$.each(points, function( indexPoint, point ) {
			if (poly_point != '') poly_point += ' ';
			
			x = (point.x * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
			y = $('#mapBox').height() - ((point.y * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
			
			poly_point += x+','+y;
		});
		
		path = makeSVGElement('polygon', { points: poly_point,
								   'stroke-width': minStokeWidth,
								   'class':'poly poly_elem_current',
								   'data-index': 'current'
								  });
		svg.appendChild(path);
	}
}

function GetCenterPoly(indexPoly)
{
	poly = polys[indexPoly];
	
	minX = 10000;
	minY = 10000;
	maxX = 0;
	maxY = 0;
	
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
function TracePoly(indexPoly)
{
	poly = polys[indexPoly];
	is_active = false;
	if ($('.poly_elem_'+poly.id_area).length > 0)
	{
		t = $('.poly_elem_'+poly.id_area);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	$('.poly_elem_'+poly.id_area).remove();
	
	points = poly.points;
	if (points.length > 1)
	{
		poly_point = '';
		$.each(points, function( indexPoint, point ) {
			if (poly_point != '') poly_point += ' ';
			
			/*
			x = (point.x * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
			y = $('#mapBox').height() - ((point.y * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
			*/
			x = point.x * 100;
			y = 2515 - (point.y * 100);
			
			poly_point += x+','+y;
		});
		
		path = makeSVGElement('polygon', { points: poly_point,
							   'stroke-width': 0,
							   'class':'poly poly_elem poly_elem_'+poly.id_area,
							   'id':'poly_'+poly.id_area,
							   'data-id_area': poly.id_area
							  });
		path.style.fill = 'rgba(0,0,0,0.5)'
		svg.appendChild(path);
		
		$.each(points, function( indexPoint, point ) {
			
			/*
			x = (point.x * 100 / ros_resolution) / largeurRos * $('#mapBox').width();
			y = $('#mapBox').height() - ((point.y * 100 / ros_resolution) / largeurRos * $('#mapBox').width());
			*/
			x = point.x * 100;
			y = 2515 - (point.y * 100);
			
			path = makeSVGElement('rect', { x: x-5, y:y-5, height:10, width:10,
						   'stroke-width': minStokeWidth,
						   'class':'movable poly_elem poly_elem_'+poly.id_area,
						   'id': 'poly_'+poly.id_area+'_'+indexPoint,
						   'data-id_area': poly.id_area,
						   'data-index_point': indexPoint,
						   'data-element_type': 'poly',
						   'data-element': 'poly'
						  });
			svg.appendChild(path);
		});
		
		if (is_active)
			AddClass('.poly_elem_'+poly.id_area, 'active');
	}
}

function ResizeSVG()
{
	$.each(polys, function( index, route ) {
		TracePoly(index);
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
	console.log(canvas.toDataURL());
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
	imgFond.setAttribute("src", $('#mapBox').attr('src'));
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