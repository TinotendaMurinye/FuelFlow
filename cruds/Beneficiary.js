const pool = require("../poolfile"); // Adjust path as necessary

let beneficiaryCrud = {};

// Function to generate a unique beneficiary ID
const generateBeneficiaryId = async () => {
    const currentYear = new Date().getFullYear(); // Get the current year
    const yearPrefix = `BEN-${currentYear}-`; // Format to BEN-YYYY-

    // Find the maximum bid for the current year
    const [rows] = await pool.execute(
        `SELECT MAX(bid) AS maxId FROM beneficiary WHERE bid LIKE ?`,
        [`${yearPrefix}%`] // Matches all bids that start with BEN-YYYY-
    );

    let nextNumber = 1; // Default to 1 if no records exist for the current year

    if (rows[0].maxId) {
        // Extract the numeric part of the maxId
        const maxId = rows[0].maxId;
        const numericPart = maxId.split("-")[2]; // Split BEN-YYYY-XXXX and get XXXXXX
        nextNumber = parseInt(numericPart, 10) + 1; // Increment by 1
    }

    // Format the number to be four digits
    const formattedNumber = String(nextNumber).padStart(4, '0'); // Ensure 4 digits

    // Combine to form the full beneficiary ID
    const beneficiaryId = `${yearPrefix}${formattedNumber}`;
    return beneficiaryId;
};

// Create a new beneficiary
beneficiaryCrud.postBeneficiary = async (Id_number, name, surname, community_pos, department, date, phone1, phone2) => {
    const bid = await generateBeneficiaryId(); // Generate unique beneficiary ID

    const query = `
        INSERT INTO beneficiary (bid, Id_number, name, surname, community_pos, department, date, phone1, phone2) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [bid, Id_number, name, surname, community_pos, department, date, phone1, phone2];

    try {
        await pool.execute(query, values);
        return {
            status: "200",
            message: "Beneficiary created successfully",
            bid: bid // Return the generated beneficiary ID
        };
    } catch (error) {
        console.error("Error inserting beneficiary:", JSON.stringify(error, null, 2));
        throw new Error("Failed to save beneficiary");
    }
};

// Get all beneficiaries
beneficiaryCrud.getBeneficiaries = async () => {
    const [results] = await pool.execute("SELECT * FROM beneficiary");
    return results;
};

// Get beneficiary by ID
beneficiaryCrud.getBeneficiaryById = async (id) => {
    const [results] = await pool.execute("SELECT * FROM beneficiary WHERE bid = ?", [id]);
    return results[0];
};

// Update beneficiary
beneficiaryCrud.updateBeneficiary = async (id, updatedValues) => {
    const setExpressions = Object.keys(updatedValues)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(updatedValues), id];
    const query = `UPDATE beneficiary SET ${setExpressions} WHERE bid = ?`;
    await pool.execute(query, values);
    return { status: "200", message: "Beneficiary updated successfully" };
};

// Delete beneficiary
beneficiaryCrud.deleteBeneficiary = async (id) => {
    await pool.execute("DELETE FROM beneficiary WHERE bid = ?", [id]);
    return { status: "200", message: "Beneficiary deleted successfully" };
};

module.exports = beneficiaryCrud;