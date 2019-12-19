<?php
class Tache extends TacheCore
{

	public function GetActions()
	{
		$query = "SELECT * FROM tache_action WHERE id_tache=".(int)$this->id_tache;
		$query .= " ORDER BY position ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new TacheAction($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>