import { Container, Table, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import "./customer.css";
const customers = [
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 98765 43210",
    orders: 12,
    spend: "₹1,42,500",
  },
  {
    name: "Anjali Verma",
    email: "anjali@gmail.com",
    phone: "+91 91234 56789",
    orders: 5,
    spend: "₹38,200",
  },
  {
    name: "Amit Kumar",
    email: "amit@gmail.com",
    phone: "+91 99887 66554",
    orders: 18,
    spend: "₹2,05,000",
  },
];
const Customer = () => {
  return (
    <div>
      <Header />
      <Sidebar />
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
              Customers
            </motion.h4>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="table-wrapper"
            >
              <Table responsive bordered hover className="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Orders</th>
                    <th>Total Spend</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.orders}</td>
                      <td>{customer.spend}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Customer;
