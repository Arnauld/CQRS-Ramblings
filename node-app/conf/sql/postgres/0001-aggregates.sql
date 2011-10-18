CREATE TABLE aggregates
(
  aggregate_id      CHARACTER VARYING(36) NOT NULL,
  aggregate_type    CHARACTER VARYING(255) NOT NULL,
  aggregate_version INTEGER NOT NULL,
  CONSTRAINT aggregates_pkey PRIMARY KEY (aggregate_id)
);
