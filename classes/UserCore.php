<?php
class UserCore
{
	public $id_user = -1;
	public $email = "";
	public $pass = "";
	public $nom = "";
	public $prenom = "";
	public $societe = "";
	public $id_groupe_user = -1;
	public $actif = 0;
	public $deleted = 0;
	public $last_connection = "";
	public $api_key = "";
	public $pin = "";

	public function __construct( $id_user = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_user);
		}
		elseif(! is_null($id_user) && $id_user != -1 )
		{
			$object = User::getUser( $id_user );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_user = $object->id_user;
		$this->email = $object->email;
		$this->pass = $object->pass;
		$this->nom = $object->nom;
		$this->prenom = $object->prenom;
		$this->societe = $object->societe;
		$this->id_groupe_user = $object->id_groupe_user;
		$this->actif = $object->actif;
		$this->deleted = $object->deleted;
		$this->last_connection = $object->last_connection;
		$this->api_key = $object->api_key;
		$this->pin = $object->pin;
	}

	public static function getUser( $id_user )
	{
		$query = "SELECT * FROM user a1 WHERE id_user = '".mysqli_real_escape_string(DB::$connexion, $id_user)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_user == -1 || is_null($this->id_user) )
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
		$query = "INSERT INTO user ( email, pass, nom, prenom, societe, id_groupe_user, actif, deleted, last_connection, api_key, pin ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->email) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->pass) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->prenom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->societe) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->actif) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->deleted) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->last_connection) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->api_key) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->pin) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert User : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_user = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE user SET

			email = '". mysqli_real_escape_string(DB::$connexion,  $this->email )."', 
			pass = '". mysqli_real_escape_string(DB::$connexion,  $this->pass )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			prenom = '". mysqli_real_escape_string(DB::$connexion,  $this->prenom )."', 
			societe = '". mysqli_real_escape_string(DB::$connexion,  $this->societe )."', 
			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."', 
			actif = '". mysqli_real_escape_string(DB::$connexion,  $this->actif )."', 
			deleted = '". mysqli_real_escape_string(DB::$connexion,  $this->deleted )."', 
			last_connection = '". mysqli_real_escape_string(DB::$connexion,  $this->last_connection )."', 
			api_key = '". mysqli_real_escape_string(DB::$connexion,  $this->api_key )."', 
			pin = '". mysqli_real_escape_string(DB::$connexion,  $this->pin )."'
		WHERE id_user = '". mysqli_real_escape_string(DB::$connexion, $this->id_user)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update User : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$this->deleted=1;
		$this->Save();
	}

	public static function GetUsers($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM user WHERE deleted=0 ";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_user ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new User($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>