<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";
$title = $data["title"] ?? "";
$author = $data["author"] ?? "";
$category = $data["category"] ?? "";
$quantity = (int)($data["quantity"] ?? 0);

if ($id == "") {
    echo json_encode([
        "status" => "error",
        "message" => "Book ID Missing"
    ]);
    exit;
}

$result = $db->books->updateOne(
    [
        "_id" => new MongoDB\BSON\ObjectId($id)
    ],
    [
        '$set' => [
            "title" => $title,
            "author" => $author,
            "category" => $category,
            "quantity" => $quantity
        ]
    ]
);

echo json_encode([
    "status" => "success",
    "message" => "Book Updated Successfully"
]);