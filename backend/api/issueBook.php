<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$studentId = $data["studentId"] ?? "";
$studentName = $data["studentName"] ?? "";
$bookId = $data["bookId"] ?? "";
$bookTitle = $data["bookTitle"] ?? "";
$issueDate = $data["issueDate"] ?? "";
$returnDate = $data["returnDate"] ?? "";

try {

    // Book ID ko MongoDB ObjectId me convert karna
    $bookObjectId = new MongoDB\BSON\ObjectId($bookId);

    // Pehle book check karo
    $book = $db->books->findOne([
        "_id" => $bookObjectId
    ]);

    if (!$book) {
        echo json_encode([
            "status" => "error",
            "message" => "Book not found"
        ]);
        exit;
    }

    // Quantity check
    if ($book->quantity <= 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Book is not available"
        ]);
        exit;
    }

    // Issued Books me record insert karo
    $result = $db->issuedBooks->insertOne([
        "studentId" => $studentId,
        "studentName" => $studentName,
        "bookId" => $bookId,
        "bookTitle" => $bookTitle,
        "issueDate" => $issueDate,
        "returnDate" => $returnDate,
        "status" => "Issued"
    ]);

    // Book quantity 1 se kam karo
    $db->books->updateOne(
        [
            "_id" => $bookObjectId
        ],
        [
            '$inc' => [
                "quantity" => -1
            ]
        ]
    );

    echo json_encode([
        "status" => "success",
        "message" => "Book Issued Successfully",
        "insertedId" => (string)$result->getInsertedId()
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>