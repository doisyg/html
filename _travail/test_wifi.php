<?php
error_reporting(E_ALL);
ini_set("track_errors", 1);
ini_set("html_errors", 1);
ini_set("display_errors", 1);


$output = array();
echo exec('whoami', $output, $code);
print_r($output);
print_r($code);

 
$output = array();
echo exec('nmcli general permissions 2>&1', $output, $code);
print_r($output);
print_r($code);

$output = array();
echo exec('nmcli device wifi rescan 2>&1', $output, $code);
print_r($output);
print_r($code);

$output = array();
echo exec('LANG=C nmcli  --terse --fields active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags device wifi  list 2>&1', $output, $code);
print_r($output);
print_r($code);


die();

/*
www-dataArray
(
    [0] => www-data
)
0org.freedesktop.NetworkManager.enable-disable-connectivity-check  yesArray
(
    [0] => PERMISSION                                                        VALUE
    [1] => org.freedesktop.NetworkManager.enable-disable-network             yes
    [2] => org.freedesktop.NetworkManager.enable-disable-wifi                yes
    [3] => org.freedesktop.NetworkManager.enable-disable-wwan                yes
    [4] => org.freedesktop.NetworkManager.enable-disable-wimax               yes
    [5] => org.freedesktop.NetworkManager.sleep-wake                         yes
    [6] => org.freedesktop.NetworkManager.network-control                    yes
    [7] => org.freedesktop.NetworkManager.wifi.share.protected               yes
    [8] => org.freedesktop.NetworkManager.wifi.share.open                    yes
    [9] => org.freedesktop.NetworkManager.settings.modify.system             yes
    [10] => org.freedesktop.NetworkManager.settings.modify.own                yes
    [11] => org.freedesktop.NetworkManager.settings.modify.hostname           yes
    [12] => org.freedesktop.NetworkManager.settings.modify.global-dns         yes
    [13] => org.freedesktop.NetworkManager.reload                             yes
    [14] => org.freedesktop.NetworkManager.checkpoint-rollback                yes
    [15] => org.freedesktop.NetworkManager.enable-disable-statistics          yes
    [16] => org.freedesktop.NetworkManager.enable-disable-connectivity-check  yes
)
0Error: Scanning not allowed immediately following previous scan.Array
(
    [0] => Error: Scanning not allowed immediately following previous scan.
)
1Array
(
    [0] => no:elodie_001:74\:DA\:38\:EA\:0C\:08:Infra:6:2437 MHz:100:WPA2:(none):pair_ccmp group_ccmp psk
    [1] => no:HUAWEI Mate 20:24\:FB\:65\:87\:66\:60:Infra:11:2462 MHz:100:WPA2:(none):pair_ccmp group_ccmp psk
    [2] => no:wyca_5G80:04\:D9\:F5\:23\:4D\:F8:Infra:100:5500 MHz:67:WPA2:(none):pair_ccmp group_ccmp psk
    [3] => yes:wyca_office:04\:D9\:F5\:23\:4D\:F0:Infra:8:2447 MHz:63:WPA2:(none):pair_ccmp group_ccmp psk
    [4] => no:wyca_5G40:04\:D9\:F5\:23\:4D\:F4:Infra:64:5320 MHz:57:WPA2:(none):pair_ccmp group_ccmp psk
    [5] => no:wyca_5G40:04\:D9\:F5\:23\:74\:54:Infra:64:5320 MHz:35:WPA2:(none):pair_ccmp group_ccmp psk
    [6] => no:wyca_5G80:04\:D9\:F5\:23\:74\:58:Infra:100:5500 MHz:35:WPA2:(none):pair_ccmp group_ccmp psk
    [7] => 
)
0
*/

