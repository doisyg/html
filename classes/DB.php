<?php
class DB
{
	public static $connexion;
	
	public static function Connexion ($host, $user, $mdp, $base)
	{
		self::$connexion = mysqli_connect($host, $user, $mdp, $base);
	}
}