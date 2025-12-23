import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import api from "../../api/axios"; // Axios instance with JWT token

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products"); // /admin/products
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err.response?.data || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  // OPEN EDIT MODAL
  const handleEdit = (product) => {
    setEditData(product);
    setShow(true);
  };

  // SAVE
  const handleSave = async () => {
    try {
      const res = await api.put(`/products/${editData._id}`, editData);
      setProducts(products.map((item) => (item._id === res.data._id ? res.data : item)));
      setShow(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Header />
      <Sidebar />

      <main className="admin-content">
        <Container fluid>
          <motion.h4 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            Products
          </motion.h4>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="table-wrapper">
            <Table responsive bordered hover className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    <td className="action-buttons">
                      <Button size="sm" variant="outline-primary" onClick={() => handleEdit(item)}>
                        <FaEdit />
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </motion.div>
        </Container>
      </main>

      {/* ================= EDIT MODAL ================= */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>

        {editData && (
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Product;
