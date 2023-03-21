const consoleTbl = require('console.table')
const mysql = require('mysql2');
const inquirer = require('inquirer');




let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ucibootcamp',
    database: 'employee_tracker'
},
console.log(`connected to employee_tracker db.`)
);

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
            })
        }
    })
}



module.exports = conn