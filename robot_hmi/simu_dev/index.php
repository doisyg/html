<?php
require_once ('config/config.php');

// Check if http or https
if ( (! empty($_SERVER['REQUEST_SCHEME']) && $_SERVER['REQUEST_SCHEME'] == 'https') ||
     (! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ||
     (! empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443') ) {
	$server_request_scheme = 'https';
} else {
	$server_request_scheme = 'http';
}

$_CONFIG['ROBOT_HOST'] = '';
$_CONFIG['ROBOT_HTTP'] = $server_request_scheme;
$_CONFIG['ROBOT_HTTP'] .= '://';

$_CONFIG['ROBOT_HOST'] = '10.0.0.72:';
$_CONFIG['ROBOT_HOST'] .= $server_request_scheme == 'http' ? '9094' : '9095';

$_CONFIG['ROBOT_HTTP'] .= $_CONFIG['ROBOT_HOST'];

?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Wyca Robotics - Floor Management</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="assets/css/boostrap.css" />
		<link rel="stylesheet" href="assets/css/font_awesome.css" />
		<link rel="stylesheet" href="assets/css/style.css" />
		
		    
        <link rel="shortcut icon" href="assets/img/favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" href="assets/img/favicon/favicon.png" type="image/png">
        <link rel="icon" sizes="32x32" href="assets/img/favicon/favicon-32.png" type="image/png">
        <link rel="icon" sizes="64x64" href="assets/img/favicon/favicon-64.png" type="image/png">
        <link rel="icon" sizes="96x96" href="assets/img/favicon/favicon-96.png" type="image/png">
        <link rel="icon" sizes="196x196" href="assets/img/favicon/favicon-196.png" type="image/png">
        <link rel="apple-touch-icon" sizes="152x152" href="assets/img/favicon/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="60x60" href="assets/img/favicon/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="76x76" href="assets/img/favicon/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="assets/img/favicon/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="assets/img/favicon/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="assets/img/favicon/apple-touch-icon-144x144.png">
        <meta name="msapplication-TileImage" content="assets/img/favicon/favicon-144.png">
        <meta name="msapplication-TileColor" content="#FFFFFF"> 
        
	</head>
	<body>

	<div class="row m-0">
		<div class="col-xl-10 offset-xl-1 col-12 text-center">
			<div class="title_logo d-inline-flex flex-column" style="padding-top: 40vh;padding-bottom: 40vh;">
				<img src="assets/img/_logo.jpg" style="max-height: 175px;" class="img-fluid">
				<h1 class="text-right my-2">Simulation</h1>
				<h4 class="text-right m-0">Site - <span id="site_name"></span></h4>
			</div>
		</div>
		
	</div>
	<div class="row m-0 vh-100 p-3" id="dashboard">
		<div class="col-md-9 h-100">
			<div class="w-100 h-100 m-auto" id="map" style="position:relative;">
				<svg id="install_normal_edit_map_svg" width="0" height="0" style="position:absolute; top:0; left:0; width:100%; height:100%;">
					<image id="install_normal_edit_map_image" xlink:href="" x="0" y="0" height="0" width="0" />
				</svg>
				<div class="d-flex justify-content-around align-items-center" id="legende">
					<p class="m-0">Legende</p>
					<i class="fas fa-backward"></i>
					<i class="fas fa-backward"></i>
				</div>
			</div>
		</div>
		<div class="col-md-3 h-100 d-flex flex-column" style="justify-content: space-evenly;">
				
				<div class="my-2 flex-centered py-5" id="battery_widget">
					<i class="fas fa-battery-full fa-5x mr-4"></i>
					<h2 class="m-0"><span id="battery_lvl">99</span> %</h2>
					<h1 class="position-absolute">Battery</h1>
				</div>
				<hr>
				<div class="my-2 d-flex justify-content-around align-items-center py-5" id="docking_state_widget">
					<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="docked">
						<i class="fas fa-charging-station fa-3x"></i>
						<p>docked</p>
					</div>
					<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="docking">
						<i class="fas fa-download fa-3x"></i>
						<p>docking</p>
					</div>
					<div class="d-flex justify-content-center align-items-center docking_state active flex-column" id="undocking">
						<i class="fas fa-upload fa-3x"></i>
						<p>undocking</p>
					</div>
					<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="undocked">
						<i class="fas fa-compass fa-3x"></i>
						<p>undocked</p>
					</div>
					<h1>Docking State</h1>
				</div>
				<hr>
				<div class="my-2 flex-centered py-5" id="leds_widget" style="min-height:300px">
					
					<h1>LEDs</h1>
				</div>
		</div>
	</div>
	
	</body>
	<script src="assets/js/jquery.js"></script>
	<script src="assets/js/wyca_socket_api.js"></script>
	<script src="assets/js/bootstrap.js"></script>
	<script src="assets/js/app.js"></script>
	<script>
		 
		var robot_host = '<?php echo $_CONFIG["ROBOT_HOST"]?>';
		var robot_http = '<?php echo $_CONFIG["ROBOT_HTTP"]?>';
		
		var use_ssl = <?php echo $server_request_scheme == 'http'?'false':'true';?>;
		var app_url = '<?php echo $server_request_scheme;?>://wyca.run';
		var user_api_key = 'P8P6IwmjY1ND6ruITeYC5krMPUVoJj5ohKkN4uXSmAlgPE';
		var user_id = '1';

	</script>
	<script src="assets/js/wyca_socket_api.js"></script>

</html>
