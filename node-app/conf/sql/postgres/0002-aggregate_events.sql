CREATE TABLE aggregate_events
(
  aggregate_id   CHARACTER VARYING(36) NOT NULL,
  event_id       INTEGER NOT NULL,
  event_type     CHARACTER VARYING(255) NOT NULL,
  event_data     TEXT, 
  CONSTRAINT aggregateevts_pkey PRIMARY KEY (aggregate_id, event_id),
  CONSTRAINT aggregateevts_fk1  FOREIGN KEY (aggregate_id) REFERENCES aggregates(aggregate_id)
);

CREATE INDEX aggregateevts_aggid ON aggregate_events (aggregate_id);
