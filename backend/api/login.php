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

$username = $data["username"] ?? "";
$password = $data["password"] ?? "";

$user = $db->users->findOne([
    "username" => $username,
    "password" => $password
]);

if ($user) {
    echo json_encode([
        "status" => "success",
        "message" => "Login Successful",
        "role" => $user["role"]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid Username or Password"
    ]);
}

?>