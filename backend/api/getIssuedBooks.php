<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    $issuedBooks = $db->issuedBooks->find();

    $data = [];

    foreach ($issuedBooks as $book) {

        $data[] = [
            "_id" => (string)$book->_id,
            "studentId" => $book->studentId ?? "",
            "studentName" => $book->studentName ?? "",
            "bookId" => $book->bookId ?? "",
            "bookTitle" => $book->bookTitle ?? "",
            "issueDate" => $book->issueDate ?? "",
            "returnDate" => $book->returnDate ?? "",
            "status" => $book->status ?? ""
        ];
    }

    echo json_encode($data);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>