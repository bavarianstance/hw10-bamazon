//npm packages
const inquirer = require("inquirer");
const mysql = require ("mysql");
const figlet = require("figlet");
const Table = require ("cli-table");

//divider global variable
const divider = "\n------------------------------------------------------------\n\n";

const connection = mysql.createConnection ({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "iseeyoutoorsql",
	database: "bamazon"
});

const mgrFunction = () => {
	inquirer.prompt([
{
	type: "list",
	name: "option",
	message: "Choose a command to execute."
	choices: ["View Products for Sale", "View Low Inventory Items", "Replenish Inventory", "Add New Product"],
	
}

		])
}

const showInventory = () => {
	figlet('BAMAZON !!!', (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    	}
		console.log(data)
});

	let showAll = "SELECT * FROM products";

	connection.query(showAll, (err,response) => {
		if (err) {
			throw err;
		} 
		console.log(divider);
			let table = new Table ({
				head: ["ID", "Product", "Department", "Price (USD)", "Quantity Left"],
				colWidths: [5, 25, 25, 15, 15]
			});

		for (let i = 0; i < response.length; i++){
			table.push(
				// ["first value", "second value", "third value", "fourth value", " fifth value"]
				[response[i].id, response[i].product_name, response[i].dept_name, response[i].price, response[i].stock_quantity]
				);
	
		}
		console.log(table.toString());		
		console.log(divider);
	})
}
