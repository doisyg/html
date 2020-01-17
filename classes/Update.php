<?php
class Update
{
	public static function CheckUpdate()
	{
		$lastUpdate = Configuration::GetFromVariable('LAST_UPDATE');
		$files = scandir(dirname(__FILE__).'/../updates/');
		foreach($files as $file)
		{
			if (substr($file, -3) == 'php' && ($lastUpdate->valeur == '' || $file > $lastUpdate->valeur))
			{
				include_once(dirname(__FILE__).'/../updates/'.$file);
			}
		}
		
		$lastUpdate->valeur = date('YmdHi').'.php';
		$lastUpdate->Save();
		
	}
}
?>
