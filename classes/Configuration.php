<?php
class Configuration
{
	private static $data = array();
	
	public static function Init()
	{
		$file_path = dirname(__FILE__).'/../lang/c.conf';
		if (file_exists($file_path))
		{
			self::$data = json_decode(file_get_contents ( $file_path ), true);
			if (json_last_error() != JSON_ERROR_NONE)
				self::$data = array();
		}
		else
			self::$data = array();
	}
	
	public static function Save()
	{
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
