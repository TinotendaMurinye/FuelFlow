const pool = require("../poolfile"); // Adjust path as necessary

let fuelRequestReportCrud = {};

// Get fuel requests by beneficiary
fuelRequestReportCrud.getFuelRequestsByBeneficiary = async (beneficiary) => {
    const [results] = await pool.execute(
        `SELECT beneficiary, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE reciepient = ?
         GROUP BY reciepient`, 
        [beneficiary]
    );
    return results;
};

// Get fuel requests by authoriser
fuelRequestReportCrud.getFuelRequestsByAuthoriser = async (authoriser) => {
    const [results] = await pool.execute(
        `SELECT authoriser, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE authoriser = ?
         GROUP BY authoriser`, 
        [authoriser]
    );
    return results;
};

// Get fuel requests by approver
fuelRequestReportCrud.getFuelRequestsByApprover = async (approver) => {
    const [results] = await pool.execute(
        `SELECT approver, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE approver = ?
         GROUP BY approver`, 
        [approver]
    );
    return results;
};

// Get fuel requests by initiator
fuelRequestReportCrud.getFuelRequestsByInitiator = async (initiator) => {
    const [results] = await pool.execute(
        `SELECT initiator, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE initiator = ?
         GROUP BY initiator`, 
        [initiator]
    );
    return results;
};

// Get fuel requests by recommender
fuelRequestReportCrud.getFuelRequestsByRecommender = async (recommender) => {
    const [results] = await pool.execute(
        `SELECT recommender, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE recommender = ?
         GROUP BY recommender`, 
        [recommender]
    );
    return results;
};

// Get fuel requests by status
fuelRequestReportCrud.getFuelRequestsByStatus = async (status) => {
    const [results] = await pool.execute(
        `SELECT *, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE status = ?
         GROUP BY status`, 
        [status]
    );
    return results;
};

// Get fuel requests by month
fuelRequestReportCrud.getFuelRequestsByMonth = async (month) => {
    const [results] = await pool.execute(
        `SELECT MONTH(date_req) AS request_month, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE MONTH(date_req) = ?
         GROUP BY request_month`, 
        [month]
    );
    return results;
};
// Function to get monthly summary report
fuelRequestReportCrud.getMonthlySummaryReport = async () => {
    const [results] = await pool.execute(`
        SELECT 
            YEAR(date_req) AS request_year,
            MONTH(date_req) AS request_month,
            COUNT(*) AS total_requests,
            SUM(amnt_req) AS total_amount_requested,
            SUM(amnt_iss) AS total_amount_issued
        FROM 
            fuel_request
        GROUP BY 
            request_year, request_month
        ORDER BY 
            request_year, request_month;
    `);
    return results;
};
// Get fuel requests by year
fuelRequestReportCrud.getFuelRequestsByYear = async (year) => {
    const [results] = await pool.execute(
        `SELECT YEAR(date_req) AS request_year, 
                COUNT(*) AS total_requests,
                SUM(amnt_req) AS total_amount_requested,
                SUM(amnt_iss) AS total_amount_issued
         FROM fuel_request
         WHERE YEAR(date_req) = ?
         GROUP BY request_year`, 
        [year]
    );
    return results;
};

module.exports = fuelRequestReportCrud;