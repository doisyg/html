<?php
class ApiActionGroupe extends ApiActionGroupeCore
{
	public static function ClearGroupe($id_groupe_user)
	{
		$query="DELETE FROM api_action_groupe WHERE id_groupe_user = '".((int)$id_groupe_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiActionUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_action WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		
		$query="DELETE FROM api_action_groupe WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action_groupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>