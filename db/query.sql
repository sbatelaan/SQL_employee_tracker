SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
	FROM employee 
    LEFT JOIN employee_role ON employee.role_id = employee_role.id
     LEFT JOIN department ON employee_role.department_id = department.id
     LEFT JOIN employee manager ON employee.manager_id = manager.id