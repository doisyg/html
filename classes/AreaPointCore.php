<?php
class AreaPointCore
{
	public $id_area_point = -1;
	public $id_area = -1;
	public $x = 0.0;
	public $y = 0.0;

	public function __construct( $id_area_point = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_area_point);
		}
		elseif(! is_null($id_area_point) && $id_area_point != -1 )
		{
			$object = AreaPoint::getAreaPoint( $id_area_point );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_area_point = $object->id_area_point;
		$this->id_area = $object->id_area;
		$this->x = $object->x;
		$this->y = $object->y;
	}

	public static function getAreaPoint( $id_area_point )
	{
		$query = "SELECT * FROM area_point a1 WHERE id_area_point = '".mysqli_real_escape_string(DB::$connexion, $id_area_point)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_area_point == -1 || is_null($this->id_area_point) )
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
		$query = "INSERT INTO area_point ( id_area, x, y ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_area) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->x) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->y) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert AreaPoint : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_area_point = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE area_point SET

			id_area = '". mysqli_real_escape_string(DB::$connexion,  $this->id_area )."', 
			x = '". mysqli_real_escape_string(DB::$connexion,  $this->x )."', 
			y = '". mysqli_real_escape_string(DB::$connexion,  $this->y )."'
		WHERE id_area_point = '". mysqli_real_escape_string(DB::$connexion, $this->id_area_point)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update AreaPoint : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM area_point WHERE id_area_point = '".mysqli_real_escape_string(DB::$connexion, $this->id_area_point)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete AreaPoint : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetAreaPoints($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area_point";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area_point ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new AreaPoint($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>