<?php
class Plan extends PlanCore
{
	public function SetAsActive()
	{
		die('TODO plan->SetAsActive()');
	}
	
	public function GetAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND is_forbidden=0 AND id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetForbiddenAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND is_forbidden=1 AND id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}

	public function GetStationRecharges($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM station_recharge WHERE id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_station_recharge ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new StationRecharge($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}

	public function GetPois($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM poi WHERE id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_poi ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Poi($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetTaches($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM tache WHERE id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_tache ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Tache($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function ExportToConfig()
	{
		$config = RobotConfig::GetLastConfig();
		$config->Dupliquer();
		$config->update_by = 'Server';
		$config->modifications = 'Update map data';
		$config->Save();
		
		$this->ExportMap($config);
		$this->ExportForbidden($config);
		$this->ExportMapZones($config);
		$this->ExportYamlZones($config);
		$this->ExportPoses($config);
	}
	
	public function ExportMap($config)
	{
		$fichiers = $config->GetListByFile();
		$map_found = false;
		$file = null;
		foreach($fichiers as $f)
		{
			if ($f->directory == '/map' && $f->file == 'map_amcl.png')
			{
				$map_found = true;
				$file = $f;
				break;
			}
		}
		
		if (!$map_found)
		{
			$file = new RobotConfigValue();
			$file->directory = '/map';
			$file->file = 'map_amcl.png';
			$file->id_robot_config = $config->id_robot_config;
			$file->is_file = 0;
			$file->name = '';
		}
		
		$image = imagecreatefromstring(base64_decode($this->image));
		
		$noir = imagecolorallocate($image, 0, 0, 0);
		
		imagesetthickness($image, 2);
		
		ob_start();
		imagepng($image);
		$contents = ob_get_contents();
		ob_end_clean();
		
		try
		{
			if (class_exists('Imagick'))
			{
				$imagick = new Imagick();
				$imagick->readImageBlob($contents);
				$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
				$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
				$imagick->setImageFormat('png32');
				
				ob_start();
				echo $imagick;
				$contents = ob_get_contents();
				ob_end_clean();
			}
		}
		catch(Excepion $e)
		{
		}
			
		$file->data = base64_encode($contents);
		
		$file->date_upd_server = date('Y-m-d H:i:s');
		$file->date_upd_robot = '0000-00-00 00:00:00';
		$file->Save();

	}
	
	public function ExportForbidden($config)
	{
		$fichiers = $config->GetListByFile();
		$map_found = false;
		$file = null;
		foreach($fichiers as $f)
		{
			if ($f->directory == '/map' && $f->file == 'map_forbidden.png')
			{
				$map_found = true;
				$file = $f;
				break;
			}
		}
		
		if (!$map_found)
		{
			$file = new RobotConfigValue();
			$file->directory = '/map';
			$file->file = 'map_forbidden.png';
			$file->id_robot_config = $config->id_robot_config;
			$file->is_file = 0;
			$file->name = '';
		}
			
		$image = imagecreatefromstring(base64_decode($this->image));
		
		$noir = imagecolorallocate($image, 0, 0, 0);
		
		imagesetthickness($image, 2);
		
		$polys = $this->GetForbiddenAreas();
		foreach($polys as $poly)
		{
			$points = $poly->GetPoints();
			for ($i=0; $i<count($points); $i++)
			{
				$ip1 = $i+1;
				if ($i == count($points)-1) $ip1 = 0;
				
				$x1 = $points[$i]->x / 5 * 100;
				$y1 = $this->ros_hauteur - $points[$i]->y / 5 * 100;
				$x2 = $points[$ip1]->x / 5 * 100;
				$y2 = $this->ros_hauteur - $points[$ip1]->y / 5 * 100;
				
				imageline($image, $x1, $y1, $x2, $y2, $noir);
			}
		}
		
		ob_start();
		imagepng($image);
		$contents = ob_get_contents();
		ob_end_clean();
		
		try
		{
			if (class_exists('Imagick'))
			{
				$imagick = new Imagick();
				$imagick->readImageBlob($contents);
				$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
				$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
				$imagick->setImageFormat('png32');
				
				ob_start();
				echo $imagick;
				$contents = ob_get_contents();
				ob_end_clean();
			}
		}
		catch(Excepion $e)
		{
		}
			
		$file->data = base64_encode($contents);
		
		$file->date_upd_server = date('Y-m-d H:i:s');
		$file->date_upd_robot = '0000-00-00 00:00:00';
		$file->Save();
	}
	
	public function ExportMapZones($config)
	{
		$fichiers = $config->GetListByFile();
		$map_found = false;
		$file = null;
		foreach($fichiers as $f)
		{
			if ($f->directory == '/map' && $f->file == 'map_areas.png')
			{
				$map_found = true;
				$file = $f;
				break;
			}
		}
		
		if (!$map_found)
		{
			$file = new RobotConfigValue();
			$file->directory = '/map';
			$file->file = 'map_areas.png';
			$file->id_robot_config = $config->id_robot_config;
			$file->is_file = 0;
			$file->name = '';
		}
			
		$image = imagecreatefromstring(base64_decode($this->image));
		
		try
		{
			if (class_exists('Imagick'))
			{
				$backgroundColor = new \ImagickPixel();
				$backgroundColor->setColor('rgba(255,255,255,1)');
				
				$imagick = new Imagick();
				$imagick->newImage(imagesx($image), imagesy($image), $backgroundColor);
				
				$draw = new \ImagickDraw();
				
				$polys = $this->GetAreas();
				$index_color = 1;
				foreach($polys as $poly)
				{
					$fillColor = new \ImagickPixel();
				    $fillColor->setColor('rgba('.$index_color.', '.$index_color.', '.$index_color.', 1)');
					
					$draw->setFillColor($fillColor);

					$points = $poly->GetPoints();
					$point_img = array();
					for ($i=0; $i<count($points); $i++)
					{	
						$x1 = $points[$i]->x / 5 * 100;
						$y1 = $this->ros_hauteur - $points[$i]->y / 5 * 100;
						
						$point_img[] = array('x' => $x1, 'y' => $y1);
					}
					
					$draw->polygon($point_img);
					
					$index_color++;
				}
				
				$imagick->drawImage($draw);
				
				
				$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
				$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
				$imagick->setImageFormat('png32');
				
				ob_start();
				echo $imagick;
				$contents = ob_get_contents();
				ob_end_clean();
			}
		}
		catch(Excepion $e)
		{
		}
			
		$file->data = base64_encode($contents);
		
		$file->date_upd_server = date('Y-m-d H:i:s');
		$file->date_upd_robot = '0000-00-00 00:00:00';
		$file->Save();
		


		$map_found = false;
		$file = null;
		foreach($fichiers as $f)
		{
			if ($f->directory == '/map' && $f->file == 'map_areas.yaml')
			{
				$map_found = true;
				$file = $f;
				break;
			}
		}
		
		if (!$map_found)
		{
			$file = new RobotConfigValue();
			$file->directory = '/map';
			$file->file = 'map_areas.yaml';
			$file->id_robot_config = $config->id_robot_config;
			$file->is_file = 0;
			$file->name = '';
		}
			
		
		$file->data = 'image: map_areas.png
resolution: 0.05
origin: [0.0, 0.0, 0.0]
occupied_thresh: 0.65
free_thresh: 0.196
negate: 0
mode: raw
';	
		
		$file->date_upd_server = date('Y-m-d H:i:s');
		$file->date_upd_robot = '0000-00-00 00:00:00';
		$file->Save();
	}
	
	public function ExportYamlZones($config)
	{
		$fichiers = $config->GetListByFile();
		$map_found = false;
		$file = null;
		foreach($fichiers as $f)
		{
			if ($f->directory == '/map' && $f->file == 'areas.yaml')
			{
				$map_found = true;
				$file = $f;
				break;
			}
		}
		
		if (!$map_found)
		{
			$file = new RobotConfigValue();
			$file->directory = '/map';
			$file->file = 'areas.yaml';
			$file->id_robot_config = $config->id_robot_config;
			$file->is_file = 0;
			$file->name = '';
		}
			
		
		$file->data = '';
		
		$polys = $this->GetAreas();
		$index_color = 1;
		foreach($polys as $poly)
		{
			$cs = $poly->GetConfigs();
			
			$max_speed_mode = 'Automatic';
			$max_speed = 0;
			$led_color_mode = 'Automatic';
			$led_color = 'rgb(0,0,255)';
			$led_animation_mode = 'Automatic';
			$led_animation = 4;
			
			foreach($cs as $c)
			{
				switch($c->name)
				{
					case 'led_color_mode': $led_color_mode = $c->value; break;
					case 'led_color': $led_color = $c->value; break;
					case 'led_animation_mode': $led_animation_mode = $c->value; break;
					case 'led_animation': $led_animation = $c->value; break;
					case 'max_speed_mode': $max_speed_mode = $c->value; break;
					case 'max_speed': $max_speed = $c->value; break;
				}
			}
			
			$led_R = 0;
			$led_G = 0;
			$led_B = 0;
			if ($led_color_mode != 'Automatic')
			{
				$t = substr($led_color, 4, -1);
				$t = explode(',', $t);
				$led_R = isset($t[0])?((int)$t[0]):0;
				$led_G = isset($t[1])?((int)$t[1]):0;
				$led_B = isset($t[2])?((int)$t[2]):0;
				
				if ($led_R + $led_G + $led_B == 0)
				{
					// Forcer une couleur
					$led_R = 1; 
					$led_G = 1; 
					$led_B = 1; 
				}
			}
			
			$file->data .= '- area_color: '.$index_color.'
  led_anim: '.( ($led_animation_mode == 'Automatic')?0:$led_animation ).'
  led_R: '.$led_R.'
  led_G: '.$led_G.'
  led_B: '.$led_B.'
  max_speed: '.( ($max_speed_mode == 'Automatic')?0:$max_speed/100 ).'
';
			$index_color++;
		}
		
		
		$file->date_upd_server = date('Y-m-d H:i:s');
		$file->date_upd_robot = '0000-00-00 00:00:00';
		$file->Save();
	}
	
	public function ExportPoses($config)
	{
		$fichiers = $config->GetListByFile();
		$map_found = false;
		$file = null;
		foreach($fichiers as $f)
		{
			if ($f->directory == '/poses' && $f->file == 'poses.yaml')
			{
				$map_found = true;
				$file = $f;
				break;
			}
		}
		
		if (!$map_found)
		{
			$file = new RobotConfigValue();
			$file->directory = '/poses';
			$file->file = 'poses.yaml';
			$file->id_robot_config = $config->id_robot_config;
			$file->is_file = 0;
			$file->name = '';
		}
			
		
		$file->data = '';
		
		$docks = $this->GetStationRecharges();
		$dock = new StationRecharge();
		$i = 1;
		foreach($docks as $dock)
		{
			$d = 0.5;
			
			$equation_a = tan($dock->t_ros);
			
			$angle_perpendiculaire = atan($equation_a);
			
			if ( (0 <= $dock->t_ros && $dock->t_ros <= pi()/2) || (pi()*1.5 <= $dock->t_ros) )
			{
				$sx = $dock->x_ros - cos($angle_perpendiculaire) * $d;
				$sy = $dock->y_ros - sin($angle_perpendiculaire) * $d;
			}
			else
			{
				$sx = $dock->x_ros + cos($angle_perpendiculaire) * $d;
				$sy = $dock->y_ros + sin($angle_perpendiculaire) * $d;
			}
				
			
			$file->data .= 'dock'.$i.': {theta: '.$dock->t_ros.', x: '.$sx.', y: '.$sy.'}
start'.$i.': {theta: '.$dock->t_ros.', x: '.$dock->x_ros.', y: '.$dock->y_ros.'}
';
			$i++;
		}
		
		
		$file->date_upd_server = date('Y-m-d H:i:s');
		$file->date_upd_robot = '0000-00-00 00:00:00';
		$file->Save();
	}
}
?>