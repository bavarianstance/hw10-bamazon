//npm packages
const inquirer = require("inquirer");
const mysql = require ("mysql");
const figlet = require("figlet");
const Table = require ("cli-table");

//divider global variable
const divider = "\n------------------------------------------------------------\n\n";

// connect to SQL DB
const connection = mysql.createConnection ({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "iseeyoutoorsql",
	database: "bamazon"
});

// input validation function to check for positive whole integers
const inputValidation = (input) => {
	let int = Number.isInteger(parseFloat(input));
	let sign = Math.sign(input);

	if (int && (sign === 1)) {
		return true;
	} else {
		return "Invalid input. Please enter positive whole numbers only.";
	}
}

// reinit function
const tryAgain = () => {
	inquirer.prompt([
{
	type: "confirm",
	message: "Would you like to try again?",
	name: "confirm",
	default: true
}
		]).then(
		(inquirerResponse) => {
			if (inquirerResponse.confirm) {
			showInventory();
			} else {
				console.log("Sorry to hear. Come back soon!");
				connection.end();
			}
		})
}

// function to purchase item
const buyItemPrompt = () => {
	//inquirer prompt
	inquirer.prompt ([
	{
		type: "input",
		name: "product_id",
		message: "Please select a product to purchase using item ID.",
		validate: inputValidation,
		filter: Number
	},
	{
		type: "input",
		name: "quantity",
		message: "Please enter desired quantity for purchase.",
		validate: inputValidation,
		filter: Number
	}

		]).then( 
		(input) => {
		let product = input.product_id;
		let quantity = input.quantity;
		//SQL search query string
		let searchString = "SELECT * FROM products WHERE ?";
		//connect to SQL DB and inject search query
		connection.query(searchString, {id: product}, (err,response) => {
			if (err) {
				throw err;
			}
			//check for valid ID number
			if (response.length === 0) {
				console.log("Whoops, looks like you tried buying something that didn't exist! Please check your item ID.");
				tryAgain();
			} else {
				let itemRes = response[0];
				//condition check for in stock items
				if (quantity <= itemRes.stock_quantity) {
					// console.log("Thank you for your purchase! Processing order now.");
					// update SQL query string 
					let updateString = "UPDATE products SET stock_quantity = " + (itemRes.stock_quantity - quantity) + " WHERE id = " + product;
					//SQL DB inject update query
					connection.query(updateString, (err, response) => {
						if (err) {
							throw err;
						}

						console.log("BAM! Your purchase is complete. Total charged to your payment method is $" + itemRes.price * quantity);
						console.log("Thank you for your patronage.");
						console.log(divider);

						connection.end();
					})
				} else {
					console.log("NO BAM! Looks like you're outta luck. Your desired product is outta stock. Or you're trying to buy too many.");
					console.log("Try buying something else or readjusting quantity desired!");
					console.log(divider);

					tryAgain();
				}
			}

			})
		})
}

// show current stock status function
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
		//init new table using CLI table module
			let table = new Table ({
				head: ["ID", "Product", "Department", "Price (USD)", "Quantity Left"],
				colWidths: [5, 25, 25, 15, 15]
			});

		for (let i = 0; i < response.length; i++){
			table.push(
				// ["first value", "second value", "third value", "fourth value", " fifth value"]
				[response[i].id, response[i].product_name, response[i].dept_name, response[i].price, response[i].stock_quantity]
				);
			// output = "";
			// output += "Product ID: " + response[i].id + "  ||  ";
			// output += "Product Name: " + response[i].product_name + "  ||  ";
			// output += "Department Name: " + response[i].dept_name + "  ||  ";
			// output += "Price: $" + response[i].price + "  ||  ";
			// output += "Current Stock: " + response[i].stock_quantity + "\n"
		}
		console.log(table.toString());		
		console.log(divider);
		buyItemPrompt();
	})
}
//init app
showInventory();