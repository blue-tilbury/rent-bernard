CREATE TABLE wishlists (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_id
      FOREIGN KEY(room_id)
      REFERENCES rooms(id)
      ON DELETE CASCADE,
  CONSTRAINT fk_user_id
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);
CREATE INDEX idx_wishlists_room_id ON wishlists(room_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_room_id_user_id ON wishlists(room_id, user_id);
