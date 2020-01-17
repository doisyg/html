<?php
class Update
{
	public static function CheckUpdate()
	{
		$lastUpdate = Configuration::GetFromVariable('LAST_UPDATE');
		$files = scandir(dirname(__FILE__).'/../updates/');
                sort($files);
                $found = '';

		foreach($files as $file)
		{
			if (substr($file, -3) == 'php' && ($lastUpdate->valeur == '' || $file > $lastUpdate->valeur))
			{
                                $found = $file;
				include_once(dirname(__FILE__).'/../updates/'.$file);
			}
		}
		
                if ($found != '')
                {
                    $lastUpdate->valeur = $found;
                    $lastUpdate->Save();
                }
		
	}
}
?>
