const consoleTbl = require('console.table')
const mysql = require('mysql2');
const inquirer = require('inquirer');




let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ucibootcamp',
    database: 'employee_tracker'
})
console.log(`connected to employee_tracker db.`)


conn.connect(err => {
    if (err) throw err;
    empTrack()
});

const empTrack = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'prompt',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees',
                     'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Log out']
        }
    ]).then((answers) => {
        if (answers.prompt === 'View all departments') {
            conn.query(`SELECT * FROM department`, (err, result) => {
                console.log('All departments:');
                console.table(result);
                empTrack();
            });
        } else if (answers.prompt === 'View all roles') {
            conn.query(`SELECT * FROM employee_role`, (err, result) => {
                console.log('All roles');
                console.table(result);
                empTrack();
            });
        } else if (answers.prompt === 'View all employees') {
            conn.query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee 
            LEFT JOIN employee_role ON employee.role_id = employee_role.id
             LEFT JOIN department ON employee_role.department_id = department.id
             LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, result) => {
                console.log('All employees');
                console.table(result);
                empTrack();
            })
        } else if (answers.prompt === 'Add a department') {
            inquirer.prompt([
                {
                    name: 'department',
                    type: 'input',
                    message: 'Enter the department you would like to add:'
                }
            ]).then(function(answer) {
                conn.query('INSERT INTO department (name) VALUES (?)',
                answer.department,
                function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    console.log(`Added department ${answer.department}`);
                    empTrack();
                })     
            })
        } else if (answers.prompt === 'Add a role') {
            const getDepartmentNames = () => {
                return new Promise((resolve, reject) => {
                  conn.query('SELECT name FROM department', (err, results) => {
                    if (err) {
                      reject(err);
                    } else {
                      // Map the result rows to an array of department names
                      const departments = results.map(result => result.name);
                      resolve(departments);
                    }
                  });
                });
              };

            inquirer.prompt([
                {
                    name: 'role',
                    type: 'input',
                    message: 'Enter the role you would like to add:'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary for this role'
                },
                {
                    name: 'ID',
                    type: 'list',
                    message: 'Enter the department ID',
                    choices: () => getDepartmentNames()
                }
            ]).then((answers) => {
                conn.query('INSERT INTO employee_role (title, salary, department_id VALUES (?, ?, (SELECT id FROM department WHERE name = ?))',
                [answers.role, answers.salary, answers.department], (err, result) => {
                    console.log('Added role')
                    empTrack()
                })
            })
        } else if (answers.prompt = 'Add an employee') {
            const getRole = () => {
                return new Promise((resolve, reject) => {
                  conn.query('SELECT title FROM employee_role', (err, results) => {
                    if (err) {
                      reject(err);
                    } else {
                      // Map the result rows to an array of department names
                      const newRole = results.map(result => result.title);
                      resolve(newRole);
                    }
                  });
                });
            };
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the employees first name?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the employees last name?'
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the employees role?',
                    choices: () => getRole()
                }
            ]).then((answers) => {
                conn.query('INSERT INTO ')
            })
        }
    })
}



module.exports = conn