UPDATE Categories
SET created_at = NOW(), updated_at = NOW()
WHERE created_at = '0000-00-00 00:00:00' 
   OR updated_at = '0000-00-00 00:00:00';