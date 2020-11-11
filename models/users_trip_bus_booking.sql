CREATE TABLE  users (
    user_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    email VARCHAR (50) NOT NULL UNIQUE,
    password  VARCHAR (50) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isAdmin BOOLEAN,
    active status_type NOT NULL
  );

INSERT INTO users (first_name, last_name,email, password, passwordConfirm, isAdmin) VALUES('yinka', 'ola', 'Yinka@gmail.com' ,'pass', 'pass', t);

CREATE TABLE  trip (
    trip_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    origin VARCHAR (50) NOT NULL,
    destination VARCHAR (50) NOT NULL,
    bus_stops CITEXT[] NOT NULL,
    trip_date  DATE NOT NULL,
    fare float NOT NULL,
    status status_type NOT NULL,
    bus_id BIGINT UNIQUE;
);

Note::
-- 1. To display a single trip row alongside the bus allocated for the trip, use the command below::
-- SELECT * FROM trip JOIN bus ON trip.bus_id = bus.id;
-- 2. Values to be specified in the bus_id column represents the id of bus in the bus table, therefore should be related to values in the id column of the bus table.

INSERT INTO trip (origin, destination, bus_stops, trip_date, fare, status, bus_id) VALUES('Ishaga', 'Agege', ARRAY ['Fagba', 'Pen-cinema', 'Alamutu'], '2020-07-30', '199.99', 'active','1');
INSERT INTO trip (origin, destination, bus_stops, trip_date, fare, status, bus_id) VALUES('Ikeja', 'Yaba', ARRAY ['Maryland', 'Anthony', 'Fadeyi'], '2020-07-30', '199.99', 'active', '2');
INSERT INTO trip (origin, destination, bus_stops, trip_date, fare, status, bus_id) VALUES('Berger', 'Gbagada', ARRAY ['Ifako', 'Ogudu', 'Oworo'], '2020-08-12', '359.99', 'active', '3');

CREATE TABLE bus (
    bus_id BIGSERIAL NOT NULL PRIMARY KEY,
    number_plate VARCHAR (50) NOT NULL,
    manufacturer VARCHAR (50) NOT NULL,
    model VARCHAR (50) NOT NULL,
    year VARCHAR (50) NOT NULL,
    capacity INTEGER NOT NULL
);

INSERT INTO bus (number_plate, manufacturer, model, year, capacity) VALUES('KJA565JU', 'Toyota','Hummer Bus', '2020', '25');


-- creating a data type in sql that only accepts two types of value::::::::
CREATE TYPE status_type AS ENUM ('active', 'inactive');

-- adding a new column (i.e status)to an existing table(i.e booking) and seting the data type of the column to 'status_type' created above::::
ALTER TABLE booking ADD COLUMN status STATUS_TYPE;

-- setting a default value for  a specific column::::
ALTER TABLE booking ALTER COLUMN status SET DEFAULT 'active';

-- renaming a column in an existing table::
ALTER TABLE table_name RENAME column_name TO new_column_name;

CREATE TABLE booking (
    booking_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id UUID REFERENCES users (id),
    trip_id UUID REFERENCES trip (trip_id),
    bus_id BIGSERIAL REFERENCES bus (bus_id),
    trip_date DATE,
    seat_number INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR (50),
    last_name VARCHAR (50),
    email VARCHAR (50),
    status STATUS_TYPE
);


-- To remove a foreign key constraint (example: I would be removing the foreign key constraint of the bus_id in trip table which allows it to reference the bus table):
ALTER TABLE trip DROP CONSTRAINT trip_bus_id_fkey;
-- Note::In d above query, 'trip_bus_id_fkey' is the name of the foreign key constraint which the bus_id in trip table used to reference the bus table

-- Adding a NOT NULL constraints to an existing column in an existing table::
ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;

-- How to get all the name of constraints(i.e name of foreign keys and primary keys) on an existing table::
SELECT con.* FROM pg_catalog.pg_constraint con INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace WHERE nsp.nspname = 'schema_name' AND rel.relname = 'table_name';

-- To set a new default for a column, use a command like this:::
ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT new_default_value;

-- To remove any default value on a specific column, use a command like this::
ALTER TABLE table_name ALTER COLUMN column_name DROP DEFAULT;

-- To rename a column:::
ALTER TABLE table_name RENAME COLUMN old_column_name TO new_column_name;

-- To rename a table:::
ALTER TABLE old_table_name RENAME TO new_table_name;

-- Adding a UNIQUE constraint to an existing column:::
ALTER TABLE table_name ADD UNIQUE (column_name);

-- To add a foreign key constraint to the existing table, you use the following form of the ALTER TABLE statement:
ALTER TABLE child_table ADD CONSTRAINT constraint_name FOREIGN KEY (fk_columns) REFERENCES parent_table (parent_key_columns);

-- Creating a new table based on the reference of bus and trip table(I don't really understand sha...but it works for me anyway)
Select * From trip JOIN bus On trip.bus_id = bus.bus_id WHERE trip.bus_id = 2;

-- Getting an Unscheduled Bus(i.e bus yet to be scheduled / assigned for a trip)::
SELECT * FROM bus LEFT JOIN trip ON(bus.bus_id = trip.bus_id) WHERE trip.bus_id IS NULL;

-- To drop a column of a table, you use the following statement::
ALTER TABLE table_name DROP COLUMN column_name;