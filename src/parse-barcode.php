<?php

$imageContent = '';
if (isset($_FILES['uploaded-photo'])) {

	$photoUploadFile = $_FILES['uploaded-photo'];

	$tmpFilePath = $photoUploadFile['tmp_name'];
	$fileType = $photoUploadFile['type'];
	$fileOriginalName = $photoUploadFile['name'];

	$exifResponse = @exif_read_data($tmpFilePath);
	$orientation = ($exifResponse !== false && isset($exifResponse['Orientation'])) ? intval($exifResponse['Orientation']) : 1;

	$imageContent = @file_get_contents($tmpFilePath);
	/*if ($imageContent !== false) {

	}*/
}

$data = [
	'message' => 'The request was successful',
	'file' => print_r($_FILES, true),
	'imageContent' => base64_encode(print_r($imageContent, true)),
];

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);
exit();
