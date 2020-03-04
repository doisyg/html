<?php
class ApiTopicPubGroupe extends ApiTopicPubGroupeCore
{
	public static function ClearUser($id_user)
	{
		$query="DELETE FROM api_topic_pub_user WHERE id_user = '".((int)$id_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicPubUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>