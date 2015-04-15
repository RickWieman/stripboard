// This file contains all constants for the strip board.

// ICAO code of your airport
const AIRPORT = 'EHAM';

// Location of the airport (for ETA/DTG calculations)
const AIRPORT_LAT = 52.3081;
const AIRPORT_LON = 4.7642;

// Transition altitude (for RFL determination)
const TRANS_ALT = 3000;

// Range (inbound strip will be added once flight is in range)
const RANGE = 10;

// Array with waypoints/routes that should be omitted when turning route into strip data
const SKIP_ROUTES = [
	'EHAM',
	'DCT',
	'STAR',
	'SID',
	'LAMS1A',
	'NORKU2A'
];