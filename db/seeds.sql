    INSERT INTO department (name)
    VALUES  ( "Sales"),
            ( "Engineering"),
            ( "Law"),
            ( "Accounting");

    INSERT INTO employee_role (title, salary, department_id)
    VALUES ( "Salesman", 100000, 1),
           ( "Software Engineer", 150000, 2),
           ( "Lawyer", 200000, 3),
           ( "Accountant", 120000, 4);

    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ( "Erlich", "Bachman", 1, NULL),
           ( "Richard", "Hendricks", 2, 1),
           ( "Gilfoyle", "Starr", 2, 1),
           ( "Jian", "Yang", 3, 1),
           ( "Gavin", "Belson", 4, 2);