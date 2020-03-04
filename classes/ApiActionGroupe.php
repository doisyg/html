<?php
class ApiActionGroupe extends ApiActionGroupeCore
{
	public static function ClearUser($id_user)
	{
		$query="DELETE FROM api_action_user WHERE id_user = '".((int)$id_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiActionUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_action WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		
		$query="DELETE FROM api_action_user WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action_user : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>