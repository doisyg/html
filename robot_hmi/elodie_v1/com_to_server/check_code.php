<?php 

$code_needed = substr(date('m'), 0, 1).substr(date('d'), 0, 1).substr(date('m'), 1, 1).substr(date('d'), 1, 1);

if (isset($_POST['code']) && $_POST['code'] == $code_needed)
	echo 'ok';
else
	echo 'error';
?>