<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

try {

    $issuedBooks = $db->issuedBooks->find();

    $data = [];

    $finePerDay = 10;
    $today = new DateTime();

    foreach ($issuedBooks as $book) {

        $returnDate = $book->returnDate ?? "";
        $status = $book->status ?? "Issued";

        $lateDays = 0;
        $fine = 0;

        if ($status === "Issued" && !empty($returnDate)) {

            $dueDate = new DateTime($returnDate);

            if ($today > $dueDate) {

                $difference = $today->diff($dueDate);

                $lateDays = $difference->days;
                $fine = $lateDays * $finePerDay;
                $status = "Overdue";

            } else {

                $lateDays = 0;
                $fine = 0;
                $status = "Issued";
            }

        } else {

            $lateDays = $book->lateDays ?? 0;
            $fine = $book->fine ?? 0;
        }

        $data[] = [
            "_id" => (string)$book->_id,
            "studentId" => $book->studentId ?? "",
            "studentName" => $book->studentName ?? "",
            "bookId" => $book->bookId ?? "",
            "bookTitle" => $book->bookTitle ?? "",
            "issueDate" => $book->issueDate ?? "",
            "returnDate" => $returnDate,
            "actualReturnDate" => $book->actualReturnDate ?? "",
            "lateDays" => $lateDays,
            "fine" => $fine,
            "fineStatus" => $book->fineStatus ?? "Unpaid",
            "paidDate" => $book->paidDate ?? "",
            "status" => $status
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