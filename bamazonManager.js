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

const inputValidation = (input) => {
	let int = Number.isInteger(parseFloat(input));
	let sign = Math.sign(input);

	if (int && (sign === 1)) {
		return true;
	} else {
		return "Invalid input. Please enter positive whole numbers only.";
	}
}

const positiveInput = (input) => {
	let int = (typeof parseFloat (input)) === "number";
	let positive = parseFloat(input) > 0;

	if (int && positive){
		return true;
	} else {
		return "Error. Input must be positive."
	}
}

const mgrFunction = () => {
	figlet('MGR CTRL PANEL', (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    	}
		console.log(data)
});
	inquirer.prompt([
{
	type: "list",
	name: "choice",
	message: "Choose a command to execute."
	choices: ["View Products for Sale", "View Low Inventory Items", "Replenish Inventory", "Add New Product"],
	filter: (value) => {
		if (value === "View Products for Sale") {
			return 'inventory';	
	} else if (value === "View Low Inventory Items") {
			return 'lowStock';		
	} else if (value === "Replenish Inventory") {
			return 'replenish';
	} else if (value === "Add New Product") {
			return 'addNew';	
	} else {
		console.log("Fatal error. Invalid operation.");
		exit(1);
	}
  }
}
		]).then (input) => {
		if (input.choice === "inventory") {
			showInventory();
		} else if (input.choice === "lowStock"){
			showLowStock();
		} else if (input.choice === "replenish") {
			addStock();
		} else if (input.choice === "addNew") {
			addNewProduct();
		} else {
			console.log("Fatal error. Illegal operation.");
			exit(1);
		}
	}

const showInventory = () => {
	console.log("--- Showing Current Inventory ---");

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

mgrFunction();