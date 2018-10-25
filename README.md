# Bored Server [![Build Status](https://travis-ci.org/thinkful-ei22/Donny-Bored-Server.svg?branch=master)](https://travis-ci.org/thinkful-ei22/Donny-Bored-Server)

General information about this project can be found on the client side repo:

https://github.com/goblincore/Donny-Bored-Client

### Deployment

[Live app](https://bored-client.herokuapp.com/)


### API Documentation

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




