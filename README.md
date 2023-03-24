# Employee-Tracker

## Project Goal

Create an application for to manage employees, roles, and departments

## User Story
AS A business owner

I WANT to be able to view and manage the departments, roles, and employees in my company

SO THAT I can organize and plan my business

## Acceptance Criteria

GIVEN a command-line application that accepts user input

WHEN I start the application

THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

WHEN I choose to view all departments

THEN I am presented with a formatted table showing department names and department ids

WHEN I choose to view all roles

THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all employees

THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to add a department

THEN I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to add a role

THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

WHEN I choose to add an employee

THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

WHEN I choose to update an employee role

THEN I am prompted to select an employee to update and their new role and this information is updated in the database 


## Installation
---
1. Run `npm i` to install all dependencies
2. Run `schema.sql` in MySQLWorkbench
    * (Optional) Run `seeds.sql` in MySQLWorkbench
3. Edit MySQL connection properties in the `connectionProperties` object in `employee-tracker.js`

## Usage
---
1. Run `node server.js` to start the application
2. Select from the menu to view, add, remove, or update employees, roles, departments, or managers

   ![Screenshot (34)](https://user-images.githubusercontent.com/119352363/227421121-487a7cfd-92fa-4abe-a663-36ca3ef4595d.png)


3. Follow prompt if presented

   ![Screenshot (35)](https://user-images.githubusercontent.com/119352363/227421202-87bab685-8144-45c2-952b-7e1bace6668d.png)


## Tool & Resources
---
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [MySQLWorkbench](https://www.mysql.com/products/workbench/) - Visual database design tool
    ### Dependencies
    ---
    * [inquirer](https://www.npmjs.com/package/inquirer) - For the CLI user interface. This will prompt user within the CLI for employee information.
    * [console.table](https://www.npmjs.com/package/console.table) - Used to print MySQL into tables to the console.
    * [mysql2](https://www.npmjs.com/package/mysql2) - Used to connect to the MySQL database and perform queries
    
