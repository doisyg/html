<?php
class GroupeUserCore
{
	public $id_groupe_user = -1;
	public $nom = "";

	public function __construct( $id_groupe_user = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_groupe_user);
		}
		elseif(! is_null($id_groupe_user) && $id_groupe_user != -1 )
		{
			$object = GroupeUser::getGroupeUser( $id_groupe_user );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_groupe_user = $object->id_groupe_user;
		$this->nom = $object->nom;
	}

	public static function getGroupeUser( $id_groupe_user )
	{
		$query = "SELECT * FROM groupe_user a1 WHERE id_groupe_user = '".mysqli_real_escape_string(DB::$connexion, $id_groupe_user)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_groupe_user == -1 || is_null($this->id_groupe_user) )
		{
			$this->Insert( );	
		}
		else
		{
			$this->Update( );
		}
	}

	public function Insert()
	{
		global $_CONFIG;
		$query = "INSERT INTO groupe_user ( nom ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert GroupeUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_groupe_user = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE groupe_user SET

			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."'
		WHERE id_groupe_user = '". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update GroupeUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM groupe_user WHERE id_groupe_user = '".mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete GroupeUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetGroupeUsers($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM groupe_user";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_groupe_user ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new GroupeUser($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>