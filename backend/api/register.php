<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"]);
$username = trim($data["username"]);
$email = trim($data["email"]);
$password = trim($data["password"]);

// Check if username already exists
$existingUser = $db->users->findOne([
    "username" => $username
]);

if ($existingUser) {
    echo json_encode([
        "success" => false,
        "message" => "Username already exists"
    ]);
    exit();
}

// Insert new student
$db->users->insertOne([
    "name" => $name,
    "username" => $username,
    "email" => $email,
    "password" => $password,
    "role" => "student"
]);

echo json_encode([
    "success" => true,
    "message" => "Registration Successful"
]);

?>