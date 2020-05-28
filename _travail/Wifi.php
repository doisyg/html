<?php
class Wifi
{
	public static function Scan()
	{
		exec('nmcli device wifi rescan 2>&1', $output, $code);
	}
	
	public static function GetWifiList()
	{
		$lists = array();
		$output = array();
		exec('LANG=C nmcli  --terse --fields active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags device wifi  list 2>&1', $output, $code);
		
		foreach($output as $line)
		{
			if (trim($line) != '' && strlen($line) > 10 && substr($line, 0, 10) != 'PERMISSION')
			{
				$champs = explode(':', str_replace('\:', '', $line));
				if (count($champs) == 10)
				{
					$wifi = array();
					$wifi['active'] 	= $champs[0];
					$wifi['state'] 		= $champs[0]=='yes'?'active':'';
					$wifi['ssid'] 		= $champs[1];
					$wifi['bssid'] 		= $champs[2];
					$wifi['mode'] 		= $champs[3];
					$wifi['chan'] 		= $champs[4];
					$wifi['freq'] 		= $champs[5];
					$wifi['signal'] 	= $champs[6];
					$wifi['security'] 	= $champs[7];
					$wifi['wpa-flags'] 	= $champs[8];
					$wifi['rsn-flags'] 	= $champs[9];
					
					$lists[] = $wifi;
				}
			}
		}
		
		return $lists;		
	}
	
	public static function Connect($ssid, $passwd)
	{
		$output = array();
		exec('LANG=C nmcli -w 10 device wifi connect "'.$ssid.'" password "'.$passwd.'" ifname "wlp1s0" 2>&1', $output, $code);
		
		if (strlen($output[0]) > 5 && substr($output[0], 0, 5) == 'Error')
			return array('error' => true, 'message' => $output[0]); 
		else
			return array('error' => false, 'message' => ''); 
		
		/*
		[2K Device 'wlp1s0' successfully activated with '1f0db09d-c395-41a4-92c3-42a41f7966ce'.
		Array ( [0] => [2K Device 'wlp1s0' successfully activated with '1f0db09d-c395-41a4-92c3-42a41f7966ce'. ) 0
		*/
		/*
		erreur mdp
		Error: Connection activation failed: (10) 802.1X supplicant failed.Array
		(
			[0] => Error: Connection activation failed: (10) 802.1X supplicant failed.
		)
		0
		erreur ssid wifi
		Error: No network with SSID 'HUAWEI Mate 202' found.Array
		(
			[0] => Error: No network with SSID 'HUAWEI Mate 202' found.
		)
		*/
	}
}