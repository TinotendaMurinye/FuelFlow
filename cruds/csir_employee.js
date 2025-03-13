const pool = require("../poolfile"); // Adjust path as necessary

let csirEmployeeCrud = {};

// Function to generate a unique employee ID
const generateEmployeeId = async () => {
    const [rows] = await pool.execute(`SELECT MAX(emp_id) AS maxId FROM CSIR_employee`);
    let nextId = 1; // Default to 1 if no records exist

    if (rows[0].maxId) {
        // Extract the numeric part and increment it
        const currentId = rows[0].maxId;
        const numericPart = parseInt(currentId.replace(/EMP/, ''), 10); // Remove "EMP" and convert to number
        nextId = numericPart + 1; // Increment by 1
    }

    // Format the ID as "EMP" followed by a zero-padded number
    return `EMP${nextId.toString().padStart(6, '0')}`; // Zero-pad to 3 digits
};
// Create a new employee
csirEmployeeCrud.postEmployee = async (name, surname, id_number, dob, sex, phone1, phone2, employee_pos, auth_level, profile, date_added, employee_num, status, plus) => {
    const emp_id = await generateEmployeeId(); // Generate unique employee ID

    const query = `
        INSERT INTO CSIR_employee (emp_id, name, surname, id_number, dob, sex, phone1, phone2, employee_pos, auth_level, profile, date_added, employee_num, status, plus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [emp_id, name, surname, id_number, dob, sex, phone1, phone2, employee_pos, auth_level, profile, date_added, employee_num, status, plus];

    try {
        await pool.execute(query, values);
        return {
            status: "200",
            message: "Employee created successfully",
            emp_id: emp_id // Return the generated employee ID
        };
    } catch (error) {
        console.error("Error inserting employee:", JSON.stringify(error, null, 2));
        throw new Error("Failed to save employee");
    }
};

// Get all employees
csirEmployeeCrud.getEmployees = async () => {
    const [results] = await pool.execute("SELECT * FROM CSIR_employee");
    return results;
};

// Get employee by ID
csirEmployeeCrud.getEmployeeById = async (id) => {
    const [results] = await pool.execute("SELECT * FROM CSIR_employee WHERE emp_id = ?", [id]);
    return results[0];
};

// Update employee
csirEmployeeCrud.updateEmployee = async (id, updatedValues) => {
    const setExpressions = Object.keys(updatedValues)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(updatedValues), id];
    const query = `UPDATE CSIR_employee SET ${setExpressions} WHERE emp_id = ?`;
    await pool.execute(query, values);
    return { status: "200", message: "Employee updated successfully" };
};

// Delete employee
csirEmployeeCrud.deleteEmployee = async (id) => {
    await pool.execute("DELETE FROM CSIR_employee WHERE emp_id = ?", [id]);
    return { status: "200", message: "Employee deleted successfully" };
};

module.exports = csirEmployeeCrud;