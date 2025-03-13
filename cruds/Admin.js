const pool = require("../poolfile"); // Adjust path as necessary

let adminCrud = {};

// Create a new admin
adminCrud.postAdmin = async (email, password, auth_key) => {
  const query = "INSERT INTO Admin (email, password, auth_key) VALUES (?, ?, ?)";
  const values = [email, password, auth_key];
  await pool.execute(query, values);
  return { status: "200", message: "Admin created successfully" };
};

// Get all admins
adminCrud.getAdmins = async () => {
  const [results] = await pool.execute("SELECT * FROM Admin");
  return results;
};

// Get admin by ID
adminCrud.getAdminById = async (id) => {
  const [results] = await pool.execute("SELECT * FROM Admin WHERE aid = ?", [id]);
  return results[0];
};

// Update admin
adminCrud.updateAdmin = async (id, updatedValues) => {
  const setExpressions = Object.keys(updatedValues)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updatedValues), id];
  const query = `UPDATE Admin SET ${setExpressions} WHERE aid = ?`;
  await pool.execute(query, values);
  return { status: "200", message: "Admin updated successfully" };
};

// Delete admin
adminCrud.deleteAdmin = async (id) => {
  await pool.execute("DELETE FROM Admin WHERE aid = ?", [id]);
  return { status: "200", message: "Admin deleted successfully" };
};

module.exports = adminCrud;