<?php
class ApiTopicGroupe extends ApiTopicGroupeCore
{
	public static function ClearUser($id_user)
	{
		$query="DELETE FROM api_topic_user WHERE id_user = '".((int)$id_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>