<?php
class ConfigurationCore
{
	public $id_configuration = -1;
	public $nom = "";
	public $description = "";
	public $valeur = "";

	public function __construct( $id_configuration = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_configuration);
		}
		elseif(! is_null($id_configuration) && $id_configuration != -1 )
		{
			$object = Configuration::getConfiguration( $id_configuration );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_configuration = $object->id_configuration;
		$this->nom = $object->nom;
		$this->description = $object->description;
		$this->valeur = $object->valeur;
	}

	public static function getConfiguration( $id_configuration )
	{
		$query = "SELECT * FROM configuration a1 WHERE id_configuration = '".mysqli_real_escape_string(DB::$connexion, $id_configuration)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_configuration == -1 || is_null($this->id_configuration) )
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
		$query = "INSERT INTO configuration ( nom, description, valeur ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->description) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->valeur) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Configuration : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_configuration = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE configuration SET

			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			description = '". mysqli_real_escape_string(DB::$connexion,  $this->description )."', 
			valeur = '". mysqli_real_escape_string(DB::$connexion,  $this->valeur )."'
		WHERE id_configuration = '". mysqli_real_escape_string(DB::$connexion, $this->id_configuration)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Configuration : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM configuration WHERE id_configuration = '".mysqli_real_escape_string(DB::$connexion, $this->id_configuration)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Configuration : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetConfigurations($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM configuration";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_configuration ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Configuration($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>