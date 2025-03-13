const pool = require("../poolfile"); // Adjust path as necessary

let fuelRequestCrud = {};

// Function to generate a unique fuel request ID
const generateRequestId = async () => {
    const [rows] = await pool.execute(`SELECT MAX(fr_id) AS maxId FROM fuel_request`);
    let nextId = 1; // Default to 1 if no records exist

    if (rows[0].maxId) {
        const currentId = rows[0].maxId;
        const numericPart = parseInt(currentId.replace(/FR/, ''), 10); // Remove "FR" and convert to number
        nextId = numericPart + 1; // Increment by 1
    }

    return `FR${nextId.toString().padStart(6, '0')}`; // Zero-pad to 3 digits
};

// Create a new fuel request
fuelRequestCrud.postFuelRequest = async (beneficiary, id_number, phone1, phone2, community_pos, purpose, amnt_req, amnt_iss, date_iss, date_req, status, initiator, recommender, approver, authoriser, reciepient, urgency, plus) => {
    const fr_id = await generateRequestId(); // Generate unique fuel request ID

    const query = `
        INSERT INTO fuel_request (fr_id, beneficiary, id_number, phone1, phone2, community_pos, purpose, amnt_req, amnt_iss, date_iss, date_req, status, initiator, recommender, approver, authoriser, reciepient, urgency, plus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [fr_id, beneficiary, id_number, phone1, phone2, community_pos, purpose, amnt_req, amnt_iss, date_iss, date_req, status, initiator, recommender, approver, authoriser, reciepient, urgency, plus];

    try {
        await pool.execute(query, values);
        return {
            status: "200",
            message: "Fuel request created successfully",
            fr_id: fr_id // Return the generated fuel request ID
        };
    } catch (error) {
        console.error("Error inserting fuel request:", JSON.stringify(error, null, 2));
        throw new Error("Failed to save fuel request");
    }
};

// Get all fuel requests
fuelRequestCrud.getFuelRequests = async () => {
    const [results] = await pool.execute("SELECT * FROM fuel_request");
    return results;
};

// Get fuel request by ID
fuelRequestCrud.getFuelRequestById = async (id) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE fr_id = ?", [id]);
    return results[0];
};

// Update fuel request
fuelRequestCrud.updateFuelRequest = async (id, updatedValues) => {
    const setExpressions = Object.keys(updatedValues)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(updatedValues), id];
    const query = `UPDATE fuel_request SET ${setExpressions} WHERE fr_id = ?`;
    await pool.execute(query, values);
    return { status: "200", message: "Fuel request updated successfully" };
};

// Delete fuel request
fuelRequestCrud.deleteFuelRequest = async (id) => {
    await pool.execute("DELETE FROM fuel_request WHERE fr_id = ?", [id]);
    return { status: "200", message: "Fuel request deleted successfully" };
};

// Get fuel requests by initiator
fuelRequestCrud.getFuelRequestsByInitiator = async (initiator) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE initiator = ?", [initiator]);
    return {
        count: results.length,
        requests: results
    };
};
fuelRequestCrud.getPending = async () => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE status <> 'complete'");
    return {
        count: results.length,
        requests: results
    };
};

// Get fuel requests by recommender
fuelRequestCrud.getFuelRequestsByRecommender = async (recommender) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE recommender = ?", [recommender]);
    return {
        count: results.length,
        requests: results
    };
};

// Get fuel requests by approver
fuelRequestCrud.getFuelRequestsByApprover = async (approver) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE approver = ?", [approver]);
    return {
        count: results.length,
        requests: results
    };
};

// Get fuel requests by authoriser
fuelRequestCrud.getFuelRequestsByAuthoriser = async (authoriser) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE authoriser = ?", [authoriser]);
    return {
        count: results.length,
        requests: results
    };
};

// Get fuel requests by recipient
fuelRequestCrud.getFuelRequestsByRecipient = async (recipient) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE reciepient = ?", [recipient]);
    return {
        count: results.length,
        requests: results
    };
};

// Get fuel requests by status
fuelRequestCrud.getFuelRequestsByStatus = async (status) => {
    const [results] = await pool.execute("SELECT * FROM fuel_request WHERE status = ?", [status]);
    return {
        count: results.length,
        requests: results
    };
};

// Calculate total amount requested by status
fuelRequestCrud.calculateTotalAmountRequestedByStatus = async (status) => {
    const [rows] = await pool.execute("SELECT SUM(amnt_req) AS totalAmount FROM fuel_request WHERE status = ?", [status]);
    return {
        totalAmount: rows[0].totalAmount || 0 // Return 0 if no records found
    };
};



// Get complete fuel requests with employee details
fuelRequestCrud.getCompleteFuelRequestById = async (fr_id) => {
    const query = `
        SELECT 
            fr.*, 
            ce_authoriser.name AS authoriser_name, 
            ce_authoriser.surname AS authoriser_surname, 
            ce_authoriser.dob AS authoriser_dob, 
            ce_authoriser.sex AS authoriser_sex, 
            ce_authoriser.phone1 AS authoriser_phone1, 
            ce_authoriser.phone2 AS authoriser_phone2, 
            ce_authoriser.employee_pos AS authoriser_employee_pos, 
            ce_authoriser.auth_level AS authoriser_auth_level, 
            ce_authoriser.profile AS authoriser_profile, 
            ce_authoriser.date_added AS authoriser_date_added, 
            ce_authoriser.employee_num AS authoriser_employee_num, 
            ce_authoriser.status AS authoriser_status, 
            ce_authoriser.plus AS authoriser_plus,
            ce_initiator.name AS initiator_name, 
            ce_initiator.surname AS initiator_surname, 
            ce_initiator.dob AS initiator_dob, 
            ce_initiator.sex AS initiator_sex, 
            ce_initiator.phone1 AS initiator_phone1, 
            ce_initiator.phone2 AS initiator_phone2, 
            ce_initiator.employee_pos AS initiator_employee_pos, 
            ce_initiator.auth_level AS initiator_auth_level, 
            ce_initiator.profile AS initiator_profile, 
            ce_initiator.date_added AS initiator_date_added, 
            ce_initiator.employee_num AS initiator_employee_num, 
            ce_initiator.status AS initiator_status, 
            ce_initiator.plus AS initiator_plus,
            ce_recommender.name AS recommender_name, 
            ce_recommender.surname AS recommender_surname, 
            ce_recommender.dob AS recommender_dob, 
            ce_recommender.sex AS recommender_sex, 
            ce_recommender.phone1 AS recommender_phone1, 
            ce_recommender.phone2 AS recommender_phone2, 
            ce_recommender.employee_pos AS recommender_employee_pos, 
            ce_recommender.auth_level AS recommender_auth_level, 
            ce_recommender.profile AS recommender_profile, 
            ce_recommender.date_added AS recommender_date_added, 
            ce_recommender.employee_num AS recommender_employee_num, 
            ce_recommender.status AS recommender_status, 
            ce_recommender.plus AS recommender_plus,
            ce_approver.name AS approver_name, 
            ce_approver.surname AS approver_surname, 
            ce_approver.dob AS approver_dob, 
            ce_approver.sex AS approver_sex, 
            ce_approver.phone1 AS approver_phone1, 
            ce_approver.phone2 AS approver_phone2, 
            ce_approver.employee_pos AS approver_employee_pos, 
            ce_approver.auth_level AS approver_auth_level, 
            ce_approver.profile AS approver_profile, 
            ce_approver.date_added AS approver_date_added, 
            ce_approver.employee_num AS approver_employee_num, 
            ce_approver.status AS approver_status, 
            ce_approver.plus AS approver_plus
        FROM 
            fuel_request fr
        JOIN 
            CSIR_employee ce_authoriser ON fr.authoriser = ce_authoriser.emp_id
        JOIN 
            CSIR_employee ce_initiator ON fr.initiator = ce_initiator.emp_id
        JOIN 
            CSIR_employee ce_recommender ON fr.recommender = ce_recommender.emp_id
        JOIN 
            CSIR_employee ce_approver ON fr.approver = ce_approver.emp_id
        WHERE 
            fr.fr_id = ?;
    `;

    const [results] = await pool.execute(query, [fr_id]);
    return results[0]; // Return the first result, or null if not found
};

module.exports = fuelRequestCrud;