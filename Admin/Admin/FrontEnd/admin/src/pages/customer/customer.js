import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import "./customer.css";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Use the correct backend URL
        const res = await fetch("http://localhost:7000/api/stats/users");
        const data = await res.json();

        const formatted = data.map((user) => ({
          name: user.name,
          email: user.email,
          phone: user.phone || "N/A",
          orders: user.orderCount,
          spend: `₹${user.totalSpent.toLocaleString()}`,
        }));

        setCustomers(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="admin-layout">
        <Sidebar />

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
              {loading ? (
                <p>Loading customers...</p>
              ) : (
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
              )}
            </motion.div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Customer;
