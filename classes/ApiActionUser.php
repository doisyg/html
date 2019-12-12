<?php
class ApiActionUser extends ApiActionUserCore
{
	public static function ClearUser($id_user)
	{
		$query="DELETE FROM api_action_user WHERE id_user = '".((int)$id_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiActionUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>