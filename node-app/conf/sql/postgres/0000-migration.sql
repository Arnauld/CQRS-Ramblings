CREATE TABLE migrations
(
  migration_id       CHARACTER VARYING(255) NOT NULL,
  migration_sequence INTEGER NOT NULL,
  migration_date     TIMESTAMP NOT NULL,
  CONSTRAINT migrations_pkey PRIMARY KEY (migration_id,migration_sequence)
);