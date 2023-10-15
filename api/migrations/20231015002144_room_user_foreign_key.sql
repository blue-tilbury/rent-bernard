ALTER TABLE rooms ADD COLUMN user_id UUID NOT NULL; 
ALTER TABLE rooms ADD CONSTRAINT user_fk 
  FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE;
CREATE INDEX idx_room_user_id ON rooms(user_id);
