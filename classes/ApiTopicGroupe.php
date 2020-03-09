<?php
class ApiTopicGroupe extends ApiTopicGroupeCore
{
	public static function ClearGroupe($id_groupe_user)
	{
		$query="DELETE FROM api_topic_groupe WHERE id_groupe_user = '".((int)$id_groupe_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic WHERE id_topic = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		
		$query="DELETE FROM api_topic_groupe WHERE id_topic = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action_groupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>