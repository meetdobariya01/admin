import { useState, useEffect } from "react";
import { Container, Table, Badge, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from '../../component/header/header';
import Sidebar from '../../component/sidebar/sidebar';
import axios from "axios";
import "./payment.css";

const API = "http://localhost:7000/admin/orders"; // your backend endpoint

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

 const fetchPayments = async () => {
  try {
    const res = await axios.get(API, { withCredentials: true });
    
    const mappedPayments = res.data.orders.map(order => ({
      id: order._id,
      method: order.paymentMethod || "Unknown", // make sure your backend sends this
      status: order.paymentStatus || (order.payment ? "Success" : "Pending"), // use paymentStatus or fallback
      amount: `₹${order.totalAmount}`,
      date: new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
    }));

    setPayments(mappedPayments);
  } catch (err) {
    console.error("Error fetching payments:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <Header />
      <Sidebar />
      <div className="admin-layout">
        <main className="admin-content">
          <Container fluid>
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Payments
            </motion.h4>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" /> Loading payments...
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="table-wrapper"
              >
                <Table responsive bordered hover className="payments-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td>{payment.id}</td>
                        <td>{payment.method}</td>
                        <td>
                          <Badge
                            bg={
                              payment.status === "Delivered"
                                ? "success"
                                : payment.status === "Pending"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td>{payment.amount}</td>
                        <td>{payment.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </motion.div>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Payment;
