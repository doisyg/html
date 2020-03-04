<?php
class IpErrorTrace extends IpErrorTraceCore
{
	public static function Nettoyer()
	{
		$date =  date('Y-m-d', strtotime(date('Y-m-d').' - 1 DAY'));
		$query = 'DELETE FROM ip_error_trace WHERE LEFT(date, 10)<="'.$date.'"';
		$delete = mysqli_query(DB::$connexion, $query);
	}
	
	public static function CheckIP($ip)
	{
		self::Nettoyer();
		
		$query = 'SELECT * FROM ip_error_trace WHERE IP="'.mysqli_real_escape_string(DB::$connexion, $ip).'"';
		$rnb = mysqli_query(DB::$connexion, $query);
		$nb = mysqli_num_rows($rnb);
		
		return $nb;
	}
	
	public static function AutoClear()
	{
		$query='DELETE FROM ip_error_trace WHERE date <= "'.mysqli_real_escape_string(DB::$connexion, date('Y-m-d H:i:s', strtotime("-180 minutes"))).'"';
		$result = mysqli_query(DB::$connexion, $query);
	}
}
?>