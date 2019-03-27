//npm packages
const inquirier = require("inquirer");
const mysql = require ("mysql");
const figlet = require("figlet");

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

const buyItemPrompt = () => {

	figlet('Express Check Out', (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    	}
		console.log(data)
});

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
		message: "Please enter desired quantity for purchase."
		validate: inputValidation,
		filter: Number
	}

		]).then( 
		() => {
		let product = input.product_id;
		let quantity = input.quantity;

		let searchString = "SELECT * FROM products WHERE ?";

		connection.query(searchString, {id: product}, (err,response) => {
			if (err) {
				throw err;
			}
			if (response.length === 0) {
				console.log("Whoops, looks like you tried buying something that didn't exist! Please check your item ID.");
				showInventory();
			} else {
				let itemRes = response[0];
				if (quantity <= itemRes.stock_quantity) {
					console.log("Thank you for your purchase! Processing order now.");

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

					showInventory();
				}
			}

			})
		})
}

const showInventory = () => {
	figlet('Inventory Status', (err, data) => {
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

		let output = "";
		for (let i = 0; i < response.length; i++){
			output = "";
			output += "Product ID: " + response[i].id + "  ||  ";
			output += "Product Name: " + response[i].product_name + "  ||  ";
			output += "Department Name: " + response[i].dept_name + "  ||  ";
			output += "Price: $" + response[i].price + "\n";

		console.log(output);		
		}
		console.log(divider);
		buyItemPrompt();
	})
}

showInventory();