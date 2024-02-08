import pkg from 'pg';

//import { Pool } from "pg";
const { Pool } = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'roundhouse.proxy.rlwy.net',
    database: 'railway',
    password: 'krPQ3AQe4Ib26J~~EhJkbA2bi3K355xU',
    port: 29922, 
  });

const otherPool = new Pool({
  user: process.env['DATABASE_USER'],
  host: process.env['DATABASE_HOST'],
  database: process.env['DATABASE_NAME'],
  password: process.env['DATABASE_PASSWORD'],
  port: 29766, 
});

const query = async (queryString) => {
    const client =  await pool.connect();
    const res = await client.query(queryString);
    client.release()
    return res
 }


const str3 = `
CREATE TABLE ARTICLE(
  id BIGSERIAL NOT NULL,
  title TEXT NOT NULL,
  json TEXT,
  title_embedding vector NOT NULL,
  problem_embedding vector NOT NULL,
  categories_embedding vector NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE ARTICLE_CATEGORY(
  id BIGSERIAL NOT NULL,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE ARTICLE_ARTICLE_CATEGORY (
  id BIGSERIAL PRIMARY KEY,
  articleId BIGINT NOT NULL,
  categoryId BIGINT NOT NULL,
  FOREIGN KEY (articleId) REFERENCES ARTICLE (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES ARTICLE_CATEGORY (id) ON DELETE CASCADE ON UPDATE CASCADE
);

`
const str4 = `
CREATE OR REPLACE FUNCTION get_or_create_category(in_title VARCHAR)
RETURNS BIGINT AS $$
DECLARE
    category_id BIGINT;
BEGIN
    SELECT id INTO category_id FROM ARTICLE_CATEGORY WHERE name = in_title;

    -- Jika kategori sudah ada, kembalikan id
    IF category_id IS NOT NULL THEN
        RETURN category_id;
    ELSE
        -- Jika kategori belum ada, buat kategori baru dan kembalikan id
        INSERT INTO ARTICLE_CATEGORY(name) VALUES (in_title) RETURNING id INTO category_id;
        RETURN category_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_or_create_categories(in_titles VARCHAR[])
RETURNS BIGINT[] AS $$
DECLARE
    category_id BIGINT;
    title VARCHAR;
    category_ids BIGINT[];
BEGIN
    -- Inisialisasi array
    category_ids := '{}';

    -- Iterasi melalui setiap judul
    FOREACH title IN ARRAY in_titles
    LOOP
        -- Cek apakah kategori dengan judul tersebut sudah ada
        SELECT id INTO category_id FROM ARTICLE_CATEGORY WHERE name = title;

        -- Jika kategori sudah ada, masukkan ID ke dalam array
        IF category_id IS NOT NULL THEN
            category_ids := category_ids || category_id;
        ELSE
            -- Jika kategori belum ada, buat kategori baru dan masukkan ID ke dalam array
            INSERT INTO ARTICLE_CATEGORY(name) VALUES (title) RETURNING id INTO category_id;
            category_ids := category_ids || category_id;
        END IF;
    END LOOP;

    -- Kembalikan array
    RETURN category_ids;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_article_with_categories(
  in_title VARCHAR,
  in_html TEXT,
  in_categories VARCHAR[]
) RETURNS BIGINT AS $$
DECLARE
  article_id BIGINT;
  category_ids BIGINT[];
  category_id BIGINT;
BEGIN
  -- Panggil fungsi untuk mendapatkan atau membuat kategori-kategori
  category_ids := get_or_create_categories(in_categories);

  -- Lakukan insert ke tabel ARTICLE tanpa memperhatikan embedding
  INSERT INTO ARTICLE (title, json)
  VALUES (in_title, in_html)
  RETURNING id INTO article_id;

  FOREACH category_id IN ARRAY category_ids
  LOOP
      INSERT INTO ARTICLE_ARTICLE_CATEGORY (articleId, categoryId)
      VALUES (article_id, category_id);
  END LOOP;

  -- Kembalikan ID artikel yang baru saja diinsert
  RETURN article_id;
END;
$$ LANGUAGE plpgsql;
`
const str5 = `
-- Menghapus NOT NULL dari kolom title_embedding
ALTER TABLE ARTICLE
ALTER COLUMN title_embedding DROP NOT NULL;

-- Menghapus NOT NULL dari kolom problem_embedding
ALTER TABLE ARTICLE
ALTER COLUMN problem_embedding DROP NOT NULL;

-- Menghapus NOT NULL dari kolom categories_embedding
ALTER TABLE ARTICLE
ALTER COLUMN categories_embedding DROP NOT NULL;

CREATE TABLE ARTICLE_EMBEDDING(
  id BIGSERIAL PRIMARY KEY,
  artikel_id BIGINT NOT NULL,
  title_embedding vector NOT NULL,
  problem_embedding vector NOT NULL,
  categories_embedding vector NOT NULL,
  FOREIGN KEY(artikel_id) REFERENCES ARTICLE(id) ON UPDATE CASCADE ON DELETE CASCADE
);
`

const task = async () => {
  const res = await query(`SELECT * FROM ARTICLE_EMBEDDING
  `)
  console.log(res)
}

task()

 