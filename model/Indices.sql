 \c ratrev;

--  create index reviews_idx on reviews using btree
--  ( id asc,
-- product_id asc,
-- rating asc,
-- date asc,
-- summary asc,
-- body asc,
-- recommend asc,
-- reported asc,
-- reviewer_name asc,
-- reviewer_email asc,
-- response asc,
-- helpfulness asc
--  );

-- CREATE INDEX pid_idx ON reviews USING btree(
--   product_id asc,
--   rating asc,
--   recommend asc
-- );

-- CREATE INDEX char_id_idx ON characteristics_reviews USING btree(
--   characteristics_id asc,
--   value asc
-- );

-- CREATE INDEX prod_id_idx ON characteristics USING btree(
--   product_id asc,
--   name asc
-- );

-- CREATE INDEX revid_idx ON reviews_photos USING btree(
--   review_id asc
-- );