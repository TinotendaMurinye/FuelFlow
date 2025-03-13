const pool = require("../poolfile"); // Adjust path as necessary

let fuelPricesCrud = {};

// Function to generate a unique price ID
const generatePriceId = async () => {
    const [rows] = await pool.execute(`SELECT MAX(price_id) AS maxId FROM Fuel_prices`);
    let nextId = 1; // Default to 1 if no records exist

    if (rows[0].maxId) {
        nextId = parseInt(rows[0].maxId, 10) + 1; // Increment by 1
    }

    return nextId.toString(); // Convert to string as price_id is varchar
};

// Create a new fuel price
fuelPricesCrud.postFuelPrice = async (date, currency, user_id) => {
    const price_id = await generatePriceId(); // Generate unique price ID

    const query = `
        INSERT INTO Fuel_prices (price_id, date, currency, user_id) 
        VALUES (?, ?, ?, ?)`;

    const values = [price_id, date, currency, user_id];

    try {
        await pool.execute(query, values);
        return {
            status: "200",
            message: "Fuel price created successfully",
            price_id: price_id // Return the generated price ID
        };
    } catch (error) {
        console.error("Error inserting fuel price:", JSON.stringify(error, null, 2));
        throw new Error("Failed to save fuel price");
    }
};

// Get all fuel prices
fuelPricesCrud.getFuelPrices = async () => {
    const [results] = await pool.execute("SELECT * FROM Fuel_prices");
    return results;
};

// Get fuel price by ID
fuelPricesCrud.getFuelPriceById = async (id) => {
    const [results] = await pool.execute("SELECT * FROM Fuel_prices WHERE price_id = ?", [id]);
    return results[0];
};

// Update fuel price
fuelPricesCrud.updateFuelPrice = async (id, updatedValues) => {
    const setExpressions = Object.keys(updatedValues)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(updatedValues), id];
    const query = `UPDATE Fuel_prices SET ${setExpressions} WHERE price_id = ?`;
    await pool.execute(query, values);
    return { status: "200", message: "Fuel price updated successfully" };
};

// Delete fuel price
fuelPricesCrud.deleteFuelPrice = async (id) => {
    await pool.execute("DELETE FROM Fuel_prices WHERE price_id = ?", [id]);
    return { status: "200", message: "Fuel price deleted successfully" };
};

module.exports = fuelPricesCrud;