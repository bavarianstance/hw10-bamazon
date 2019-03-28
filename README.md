# HW10 BAMAZON APP

## Installation 
* npm-install for initial download of dependent packages

### Usage
* node bamazonManager.js --> run Manager Control Panel application
* node bamazonCustomer.js --> run Customer Item Purchase application

### Customer App Screenshots
* Initial prompt - displays current inventory status and allows purchase of items by ID number.
![bamazon_customer_init_screenshot](./imgs/customer_initprompt.png "Bamazon Customer")

* Edge case 1 - attempt to purchase items out of stock or more than quantity available.
![edge-case-1](./imgs/customer_edgecase1.png "Edge Case 1")

* Edge case 2 - invalid item ID.
![edge-case-2](./imgs/customer_edgecase2.png "Edge Case 2")

* Edge case 3 - invalid quantity input.
![edge-case-3](./imgs/customer_edgecase3.png "Edge Case 3")

* Successful purchase screen
![success-case](./imgs/customer_success.png "Success Case")

### Manager App Screenshots
* Initial prompt - displays manager options.
![bamazon_mgr_init_screenshot](./imgs/mgr_initprompt.png "Bamazon Manager")

* View Products - shows current inventory
![view-products](./imgs/mgr_currentstock.png "View Products")

* View Low Stock Products - shows low stock items.
![view-low-stock](./imgs/mgr_lowstock.png "Low Stock")

* Replenish Stock - Add quantity to product by ID.
![replenish-stock](./imgs/mgr_replenishstock.png "Replenish Stock")

* Add new product - create new product and specify attributes.
![add-new](./imgs/mgr_addnew.png "Add New Product")

* Edge cases include negative/non whole number inputs for quantity, price, etc.

### Technologies Used
* Node.JS 
* MySQL
* Inquirer
* figlet
* CLI-Table
* Javascript ES6

### Comments
* Added edge cases for invalid inputs
* figlet utilized for ASCII art generation
* CLI-Table leveraged for clean formatting of product tables
