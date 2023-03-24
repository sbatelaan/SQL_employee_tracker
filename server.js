const consoleTbl = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");

let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ucibootcamp",
  database: "employee_tracker",
});
console.log(`connected to employee_tracker db.`);

conn.connect((err) => {
  if (err) throw err;
  empTrack();
});

const empTrack = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Log out",
        ],
      },
    ])
    .then((answers) => {
      if (answers.prompt === "View all departments") {
        conn.query(`SELECT * FROM department`, (err, result) => {
          console.log("All departments:");
          console.table(result);
          empTrack();
        });
      } else if (answers.prompt === "View all roles") {
        conn.query(`SELECT * FROM employee_role`, (err, result) => {
          console.log("All roles");
          console.table(result);
          empTrack();
        });
      } else if (answers.prompt === "View all employees") {
        conn.query(
          `SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee 
            LEFT JOIN employee_role ON employee.role_id = employee_role.id
             LEFT JOIN department ON employee_role.department_id = department.id
             LEFT JOIN employee manager ON employee.manager_id = manager.id`,
          (err, result) => {
            console.log("All employees");
            console.table(result);
            empTrack();
          }
        );
      } else if (answers.prompt === "Add a department") {
        inquirer
          .prompt([
            {
              name: "department",
              type: "input",
              message: "Enter the department you would like to add:",
            },
          ])
          .then(function (answer) {
            conn.query(
              `INSERT INTO department (name) VALUES (?)`,
              [answer.department],
              (err, result) => {
                if (err) throw err;
                console.log(`Added department ${answer.department}`);

                conn.query(`SELECT * FROM department`, (err, results) => {
                  if (err) throw err;
                  console.table(results);
                  empTrack();
                });
              }
            );
          });
      } else if (answers.prompt === "Add a role") {
        const getDepartmentNames = () => {
          return new Promise((resolve, reject) => {
            conn.query("SELECT name FROM department", (err, results) => {
              if (err) {
                reject(err);
              } else {
                // Map the result rows to an array of department names
                const departments = results.map((result) => result.name);
                resolve(departments);
              }
            });
          });
        };

        inquirer
          .prompt([
            {
              name: "role",
              type: "input",
              message: "Enter the role you would like to add:",
            },
            {
              name: "salary",
              type: "input",
              message: "Enter the salary for this role",
            },
            {
              name: "ID",
              type: "list",
              message: "Enter the department ID",
              choices: () => getDepartmentNames(),
            },
          ])
          .then((answers) => {
            conn.query(
              "INSERT INTO employee_role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))",
              [answers.role, answers.salary, answers.ID],
              (err, result) => {
                console.log("Added role");
                conn.query(`SELECT * FROM employee_role`, (err, results) => {
                  if (err) throw err;
                  console.table(results);
                  empTrack();
                });
              }
            );
          });
      } else if (answers.prompt === "Add an employee") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "fistName",
              message: "What is the employee's first name?",
              validate: (addFirst) => {
                if (addFirst) {
                  return true;
                } else {
                  console.log("Please enter a first name");
                  return false;
                }
              },
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
              validate: (addLast) => {
                if (addLast) {
                  return true;
                } else {
                  console.log("Please enter a last name");
                  return false;
                }
              },
            },
          ])
          .then((answer) => {
            const params = [answer.fistName, answer.lastName];

            // grab roles from roles table
            const roleSql = `SELECT employee_role.id, employee_role.title FROM employee_role`;

            conn.query(roleSql, (err, data) => {
              if (err) throw err;

              const roles = data.map(({ id, title }) => ({
                name: title,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role",
                    message: "What is the employee's role?",
                    choices: roles,
                  },
                ])
                .then((roleChoice) => {
                  const role = roleChoice.role;
                  params.push(role);

                  const managerSql = `SELECT * FROM employee`;

                  conn.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(
                      ({ id, first_name, last_name }) => ({
                        name: first_name + " " + last_name,
                        value: id,
                      })
                    );

                    // console.log(managers);

                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "manager",
                          message: "Who is the employee's manager?",
                          choices: managers,
                        },
                      ])
                      .then((managerChoice) => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES (?, ?, ?, ?)`;

                        conn.query(sql, params, (err, result) => {
                          if (err) throw err;
                          console.log("Employee has been added!");
                          conn.query(
                            `SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                                FROM employee 
                                LEFT JOIN employee_role ON employee.role_id = employee_role.id
                                 LEFT JOIN department ON employee_role.department_id = department.id

                                 LEFT JOIN employee manager ON employee.manager_id = manager.id `,
                            (err, results) => {
                              if (err) throw err;
                              console.table(results);
                              empTrack();
                            }
                          );
                        });
                      });
                  });
                });
            });
          });
      }else if(answers.prompt === 'Update an employee role') 
      {
        //get all the employee list 
        conn.query("SELECT * FROM employee", (err, res) => {
          if (err) throw err;
          const employeeChoice = [];
          res.forEach(({ first_name, last_name, id }) => {
            employeeChoice.push({
              name: first_name + " " + last_name,
              value: id
            });
          });
          
          //get all the role list to make choice of employee's role
          conn.query("SELECT * FROM employee_role", (err, res) => {
            if (err) throw err;
            const roleChoice = [];
            res.forEach(({ title, id }) => {
              roleChoice.push({
                name: title,
                value: id
                });
              });
           
            let questions = [
              {
                type: "list",
                name: "id",
                choices: employeeChoice,
                message: "whose role do you want to update?"
              },
              {
                type: "list",
                name: "role_id",
                choices: roleChoice,
                message: "what is the employee's new role?"
              }
            ]
        
            inquirer.prompt(questions)
              .then(response => {
                const query = `UPDATE employee SET ? WHERE ?? = ?;`;
                conn.query(query, [
                  {role_id: response.role_id},
                  "id",
                  response.id
                ], (err, res) => {
                  if (err) throw err;
                  
                  console.log("successfully updated employee's role!");
                    console.table(query)
                  empTrack();
                });
              })
              
            })
        });
      }
    }) 
};

module.exports = conn;
