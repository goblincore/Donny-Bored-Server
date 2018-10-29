# Bored Server [![Build Status](https://travis-ci.org/thinkful-ei22/Donny-Bored-Server.svg?branch=master)](https://travis-ci.org/thinkful-ei22/Donny-Bored-Server)

General information about this project can be found on the client side repo:

https://github.com/goblincore/Donny-Bored-Client

### Deployment

[Live app](https://bored-client.herokuapp.com/)

## Data Schema

Bored uses Postgres as the main database. The data is structured as follows:

* An USERS table which stores our basic user login information:
```
CREATE TABLE users(
      id serial PRIMARY KEY,
      username varchar(150) NOT NULL,
      email varchar(200) NOT NULL,
      password varchar(150) NOT NULL
);
```


* An IMAGES table which stores the image links in our cloud storage as well as the size, rotation and X,Y coordinates

```
CREATE TABLE images (
    id serial PRIMARY KEY,
    imageURL text NOT NULL,
    created timestamp DEFAULT now(),
    position integer [],
    dimensions integer []
);
```

* A MOODBOARDS table which just contains a name and description for the board plus a reference to our USER

```
CREATE TABLE moodboards (
    id serial PRIMARY KEY,
    board_name varchar(200) NOT NULL,
    description varchar(300) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
);
```


* A IMAGES + MOODBOARDS JUNCTION table

This is an associative table that defines the relationship of our images to their respective moodboards

```
CREATE TABLE images_moodboard(
    image_id INTEGER NOT NULL REFERENCES images ON DELETE CASCADE,
    moodboard_id INTEGER NOT NULL REFERENCES moodboards ON DELETE CASCADE
);

```

## API Documentation

### Register/Login Endpoints

#### Register a User 

* Request Type: `POST`

* URL: `https://moodboard-server.herokuapp.com/api/users`

* Required Request Headers: 
```
{
  Content-Type: `application/json`
}
```

* Required Request JSON Body: 
```
{
  username: 'UsernameStringGoesHere',
  password: 'PasswordStringGoesHere'
  email: 'EmailStringGoesHere'
}
```

* Response Body will be a JSON Web Token: 
```
{
  authToken: 'theTokenWillBeHereAsAString'
}
```

*  201 response if successful


###### Login

* Request Type: `POST`

* URL: `https://moodboard-server.herokuapp.com/api/auth/login/`

* Required Request Headers: 
```
{
  Content-Type: `application/json`
}
```

* Required Request JSON Body: 
```
{
  username: 'UsernameStringGoesHere',
  password: 'PasswordStringGoesHere'
}
```

* Response Body will be a JSON Web Token: 
```
{
  authToken: 'theTokenWillBeHereAsAString'
}
```

* Note - Web Token is valid for 7 days from the issue date



### Moodboard Endpoints

#### GET all moodboards for a user

* Requires valid JSON Webtoken

* Request Type: `GET`

* URL: `https://moodboard-server.herokuapp.com/api/moodboards`

* Required Request Headers: 
```
{
  Authorization: `Bearer JSONWebToken`
}
```

* User Id is required; send it as part of the request query, e.g.:
`https://moodboard-server.herokuapp.com/api/moodboards?user_id=1241234`

* Response Body will be an array of moodboard objects for that user id. 


#### GET images for a specific moodboard

* Requires valid JSON Webtoken

* Request Type: `GET`

* URL: `https://moodboard-server.herokuapp.com/api/moodboards/:id`

* Example: `https://moodboard-server.herokuapp.com/api/moodboards/12345`

* Required Request Headers: 
```
{
  Authorization: `Bearer JSONWebToken`
}
```

* Response Body will be an array of objects containing the imageURL and positioning coordinates




