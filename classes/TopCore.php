<?php
class TopCore
{
	public $id_top = -1;
	public $name = "";
	public $manufacturer = "";
	public $size_x = -1;
	public $size_y = -1;
	public $size_z = -1;
	public $have_3d_cam = 0;
	public $pos_x = -1;
	public $pos_y = -1;
	public $pos_z = -1;
	public $image_name = "";
	public $have_cpu = 0;
	public $available = 0;
	public $active = 0;

	public function __construct( $id_top = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_top);
		}
		elseif(! is_null($id_top) && $id_top != -1 )
		{
			$object = Top::getTop( $id_top );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_top = $object->id_top;
		$this->name = $object->name;
		$this->manufacturer = $object->manufacturer;
		$this->size_x = $object->size_x;
		$this->size_y = $object->size_y;
		$this->size_z = $object->size_z;
		$this->have_3d_cam = $object->have_3d_cam;
		$this->pos_x = $object->pos_x;
		$this->pos_y = $object->pos_y;
		$this->pos_z = $object->pos_z;
		$this->image_name = $object->image_name;
		$this->have_cpu = $object->have_cpu;
		$this->available = $object->available;
		$this->active = $object->active;
	}

	public static function getTop( $id_top )
	{
		$query = "SELECT * FROM top a1 WHERE id_top = '".mysqli_real_escape_string(DB::$connexion, $id_top)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_top == -1 || is_null($this->id_top) )
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
		$query = "INSERT INTO top ( name, manufacturer, size_x, size_y, size_z, have_3d_cam, pos_x, pos_y, pos_z, image_name, have_cpu, available, active ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->manufacturer) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->size_x) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->size_y) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->size_z) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->have_3d_cam) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->pos_x) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->pos_y) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->pos_z) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->image_name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->have_cpu) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->available) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->active) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Top : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_top = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE top SET

			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			manufacturer = '". mysqli_real_escape_string(DB::$connexion,  $this->manufacturer )."', 
			size_x = '". mysqli_real_escape_string(DB::$connexion,  $this->size_x )."', 
			size_y = '". mysqli_real_escape_string(DB::$connexion,  $this->size_y )."', 
			size_z = '". mysqli_real_escape_string(DB::$connexion,  $this->size_z )."', 
			have_3d_cam = '". mysqli_real_escape_string(DB::$connexion,  $this->have_3d_cam )."', 
			pos_x = '". mysqli_real_escape_string(DB::$connexion,  $this->pos_x )."', 
			pos_y = '". mysqli_real_escape_string(DB::$connexion,  $this->pos_y )."', 
			pos_z = '". mysqli_real_escape_string(DB::$connexion,  $this->pos_z )."', 
			image_name = '". mysqli_real_escape_string(DB::$connexion,  $this->image_name )."', 
			have_cpu = '". mysqli_real_escape_string(DB::$connexion,  $this->have_cpu )."', 
			available = '". mysqli_real_escape_string(DB::$connexion,  $this->available )."', 
			active = '". mysqli_real_escape_string(DB::$connexion,  $this->active )."'
		WHERE id_top = '". mysqli_real_escape_string(DB::$connexion, $this->id_top)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Top : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM top WHERE id_top = '".mysqli_real_escape_string(DB::$connexion, $this->id_top)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Top : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTops($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM top";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_top ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Top($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>