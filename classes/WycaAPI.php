<?php
class WycaAPI
{
	private static $_api_key = '';
	public static function Init($api_key)
	{
		self::$_api_key = $api_key;
	}
	
	
	private static function runBashFunction($bashfunction) {
		
		$descriptorspec = array(
			 0 => array("pipe", "r"),    // stdin is a pipe that the child will read from
			 1 => array("pipe", "w"),    // stdout is a pipe that the child will write to
			 2 => array("pipe", "w") // stderr is a pipe too
		);
		
		$cwd = '.';
		$env = array();
	
		$process = proc_open('bash', $descriptorspec, $pipes, $cwd, $env);
	
		if (is_resource($process)) {
	
			//echo '<br>'.$bashfunction.'<br>';
	
			fwrite($pipes[0], "source /opt/ros/melodic/setup.bash\n");
			fwrite($pipes[0], "source /home/elodie/Elodie_ws/devel/setup.bash\n");
			fwrite($pipes[0], $bashfunction."\n");
			fclose($pipes[0]);

			$output = stream_get_contents($pipes[1]);
			$error = stream_get_contents($pipes[2]);
			fclose($pipes[1]);
			fclose($pipes[2]);

			$return_value = proc_close($process);
	
			/*
			echo 'DEBUG error<br>';
			print_r($error);
			echo 'DEBUG return_value<br>';
			print_r($return_value);
			echo 'DEBUG output<br>';
			print_r($output);
			*/
	
			//note, $error and $return_value are discarded
			return $output;
		}
		return null;
	}
	
	private static function function PrepareJSON($json)
	{
		return str_replace('{', '\{', str_replace('}', '\}', addslashes($json)));
	}
	
	private static function ParseResult($result)
	{
		$jsonComple = '';
		$jsonStarted = false;
		$lignes = explode("\n", $result);
			
		foreach($lignes as $ligne)
		{
			if ($jsonStarted)
			{
				$jsonComplet.= "\n".$ligne;
			}
			elseif (substr($ligne, 0, 4) == 'json')
			{
				$jsonStarted = true;
				$jsonComplet = substr($ligne, 7);
			}
		}
		$jsonComplet = substr($jsonComplet, 0, -2); // On enleve le dernier "
		$jsonComplet = str_replace('\n', "\n", $jsonComplet);
		$jsonComplet = str_replace('\r', "\r", $jsonComplet);
		$jsonComplet = str_replace('\t', "\t", $jsonComplet);
	
		/*
		echo 'DEBUG jsonComplet<br>';
		echo '|'.stripslashes($jsonComplet).'|<br>';
		*/
			
		$json_decoded = json_decode(stripslashes($jsonComplet));
		if (json_last_error() == JSON_ERROR_NONE)
			return $json_decoded;
		else
			return 'Error decode JSON';
	}
	
	public static function WycaAPICall($json)
	{
		$cmd = "rosservice call /wyca_api/php_interface_message \"".self::$_api_key."\" \"".self::PrepareJSON($json)."\"";
		$result = self::runBashFunction($cmd);
		return self::ParseResult($result);
	}
}