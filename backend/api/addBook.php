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

$title = $data["title"] ?? "";
$author = $data["author"] ?? "";
$category = $data["category"] ?? "";
$quantity = (int)($data["quantity"] ?? 0);

$result = $db->books->insertOne([
    "title" => $title,
    "author" => $author,
    "category" => $category,
    "quantity" => $quantity
]);

echo json_encode([
    "status" => "success",
    "message" => "Book Added Successfully"
]);

?>