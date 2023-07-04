# PayMe

PayMe is a soft clone of the popular app Venmo. Over the past few years, Venmo's popularity has skyrocketed due to it's functionality of being able to charge or request users. However, since it's launch in 2009 thus following its rise to popularity in 2015, Venmo's social functionality has remained stagnant.

This clone intends on improving that functionality by adding groups and group budgets. Additonally, a visualization of your tranasactions and a budget creator have been implemented as well to further improve application.

## Check out <a href="http://payme-ksng.onrender.com/">PayMe</a>

## Getting started
1. Clone this repository

2. Install dependencies for the Backend and Frontend in different terminals

      Backend:
      ```bash
      pipenv install -r requirements.txt
      ```
      Frontend:
      ```bash
      cd react-app
      npm i
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

5. Start the app by utilizing two seperate terminals and run the following:
   Backend:
   ```bash
   flask run 
   ```
   Frontend:
   ```bash
   npm start 
   ```

6. Now you can use the app!
