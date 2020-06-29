<?php
error_reporting(E_ALL);
ini_set("track_errors", 1);
ini_set("html_errors", 1);
ini_set("display_errors", 1);

$output = array();
echo exec('LANG=C nmcli -w 10 device wifi connect "HUAWEIj Mate 20" password "ba8ec95b7707" ifname "wlp1s0" 2>&1', $output, $code);
print_r($output);
print_r($code);


/*
[2K Device 'wlp1s0' successfully activated with '1f0db09d-c395-41a4-92c3-42a41f7966ce'.Array ( [0] => [2K Device 'wlp1s0' successfully activated with '1f0db09d-c395-41a4-92c3-42a41f7966ce'. ) 0
*/
/*
erreur mdp
Error: Connection activation failed: (10) 802.1X supplicant failed.Array
(
    [0] => Error: Connection activation failed: (10) 802.1X supplicant failed.
)
0
erreur ssid wifi
Error: No network with SSID 'HUAWEI Mate 202' found.Array
(
    [0] => Error: No network with SSID 'HUAWEI Mate 202' found.
)
10
*/

die();

