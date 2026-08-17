<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

$books = $db->books->find();

$data = [];

foreach ($books as $book) {

    $data[] = [
        "_id" => (string)$book["_id"],
        "title" => $book["title"] ?? "",
        "author" => $book["author"] ?? "",
        "category" => $book["category"] ?? "",
        "quantity" => $book["quantity"] ?? 0,
        "image" => $book["image"] ?? ""
    ];
}

echo json_encode($data);

?>