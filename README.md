# `MansionsBnB`

```
MansionsBnB is a clone of AirBnB. MansionsBnB will help you find the best venue for your wedding, family parties or vacation.
```

## `Technologies Used`

```
Node.js
Express.js
Redux
React.js
CSS
JSON API
Sequelize
PostgreSQL
Render
```

### `CRUD`

```
Create a new user
Create spots
Update spots
Delete spots
Create spot images
Update spot images
Delete spot Images
Create reviews
Delete reviews
Create bookings (Coming soon)
Update bookings (Coming soon)
Delete bookings (Coming soon)
```

## `Launch App Locally`

- Clone the project to your desired location.
- `cd` into the project folder
- Press `ctrl-t` or `cmd-t` to duplicate the tab
- `cd` into frontend folder
- run command `npm run dev`
- In other tab, `cd` into backend folder
- run command `npm start`
- In the frontend process, press `o` in your terminal; will open up the application window
- OR you can Navigate to `http://localhost:5173/`

## `Implementation`

The application starts at url `/` which is the landing page to welcome you to the app. Clicking the `Enter` button will navigate you to the all listings page at url `/spots`, this page has all the available listings. You can click on any listing you desire, which will navigate you to that spot's details at url `/spots/:spotId`. On this page, you can view the details of the listing such as the description, any reviews the listing has if any, host's name and a button to reserve the spot (Feature coming soon). On the top left corner, you can click the avatar button which will give you two options; `Login` or `Signup`. If you'd like to test out `CRUD` features, you can hit `Login` and `Login as a Demo User`. After logging in, you can hit `Create a spot` in the top right to create your own spot to list. You can also select a spot which you can post a review on as well. You can create a new account by hitting `Log Out` in the dropdown menu of the avatar and than hitting `Signup` under the dropdown menu.

## `Frontend`

```
The application rendered using React.js and used Redux to manage states. Pulls info from the backend via PostgreSQL. CSS is used to style the application
```

## `Backend`

```
The backend uses Express.js to create RESTful API to access Sequelize database that returns info
```

For more info on DB Schema and API docs [Backend Readme](./backend/README.md)

## `Screenshot`

![Landing Page](./images//Landing%20Page.png)
![All Spots](./images/All%20Spots.png)
![Spot Details](./images//Spot%20Details.png)
![Manage Your Spots](./images/Manage%20your%20spots.png)
