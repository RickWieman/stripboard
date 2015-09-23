# Flight Progress Strips Board

This tool allows you to manage VATSIM flight progress strips on a drag 'n drop strip board.
It tries to do as much as possible on the client side (using JavaScript) to provide the best user experience possible.

**Development is discontinued (at least for now).**

## Installation

As this tool is a rather simple JavaScript based application, it should be able to run on almost any system.
Just open the index.html in the `public/` directory.

Additionally, you'll find a `Vagrantfile` and a `Dockerfile` in this repository, which can help you to get the system up and running in minutes.
Note that the `vatsim-data.txt` should be available on the domain you're running the application on (due to AJAX restrictions)!

## Dependencies

All dependencies are currently bundled in the `vendor/` directory.

- [jQuery](https://jquery.com/) for obvious reasons
- [gridster.js](http://gridster.net/) for placing/dragging the strips in a grid
- [Papa Parse](http://papaparse.com/) for parsing the CSV containing VATSIM data
