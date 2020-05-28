<?php

define('FILE_ENCRYPTION_BLOCKS', 1000);
$key = 'R0sJ3K+Pfo19hysEdQr7e7u0fEjC/rUTVxZotH1A98FzE781x3+U+v/FJAmS7KH7';

function encryptFile($source, $key, $dest)
{
    $key = substr(sha1($key, true), 0, 16);
    $iv = openssl_random_pseudo_bytes(16);

    $error = false;
    if ($fpOut = fopen($dest, 'w')) {
        // Put the initialzation vector to the beginning of the file
        fwrite($fpOut, $iv);
        if ($fpIn = fopen($source, 'rb')) {
            while (!feof($fpIn)) {
                $plaintext = fread($fpIn, 16 * FILE_ENCRYPTION_BLOCKS);
                $ciphertext = openssl_encrypt($plaintext, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);
                // Use the first 16 bytes of the ciphertext as the next initialization vector
                $iv = substr($ciphertext, 0, 16);
                fwrite($fpOut, $ciphertext);
            }
            fclose($fpIn);
        } else {
            $error = true;
        }
        fclose($fpOut);
    } else {
        $error = true;
    }

    return $error ? false : $dest;
}

function encryptStringInFile($source, $key, $dest)
{
    $key = substr(sha1($key, true), 0, 16);
    $iv = openssl_random_pseudo_bytes(16);

    $error = false;
    if ($fpOut = fopen($dest, 'w')) {
        // Put the initialzation vector to the beginning of the file
        fwrite($fpOut, base64_encode($iv));
		echo strlen(base64_encode($iv));
		
		$start = 0;
		while ($start < strlen($source))
		{
			$plaintext = substr($source, $start, FILE_ENCRYPTION_BLOCKS);
			echo 'plaintext:'.$plaintext.'<br />';
			$ciphertext = openssl_encrypt($plaintext, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);
			echo strlen($plaintext). ' '.strlen($ciphertext).'<br />';
			echo strlen(base64_encode($ciphertext)).'<br />';
			// Use the first 16 bytes of the ciphertext as the next initialization vector
			$iv = substr($ciphertext, 0, 16);
			fwrite($fpOut, base64_encode($ciphertext));
			$start += FILE_ENCRYPTION_BLOCKS;
        }
        fclose($fpOut);
    }
	else {
        $error = true;
    }

    return $error ? false : $dest;
}



//$img = file_get_contents('interactive.png'); 
$img = file_get_contents('interactive_light.png'); 

$json_top = array('id_top' => 8, 'manufacturer'=> 'Wyca', 'name'=>'Top steph', 'description'=>'Un super top', 'top_key'=>'A GENRER', 'size_x'=>10, 'size_y'=>10, 'size_z'=>10, 'pos_x'=> 0, 'pos_y'=> 0, 'pos_z'=>0, 'have_3d_cam'=> false, 'cam_pos_x'=>0, 'cam_pos_y'=>0, 'cam_pos_z'=>0, 'cam_t_x'=>0, 'cam_t_y'=>0, 'cam_t_z'=>0, 'have_cpu'=> true, 'data_storage'=> '', 'image_b64' => base64_encode($img));

//echo json_encode($json_top).'<br /><br />';

/*
if ($fpOut = fopen("test.tmp", 'w'))
	fwrite($fpOut, json_encode($json_top));
fclose($fpOut);
encryptFile ("test.tmp", $key, "test.crypted");
unlink("test.tmp");
*/

//encryptStringInFile(json_encode($json_top)."|IMG|".base64_encode($img)."|FIMG|", $key, "test.crypted");
encryptStringInFile(json_encode($json_top), $key, "test.crypted");



$json_top = array('id_top' => 8, 'manufacturer'=> 'Wyca', 'name'=>'Top steph', 'description'=>'Un super top', 'top_key'=>'A GENRER', 'size_x'=>10, 'size_y'=>10, 'size_z'=>10, 'pos_x'=> 0, 'pos_y'=> 0, 'pos_z'=>0, 'have_3d_cam'=> false, 'cam_pos_x'=>0, 'cam_pos_y'=>0, 'cam_pos_z'=>0, 'cam_t_x'=>0, 'cam_t_y'=>0, 'cam_t_z'=>0, 'have_cpu'=> true, 'data_storage'=> '', 'image_b64'=> '');

echo json_encode($json_top).'<br /><br />';
/*
if ($fpOut = fopen("test.tmp", 'w'))
	fwrite($fpOut, json_encode($json_top));
fclose($fpOut);
encryptFile ("test.tmp", $key, "test_without_img.crypted");
unlink("test.tmp");
*/
//encryptStringInFile(json_encode($json_top)."|IMG|"."|FIMG|", $key, "test_without_img.crypted");
encryptStringInFile(json_encode($json_top), $key, "test_without_img.crypted");