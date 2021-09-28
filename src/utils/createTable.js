import { pool } from "./db.js";

const query = `
CREATE TABLE IF NOT EXISTS
    products(
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        brand VARCHAR(50) NOT NULL,
        image_url TEXT,
        price INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS
    reviews(
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        comment TEXT NOT NULL,
        rate INT NOT NULL,
        product_id INT REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )
`;

const createTables = async () => {
  try {
    await pool.query(query);
    console.log("Def tables created!");
  } catch (err) {
    console.log("Def tables NOT created!");
  }
};

export default createTables;
