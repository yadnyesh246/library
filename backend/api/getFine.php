<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    $cursor = $db->issuedBooks->find([
        "fine" => [
            '$gt' => 0
        ]
    ]);

    $fines = [];

    foreach ($cursor as $book) {

        $fines[] = [
            "_id" => (string)$book->_id,
            "studentId" => $book->studentId ?? "",
            "studentName" => $book->studentName ?? "",
            "bookTitle" => $book->bookTitle ?? "",
            "issueDate" => $book->issueDate ?? "",
            "returnDate" => $book->returnDate ?? "",
            "actualReturnDate" => $book->actualReturnDate ?? "",
            "lateDays" => $book->lateDays ?? 0,
            "fine" => $book->fine ?? 0,
            "fineStatus" => $book->fineStatus ?? "Unpaid",
            "paidDate" => $book->paidDate ?? "",
            "status" => $book->status ?? ""
        ];
    }

    echo json_encode([
        "status" => "success",
        "fines" => $fines
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>