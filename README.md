# HW10 BAMAZON APP

## Installation 
* npm-install for initial download of dependent packages

### Usage
* node bamazonManager.js --> run Manager Control Panel application
* node bamazonCustomer.js --> run Customer Item Purchase application

### Customer App 
* Initial prompt - displays current inventory status and allows purchase of items by ID number.
![bamazon_customer_init_screenshot](./imgs/customer_initprompt.png "Bamazon Customer")

* spotify-this --> searches Spotify for Song(s). Accepts search value(s) by song title and/or artist name.
![spotify-this-screenshot](./imgs/song.png "Spotify This")

* movie-this --> searches OMDB for movie(s). Accepts search value(s) by movie title.
![movie-this-screenshot](./imgs/movie.png "Movie This")

* random-[input] --> searches via random-[input].txt for random [input] to display. Valid inputs include song, movie or concert. 


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
