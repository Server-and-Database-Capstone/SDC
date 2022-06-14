const db = require('./dbConnect');
const getReviewsById = (id, sort, count, page) => {
  sort = sort || 'newest';
  count = count || 5;
  page = page || 1;
  let limit = count * page;
  let offset = (page - 1) * count;
  let q = `select *,
  (select json_agg(row_to_json(reviews_photos)) from reviews_photos
   where reviews.id = reviews_photos.review_id )photos
   from reviews where product_id = $1
   ORDER BY date DESC LIMIT $2 OFFSET $3;`;

  if (sort === 'helpful' || sort === 'relevant') {
   q = `select *,
   (select json_agg(row_to_json(reviews_photos)) from reviews_photos
    where reviews.id = reviews_photos.review_id )photos
    from reviews where product_id = $1
    ORDER BY helpfulness DESC, date DESC LIMIT $2 OFFSET $3;`
  }

  const args = [id,limit, offset];
  return db.query(q, args);
}
const getMeta = (id) => {
  const q = `
  SELECT json_build_object(
    'ratings',(SELECT json_object_agg(rating, occurences) from
    (
    SELECT rating, COUNT(rating) AS Occurences
    FROM reviews
    WHERE product_id = $1
    GROUP BY rating
     )dkd),
    'recommended',(SELECT json_object_agg( recommend, occurences) from
    (
    SELECT recommend, COUNT(recommend) AS Occurences
    FROM reviews
    WHERE product_id = $1
    GROUP BY recommend
     )dkd),
    'characteristics', (select jsonb_object_agg(k,v)
   from (select (select jsonb_object_agg(characteristics.name, objj)
     FROM
     (SELECT id ,
     (select AVG(value)
     from characteristics_reviews
     where characteristics_id = characteristics.id)value)objj) "char"
     FROM characteristics
     WHERE product_id = $1) pls, jsonb_each(char) as t(k,v))) AS meta;`;

const args = [id]
return db.query(q, args);
}
const addReview = async (data) => {
  // const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = data
  // const q = `
  // INSERT INTO reviews
  // VALUES(default, $1, $2, NOW(), $3, $4, $5, false, $6, $7)`;
  // const args = [product_id, rating, summary, body, recommend, name, email];
  // db.query(q, args)
  // .then(_ => {
  //     let pq = `INSERT INTO reviews_photos(review_id, url) VALUES`;
  //     for (var i = 0; i < photos.length; i++) {
  //       pq.concat(`((SELECT MAX(id) FROM reviews) ,${photos[i]}),`)
  //     }
  //     pq = pq.slice(0, pq.length - 1);
  //     db.query(pq)
  //     .then(_ => {
  //       let aq = 'INSERT INTO characteristics_reviews VALUES';
  //       for (let key in characteristics) {
  //         let val = `(default, ${key}, ${characteristics[key]})`,
  //         aq.concat(val)
  //       }
  //       aq = aq.slice(0, aq.length - 1);
  //       db.query(aq)
  //     })
  // })
(async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const queryText = 'INSERT INTO reviews VALUES(default, $1, $2, NOW(), $3, $4, $5, false, $6, $7) RETURNING id'
      const args = [product_id, rating, summary, body, recommend, name, email];
      const res = await client.query(queryText, args)


      const insertPhotoText = 'INSERT INTO reviews_photos(review_id, url) VALUES';
      for (var i = 0; i < photos.length; i++) {
        insertPhotoText.concat(`($1, ${photos[i]}),`)
      }
      insertPhotoText = insertPhotoText.slice(0, pq.length - 1);

      const insertPhotoValues = [res.rows[0].id]
      await client.query(insertPhotoText, insertPhotoValues)

      let aq = 'INSERT INTO characteristics_reviews VALUES';
      for (let key in characteristics) {
        let val = `(default, ${key}, $1 , ${characteristics[key]}),`;
        aq.concat(val)
      }
      aq = aq.slice(0, aq.length - 1);
      await client.query(aq, insertPhotoValues )

      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
}

module.exports = {
  getReviewsById,
  getMeta
}

//  SELECT pg_catalog.setval(pg_get_serial_sequence('questions', 'id'), (SELECT MAX(id) FROM questions)+1)