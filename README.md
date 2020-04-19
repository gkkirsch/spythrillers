# Spy Thrillers
In order to run the project you will need to:
1. Be added to firebase project
2. Create a `.env` file in the root of the project and paste any env vars
3. Make sure you are logged into and part of the spy thrillers firebase project (https://firebase.google.com/docs/cli#install-cli-mac-linux)

### `npm install`
### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000/tv](http://localhost:3000/tv) to view the TV portion.
Open [http://localhost:3000](http://localhost:3000) to view the Player portion.

## Deploying
First build the project using  `npm run build` which will minify the project and output code to the build dir.
You can then run `firebase deploy` That will copy the files from the build file to the firebase hosting service.
