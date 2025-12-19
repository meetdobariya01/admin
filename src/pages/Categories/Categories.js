import { useState } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Image,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
const initialCategories = [
  {
    id: 1,
    name: "Mobiles",
    image: "https://via.placeholder.com/60",
    status: "Active",
  },
  {
    id: 2,
    name: "Footwear",
    image: "https://via.placeholder.com/60",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Laptops",
    image: "https://via.placeholder.com/60",
    status: "Active",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);

  /* DELETE */
  const handleDelete = (id) => {
    setCategories(categories.filter((item) => item.id !== id));
  };

  /* OPEN EDIT MODAL */
  const handleEdit = (category) => {
    setEditData(category);
    setShow(true);
  };

  /* SAVE */
  const handleSave = () => {
    setCategories(
      categories.map((item) => (item.id === editData.id ? editData : item))
    );
    setShow(false);
  };
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
              Categories
            </motion.h4>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="table-wrapper"
            >
              <Table responsive bordered hover className="category-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>{item.name}</td>

                      <td>
                        <Image
                          src={item.image}
                          alt={item.name}
                          rounded
                          className="category-img"
                        />
                      </td>

                      <td>
                        <Badge
                          bg={
                            item.status === "Active" ? "success" : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>

                      <td className="action-buttons">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
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
      </div>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>

        {editData && (
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  value={editData.image}
                  onChange={(e) =>
                    setEditData({ ...editData, image: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </Form.Select>
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
    </div>
  );
};

export default Categories;
