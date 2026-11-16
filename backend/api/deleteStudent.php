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

$data = json_decode(file_get_contents("php://input"), true);

$id = trim((string)($data["_id"] ?? ""));

if ($id === "") {
    echo json_encode([
        "status" => "error",
        "message" => "Student ID is required"
    ]);
    exit();
}

try {
    $studentObjectId = new MongoDB\BSON\ObjectId($id);

    $student = $db->students->findOne([
        "_id" => $studentObjectId
    ]);

    if (!$student) {
        echo json_encode([
            "status" => "error",
            "message" => "Student not found"
        ]);
        exit();
    }

    $db->students->deleteOne([
        "_id" => $studentObjectId
    ]);

    $db->users->deleteOne([
        "studentId" => $id,
        "role" => "student"
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Student Deleted Successfully"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>