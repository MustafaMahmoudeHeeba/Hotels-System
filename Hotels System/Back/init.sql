DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin'
   ) THEN
      CREATE USER admin WITH PASSWORD 'sifre123';
   END IF;
END
$do$;

GRANT ALL PRIVILEGES ON DATABASE hotel_new_db TO admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;