<?php
require_once('./config/initSite.php');

$plan = new Plan(49);
$plan->ExportToConfig();