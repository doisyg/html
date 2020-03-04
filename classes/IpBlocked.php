<?php
class IpBlocked extends IpBlockedCore
{	
	public function Insert()
	{
		$query = "INSERT INTO ip_blocked ( ip, date ) VALUES ( 
			'". mysqli_real_escape_string(DB::$connexion, $this->IP) ."',
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert IpBlocked : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}


	public static function IsBlocked($ip)
	{
		$query='SELECT * FROM ip_blocked WHERE IP="'.mysqli_real_escape_string(DB::$connexion, $ip).'"';
		$result = mysqli_query(DB::$connexion, $query);
		$retour = false;
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$retour = true;
		}
		@mysqli_free_result( $result );
		return $retour;
	}
	
	public static function Debloquer($ip)
	{
		$query='DELETE FROM ip_blocked WHERE IP="'.mysqli_real_escape_string(DB::$connexion, $ip).'"';
		$result = mysqli_query(DB::$connexion, $query);
		
		$query='DELETE FROM ip_error_trace WHERE IP="'.mysqli_real_escape_string(DB::$connexion, $ip).'"';
		$result = mysqli_query(DB::$connexion, $query);
	}
	
	public static function AutoClear()
	{
		$query='DELETE FROM ip_blocked WHERE date <= "'.mysqli_real_escape_string(DB::$connexion, date('Y-m-d H:i:s', strtotime("-10 minutes"))).'"';
		$result = mysqli_query(DB::$connexion, $query);
	}
}
?>