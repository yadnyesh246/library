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

$name = trim($data["name"] ?? "");
$username = trim($data["username"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($name === "" || $username === "" || $email === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);

    exit();
}

try {

    // Check username
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


    // Check email
    $existingEmail = $db->users->findOne([
        "email" => $email
    ]);

    if ($existingEmail) {

        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);

        exit();
    }


    // 1. Create student
    $studentResult = $db->students->insertOne([
        "name" => $name,
        "email" => $email
    ]);

    // Get newly created student ID
    $studentId = $studentResult->getInsertedId();


    // 2. Create user account
    $db->users->insertOne([
        "name" => $name,
        "username" => $username,
        "email" => $email,
        "password" => $password,
        "role" => "student",
        "studentId" => (string)$studentId
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Registration Successful"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>