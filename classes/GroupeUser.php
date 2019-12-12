<?php
class GroupeUser extends GroupeUserCore
{
	private $_cando = array();
	public function CanDo($menu, $sousmenu='', $action='view')
	{
		if (isset($this->_cando[$menu.'||'.$sousmenu.'||'.$action])) return $this->_cando[$menu.'||'.$sousmenu.'||'.$action];
		$query='SELECT * FROM groupe_droit gd, droit d WHERE 
			id_groupe_user = "'.$this->id_groupe_user.'" AND 
			d.id_droit = gd.id_droit AND
			d.section = "'.mysqli_real_escape_string(DB::$connexion, $menu).'" AND
			d.action = "'.mysqli_real_escape_string(DB::$connexion, $action).'"';
		if ($sousmenu!='')
		{
			$query .= ' AND d.sous_section = "'.mysqli_real_escape_string(DB::$connexion, $sousmenu).'"';
		}
		$resultat=mysqli_query(DB::$connexion, $query);
		if (mysqli_fetch_array($resultat))
		{
			$this->_cando[$menu.'||'.$sousmenu.'||'.$action] = true;
			return true;
		}
		
		$this->_cando[$menu.'||'.$sousmenu.'||'.$action] = false;
		return false;
	}
	
	private $_candoid = array();
	public function CanDoId($id_droit)
	{
		if (isset($this->_candoid[$id_droit])) return $this->_candoid[$id_droit];
		
		$query='SELECT * FROM groupe_droit  WHERE 
			id_groupe_user = "'.$this->id_groupe_user.'" AND 
			id_droit = "'.mysqli_real_escape_string(DB::$connexion, $id_droit).'"';
		$resultat=mysqli_query(DB::$connexion, $query);
		if (mysqli_fetch_array($resultat))
		{
			$this->_candoid[$id_droit] = true;
			return true;
		}
		
		$this->_candoid[$id_droit] = false;
		return false;
	}
	
	public function ViderDroits()
	{
		$query='DELETE FROM groupe_droit WHERE id_groupe_user="'.mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user).'"';
		$delete=mysqli_query(DB::$connexion, $query) or die (mysqli_error(DB::$connexion).'<br />'.$query);
	}
	
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
	
	public function AddCanDo($id_droit)
	{
		$query='INSERT INTO groupe_droit (id_groupe_user, id_droit) VALUES ("'.mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user).'", "'.mysqli_real_escape_string(DB::$connexion, $id_droit).'")';
		$insert=mysqli_query(DB::$connexion, $query) or die (mysqli_error(DB::$connexion).'<br />'.$query);
	}
	
	public function Supprimer()
	{
		$this->ViderDroits();
		
		$query="DELETE FROM groupe_user WHERE id_groupe_user = '".mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete GroupeUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>