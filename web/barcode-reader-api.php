<?php

require_once(__DIR__."/../vendor/autoload.php");

$controller = new Controller\BarcodeController();
$controller->uploadBarcodeAction();
