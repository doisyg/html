<?php
class ApiServiceUser extends ApiServiceUserCore
{
	public static function ClearUser($id_user)
	{
		$query="DELETE FROM api_service_user WHERE id_user = '".((int)$id_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiServiceUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>