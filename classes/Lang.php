<?php
class Lang
{
	public $id_lang = -1;
	public $iso = "";
	public $langue = "";
	
	private static $_langues = array();
	private static $_idbyiso = array();
	
	public static function Init()
	{
		self::$_langues = array();
		$l = new Lang(); $l->id_lang=1; $l->iso = 'fr'; $l->langue = 'Français';
		self::$_langues[] = $l;
		$_idbyiso['fr'] = $l;
		$l = new Lang(); $l->id_lang=2; $l->iso = 'en'; $l->langue = 'English';
		self::$_langues[] = $l;
		$_idbyiso['en'] = $l;
	}
	
	public function __construct( $id_lang = null, $byrow=false ) 
	{
		if(! is_null($id_lang) && $id_lang != -1 )
		{
			$l = self::$_langues[$id_lang-1];
			$this->id_lang = $l->id_lang;
			$this->iso = $l->iso;
			$this->langue = $l->langue;
		}
	}

	public static function GetLangs($order = "", $order_sens = "")
	{
		return self::$_langues;
	}
	
	public static function GetIdByIso($iso)
	{
		return self::$_idbyiso[$iso];
	}
}

Lang::Init();
?>