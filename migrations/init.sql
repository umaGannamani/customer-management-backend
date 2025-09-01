PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT,
  only_one_address INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  address_details TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  is_primary INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- seed
INSERT OR IGNORE INTO customers (id, first_name,last_name,phone_number,email,only_one_address) VALUES
(1,'Riya','Singh','9000000001','riya@example.com',0),
(2,'Amit','Kumar','9000000002','amit@example.com',1);

INSERT OR IGNORE INTO addresses (id,customer_id,address_details,city,state,pin_code,is_primary) VALUES
(1,1,'12/B Jubilee Hills','Hyderabad','Telangana','500034',1),
(2,1,'45/A Banjara Hills','Hyderabad','Telangana','500033',0),
(3,2,'100 MG Road','Bengaluru','Karnataka','560001',1);
