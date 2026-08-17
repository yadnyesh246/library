<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";

if (empty($id)) {
    echo json_encode([
        "status" => "error",
        "message" => "Fine ID is required"
    ]);
    exit;
}

try {

    $objectId = new MongoDB\BSON\ObjectId($id);

    $fine = $db->issuedBooks->findOne([
        "_id" => $objectId
    ]);

    if (!$fine) {
        echo json_encode([
            "status" => "error",
            "message" => "Fine record not found"
        ]);
        exit;
    }

    if (($fine->fine ?? 0) <= 0) {
        echo json_encode([
            "status" => "error",
            "message" => "No fine exists"
        ]);
        exit;
    }

    if (($fine->fineStatus ?? "Unpaid") === "Paid") {
        echo json_encode([
            "status" => "error",
            "message" => "Fine is already paid"
        ]);
        exit;
    }

    $paidDate = date("Y-m-d");

    $result = $db->issuedBooks->updateOne(
        [
            "_id" => $objectId
        ],
        [
            '$set' => [
                "fineStatus" => "Paid",
                "paidDate" => $paidDate
            ]
        ]
    );

    if ($result->getModifiedCount() === 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Fine payment could not be updated"
        ]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Fine marked as paid",
        "paidDate" => $paidDate
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>