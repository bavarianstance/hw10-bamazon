//npm packages
const inquirer = require("inquirer");
const mysql = require ("mysql");
const Table = require ("cli-table");

//divider global variable
const divider = "\n------------------------------------------------------------\n\n";

//init SQL DB connection
const connection = mysql.createConnection ({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "iseeyoutoorsql",
	database: "bamazon"
});

//input validation function for whole integers
const inputValidation = (input) => {
	let int = Number.isInteger(parseFloat(input));
	let sign = Math.sign(input);

	if (int && (sign === 1)) {
		return true;
	} else {
		return "Invalid input. Please enter positive whole numbers only.";
	}
}

//input validation function for positive numbers only
const positiveInput = (input) => {
	let int = (typeof parseFloat (input)) === "number";
	let positive = parseFloat(input) > 0;

	if (int && positive){
		return true;
	} else {
		return "Error. Input must be positive."
	}
}
//reinit function to perform another action
const tryAgain = () => {
	inquirer.prompt([
{
	type: "confirm",
	message: "Would you like to perform another action?",
	name: "confirm",
	default: true
}
		]).then(
		(inquirerResponse) => {
			if (inquirerResponse.confirm) {
			mgrFunction();
			} else {
				console.log("Goodbye!");
				connection.end();
			}
		})
}

//init primary selection function for commands
const mgrFunction = () => {
	inquirer.prompt([
{
	type: "list",
	name: "choice",
	message: "Choose a command to execute.",
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
		]).then( 
		(input) => {
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
	});
}
//show current stock status function
const showInventory = () => {
	console.log("--- Showing Current Inventory ---");

	let showAll = "SELECT * FROM products";

	connection.query(showAll, (err,response) => {
		if (err) {
			throw err;
		} 
		console.log(divider);
		//init new table via CLI module
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
		tryAgain();
	})
}

//lowstock function
const showLowStock = () => {
	console.log("--- Showing Low Stock Items ---");

	let showLow = "SELECT * FROM products WHERE stock_quantity < 25";
	connection.query(showLow, (err, response) => {
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
				[response[i].id, response[i].product_name, response[i].dept_name, response[i].price, response[i].stock_quantity]
				);
	
		}
		console.log(table.toString());		
		console.log(divider);
		tryAgain();
	})
}
// replenish stock function
const addStock = () => {
	inquirer.prompt([
	{
		type: "input",
		name: "product_id",
		message: "Please select a product ID to replenish stock of.",
		validate: inputValidation,
		filter: Number
	},
	{
		type: "input",
		name: "quantity",
		message: "Please enter number of new stock to replenish.",
		validate: inputValidation,
		filter: Number
	}
		]).then( 
		(input) => {
			let product = input.product_id;
			let reStock = input.quantity;

			let searchString = "SELECT * FROM products WHERE ?";

			connection.query(searchString, {id:product}, (err, response) => {
				if (err){
					throw err;
				} 
				if (response.length === 0) {
					console.log("Error. Please check your Product ID input.");
					tryAgain();				
				} else {
					let itemRes = response[0];
					console.log("--- Processing Inventory Update ---");
					let updateString = "UPDATE products SET stock_quantity = " + (itemRes.stock_quantity + reStock) + " WHERE id =" + product;

					connection.query(updateString, (err, response) => {
						if (err) {
							throw err;
						} 
					console.log("Product: " + itemRes.product_name + " restocked. New stock count: " + (itemRes.stock_quantity +reStock));	
					console.log(divider);
					tryAgain();
					})
				}
			})
		});
}
//add new product function
const addNewProduct = () => {
	inquirer.prompt([
{
	type: "input",
	name: "product_name",
	message: "Input new product name"
},
{
	type: "input",
	name: "dept_name",
	message: "Please enter department name of new product"
},
{
	type: "input",
	name: "price",
	message: "Please enter price (USD) per unit of new product",
	validate: positiveInput
},
{
	type: "input",
	name: "stock_quantity",
	message: "Please enter current stock quantity.",
	validate: inputValidation
}

		]).then ( 
		(input) => {
			console.log("Processing. \n New product: " + input.product_name + divider +
				"Department: " + input.dept_name + divider +
				"Price: " + input.price + divider + 
				"Quantity: " +input.stock_quantity + divider);
		let searchString = "INSERT INTO products SET ?";
		
		connection.query(searchString, input, (error, response) => {
			if (error) {
				throw error;
			}

			console.log("Processed. " + input.product_name + " Sucessfully added.");
			console.log(divider);

			tryAgain();
			});	
		});
}
//init app
mgrFunction();