<?php
$_CONFIG['URL'] = 'https://elodie.wyca-solutions.com/';
?><!doctype html>
<html>
<head>
<title>Wyca test api</title>

	<link href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/fonts/opensans/opensans.css" rel="stylesheet" type="text/css">

	<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
	<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/default.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/extension.css" />
    
	<script src="./assets/vendor/jquery/jquery.js"></script>
</head>
<body style="padding:50px;">

	<?php
	require_once(dirname(__FILE__).'/lib/httpful.phar');
	define('URL_WYCA_REST', 'https://192.168.0.30/API/REST/');
	
	$email = 'Distributor';
	$password = 'toto';
	
	
	$url = URL_WYCA_REST.'v1.0/json/user/connection';
	$response = \Httpful\Request::post($url)->body('login='.$email.'&password='.$password)->send();
	?>
	<code>
		<pre><?php print_r(json_decode($response->body));?></pre>	
    </code>
    
    <?php
    $email = 'Distributor';
	$password = 'wyca2019';
	
	
	$url = URL_WYCA_REST.'v1.0/json/user/connection';
	$response = \Httpful\Request::post($url)->body('login='.$email.'&password='.$password)->send();
	?>
	<code>
		<pre><?php print_r($response->body);?></pre>	
    </code>
	<code>
		<pre><?php print_r(json_decode($response->body));?></pre>	
    </code>
    
    
</body>
</html>