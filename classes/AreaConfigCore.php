<?php
class AreaConfigCore
{
	public $id_area_config = -1;
	public $id_area = -1;
	public $name = "";
	public $value = "";

	public function __construct( $id_area_config = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_area_config);
		}
		elseif(! is_null($id_area_config) && $id_area_config != -1 )
		{
			$object = AreaConfig::getAreaConfig( $id_area_config );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_area_config = $object->id_area_config;
		$this->id_area = $object->id_area;
		$this->name = $object->name;
		$this->value = $object->value;
	}

	public static function getAreaConfig( $id_area_config )
	{
		$query = "SELECT * FROM area_config a1 WHERE id_area_config = '".mysqli_real_escape_string(DB::$connexion, $id_area_config)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_area_config == -1 || is_null($this->id_area_config) )
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
		$query = "INSERT INTO area_config ( id_area, name, value ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_area) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->value) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert AreaConfig : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_area_config = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE area_config SET

			id_area = '". mysqli_real_escape_string(DB::$connexion,  $this->id_area )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			value = '". mysqli_real_escape_string(DB::$connexion,  $this->value )."'
		WHERE id_area_config = '". mysqli_real_escape_string(DB::$connexion, $this->id_area_config)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update AreaConfig : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM area_config WHERE id_area_config = '".mysqli_real_escape_string(DB::$connexion, $this->id_area_config)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete AreaConfig : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetAreaConfigs($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area_config";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area_config ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new AreaConfig($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>