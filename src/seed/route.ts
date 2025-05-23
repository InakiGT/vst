import mysql from 'mysql2'

const sql = mysql.createConnection(process.env.MYSQL_URI || '')

async function createUserTable() {
  await sql.execute('DROP TABLE IF EXISTS itinerary_user_enroll;')
  await sql.execute('DROP TABLE IF EXISTS itineraries;')
  await sql.execute(`DROP TABLE IF EXISTS users;`)
  await sql.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(55) NOT NULL,
      lastname VARCHAR(55),
      email VARCHAR(55) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      kardex_photo VARCHAR(255)
    );
  `)
}

async function createItineraryTable() {
  await sql.execute('DROP TABLE IF EXISTS itineraries;')
  await sql.execute(`
    CREATE TABLE IF NOT EXISTS itineraries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plate VARCHAR(10) NOT NULL,
      color VARCHAR(20) NOT NULL,
      location POINT NOT NULL,
      direction ENUM('uam', 'location') NOT NULL DEFAULT 'uam',
      days VARCHAR(7),
      hour TIME NOT NULL,
      capacity TINYINT,
      user_email VARCHAR(55) NOT NULL,
      status ENUM('a', 's') DEFAULT 'a',
      SPATIAL INDEX(location),
      INDEX (user_email),
      CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    ) ENGINE = InnoDB;
  `)
}

async function createItineraryUsersEnrollTable() {
  await sql.execute('DROP TABLE IF EXISTS itinerary_user_enroll;')
  await sql.execute(`CREATE TABLE IF NOT EXISTS itinerary_user_enroll (
    itinerary_id INT NOT NULL,
    user_email VARCHAR(55) NOT NULL,
    status ENUM('pendiente', 'aceptada', 'rechazada') NOT NULL DEFAULT 'pendiente',

    PRIMARY KEY (itinerary_id, user_email),

    CONSTRAINT fk_enroll_itinerary
      FOREIGN KEY (itinerary_id)
      REFERENCES itineraries(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,

    CONSTRAINT fk_enroll_user
      FOREIGN KEY (user_email)
      REFERENCES users(email)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB;`)

}

async function createUserRatings() {
  await sql.execute('DROP TABLE IF EXISTS user_ratings')
  await sql.execute(`CREATE TABLE IF NOT EXISTS user_ratings (
    rater_email VARCHAR(55) NOT NULL,
    rated_email VARCHAR(55) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,

    PRIMARY KEY (rater_email, rated_email),

    CONSTRAINT fk_rater_user
      FOREIGN KEY (rater_email)
      REFERENCES users(email)
      ON DELETE CASCADE
      ON UPDATE CASCADE,

    CONSTRAINT fk_rated_user
      FOREIGN KEY (rated_email)
      REFERENCES users(email)
      ON DELETE CASCADE
      ON UPDATE CASCADE,

    CONSTRAINT chk_rating_range
      CHECK (rating >= 1 AND rating <= 5)
  ) ENGINE = InnoDB;`)
}

async function GET() {
  try {
    await createUserTable()
    await createItineraryTable()
    await createItineraryUsersEnrollTable()
    await createUserRatings()


  } catch {
    console.error('Error attemping to seed db')
  }
}

GET()
