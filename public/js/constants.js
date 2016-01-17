// This file contains all constants for the strip board.

// Update frequency (i.e. frequency on which updateData() gets called) in milliseconds
const UPDATE_FREQUENCY = 2 * 60 * 1000;

// ICAO code of your airport
const AIRPORT = 'EHAM';

// Location of the airport (for ETA/DTG calculations)
const AIRPORT_LAT = 52.3081;
const AIRPORT_LON = 4.7642;

// Array with all entry points of the TMA. These are formally the end of a flight route.
const ENTRY_POINTS = ['EELDE','EEL','NORKU','REKKEN','RKN','DENUT','HELEN','PUTTY','PESER','LAMSO','MOLIX','REDFA','TOPPA'];

// Array with all exit points of the TMA. These are formally the begin of a flight route.
const EXIT_POINTS = ['ANDIK','ARNEM','BERGI','EDUPO','GORLO','LEKKO','LOPIK','VALKO'];

// Array with all landing runways
const LANDING_RUNWAYS = ['04','06','09','18C','18R','22','24','27','36C','36R'];
const LANDING_RUNWAYS_DEFAULT = '06';

// Array with all takeoff runways
const TAKEOFF_RUNWAYS = ['04','06','09','18C','18L','22','24','27','36C','36L'];
const TAKEOFF_RUNWAYS_DEFAULT = '36L';

// Array with all SIDs. Defined as { runway: [ exitpoint: SID, ... ], ... }
// Currently no support for multiple SIDs.
const SIDs = {
	'04': {
		ANDIK: 'AND2F',
		ARNEM: 'ARN2F',
		BERGI: 'BER1F',
		EDUPO: 'LUN1F',
		GORLO: 'GOR2F',
		LEKKO: 'LEK1F',
		LOPIK: 'LOP1F',
		VALKO: 'GOR2F'
	},
	'06': {
		ANDIK: 'AND2R',
		ARNEM: 'ARN2R',
		BERGI: 'BER2R',
		EDUPO: 'LUN1R',
		GORLO: 'GOR2R',
		LEKKO: 'LEK1R',
		LOPIK: 'LOP1R',
		VALKO: 'GOR2R'
	},
	'09': {
		ANDIK: 'AND1N',
		ARNEM: 'ARN2N',
		BERGI: 'BER2N',
		EDUPO: 'LUN1N',
		GORLO: 'GOR2N',
		LEKKO: 'LEK1N',
		LOPIK: 'LOP1N',
		VALKO: 'GOR2N'
	},
	'18L': {
		ANDIK: 'AND2E',
		ARNEM: 'ARN3E',
		BERGI: 'BER3E',
		EDUPO: 'LUN1E',
		GORLO: 'VAL3E',
		LEKKO: 'LEK3E',
		LOPIK: 'LOP3E',
		VALKO: 'VAL3E'
	},
	'18C': {
		ANDIK: 'BET3Y',
		ARNEM: 'ELP2X',
		BERGI: 'WIS1X',
		EDUPO: 'EDU2X',
		GORLO: 'DEN3X',
		LEKKO: 'LAR1X',
		LOPIK: 'ROV2X',
		VALKO: 'DEN3X'
	},
	'22': {
		ANDIK: 'AND2G',
		ARNEM: 'ARN3G',
		BERGI: 'BER1G',
		EDUPO: 'LUN1G',
		GORLO: 'VAL1G',
		LEKKO: 'LEK1G',
		LOPIK: 'LOP1G',
		VALKO: 'VAL1G'
	},
	'24': {
		ANDIK: 'AND1S',
		ARNEM: 'ARN2S',
		BERGI: 'BER1S',
		EDUPO: 'LUN1S',
		GORLO: 'VAL1S',
		LEKKO: 'LEK1S',
		LOPIK: 'LOP2S',
		VALKO: 'VAL1S'
	},
	'27': {
		ANDIK: 'SPY1P',
		ARNEM: 'ARN2P',
		BERGI: 'BER1P',
		EDUPO: 'LUN1P',
		GORLO: 'GOR1P',
		LEKKO: 'LEK1P',
		LOPIK: 'LOP1P',
		VALKO: 'GOR1P'
	},
	'36L': {
		ANDIK: 'SPY2V',
		ARNEM: 'ARN1V',
		BERGI: 'BER3V',
		EDUPO: 'LUN1V',
		GORLO: 'GOR3V',
		LEKKO: 'LEK3V',
		LOPIK: 'LOP3V',
		VALKO: 'GOR3V'
	},
	'36C': {
		ANDIK: 'NOP1W',
		ARNEM: 'NYK3W',
		BERGI: 'DIFT',
		EDUPO: 'IVL2W',
		GORLO: 'DIFT',
		LEKKO: 'WOO1W',
		LOPIK: 'OGI2W',
		VALKO: 'DIFT'
	}
}