import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiUrl } from "../services/api";
import "../css/Fines.css";

function FineFund() {
  const [fund, setFund] = useState({ totalCollected: 0, paymentCount: 0, payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFund = async () => {
      try {
        const response = await fetch(apiUrl("getFineFund.php"));
        const data = await response.json();

        if (data.status === "success") {
          setFund(data);
        }
      } catch (error) {
        console.log("Fine Fund Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFund();
  }, []);

  if (loading) {
    return <h2>Loading Fine Fund...</h2>;
  }

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <BackButton />
        <div className="fines-page">
          <div className="fines-header">
            <h1>Fine Fund</h1>
            <p>All successfully collected fine payments</p>
          </div>

          <div className="fund-summary">
            <div>
              <span>Total Collected</span>
              <strong>₹{fund.totalCollected}</strong>
            </div>
            <div>
              <span>Payments</span>
              <strong>{fund.paymentCount}</strong>
            </div>
          </div>

          <div className="fines-table-container">
            <table className="fines-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Late Days</th>
                  <th>Amount</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {fund.payments.length > 0 ? fund.payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.studentName || payment.studentId}</td>
                    <td>{payment.bookTitle}</td>
                    <td>{payment.lateDays}</td>
                    <td>₹{payment.amount}</td>
                    <td>{payment.paidDate}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="no-fines">No Fine Fund Records Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default FineFund;