# MusicRanger

## Description

MusicRanger is an app where musicians can find bands, and bands can find musicians! Bringing talent together!
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup, and take a sneak peak at the listings. 
- **sign up** - As a user I want to sign up on the webpage so that I can look for and contact musicians/bands that I can collaborate with. 
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my accoutn from where I can update/create bands, and keep track of my messages. 
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **Listings** - As a user I want to see all the musicians/bands so that I can choose which ones I want to work with by using a search criteria. 
- **Dashboard** - As a user I want to create and update my profile, and be able to create and view my bands.  I would also like to see my messages.
- **Messages** - As a user I want to see my conversations with other users, and also contact users I would be interested in working with.
- **View my bands** 
- **Profile/Band View** 
- **Edit band/profile**

## Backlog

List of other features outside of the MVPs scope

User profile:
- see my profile
- upload my profile picture
- see other users profile
- list of events created by the user
- list events the user is attending

Geo Location:
- add geolocation to events when creating
- show event in a map in event detail page
- show all events in a map in the event list page

Homepage
- ...


## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - body: (empty)

- GET /events
  - renders the event list + the create form
- POST /events/create 
  - redirects to / if user is anonymous
  - body: 
    - name
    - date
    - location
    - description
- GET /events/:id
  - renders the event detail page
  - includes the list of attendees
  - attend button if user not attending yet
- POST /events/:id/attend 
  - redirects to / if user is anonymous
  - body: (empty - the user is already stored in the session)


## Models

User model
 
```
username: String
password: String
```

Event model

```
owner: ObjectId<User>
name: String
description: String
date: Date
location: String
attendees: [ObjectId<User>]
``` 

## Links

### Trello

[Link to your trello board](https://trello.com) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
