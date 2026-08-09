<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";

if (empty($id)) {
    echo json_encode([
        "status" => "error",
        "message" => "Issued Book ID is required"
    ]);
    exit;
}

try {

    // Issued book find karo
    $issuedBook = $db->issuedBooks->findOne([
        "_id" => new MongoDB\BSON\ObjectId($id)
    ]);

    if (!$issuedBook) {
        echo json_encode([
            "status" => "error",
            "message" => "Issued book not found"
        ]);
        exit;
    }

    // Agar already Returned hai
    if ($issuedBook->status === "Returned") {
        echo json_encode([
            "status" => "error",
            "message" => "Book is already returned"
        ]);
        exit;
    }

    // Book ID nikalo
    $bookObjectId = new MongoDB\BSON\ObjectId($issuedBook->bookId);

    // Book ki quantity +1 karo
    $bookResult = $db->books->updateOne(
        [
            "_id" => $bookObjectId
        ],
        [
            '$inc' => [
                "quantity" => 1
            ]
        ]
    );

    if ($bookResult->getModifiedCount() === 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Book quantity could not be updated"
        ]);
        exit;
    }

    // Issued book ka status Returned karo
    $db->issuedBooks->updateOne(
        [
            "_id" => new MongoDB\BSON\ObjectId($id)
        ],
        [
            '$set' => [
                "status" => "Returned"
            ]
        ]
    );

    echo json_encode([
        "status" => "success",
        "message" => "Book Returned Successfully"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>