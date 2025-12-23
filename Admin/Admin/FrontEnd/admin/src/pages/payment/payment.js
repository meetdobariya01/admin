import { Container, Table, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from '../../component/header/header';
import Sidebar from '../../component/sidebar/sidebar';
import "./payment.css"
const payments = [
  {
    id: "TXN-902341",
    method: "UPI",
    status: "Success",
    amount: "₹8,200",
    date: "18 Dec 2025",
  },
  {
    id: "TXN-902342",
    method: "Credit Card",
    status: "Pending",
    amount: "₹79,999",
    date: "17 Dec 2025",
  },
  {
    id: "TXN-902343",
    method: "Net Banking",
    status: "Failed",
    amount: "₹6,499",
    date: "16 Dec 2025",
  },
];

const Payment = () => {
  return (
    <div>
        <Header/>
        <Sidebar/>
        <div className="admin-layout">
        <Sidebar />

        {/* ===== PAGE CONTENT ===== */}
        <main className="admin-content">
          <Container fluid>
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Payments
            </motion.h4>

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
                            payment.status === "Success"
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
          </Container>
        </main>
      </div>
    </div>
  )
}

export default Payment;