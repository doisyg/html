<?php 
error_reporting(E_ALL);
ini_set("display_errors", 1);
echo base64_encode(file_get_contents('./t.png'));
