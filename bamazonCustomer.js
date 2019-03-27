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

const buyItemPrompt = () => {
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

		let searchString = "SELECT * FROM products WHERE ?";

		connection.query(searchString, {id: product}, (err,response) => {
			if (err) {
				throw err;
			}
			if (response.length === 0) {
				console.log("Whoops, looks like you tried buying something that didn't exist! Please check your item ID.");
				tryAgain();
			} else {
				let itemRes = response[0];
				if (quantity <= itemRes.stock_quantity) {
					// console.log("Thank you for your purchase! Processing order now.");

					let updateString = "UPDATE products SET stock_quantity = " + (itemRes.stock_quantity - quantity) + " WHERE id = " + product;

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
					console.log("NO BAM! Looks like you're outta luck. Your desired product is outta stock.");
					console.log("Try buying something else!");
					console.log(divider);

					tryAgain();
				}
			}

			})
		})
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

showInventory();