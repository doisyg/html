<?php
class Crypt
{
	/*
	C:\wamp64\bin\apache\apache2.4.27\bin\openssl genrsa -out private.key 1024
	C:\wamp64\bin\apache\apache2.4.27\bin\openssl rsa -in private.key -out public.key -pubout -outform PEM
	*/

	
	private static $_private_key = '';
	private static $_public_key = '';
	
	public static function Crypter($texte)
	{
		global $_CONFIG;
		if (self::$_public_key == '') self::$_public_key = file_get_contents($_CONFIG['KEYS_DIR'].'public.key');
		openssl_public_encrypt($texte, $crypted, self::$_public_key);
		return base64_encode($crypted);
	}
	
	public static function Decrypter($texte)
	{
		global $_CONFIG;
		if (self::$_private_key == '') self::$_private_key = file_get_contents($_CONFIG['KEYS_DIR'].'private.key');
		openssl_private_decrypt(base64_decode($texte), $decrypted, self::$_private_key);
		return $decrypted;
	}
}