<?php
class UserCore
{
	public $id_user = -1;
	public $email = "";
	public $pass = "";
	public $nom = "";
	public $prenom = "";
	public $adresse_1 = "";
	public $adresse_2 = "";
	public $codepostal = "";
	public $ville = "";
	public $societe = "";
	public $tel = "";
	public $portable = "";
	public $id_groupe_user = -1;
	public $actif = 0;
	public $deleted = 0;
	public $tel_sip = -1;
	public $photo = "";
	public $last_connection = "";
	public $online = -1;
	public $api_key = "";
	public $id_lang = -1;
	public $acces_suivi = 0;
	public $trax_options = "";

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
		$this->adresse_1 = $object->adresse_1;
		$this->adresse_2 = $object->adresse_2;
		$this->codepostal = $object->codepostal;
		$this->ville = $object->ville;
		$this->societe = $object->societe;
		$this->tel = $object->tel;
		$this->portable = $object->portable;
		$this->id_groupe_user = $object->id_groupe_user;
		$this->actif = $object->actif;
		$this->deleted = $object->deleted;
		$this->tel_sip = $object->tel_sip;
		$this->photo = $object->photo;
		$this->last_connection = $object->last_connection;
		$this->online = $object->online;
		$this->api_key = $object->api_key;
		$this->id_lang = $object->id_lang;
		$this->acces_suivi = $object->acces_suivi;
		$this->trax_options = $object->trax_options;
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
		$query = "INSERT INTO user ( email, pass, nom, prenom, adresse_1, adresse_2, codepostal, ville, societe, tel, portable, id_groupe_user, actif, deleted, tel_sip, photo, last_connection, online, api_key, id_lang, acces_suivi, trax_options ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->email) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->pass) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->prenom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->adresse_1) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->adresse_2) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->codepostal) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ville) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->societe) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->tel) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->portable) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->actif) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->deleted) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->tel_sip) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->photo) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->last_connection) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->online) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->api_key) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_lang) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->acces_suivi) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->trax_options) ."'
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
			adresse_1 = '". mysqli_real_escape_string(DB::$connexion,  $this->adresse_1 )."', 
			adresse_2 = '". mysqli_real_escape_string(DB::$connexion,  $this->adresse_2 )."', 
			codepostal = '". mysqli_real_escape_string(DB::$connexion,  $this->codepostal )."', 
			ville = '". mysqli_real_escape_string(DB::$connexion,  $this->ville )."', 
			societe = '". mysqli_real_escape_string(DB::$connexion,  $this->societe )."', 
			tel = '". mysqli_real_escape_string(DB::$connexion,  $this->tel )."', 
			portable = '". mysqli_real_escape_string(DB::$connexion,  $this->portable )."', 
			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."', 
			actif = '". mysqli_real_escape_string(DB::$connexion,  $this->actif )."', 
			deleted = '". mysqli_real_escape_string(DB::$connexion,  $this->deleted )."', 
			tel_sip = '". mysqli_real_escape_string(DB::$connexion,  $this->tel_sip )."', 
			photo = '". mysqli_real_escape_string(DB::$connexion,  $this->photo )."', 
			last_connection = '". mysqli_real_escape_string(DB::$connexion,  $this->last_connection )."', 
			online = '". mysqli_real_escape_string(DB::$connexion,  $this->online )."', 
			api_key = '". mysqli_real_escape_string(DB::$connexion,  $this->api_key )."', 
			id_lang = '". mysqli_real_escape_string(DB::$connexion,  $this->id_lang )."', 
			acces_suivi = '". mysqli_real_escape_string(DB::$connexion,  $this->acces_suivi )."', 
			trax_options = '". mysqli_real_escape_string(DB::$connexion,  $this->trax_options )."'
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