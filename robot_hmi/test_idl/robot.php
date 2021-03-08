<?php 
$_CONFIG['URL_ROOT'] = 'https://wyca.run/';
$_CONFIG['URL'] = 'https://wyca.run/robot_hmi/test_idl/';
$_CONFIG['URL_API'] = 'https://wyca.run/robot_hmi/test_idl/API/';

$sim = true;

$version = '20200308';

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"  <?=$sim?'style="font-size:14px;"':'' ?>>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Wyca - Robot interface</title>
	
	<link rel="shortcut icon" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon.ico" type="image/x-icon">
	<link rel="icon" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon.png" type="image/png">
	<link rel="icon" sizes="32x32" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-32.png" type="image/png">
	<link rel="icon" sizes="64x64" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-64.png" type="image/png">
	<link rel="icon" sizes="96x96" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-96.png" type="image/png">
	<link rel="icon" sizes="196x196" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-196.png" type="image/png">
	<link rel="apple-touch-icon" sizes="152x152" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="60x60" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="76x76" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-144x144.png">
	<meta name="msapplication-TileImage" content="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-144.png">
	<meta name="msapplication-TileColor" content="#FFFFFF"> 
		
	<script>
		var robot_host = 'wyca.run:9143';
		var robot_host = '10.0.0.39:9143';
		var api_key = '';
		var use_ssl = true;
	</script>
	
	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap-switch.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Montserrat%3A400%2C700&#038;subset=latin&#038;ver=1455269554' type='text/css' media='all' rel='stylesheet' id='anaglyph-google-fonts-anaglyph_config-css' />
	<link href="<?php echo $_CONFIG['URL'];?>css/font-awesome.min.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/robot.css?v=<?= $version ?>" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/map_wyca.css?v=<?= $version ?>" rel="stylesheet">
	
	<script src="<?php echo $_CONFIG['URL_API'];?>wyca_idl_api.js?v=<?= $version ?>"></script>
	<script src="<?php echo $_CONFIG['URL_API'];?>extern/jquery-1.11.3.min.js"></script>
	<script src="<?php echo $_CONFIG['URL'];?>js/bootstrap.js"></script>
	
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>css/sim_bootstrap.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>css/sim_font_awesome.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>css/sim_style.css?v=<?= $version ?>" />
    
	<script src="<?php echo $_CONFIG['URL'];?>js/sim_jquery.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>js/sim_bootstrap.js"></script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/sim_anim_led.js?v=<?= $version ?>"></script>
    <script src="<?php echo $_CONFIG['URL'];?>js/sim_led.js?v=<?= $version ?>"></script>
    <script src="<?php echo $_CONFIG['URL'];?>js/sim_map_svg.js?v=<?= $version ?>"></script>
	
	<script src="<?php echo $_CONFIG['URL'];?>js/robot.js?v=<?= $version ?>"></script>
</head>

<body>


<div id="HMI_simu" class="position-relative" style="">
	<div class="row m-0">
		<div class="col-xl-10 offset-xl-1 col-12 text-center">
			<div class="title_logo d-inline-flex flex-column" style="padding-top: 40vh;padding-bottom: 40vh;">
				<img src="<?php echo $_CONFIG['URL'];?>images/sim_logo.jpg" style="max-height: 175px;" class="img-fluid">
				<h1 class="text-right my-2">Simulation</h1>
				<h4 class="text-right m-0">Site - <span id="site_name"></span></h4>
			</div>
		</div>
		
	</div>
	<div class="row m-0 vh-100 p-3" id="dashboard">
		<div class="col-lg-9 col-12 h-100">
			<div class="w-100 h-100 d-flex justify-content-center align-items-center" id="map">
				<div class="d-flex position-relative">
					<svg id="map_svg" class="position-relative" width="0" height="0" style="display:none;">
						<image id="map_image" xlink:href="" x="0" y="0" height="0" width="0" />
					</svg>
					<div class="flex-centered tActionInProgess blinking_soft" id="tActionInProgess" style="display:none;"><i class="fas fa-map-marker-alt fa-2x"></i></div>
					<span id="tRobotNotLocalised" class="tRobotNotLocalised" style="display:none;"><i class="fas fa-exclamation-triangle"></i>The robot is not localized</span>
					
				</div>
				
				<div id="loader_map">
					<div class="loader-container">
						<div class="dot dot-1"></div>
						<div class="dot dot-2"></div>
						<div class="dot dot-3"></div>
					</div>

					<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
						<defs>
							<filter id="goo">
								<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/>
							</filter>
						</defs>
					</svg>
				</div>
				
			</div>
		</div>
		<div class="col-lg-3 col-12 h-100 d-flex flex-column" style="justify-content:space-between;">
			<img src="<?php echo $_CONFIG['URL'];?>images/sim_logo.jpg" class="img-fluid my-3 my-lg-0 mx-auto" style="max-height:150px">
			
			<div class="flex-centered py-5 my-3 my-lg-0" id="battery_widget">
				<i class="fas fa-battery-full fa-5x mr-4"></i>
				<h2 class="m-0"><span id="battery_lvl">-</span> %</h2>
				<h1 class="position-absolute">Battery</h1>
			</div>
			<div class="d-flex justify-content-around align-items-center py-5  my-3 my-lg-0" id="docking_state_widget">
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="docked">
					<i class="fas fa-charging-station fa-3x"></i>
					<p>docked</p>
				</div>
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="docking">
					<i class="fas fa-download fa-3x"></i>
					<p>docking</p>
				</div>
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="undocking">
					<i class="fas fa-upload fa-3x"></i>
					<p>undocking</p>
				</div>
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="undocked">
					<i class="fas fa-route fa-3x"></i>
					<p>undocked</p>
				</div>
				<h1>Docking State</h1>
			</div>
			<div class=" py-5 my-3 my-lg-0" id="leds_widget" style="min-height:450px">
            
            	<div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group sep">
                                <label class="col-xs-4 control-label" for="segment_id">Segment id</label>
                                <div class="col-xs-8">
                                    <div class=" input-group">
                                        <input type="text" id="segment_id" name="segment_id" class="form-control input-sm mb-md" value="unique_id_string" />
                                    </div>
                                </div>
                            </div>
                            <div style="clear:both; height:5px;"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group sep">
                                <label class="col-xs-4 control-label" for="step_distance">Step distance</label>
                                <div class="col-xs-8">
                                    <div class=" input-group">
                                        <input type="number" id="step_distance" name="step_distance" class="form-control input-sm mb-md" value="1.0" />
                                        <span class="input-group-addon" style="padding: 5px; width: auto; line-height: 20px;">m</span>
                                    </div>
                                </div>
                            </div>
                            <div style="clear:both; height:5px;"></div>
                        </div>
                    </div>
                    
                    <div class="row">
                    
                        <div class="col-md-6">
                            <div class="form-group sep">
                                <label class="col-xs-5 control-label" for="start_x">Start X</label>
                                <div class="col-xs-7">
                                    <div class=" input-group">
                                        <input type="number" id="start_x" name="start_x" class="form-control input-sm mb-md" value="1.0" />
                                        <span class="input-group-addon" style="padding: 5px; width: auto; line-height: 20px;">m</span>
                                    </div>
                                </div>
                            </div>
                            <div style="clear:both;"></div>
                            <div class="form-group sep">
                                <label class="col-xs-5 control-label" for="start_x">Start Y</label>
                                <div class="col-xs-7">
                                    <div class=" input-group">
                                        <input type="number" id="start_y" name="start_y" class="form-control input-sm mb-md" value="1.0" />
                                        <span class="input-group-addon" style="padding: 5px; width: auto; line-height: 20px;">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group sep">
                                <label class="col-xs-5 control-label" for="end_x">End X</label>
                                <div class="col-xs-7">
                                    <div class=" input-group">
                                        <input type="number" id="end_x" name="end_x" class="form-control input-sm mb-md" value="1.0" />
                                        <span class="input-group-addon" style="padding: 5px; width: auto; line-height: 20px;">m</span>
                                    </div>
                                </div>
                            </div>
                            <div style="clear:both;"></div>
                            <div class="form-group sep">
                                <label class="col-xs-5 control-label" for="end_y">End Y</label>
                                <div class="col-xs-7">
                                    <div class=" input-group">
                                        <input type="number" id="end_y" name="end_y" class="form-control input-sm mb-md" value="1.0" />
                                        <span class="input-group-addon" style="padding: 5px; width: auto; line-height: 20px;">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="padding:10px; text-align:center">
	                    <a href="#" id="bStartNavSegment" class="btn btn-primary">Start nav segment</a>
    				</div>
                </div>
                
                <div style="padding:10px">
                	<h3>Response</h3>
                    <div id="navsegment_response" style="max-height:100px; overflow:auto;"></div>
                </div>
                
                <div style="padding:10px">
                	<h3>Feedback</h3>
                    <div id="navsegment_feedback" style="max-height:100px; overflow:auto;"></div>
                </div>
                
                <div style="padding:10px">
                	<h3>Result</h3>
                    <div id="navsegment_result" style="max-height:100px; overflow:auto;"></div>
                </div>
            	
				<h1>NavSegment</h1>
			</div>
		</div>
	</div>
	<span id="tVersion" class="tVersion">v = <span class="font-weight-bold"><?= $version ?></span>
</div>
</body>
</html>
