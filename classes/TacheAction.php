<?php
class TacheAction extends TacheActionCore
{
	public static $TYPE_GotoPOI 	= 1;
	public static $TYPE_WaitClick 	= 2;
	public static $TYPE_WaitTime 	= 3;
	
	
	public static $FIN_Stop 	= 0;
	public static $FIN_Redo 	= 1;
	/* 
	action type		name
	1				Go to POI
	2				Wait click on screen
	3				Wait x secondes
	*/
}
?>