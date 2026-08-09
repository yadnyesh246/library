<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$studentId = $_GET["studentId"] ?? "";

if (empty($studentId)) {
    echo json_encode([
        "status" => "error",
        "message" => "Student ID is required"
    ]);
    exit;
}

try {

    // String ID ko MongoDB ObjectId me convert karo
    $studentObjectId = new MongoDB\BSON\ObjectId($studentId);

    // Student find karo
    $student = $db->students->findOne([
        "_id" => $studentObjectId
    ]);

    if (!$student) {
        echo json_encode([
            "status" => "error",
            "message" => "Student not found"
        ]);
        exit;
    }

    // Student ke issued books
    $issuedCursor = $db->issuedBooks->find([
        "studentId" => $studentId
    ]);

    $issuedBooks = [];

    foreach ($issuedCursor as $book) {

        $issuedBooks[] = [
            "_id" => (string)$book->_id,
            "bookTitle" => $book->bookTitle ?? "",
            "issueDate" => $book->issueDate ?? "",
            "returnDate" => $book->returnDate ?? "",
            "status" => $book->status ?? ""
        ];
    }

    // Final response
    echo json_encode([
        "status" => "success",

        "student" => [
            "name" => $student->name ?? "",
            "email" => $student->email ?? "",
            "course" => $student->course ?? "",
            "year" => $student->year ?? ""
        ],

        "issuedBooks" => $issuedBooks
    ]);

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>