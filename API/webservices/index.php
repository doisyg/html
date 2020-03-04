<?php
if (isset($_REQUEST['_method'])) $_SERVER['REQUEST_METHOD'] = $_REQUEST['_method'];

require_once(dirname(__FILE__).'/config/initWS.php');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

if (!isset($userConnected)) die();

$app = new \Slim\Slim();
$app->config(array(
	'debug' => true
));

$app->add(new \Slim\Middleware\SessionCookie(array('secret' => $_CONFIG['WS_KEY'])));


/*
function authenticate ($app) {
    return function () use ($app) {
		
		global $_CONFIG;
	
		$api_key = $app->request()->headers('PHP_AUTH_USER');
		if ($api_key != '')
		{
			$user = User::GetUserFromApiKey($api_key);
			if ($user == null)
			{
				$_SESSION['api_key'] = '';
				$response = array('statut' => 'ERROR', 'message' => 'Login needed');
				$app->halt(401, json_encode($response));
			}
			else
			{
				$_SESSION['api_key'] = $api_key;
				$_SESSION['id_user'] = $user->id_user;
			}
		}
		else
		{
			$_SESSION['api_key'] = '';
			$response = array('statut' => 'ERROR', 'message' => 'Login needed');
			$app->halt(401, json_encode($response));
		}

    };
};
*/

$app->get('/', function () use($app) {
	echo ('<h1>Hello to Wyca Webservice</h1>');
});

$app->group('/v1.0', function () use ($app){
	$app->group('/json', function () use ($app){
		$app->post('/error', function () use($app) {
				
				$email = new Email();
				$email->objet = 'Wyca - ERREUR JS';
				$email->message = 'Message : '.$app->request()->post('messageOrEvent').'<br>
				Source : '.$app->request()->post('source').'<br>
				Ligne : '.$app->request()->post('noligne').'<br>'; 
				
				$email->destinataire = 'stephane.morillon@smorillon.com';
				$email->Send();
			});
		$app->get('/pcConfig', function () use($app) {
				
				echo '{"iceServers": 
						[
							{"urls":["stun:wyca-solutions.com:3478"], "username":"wyca", "credential":"wyca2016"},
							{"urls":["turn:wyca-solutions.com:3478"], "username":"wyca", "credential":"wyca2016"}
						]
					  }';
			});
		$app->get('/map_contenu', function () use($app) {
			
			$map = new Map(Configuration::GetValue('CURRENT_MAP'));
			
			$contenuCarte = array();
			$contenuCarteRotate = array();
						
			$contenuCarte = array();
			$contenuCarte['width'] = $map->ros_width;
			$contenuCarte['height'] = $map->ros_height;
			$contenuCarte['paths'] = array();
				
			$contenuCarteRotate = array();
			$contenuCarteRotate['width'] = $map->ros_width;
			$contenuCarteRotate['height'] = $map->ros_height;
			$contenuCarteRotate['paths'] = array();
				
			$index = 0;
			
			$data = array('contenuCarte' => $contenuCarte, 'contenuCarteRotate' => $contenuCarteRotate);
			echo json_encode($data);
		});
		$app->get('/map', function () use($app) {
				
				$map = new Map(Configuration::GetValue('CURRENT_MAP'));
			
				$p = array();
				$p['image'] = $map ->image_tri;
				$p['ros_width'] = $map ->ros_width;
				$p['ros_height'] = $map ->ros_height;
				$p['ros_resolution'] = $map ->ros_resolution;
				
				echo json_encode($p);
			});
		$app->group('/robot', function () use ($app){
			$app->get('/getHash', function () use($app) {
				
				$site = new Site(Configuration::GetValue('CURRENT_SITE'));
				$last_config = $site->GetLastConfig();
				$value = $last_config->GetValue('/auth', 'valid.secret');
				
				$secret = '';
				
				if (isset($value->data))
					$secret = $value->data;
					
				$client = $_SERVER['REMOTE_ADDR'];
				$dest = $_SERVER['REMOTE_ADDR'];
				$rand = Site::GenerateRandomString();
				$t = time() + 2;
				$end = time() + 60*60*1000;
				$level = "ope";
				
				$mac = hash ('sha512', $secret.$dest.$rand.$t.$level.$client.$end);
				
				$data = array();
				
				$data['client'] = $client;
				$data['dest'] = $dest;
				$data['rand'] = $rand;
				$data['t'] = $t;
				$data['end'] = $end;
				$data['level'] = $level;
				$data['mac'] = $mac;
				
				echo json_encode($data);
			});
		});
	});
});

$app->run();
?>