<?php
class GroupeUser extends GroupeUserCore
{	
	public function HaveUsers()
	{
		$query='SELECT * FROM user  WHERE id_groupe_user = "'.$this->id_groupe_user.'"';
		$resultat=mysqli_query(DB::$connexion, $query);
		if (mysqli_fetch_array($resultat))
		{
			return true;
		}
		
		return false;
	}
}
?>