<?php

namespace Controller;

use MerryGoblin\BarcodeReader\Services\Barcode\BarcodeReader;

use Symfony\Component\Process\Exception\ProcessFailedException;

class BarcodeController
{
	public function uploadBarcodeAction()
	{
		$imageContent = '';
		$tmpFilePath = '';
		if (isset($_FILES['uploaded-photo'])) {

			//	Uploaded file
			$photoUploadFile = $_FILES['uploaded-photo'];
			$tmpFilePath = $photoUploadFile['tmp_name'];
			$fileType = $photoUploadFile['type'];
			$fileOriginalName = $photoUploadFile['name'];

			//	Image orientation
			$exifResponse = @exif_read_data($tmpFilePath);
			$orientation = ($exifResponse !== false && isset($exifResponse['Orientation'])) ? intval($exifResponse['Orientation']) : 1;

			//	Image content
			$imageContent = @file_get_contents($tmpFilePath);
			if ($imageContent !== false) {
				try {
					//	Barcode parsing
					$barcodeReader = new BarcodeReader();
					$parsingResult = $barcodeReader->parse($tmpFilePath);
				} catch(ProcessFailedException $e) {
					$parsingResult = 'failed';
				}
			}
		}

		$data = [
			'message' => 'The request was successful',
			'file' => print_r($_FILES, true),
			'filePath' => $tmpFilePath,
			'imageContent' => base64_encode(print_r($imageContent, true)),
			'parsingResult' => print_r($parsingResult, true),
		];

		http_response_code(200);
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($data);
		exit();
	}
}