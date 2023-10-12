CREATE TABLE room_images (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id uuid NOT NULL,
  s3_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_id
      FOREIGN KEY(room_id)
      REFERENCES rooms(id)
      ON DELETE CASCADE
);
CREATE INDEX idx_room_id ON room_images(room_id);
