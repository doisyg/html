<?php
class User extends UserCore
{	
	public static function CheckConnexion( $email, $pass )
	{
		global $_CONFIG;
		
		$query = "SELECT * FROM user WHERE email = '".mysqli_real_escape_string(DB::$connexion, $email)."'";
		$query.=" AND pass='".mysqli_real_escape_string(DB::$connexion, md5($_CONFIG['KEY'].$pass))."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}
	
	public function GetKey()
	{
		global $_CONFIG;
		
		return md5($_CONFIG['WS_KEY'].$this->pass);
	}
	
	
	public function CheckKey($key)
	{
		global $_CONFIG;
		
		return $key == md5($_CONFIG['WS_KEY'].$this->pass);
	}
	
	public static function GetIdConnexion( $email, $pass )
	{
		global $_CONFIG;
		$query = "SELECT * FROM user WHERE email = '".mysqli_real_escape_string(DB::$connexion, $email)."'";
		$query.=" AND pass='".mysqli_real_escape_string(DB::$connexion, md5($_CONFIG['KEY'].$pass))."' AND deleted=0";
		$resultat=mysqli_query(DB::$connexion, $query) or die (mysqli_error(DB::$connexion));
		$user =  mysqli_fetch_object($resultat);
		return $user->id_user;
	}
	
	public static function EmailIsUsed( $email )
	{
		$query = "SELECT * FROM user WHERE email = '".mysqli_real_escape_string(DB::$connexion, $email)."' AND deleted=0";
		$resultat=mysqli_query(DB::$connexion, $query);
		if (mysqli_fetch_object($resultat))
			return true;
		
		return false;
	}
	
	private static function passwdGen($length = 8, $flag = 'ALPHANUMERIC')
	{
		switch ($flag)
		{
			case 'NUMERIC':
				$str = '0123456789';
				break;
			case 'NO_NUMERIC':
				$str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				break;
			default:
				$str = 'abcdefghijkmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				break;
		}

		for ($i = 0, $passwd = ''; $i < $length; $i++)
			$passwd .= substr($str, mt_rand(0, strlen($str) - 1), 1);
		return $passwd;
	}
	
	public static function SendNewPassword( $email )
	{
		global $_CONFIG;
		
		$query = "SELECT * FROM user WHERE email = '".mysqli_real_escape_string(DB::$connexion, $email)."' AND deleted=0";
		$resultat=mysqli_query(DB::$connexion, $query);
		if ($uData = mysqli_fetch_object($resultat))
		{
			$newMdp = self::passwdGen();
			
			$user = new User($uData, true);
			$user->pass = md5($_CONFIG['KEY'].$newMdp);
			$user->Save();
			
			$mail = new Email();
			$mail->destinataire = $user->email;
			$mail->objet = utf8_decode(__m($user->id_lang, 'Nouveau mot de passe'));
			$mail->message = utf8_decode(__m($user->id_lang, 'Suite à votre demande, vous trouverez ci-dessous votre nouveau mot de passe :').'<br />'.$newMdp.'<br /><br />'.__m($user->id_lang, 'Bonne journée.'));
			$mail->Send();
		
			return true;
		}
		return false;
	}

	public static function GetUserByEmail( $email )
	{
		$query = "SELECT * FROM user WHERE email = '".mysqli_real_escape_string(DB::$connexion, $email)."' AND deleted=0";
		$resultat=mysqli_query(DB::$connexion, $query);
		$partenaire = mysqli_fetch_object($resultat);
		return new Partenaire($partenaire, true);
	}
	
	public static function GetUserIdByTel( $tel )
	{
		$query = "SELECT * FROM user WHERE tel_sip = '".mysqli_real_escape_string(DB::$connexion, $tel)."' AND deleted=0";
		$resultat=mysqli_query(DB::$connexion, $query);
		$partenaire = mysqli_fetch_object($resultat);
		return $partenaire->id_user;
	}

	public function ToString()
	{
		return $this->nom." ".$this->prenom;
	}
	
	private $_groupe = null;
	public function CanDo($menu, $sousmenu='', $action='')
	{
		if ($this->_groupe == null) $this->_groupe = new GroupeUser($this->id_groupe_user);
	
		return $this->_groupe->CanDo($menu, $sousmenu, $action);
	}
	
	public static function GetUserFromApiKey ($api_key)
	{
		$query = "SELECT * FROM user u WHERE u.deleted=0 AND api_key = '".mysqli_real_escape_string(DB::$connexion, $api_key)."'";
		$result = mysqli_query(DB::$connexion, $query);
		$user = null;
		if ($row = @mysqli_fetch_object( $result ) )
		{
			$user = new User($row, true);
		}
		@mysqli_free_result( $result );
		return $user;
	}
		
	public static function GetUsersSuivi ($order = "nom ASC, prenom", $order_sens = "ASC")
	{	
		$query = "SELECT * FROM user WHERE deleted=0 AND acces_suivi=1";
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
	
	public function GetApiTopicIds()
	{
		$query = "SELECT * FROM api_topic_user WHERE id_user=".(int)$this->id_user;
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
			$array[$row->id_topic] = $row->id_topic;
		@mysqli_free_result( $result );
		return $array;
	}
	public function GetApiTopicPubIds()
	{
		$query = "SELECT * FROM api_topic_pub_user WHERE id_user=".(int)$this->id_user;
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
			$array[$row->id_topic_pub] = $row->id_topic_pub;
		@mysqli_free_result( $result );
		return $array;
	}
	public function GetApiServiceIds()
	{
		$query = "SELECT * FROM api_service_user WHERE id_user=".(int)$this->id_user;
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
			$array[$row->id_service] = $row->id_service;
		@mysqli_free_result( $result );
		return $array;
	}
	public function GetApiActionIds()
	{
		$query = "SELECT * FROM api_action_user WHERE id_user=".(int)$this->id_user;
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
			$array[$row->id_action] = $row->id_action;
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetApiTopics($order = "", $order_sens = "")
	{
		$query = "SELECT t.* FROM api_topic t, api_topic_user tu WHERE t.id_topic=tu.id_topic AND tu.id_user=".(int)$this->id_user;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY t.id_topic ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopic($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	public function GetApiTopicPubs($order = "", $order_sens = "")
	{
		$query = "SELECT s.* FROM api_topic_pub s, api_topic_pub_user su WHERE s.id_topic_pub=su.id_topic_pub AND su.id_user=".(int)$this->id_user;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY s.id_topic_pub ASC";
		$result = mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<br />'.$query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopicPub($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	public function GetApiServices($order = "", $order_sens = "")
	{
		$query = "SELECT s.* FROM api_service s, api_service_user su WHERE s.id_service=su.id_service AND su.id_user=".(int)$this->id_user;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY s.id_service ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiService($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	public function GetApiActions($order = "", $order_sens = "")
	{
		$query = "SELECT s.* FROM api_action s, api_action_user su WHERE s.id_action=su.id_action AND su.id_user=".(int)$this->id_user;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY s.id_action ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiAction($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetIdServicesAndTopicsToInit()
	{
		$query = "SELECT t.id_service_update, t.id_topic FROM api_topic t , api_topic_user tu WHERE t.id_topic=tu.id_topic AND tu.id_user=".((int)$this->id_user)." AND id_service_update > 0";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			if (!isset($array[$row->id_service_update])) $array[$row->id_service_update] = array();
			$array[$row->id_service_update][] = $row->id_topic;
		}
		
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetIdActionsAndTopicsToInit()
	{
		$query = "SELECT t.id_action_update, t.id_topic FROM api_topic t , api_topic_user tu WHERE t.id_topic=tu.id_topic AND tu.id_user=".((int)$this->id_user)." AND id_action_update > 0";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			if (!isset($array[$row->id_action_update])) $array[$row->id_action_update] = array();
			$array[$row->id_action_update][] = $row->id_topic;
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public static function GenerateAPIKey()
	{
		$nbLetters = 46;
		$charUniverse="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.";
		$nbChars = strlen($charUniverse);
		$randString="";
		
		for($i=0; $i<$nbLetters; $i++){
		   $randInt=rand(0,$nbChars-1);
			$randChar=$charUniverse[$randInt];
			$randString .= $randChar;
		}
		return $randString;
	}
}
?>