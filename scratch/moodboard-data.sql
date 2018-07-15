DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS moodboards;

--PRIMARY DATA TABLES
CREATE TABLE users(
      id serial PRIMARY KEY,
      username varchar(150) NOT NULL,
      email varchar(200) NOT NULL,
      password varchar(150) NOT NULL
);


CREATE TABLE images (
    id serial PRIMARY KEY,
    imageURL text NOT NULL,
    created timestamp DEFAULT now(),
    position integer [],
    dimensions integer []
);


CREATE TABLE moodboards (
    id serial PRIMARY KEY,
    board_name varchar(200) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);



--IMAGES + MOODBOARD JUNCTION

CREATE TABLE images_moodboard(
    image_id INTEGER NOT NULL REFERENCES images ON DELETE CASCADE,
    moodboard_id INTEGER NOT NULL REFERENCES moodboards ON DELETE CASCADE
);



--INSERT DUMMY DATA

INSERT INTO users (username,email,password) VALUES
    (
      'pockets10k',   
      'chazzy@gmail.com',  
      'chaz123'   
    ),
    (
      'Bazzazz',  
       'frankie@mail.com',
       'Frankie_123!'
    ),
    (
      'King David',
      'loud@niceday.com',
      'Doinks777'
    );


INSERT INTO moodboards(board_name, user_id)
    VALUES (
        'Blue Time',
        '1'
    ),
    (
        'Apocolypse Now!!!',
        '2'
    ),
    (
        'super mario 64 tomorrow and forever',
        '2'
    ),
    (
        'There is a time and place for anime',
        '3'
    );


INSERT INTO images(imageURL,position,dimensions)
    VALUES
    (
        'http://james-k.com/img/fact.png',
        ARRAY[100,500],
        ARRAY[40,16]
    ),
    (
        'http://james-k.com/img/pettext.png',
        ARRAY[700,200],
        ARRAY[294,12]      
    ),
    (
        'http://james-k.com/img/pettext.png',
        ARRAY[300,270],
        ARRAY[294,12]      
    ),
    (
        'http://james-k.com/img/jamesk-logo.png',
        ARRAY[500,400],
        ARRAY[187,81]
    ),
    (
        'http://james-k.com/img/snail.png',
        ARRAY[800,520],
        ARRAY[136,140]
    );


INSERT INTO images_moodboard(image_id,moodboard_id)
    VALUES(
        (1,2),
        (1,3),
        (1,4),
        (2,1),
        (3,2),
        (4,1),
        (5,2),
        (6,3),
        (7,2),
        (8,2),
        (9,2)
    );


