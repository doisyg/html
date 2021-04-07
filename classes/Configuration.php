<?php
class Configuration
{
	private static $data = array();
	
	public static function Init()
	{
		global $_CONFIG;

		//echo exec('whoami');
		if(isset($_CONFIG['CONF_PATH']))
			$file_path = $_CONFIG['CONF_PATH'];
		else
			$file_path = dirname(__FILE__).'/../lang/c.conf';
		//echo $file_path;
		try{
			if (file_exists($file_path))
			{
				$content =  file_get_contents ( $file_path );
				if ( !$content ) {
					self::$data = array();
					throw new Exception('File open failed.');
				}else{
					if ($content == '')
						self::$data = array();
					else
					{
						self::$data = json_decode($content, true);
						if (json_last_error() != JSON_ERROR_NONE){
							self::$data = array();
							throw new Exception('Json decode failed.');
						}
					}
				}
			}
			else{
			
				if(file_exists(dirname(__FILE__).'/../lang/c.conf'))
				{
					//SI OLD c.conf EXIST COPY + LOAD IT
					copy( dirname(__FILE__).'/../lang/c.conf', $file_path);
					$content =  file_get_contents ( $file_path );
					if ( !$content ) {
						self::$data = array();
						throw new Exception('File open failed.');
					}else{
						if ($content == '')
							self::$data = array();
						else
						{
							self::$data = json_decode($content, true);
							if (json_last_error() != JSON_ERROR_NONE){
								self::$data = array();
								throw new Exception('Json decode failed.');
							}
						}
					}
				}
				else
				{
					self::$data = array();
					if ($fd = fopen($file_path, 'w')){
						//CREER C.CONF IF DO NOT EXIST
						fwrite($fd, json_encode(self::$data));
						fclose($fd);
					}else{
						throw new Exception('File not found and unable to create it.');
					}
				}
			}
		}
		catch (Exception $e) {
			echo "Error on loading conf + ".$e->getMessage();
		}
	}
	
	public static function Save()
	{
		global $_CONFIG;
		if(isset($_CONFIG['CONF_PATH']))
			$file_path = $_CONFIG['CONF_PATH'];
		else
			$file_path = dirname(__FILE__).'/../lang/c.conf';

		if ($fd = fopen($file_path, 'w'))
		{	
			fwrite($fd, json_encode(self::$data));
			fclose($fd);
		}
	}
	
	public static function GetValue($name)
	{
		return isset(self::$data[$name])?self::$data[$name]:'';		
	}
	
	public static function SetValue($name, $value)
	{
		self::$data[$name] = $value;
		self::Save();	
	}
}

Configuration::Init();
?>
