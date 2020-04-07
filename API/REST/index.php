<?php
if (isset($_REQUEST['_method'])) $_SERVER['REQUEST_METHOD'] = $_REQUEST['_method'];

require_once(dirname(__FILE__).'/config/initWS.php');

require 'classes/WycaAPI.php';

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->config(array(
	'debug' => true
));

$app->add(new \Slim\Middleware\SessionCookie(array('secret' => $_CONFIG['WS_KEY'])));

$app->get('/', function () use($app) {
	echo ('<h1>Hello to Wyca Webservice</h1>');
});

$app->group('/v1.0', function () use ($app){
	$app->group('/json', function () use ($app){
		$app->group('/user', function () use ($app){	
			$app->post('/connection', function () use($app) {
					$api_key = '';
					
					$email = $app->request()->post('email');
					$password = $app->request()->post('password');
					
					WycaAPI::Init($api_key);
					
					echo WycaAPI::CheckConnexion($email, $password);
			});
		});
		$app->post('/connection', function () use($app) {
			$api_key = $app->request()->headers('PHP_AUTH_USER');				
		});
	});
});

$app->run();
?>