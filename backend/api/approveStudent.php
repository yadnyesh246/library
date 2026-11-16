<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/db.php";
require_once "emailUtils.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["userId"] ?? "";

if (empty($userId)) {

    echo json_encode([
        "status" => "error",
        "message" => "User ID is required"
    ]);

    exit();
}

try {

    $objectId = new MongoDB\BSON\ObjectId($userId);

    $result = $db->users->updateOne(
        [
            "_id" => $objectId,
            "role" => "student"
        ],
        [
            '$set' => [
                "status" => "approved"
            ]
        ]
    );

    if ($result->getModifiedCount() > 0) {

        $approvedUser = $db->users->findOne(["_id" => $objectId]);
        if (!empty($approvedUser["studentId"])) {
            $db->students->updateOne(
                ["_id" => new MongoDB\BSON\ObjectId($approvedUser["studentId"])],
                ['$set' => ["status" => "approved"]]
            );
        }

        $emailSent = false;
        if (!empty($approvedUser["email"])) {
            $emailSent = sendStudentApprovalEmail($approvedUser["email"], $approvedUser["name"] ?? "Student");
        }

        echo json_encode([
            "status" => "success",
            "message" => $emailSent
                ? "Student approved successfully and email sent."
                : "Student approved successfully. Email notification could not be sent."
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Student could not be approved"
        ]);
    }

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>