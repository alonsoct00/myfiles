/*=================================================================================================
This file is part of the Navitaire NewSkies application.
� 2010 Navitaire, a division of Accenture LLP  All Rights Reserved     
=================================================================================================*/
/*   
---------------------------------------------------------------------------------------------------------------------------------------
common.js
---------------------------------------------------------------------------------------------------------------------------------------
*/
/*
Dependencies: 
This file depends on other JavaScript files to be there at run time.
jquery.js:
$ is a jquery variable
Standards:
JavaScript file names are camelCase, starting with a lower case letter
Put all code in the appropriate namespace such as all object definitions go in SKYSALES.Class
Objects take no parameters when they are constructed, but implement an init method for initialization of their data members

Every object definition has some basic methods
init(jsonObject) - calls the initializing methods
setSettingsByObject(jsonObject) - initializes the object by matching the jsonObject key name with the public member variable name
setVars - accesses nodes on the dom
addEvents - adds dom events to the object, and sets event handlers
supplant - swaps out the objects member value names in [] with there actual values

Event handler method names end in Handler, for example clickEventHandler, 
this is to identify that the this variable will be the dom object and not the object instance.

You pass string ids of dom nodes to objects and they handle finding that node on the dom, and wiring up its own events

Do not write HTML in JavaScript, use a template node from the XSLT, and swap out the object values with a supplant method.
Array brackets [] are used to tell the supplant method to replace the member name with the member value.
[name] is replaced with this.name, Hello [title] [name], becomes Hello Mr. Anderson

Inheritance
Note that I have to instantiate an instance of the base class. And keep it around to be able to call base class methods.
var parent = new GLOBAL.Class.Base();

You must make a copy of the this object, to be used when the this object turns into the window or a dom object.
var thisChildObject = GLOBAL.extendObject(parent);
                
To call a parent method, you must use the built-in call function
parent.setSettingsByObject.call(this);

The child class must override event handler methods to set the this variable correctly.
// The event is added in a addEvents method
thisChildObject.domButton.click(this.updateHandler);

// The event is handled by the correct method, and has thisChildObject available to use via closure
thisChildObject.updateHandler = function  ()
{
thisChildObject.update();
};

How to know when to use the "this" keyword, or the copied this object (thisChildObject)

You should always use the copied this variable on the left side of an assignment operator.
thisChildObject.type = 'childObject';

Inside of an event handler method where you know the the this variable will be set to the dom object.
thisChildObject.updateHandler = function  ()
{
thisChildObject.update();
};

Use the "this" keyword in every other scenario.
this.setSettingsByObject(jsonObject);
var name = this.name;


Follow all of the JsLint rules that apply when you click good parts.

It is highly recommended that you use a JavaScript code compressor to decrease the size of the JavaScript files in production.
Be sure to keep the original file around, because making edits to a compressed file is very difficult.
JavaScript Compressors: 
YUI Compressor: http://developer.yahoo.com/yui/compressor/
JsMin: http://crockford.com/javascript/jsmin.html
We highly recommend turning on gzip compression on your web server.


General Notes:
The common.js file is where JavaScript that is used in multiple places goes,
or JavaScript that is commonly used. Such as code for a control that is on many views.

All of the SkySales JavaScript should be behind the SKYSALES object defined in this file.
You can think of the SKYSALES object as a namespace.
*/

/*
Initialize SKYSALES namespace
All javascript in skysales should be behind the SKYSALES namespace
This prevents naming collisions
*/

/*global window: false, SKYSALES: true, $: false, alert: false, confirm: false, document: false, Option: false, setTimeout: false */

(function () {
    window.SKYSALES = {};
    var SKYSALES = window.SKYSALES;

    //The JSON parser, and serializer
    SKYSALES.Json = window.JSON;

    //A pointer to the active resource object instance
    SKYSALES.Resource = {};

    //A static helper class
    SKYSALES.Util = {};

    //A namespace for class definitions
    SKYSALES.Class = {};

    /*
    A namespace for instances, 
    this is used for instances of objects that are auto generated from object tags. 
    */
    SKYSALES.Instance = {};
    SKYSALES.Instance.index = 0;
    SKYSALES.Instance.getNextIndex = function () {
        SKYSALES.Instance.index += 1;
        return SKYSALES.Instance.index;
    };

    /*
    This is to support browsers that do auto field validation.
    If the form will be checked for validity by the browser then 
    all required attributes and properties will be removed from the input control.
    Opera is the browser this was added for, and it should allow opera to act as a browser
    that does not perform its own form validation.
    */
    /*jslint nomen: true */
    window.__doPostBack = function (eventTarget, eventArgument) {
        var doc = document,
            theForm = doc.SkySales,
            eventTargetElement = doc.getElementById('eventTarget'),
            eventArgumentElement = doc.getElementById('eventArgument'),
            viewStateElement = doc.getElementById('viewState');

        if (theForm && (!theForm.onsubmit || (theForm.onsubmit() !== false))) {
            eventTargetElement.value = eventTarget || eventTargetElement.value;
            eventTargetElement.name = '__EVENTTARGET';
            if (eventArgument !== null) {
                eventArgumentElement.value = eventArgument;
            }
            eventArgumentElement.name = '__EVENTARGUMENT';
            viewStateElement.name = '__VIEWSTATE';
            theForm.submit();
        }
    };
    /*jslint nomen: false */

    /*
    Name: 
    Class LocaleCurrency
    Param:
    num
    Return: 
    An instance of LocaleCurrency
    Functionality:
    This class is used by Util.convertToLocaleCurrency(num)
    Notes:
    This class provides the ability to convert a number to the local currency format
    Class Hierarchy:
    SkySales -> LocaleCurrency
    */
    SKYSALES.Class.LocaleCurrency = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisLocaleCurrency = SKYSALES.Util.extendObject(parent),
            resource = SKYSALES.Util.getResource(),
            integerPartNum = 0,
            integerPartString = '',
            decimalPartString = '',
            number = '',
            positive = true,
            currencyCultureInfo = resource.currencyCultureInfo,

            getCurrencyPattern = function () {
                var pattern = currencyCultureInfo.positivePattern;
                if (!positive) {
                    pattern = currencyCultureInfo.negativePattern;
                }
                return pattern;
            },

            getIntegerPart = function (numVal) {
                var groupSizes = currencyCultureInfo.groupSizes || [],
                    groupSeparator = currencyCultureInfo.groupSeparator,
                    groupSizesIndex = 0,
                    index = 0,
                    currentGroupSize = 3,
                    currentGroupEndIndex = 0,
                    localString = '',
                    array = [],
                    reverseArray = [],
                    reverseArrayOutput = [],
                    getNextGroupSize = null,
                    outputString = '';

                if (groupSizesIndex > groupSizes.length) {
                    currentGroupSize = groupSizes[groupSizesIndex];
                }
                currentGroupEndIndex = currentGroupSize - 1;
                integerPartNum = Math.floor(numVal);
                localString = integerPartNum.toString();
                array = localString.split('');
                reverseArray = array.reverse();
                reverseArrayOutput = [];

                getNextGroupSize = function () {
                    var nextGroupSize = 3;
                    //Increment group sizes index if necessary
                    if (groupSizesIndex <= groupSizes.length - 2) {
                        groupSizesIndex += 1;
                        nextGroupSize = groupSizes[groupSizesIndex];
                    } else {
                        nextGroupSize = currentGroupSize;
                    }
                    currentGroupEndIndex += nextGroupSize;
                    return nextGroupSize;
                };
                for (index = 0; index < reverseArray.length; index += 1) {
                    if (index > currentGroupEndIndex) {
                        currentGroupSize = getNextGroupSize();
                        reverseArrayOutput.push(groupSeparator);
                    }
                    reverseArrayOutput.push(reverseArray[index]);
                }

                array = reverseArrayOutput.reverse();
                outputString = array.join('');
                return outputString;
            },

            getDecimalPart = function (numVal) {
                var decimalPart = numVal - integerPartNum,
                    decimalPartTrimmed = decimalPart.toFixed(currencyCultureInfo.decimalDigits),
                    decimalPartString = decimalPartTrimmed.substring(2);
                return decimalPartString;
            },

            applyPattern = function () {
                var pattern = getCurrencyPattern() || '',
                    replaceNumber = SKYSALES.Util.replace(pattern, 'n', number);
                return replaceNumber;
            },

            invariantNumberToLocaleCurrency = function () {
                thisLocaleCurrency.currency = thisLocaleCurrency.num.toString();
                positive = thisLocaleCurrency.num >= 0;
                // Make the number positive. The applyPattern will reestablish the sign.
                thisLocaleCurrency.num = Math.abs(thisLocaleCurrency.num);
                integerPartString = getIntegerPart(thisLocaleCurrency.num);

                decimalPartString = getDecimalPart(thisLocaleCurrency.num);
                number = integerPartString;
                if (0 < currencyCultureInfo.decimalDigits) {
                    number += currencyCultureInfo.decimalSeparator + decimalPartString;
                }

                thisLocaleCurrency.integerPart = integerPartString;
                thisLocaleCurrency.currency = applyPattern();
            };

        thisLocaleCurrency.num = null;
        thisLocaleCurrency.localeCurrency = null;
        thisLocaleCurrency.integerPart = '';

        thisLocaleCurrency.init = function (json) {
            this.setSettingsByObject(json);
            if (null !== this.num) {
                invariantNumberToLocaleCurrency();
            }
        };

        return thisLocaleCurrency;
    };

    /*
    Name: 
    Class Resource
    Param:
    None
    Return: 
    An instance of Resource
    Functionality:
    Used to hold any common data that multiple controls use such as
    CountryInfo, MacInfo, StationInfo, and BookingInfo
    Notes:
    Right now there is one resource object instance.
    It is accessed in the JavaScript by calling SKYSALES.Util.getResource()
    It is created in the common.xslt file, and populated by resource data
    that is written to JSON.
    The resources that come down to the browser are configured at a view level in the naml file.
    To get a list of stations in JSON you add the node of
    <bind link="StationResource" property="ResourceContainer"/>
    as a child node of the view node.
            
    This class also contains a way to access cookie data. 
    Such as the contact info that is stored in a cookie to populate the contact view.
    Class Hierarchy:
    SkySales -> Resource
    */
    SKYSALES.Class.Resource = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisResource = SKYSALES.Util.extendObject(parent);

        thisResource.carLocationInfo = {};
        thisResource.carLocationArray = [];
        thisResource.carLocationHash = {};
        thisResource.activityLocationInfo = {};
        thisResource.activityLocationArray = [];
        thisResource.activityLocationHash = {};
        thisResource.hotelLocationInfo = {};
        thisResource.hotelLocationArray = [];
        thisResource.hotelLocationHash = {};
        thisResource.countryInfo = {};
        thisResource.provinceStateInfo = {};
        thisResource.stationInfo = {};
        thisResource.macInfo = {};
        thisResource.marketInfo = {};
        thisResource.macHash = {};
        thisResource.stationHash = {};
        thisResource.marketHash = {};
        thisResource.sourceInfo = {};
        thisResource.clientHash = {};
        thisResource.dateCultureInfo = {};
        thisResource.currencyCultureInfo = {};
        thisResource.carrierInfo = {};
        thisResource.carrierHash = {};
        thisResource.datePickerInfo = {};
        thisResource.passengerInfo = {};
        thisResource.passengerHash = {};
        thisResource.titleInfo = {};
        thisResource.carInfo = {};
        thisResource.externalRateInfo = {};
        thisResource.currencyInfo = {};
        thisResource.currencyHash = {};

        /*
        Turns the macInfo into a hash for quick lookups.
        Keying into the macHash with the mac code you will get back 
        an object that contains an array of station codes that the mac code is associated with.
        macHash[macCode] = { "code": "stationCode", "stations": [ "stationCode1", "stationCode2" ] };
        */
        thisResource.populateMacHash = function () {
            var i = 0,
                macArray = [],
                macHash = {},
                mac = null,
                len = -1;

            if (thisResource.macInfo && thisResource.macInfo.MacList) {
                macArray = thisResource.macInfo.MacList;
                len = macArray.length;
                for (i = 0; i < len; i += 1) {
                    mac = macArray[i];
                    macHash[mac.code] = mac;
                }
            }
            thisResource.macHash = macHash;
        };


		Array.prototype.removeValue = function(name, value){
		   var array = $.map(this, function(v,i){
			  return v[name] === value ? null : v;
		   });
		   this.length = 0; //clear original array
		   this.push.apply(this, array); //push all elements except the one we want to delete
		};

        thisResource.populateStationList = function () {
            var i = 0,
                stationArray = [],
                station = null,
                len = -1;

            if (thisResource.stationInfo && thisResource.stationInfo.StationList) {
                stationArray = thisResource.stationInfo.StationList;
                len = stationArray.length;
                for (i = 0; i < len; i += 1) {
                    station = stationArray[i];
                    station.index = i;					
                }
            }

			stationArray.removeValue('code', 'BNA');
			stationArray.removeValue('code', 'CLT');
			stationArray.removeValue('code', 'CLE');
			stationArray.removeValue('code', 'PIT');
			stationArray.removeValue('code', 'RIC');
			stationArray.removeValue('code', 'EWR');
			stationArray.removeValue('code', 'IND');
			stationArray.removeValue('code', 'RDU');
			stationArray.removeValue('code', 'CMH');
			stationArray.removeValue('code', 'LAN');
			stationArray.removeValue('code', 'LTO');
			stationArray.removeValue('code', 'UPN');
			stationArray.removeValue('code', 'QRO');			
			stationArray.removeValue('code', 'DEN');
			stationArray.removeValue('code', 'PBC');			
			stationArray.removeValue('code', 'ZLO');
			stationArray.removeValue('code', 'SAP');
			stationArray.removeValue('code', 'SJU');
			stationArray.removeValue('code', 'NAS');
			stationArray.removeValue('code', 'PTY');
			stationArray.removeValue('code', 'YYZ');
			stationArray.removeValue('code', 'YUL');
			stationArray.removeValue('code', 'DCA');
			stationArray.removeValue('code', 'SLW');
			stationArray.removeValue('code', 'YVR');
			stationArray.removeValue('code', 'MBJ');
            thisResource.stationInfo.StationList = stationArray;
        };

        /*
        Turns the stationInfo into a hash for quick lookups.
        Keying into the stationHash with the station code you will get back a station object
        stationHash[stationCode] = { "macCode": "", "name":"", "code": "" };
        */
        thisResource.populateStationHash = function () {
            var i = 0,
                stationArray = [],
                stationHash = {},
                station = null,
                len = -1;

            if (thisResource.stationInfo && thisResource.stationInfo.StationList) {
                stationArray = thisResource.stationInfo.StationList;
                len = stationArray.length;
                for (i = 0; i < len; i += 1) {
                    station = stationArray[i];
                    stationHash[station.code] = station;
                }
            }
            thisResource.stationHash = stationHash;
        };

        /*
        Turns the passengerInfo into a hash for quick lookups.
        Keying into the passengerHash with the passenger number you will get back a passenger object
        passengerHash[passengerNumber] = { "name": {}, "Nationality":"US", "Gender": "Male" };
        */
        thisResource.populatePassengerHash = function () {
            var i = 0,
                passengerArray = [],
                passengerHash = {},
                passenger = null,
                len = -1;

            if (thisResource.passengerInfo && thisResource.passengerInfo.PassengerList) {
                passengerArray = thisResource.passengerInfo.PassengerList;
                len = passengerArray.length;
                for (i = 0; i < len; i += 1) {
                    passenger = passengerArray[i];
                    passengerHash[passenger.PassengerNumber] = passenger;
                }
            }
            thisResource.passengerHash = passengerHash;
        };

        /*
        Turns the carrierInfo into a hash for quick lookups.
        Keying into the carrierHash with the carrier code you will get back a carrier object
        carrierHash[carrierCode] = { "macCode": "", "name":"", "code": "" };
        */
        thisResource.populateCarrierHash = function () {
            var i = 0,
                carrierArray = [],
                carrierArrayLength = 0,
                carrierHash = {},
                carrier = null,
                carrierInfo = this.carrierInfo;

            if (carrierInfo) {
                carrierArray = carrierInfo.carrierList;
                if (carrierArray) {
                    carrierArrayLength = carrierArray.length;
                    if (carrierArrayLength > 0) {
                        for (i = 0; i < carrierArrayLength; i += 1) {
                            carrier = carrierArray[i];
                            carrierHash[carrier.code] = carrier;
                        }
                    }
                }
                thisResource.carrierHash = carrierHash;
            }
        };

        /*
        Turns the marketInfo into a hash for quick lookups.
        Keying into the marketHash with the orgin station code you will get back an array of objects.
        Each object contains a destination station code that can be mapped to a station object using the stationHash.
        marketHash[originStationCode] = [ { "code": "destinationStationCode1", "name": "destinationStationCode2" } ]

        The station codes that do not match up to a station object are removed from the destinationArray with the
        JavaScript array method splice. Array.splice(startIndex, lengthOfElementsToRemove);
        The splice method takes the element out of the array completely, and reorders the indexes of the array
        */
        thisResource.populateMarketHash = function () {
            var i = 0,
                destinationArray = [],
                destination = {},
                station = {},
                originCode = "",
                marketHash = {},
                stationHash = thisResource.stationHash;

            if (thisResource.marketInfo && thisResource.marketInfo.MarketList) {
                marketHash = thisResource.marketInfo.MarketList;

                for (originCode in marketHash) {
                    if (marketHash.hasOwnProperty(originCode)) {
                        destinationArray = marketHash[originCode];

                        for (i = destinationArray.length - 1; i >= 0; i -= 1) {
                            destination = destinationArray[i];
                            station = stationHash[destination.code];
                            if (station) {
                                destination.name = station.name;
                                destination.index = station.index;
                            } else {
                                destinationArray.splice(i, 1);
                            }
                        }
                        destinationArray.sort(this.destinationSort);
                    }
                }
                thisResource.marketHash = marketHash;
            }
        };

        thisResource.destinationSort = function (stationOne, stationTwo) {
            var stationOneIndex = stationOne.index,
                stationTwoIndex = stationTwo.index;

            return stationOneIndex - stationTwoIndex;
        };

        /*
        The clientHash is data that has been stored in a cookie
        */
        thisResource.populateClientHash = function () {
            var cookie = window.document.cookie,
                nameValueArray = [],
                i = 0,
                singleNameValue = '',
                key = '',
                value = '',
                eqIndex = -1,
                len = -1;

            if (cookie) {
                nameValueArray = document.cookie.split('; ');
                len = nameValueArray.length;
                for (i = 0; i < len; i += 1) {
                    singleNameValue = nameValueArray[i];
                    eqIndex = singleNameValue.indexOf('=');
                    if (eqIndex > -1) {
                        key = singleNameValue.substring(0, eqIndex);
                        value = singleNameValue.substring(eqIndex + 1, singleNameValue.length);
                        if (key) {
                            value = SKYSALES.Util.decodeUriComponent(value);
                            thisResource.clientHash[key] = value;
                        }
                    }
                }
            }
        };

        /*
        Turns the currencyInfo into a hash for quick lookups.
        Keying into the currencyHash with the currency code you will get back a currency object
        currencyHash[currencyCode] = { "currencyCode": "", "Description":"" };
        */
        thisResource.populateCurrencyHash = function () {
            var i = 0,
                currencyArray = [],
                currencyHash = {},
                currency = null,
                len = -1;

            if (thisResource.currencyInfo && thisResource.currencyInfo.CurrencyList) {
                currencyArray = thisResource.currencyInfo.CurrencyList;
                len = currencyArray.length;
                for (i = 0; i < len; i += 1) {
                    currency = currencyArray[i];
                    currencyHash[currency.code] = currency;
                }
            }
            thisResource.currencyHash = currencyHash;
        };

        /*
        Turns the locationInfo into an array
        */
        thisResource.populateAOSLocationInfoArray = function (locationInfo, locationHash) {
            var i = 0,
                locationArray = [],
                len = 0,
                location = null,
                parentCode = '',
                parentLocation = null;

            locationInfo = locationInfo || {};
            locationArray = locationInfo.LocationList || [];
            len = locationArray.length;
            for (i = 0; i < len; i += 1) {
                location = locationArray[i];
                parentCode = location.parent;
                if (parentCode) {
                    parentLocation = locationHash[parentCode];
                    if (parentLocation) {
                        // need to add spaces for indentation to work in Internet Explorer
                        location.name = '\xa0\xa0\xa0\xa0' + parentLocation.name + ' - ' + location.name;
                        location.optionClass = 'subLocation';
                    }
                }
            }

            return locationArray;
        };

        /*
        Turns the locationInfo into an array
        */
        thisResource.getAOSLocationHash = function (aosLocationInfo) {
            var i = 0,
                locationArray = null,
                locationHash = {},
                len = 0,
                location = null,
                locationInfo = aosLocationInfo || {};

            locationArray = locationInfo.LocationList || [];
            len = locationArray.length;
            for (i = 0; i < len; i += 1) {
                location = locationArray[i];
                locationHash[location.code] = location;
            }
            locationHash = locationHash || {};
            return locationHash;
        };


        /*
        Populate the object instance.
        This is accomplished by matching the name of the public menber
        with the name of the key in the key: value pair of the JSON object that is passed in.
        It then turns the data into hash lists for quick lookups.
        */
        thisResource.setSettingsByObject = function (json) {
            parent.setSettingsByObject.call(this, json);
            SKYSALES.datepicker = this.datePickerInfo;
            this.populateStationList();
            this.populateStationHash();
            this.populateCarrierHash();
            this.populateMacHash();
            this.populateMarketHash();
            this.populateClientHash();
            this.populatePassengerHash();
            this.populateCurrencyHash();
            thisResource.carLocationHash = this.getAOSLocationHash(this.carLocationInfo);
            thisResource.carLocationArray = this.populateAOSLocationInfoArray(this.carLocationInfo, this.carLocationHash);
            thisResource.activityLocationHash = this.getAOSLocationHash(this.activityLocationInfo);
            thisResource.activityLocationArray = this.populateAOSLocationInfoArray(this.activityLocationInfo, this.activityLocationHash);
            thisResource.hotelLocationHash = this.getAOSLocationHash(this.hotelLocationInfo);
            thisResource.hotelLocationArray = this.populateAOSLocationInfoArray(this.hotelLocationInfo, this.hotelLocationHash);
        };
        return thisResource;
    };

    /*
    Name:
    Class Util
    Param:
    objNameBase: the prefix for the instance name
    objType: The type of object to create
    json: The object passed to the init method
    createEvent:       ready, If the object should be created on the ready event - (The Default)
    load, If the object creation can wait until the onLoad event
    Return:
    None
    Functionality:
    Represents a Static Util object
    Notes:
    Provides common methods.
    Used for inheritance - for example
    var parent = new SKYSALES.Class.SkySales();
    var theObject = SKYSALES.Util.extendObject(parent);
    This class reads in the JSON object tags and instantiates them into running JavaScript

    Class Hierarchy:
    SkySales -> Resource
    */

    SKYSALES.Util.createObjectArray = [];
    SKYSALES.Util.createObject = function (objNameBase, objType, json, createEvent) {
        createEvent = createEvent || "ready";
        var createObjectArray = SKYSALES.Util.createObjectArray;
        createObjectArray[createObjectArray.length] = {
            "objNameBase": objNameBase,
            "objType": objType,
            "json": json,
            "createEvent": createEvent
        };
    };

    SKYSALES.Util.initObjects = function (createEvent) {
        createEvent = createEvent || "ready";
        var i = 0,
            createObjectArray = SKYSALES.Util.createObjectArray,
            objName = '',
            objectType = '',
            json = null,
            createObject = null;

        for (i = 0; i < createObjectArray.length; i += 1) {
            createObject = createObjectArray[i];
            if (createObject.createEvent === createEvent) {
                objName = createObject.objNameBase + SKYSALES.Instance.getNextIndex();
                objectType = createObject.objType;
                json = createObject.json || {};
                if (SKYSALES.Class[objectType]) {
                    SKYSALES.Instance[objName] = new SKYSALES.Class[objectType]();
                    SKYSALES.Instance[objName].init(json);
                }
            }
        }
    };

    //Replace characters that could not be stored in a cookie
    SKYSALES.Util.decodeUriComponent = function (str) {
        str = str || '';
        if (window.decodeURIComponent) {
            str = window.decodeURIComponent(str);
        }
        str = SKYSALES.Util.replace(str, /\+/g, ' ');
        return str;
    };

    //Replace characters for cookie storage
    SKYSALES.Util.encodeUriComponent = function (str) {
        str = str || '';
        if (window.encodeURIComponent) {
            str = window.encodeURIComponent(str);
        }
        return str;
    };

    SKYSALES.Util.getTime = function (hour, minutes, seconds) {
        var time = '',
            hourOriginal = 0;

        hour = Number(hour);
        hourOriginal = hour;
        minutes = Number(minutes);
        seconds = Number(seconds);

        if (isNaN(hour) === false) {
            if (hour > 12) {
                hour = hour - 12;
            } else if (hour === 0) {
                hour = 12;
            } else if (hour.toString().length === 1) {
                hour = '0' + hour;
            }
            time = hour;
            if (isNaN(minutes) === false) {
                if (minutes.toString().length === 1) {
                    minutes = '0' + minutes;
                }
                time = time + ':' + minutes;
                if (isNaN(seconds) === false) {
                    if (seconds.toString().length === 1) {
                        seconds = '0' + seconds;
                    }
                    time = time + ':' + seconds;
                }
            }
            if (hourOriginal > 11 && hourOriginal < 24) {
                time = time + ' PM';
            } else {
                time = time + ' AM';
            }
        }
        return time;
    };

    //Return the main resource instance, this object is instantiated in the common.xslt
    SKYSALES.Util.getResource = function () {
        return SKYSALES.Resource;
    };

    SKYSALES.Util.getAttributeValue = function (e, name) {
        var attributeName = name + '.validation',
            jQueryData = e.data(attributeName);
        return jQueryData;
    };

    SKYSALES.Util.setAttribute = function (e, name, value) {
        var attributeName = name + '.validation';
        e.data(attributeName, value);
    };

    SKYSALES.Util.removeAttribute = function (e, name) {
        var attributeName = name + '.validation';
        e.removeData(attributeName);
    };

    SKYSALES.Util.setRequiredAttribute = function (e, requiredError) {
        var requiredAttribute = 'required',
            requiredErrorAttribute = 'requirederror',
            required = 'true',
            setAttribute = SKYSALES.Util.setAttribute;

        setAttribute(e, requiredAttribute, required);
        if (requiredError) {
            setAttribute(e, requiredErrorAttribute, requiredError);
        }
        SKYSALES.Util.formatInputLabel(e);
    };

    SKYSALES.Util.removeRequiredAttribute = function (e) {
        var requiredAttribute = 'required',
            requiredErrorAttribute = 'requirederror',
            removeAttribute = SKYSALES.Util.removeAttribute;

        removeAttribute(e, requiredAttribute);
        removeAttribute(e, requiredErrorAttribute);
        SKYSALES.Util.formatInputLabel(e);
    };

    //Douglas Crockford's inheritance method
    SKYSALES.Util.extendObject = function (o) {
        var F = function () { };
        F.prototype = o;
        return new F();
    };

    // Searches for bracketed tokens within html and replaces them using the fields of json.
    // for example:
    // supplant("<p>[name]<p>", { "name":"Joe" })
    // will return "<p>Joe</p>"
    SKYSALES.Util.supplant = function (template, json) {
        var regex = /\[(\w+)\]/g,
            retval = null;

        if (template && template.replace && json) {
            retval = template.replace(regex, function (fullMatch, token) {
                var result = null;
                if (json.hasOwnProperty(token)) {
                    result = json[token];
                }
                if (result === null) {
                    result = '';
                } else if (result === undefined) {
                    result = token;
                }

                return result;
            });
        } else {
            retval = '';
        }
        return retval;
    };

    /*
    Parses a date string like "2010-05-31" (ISO 8601 format) and returns a JS Date object.
    */
    SKYSALES.Util.parseIsoDate = function (dateStr) {
        var iso8601Regex = /^(\d{4})-([0-3]\d)-(\d{2})/,
            result = null,
            matches = iso8601Regex.exec(dateStr);

        if (matches) {
            result = new Date(+matches[1], matches[2] - 1, +matches[3]);
        }

        return result;
    };

    /*
    Takes a JS Date as input and returns a string like "2010-05-31" (ISO 8601 format)
    */
    SKYSALES.Util.dateToIsoString = function (date) {
        var year = date.getFullYear(),
            month = (date.getMonth() + 1).toString(),
            day = date.getDate().toString(),
            result = '';

        if (month.length === 1) {
            month = '0' + month;
        }
        if (day.length === 1) {
            day = '0' + day;
        }

        result = year + '-' + month + '-' + day;
        return result;
    };


    /*
    Parses a date string like "2010-05-31" and returns a JS Date object.
    */
    SKYSALES.Util.parseIsoDate = function (dateStr) {
        var iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})/,
            result = null,
            matches = iso8601Regex.exec(dateStr);

        if (matches) {
            result = new Date(+matches[1], matches[2] - 1, +matches[3]);
        }

        return result;
    };

    /*
    Takes a JS Date as input and returns a string like "2010-05-31"
    */
    SKYSALES.Util.dateToIsoString = function (date) {
        var year = date.getFullYear(),
            month = (date.getMonth() + 1).toString(),
            day = date.getDate().toString(),
            result = '';

        if (month.length === 1) {
            month = '0' + month;
        }
        if (day.length === 1) {
            day = '0' + day;
        }

        result = year + '-' + month + '-' + day;
        return result;
    };

    /*
    Populates a html select box
    An Option object should always be used instead of writing <option> nodes to the dom.
    Writing <option> nodes to the dom has issues in IE6
    */
    SKYSALES.Util.populateSelect = function (paramObj) {
        paramObj = paramObj || {};

        var selectedItem = paramObj.selectedItem || null,
            objectArray = paramObj.objectArray || [],
            selectBox = paramObj.selectBox || null,
            showCode = paramObj.showCode || false,
            clearOptions = paramObj.clearOptions || false,
            text = '',
            value = '',
            selectBoxObj = null,
            obj = null,
            i = 0,
            len = 0,
            optionNode = '',
            OptionNode = Option,
            codeProperty = paramObj.codeName || 'code',
            nameProperty = paramObj.nameProperty || 'name',
            optionArray = null,
            isIe6 = false,
            val = '';

        if (selectBox.length > 0) {
            selectBoxObj = selectBox[0];
            if (selectBoxObj && selectBoxObj.options) {
                optionArray = selectBoxObj.options;
                if (clearOptions) {
                    optionArray.length = 0;
                } else {
                    if (!selectBoxObj.originalOptionLength) {
                        selectBoxObj.originalOptionLength = selectBoxObj.options.length;
                    }
                    optionArray.length = selectBoxObj.originalOptionLength;
                }

                len = objectArray.length;
                //if ($.browser.msie && $.browser.version < 7) {
				//if (8 < 7) {
                //    isIe6 = true;
                // }
                for (i = 0; i < len; i += 1) {
                    obj = objectArray[i] || {};
                    text = obj[nameProperty] || '';
                    value = obj[codeProperty];
                    if (!value && value !== 0) {
                        value = '';
                    }
                    if (showCode) {
                        text += ' (' + value + ')';
                    }
                    //if (isIe6) {
                    //    optionNode = new OptionNode(text, value, false, false);
                    //    if (obj.optionClass) {
                    //        $(optionNode).addClass(obj.optionClass);
                    //    }
                    //    optionArray[optionArray.length] = optionNode;
                    //} else 
                    //{

                        optionNode += '<option value="' + value + '"';
                        if (obj.optionClass) {
                            optionNode += ' class"="' + obj.optionClass + '"';
                        }
                        optionNode += '>' + text + '</option>';
                    //}
                }
                //if (!isIe6) {
                //    selectBox.append(optionNode);
                //}
                if (selectedItem !== null) {
                    selectBox.val(selectedItem);
                    val = selectBox.val();
                    selectedItem = String(selectedItem);

                    if (val !== selectedItem) {
                        optionNode = new OptionNode(selectedItem, selectedItem, false, false);
                        selectBox.append(optionNode);
                        selectBox.val(selectedItem);
                    }
                }
            }
        }
    };

    SKYSALES.Util.populate = function (json) {
        json = json || {};

        var input = json.input || $([]);

        if (input && input[0] && input[0].options) {
            json.selectBox = input;
            SKYSALES.Util.populateSelect(json);
        } else if (input) {
            json.options = json.objectArray || [];
            SKYSALES.Class.DropDown.getDropDown(json);
        }
    };

    SKYSALES.Util.cloneArray = function (array) {
        return array.concat();
    };

    SKYSALES.Util.convertToLocaleCurrency = function (num) {
        var json = {
            "num": num
        },
            localeCurrency = new SKYSALES.Class.LocaleCurrency();

        localeCurrency.init(json);
        return localeCurrency.currency;
    };

    SKYSALES.Util.convertToLocaleInteger = function (num) {
        var json = {
            "num": num
        },
            localeInteger = new SKYSALES.Class.LocaleCurrency();

        localeInteger.init(json);
        return localeInteger.integerPart;
    };

    SKYSALES.Util.formatAmount = function (price, points, pointsSuffix, connector) {
        var formattedAmount = "",
            pointsCompare = (points === "0" || points === "");


        if (price !== "" && !pointsCompare) {
            formattedAmount = points + " " + pointsSuffix + " " + connector + " " + price;
        } else if (price !== "" && pointsCompare) {
            formattedAmount = price;
        } else if (price === "" && !pointsCompare) {
            formattedAmount = points + " " + pointsSuffix;
        }

        return formattedAmount;
    };

    SKYSALES.Util.replace = function (source, search, replacement) {
        var retVal = '',
            searchType = typeof search;

        replacement = String(replacement);
        searchType = searchType.toLowerCase();
        source = String(source);

        if (searchType === 'object') {
            replacement = replacement.replace(/\$/g, '$$$$');
        }
        retVal = source.replace(search, replacement);
        return retVal;
    };

    /*
    Name:
    Class SkySales
    Param:
    None
    Return:
    An instance of SkySales
    Functionality:
    This is the SkySales base class that most objects inherit from
    Notes:
    This class provides the ability to show and hide objects based on their container.
    Class Hierarchy:
    SkySales
    */
    SKYSALES.Class.SkySales = function () {
        var thisSkySales = this;

        thisSkySales.containerId = '';
        thisSkySales.container = null;

        thisSkySales.init = SKYSALES.Class.SkySales.prototype.init;
        thisSkySales.getById = SKYSALES.Class.SkySales.prototype.getById;
        thisSkySales.setSettingsByObject = SKYSALES.Class.SkySales.prototype.setSettingsByObject;
        thisSkySales.addEvents = SKYSALES.Class.SkySales.prototype.addEvents;
        thisSkySales.setVars = SKYSALES.Class.SkySales.prototype.setVars;
        thisSkySales.hide = SKYSALES.Class.SkySales.prototype.hide;
        thisSkySales.show = SKYSALES.Class.SkySales.prototype.show;

        return thisSkySales;
    };
    SKYSALES.Class.SkySales.prototype.init = function (json) {
        this.setSettingsByObject(json);
        this.setVars();
    };
    SKYSALES.Class.SkySales.prototype.getById = function (id, container) {
        var retVal = null;

        if (id && container) {
            retVal = $('#' + id, container);
        } else if (id) {
            retVal = window.document.getElementById(id);
            if (retVal) {
                retVal = $(retVal);
            }
        }

        if (!retVal) {
            retVal = $([]);
        }

        return retVal;
    };
    SKYSALES.Class.SkySales.prototype.setSettingsByObject = function (json) {
        var propName = '';
        for (propName in json) {
            if (json.hasOwnProperty(propName)) {
                if (this[propName] !== undefined) {
                    this[propName] = json[propName];
                }
            }
        }
    };
    SKYSALES.Class.SkySales.prototype.addEvents = function () { };
    SKYSALES.Class.SkySales.prototype.setVars = function () {
        this.container = this.getById(this.containerId);
    };
    SKYSALES.Class.SkySales.prototype.hide = function () {
        this.container.hide();
    };
    SKYSALES.Class.SkySales.prototype.show = function () {
        this.container.show('slow');
    };

    /*
    Name:
    Class BaseToggleView
    Param:
    None
    Return:
    An instance of BaseToggleView
    Functionality:
    This is the Base class for any class that can show or hide itself.
    The containerId is the id of the domelement that you wish to show and hide.
    Notes:
    Class Hierarchy:
    SkySales -> BaseToggleView
    */
    SKYSALES.Class.BaseToggleView = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisBaseToggleView = SKYSALES.Util.extendObject(parent);

        thisBaseToggleView.toggleViewIdArray = [];
        thisBaseToggleView.toggleViewArray = [];

        thisBaseToggleView.addToggleView = function (json) {
            if (json.toggleViewIdArray) {
                json = json.toggleViewIdArray;
            }
            var toggleViewIdArray = json || [],
                toggleViewIdObj = null,
                i = 0,
                toggleView = null;

            if (toggleViewIdArray.length === undefined) {
                toggleViewIdArray = [];
                toggleViewIdArray[0] = json;
            }
            for (i = 0; i < toggleViewIdArray.length; i += 1) {
                toggleViewIdObj = toggleViewIdArray[i];
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdObj);
                thisBaseToggleView.toggleViewArray[thisBaseToggleView.toggleViewArray.length] = toggleView;
            }
        };
        return thisBaseToggleView;
    };

    /*
    Name:
    Class FlightSearch
    Param:
    None
    Return:
    An instance of FlightSearch
    Functionality:
    The object that initializes the AvailabilitySearchInput control
    Notes:
    This class contains and creates all of the objects necessary to add functionality to the AvailabilitySearchInput control
    Class Hierarchy:
    SkySales -> FlightSearch
    */
    SKYSALES.Class.FlightSearch = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisFlightSearch = SKYSALES.Util.extendObject(parent),
            flightTypeInputArray = [];

        thisFlightSearch.marketArray = [];
        thisFlightSearch.flightTypeInputIdArray = [];
        thisFlightSearch.countryInputIdArray = [];
        thisFlightSearch.countryInputArray = [];

        thisFlightSearch.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initFlightTypeInputIdArray();
            this.initCountryInputIdArray();
            this.populateFlightType();
        };

        thisFlightSearch.setSettingsByObject = function (json) {
            parent.setSettingsByObject.call(this, json);

            var i = 0,
                marketArray = this.marketArray || [],
                market = null;

            for (i = 0; i < marketArray.length; i += 1) {
                market = new SKYSALES.Class.FlightSearchMarket();
                market.flightSearch = this;
                market.index = i;
                market.init(marketArray[i]);
                this.marketArray[i] = market;
            }
        };

        thisFlightSearch.initCountryInputIdArray = function () {
            var i = 0,
                countryInputId = null,
                countryInput = {},
                countryInputIdArray = this.countryInputIdArray || [];

            for (i = 0; i < countryInputIdArray.length; i += 1) {
                countryInputId = countryInputIdArray[i];
                countryInput = new SKYSALES.Class.CountryInput();
                countryInput.init(countryInputId);
                thisFlightSearch.countryInputArray[this.countryInputArray.length] = countryInput;
            }
        };

        thisFlightSearch.initFlightTypeInputIdArray = function () {
            var i = 0,
                flightTypeInputId = null,
                flightTypeInput = {},
                flightTypeInputIdArray = this.flightTypeInputIdArray || [];

            for (i = 0; i < flightTypeInputIdArray.length; i += 1) {
                flightTypeInputId = flightTypeInputIdArray[i];
                flightTypeInput = new SKYSALES.Class.FlightTypeInput();
                flightTypeInput.flightSearch = this;
                flightTypeInput.index = i;
                flightTypeInput.init(flightTypeInputId);
                flightTypeInputArray[flightTypeInputArray.length] = flightTypeInput;
            }
        };

        thisFlightSearch.populateFlightType = function () {
            var flightTypeIndex = 0,
                flightType = null,
                jFlightTypeInput = null;

            for (flightTypeIndex = 0; flightTypeIndex < flightTypeInputArray.length; flightTypeIndex += 1) {
                flightType = flightTypeInputArray[flightTypeIndex];
                jFlightTypeInput = $(flightType.input);
                if (jFlightTypeInput.attr('checked')) {
                    jFlightTypeInput.click();
                    break;
                }
            }
        };

        thisFlightSearch.updateFlightType = function (activeflightType) {
            var flightTypeIndex = 0,
                flightType = null,
                hideInput = null,
                hideInputIndex,
                hideInputArray = null;

            for (flightTypeIndex = 0; flightTypeIndex < flightTypeInputArray.length; flightTypeIndex += 1) {
                flightType = flightTypeInputArray[flightTypeIndex];
                hideInputArray = flightType.hideInputArray;
                for (hideInputIndex = 0; hideInputIndex < hideInputArray.length; hideInputIndex += 1) {
                    hideInput = $(hideInputArray[hideInputIndex]);
                    hideInput.show();
                }
            }
            hideInputArray = activeflightType.hideInputArray;
            for (hideInputIndex = 0; hideInputIndex < hideInputArray.length; hideInputIndex += 1) {
                hideInput = $(hideInputArray[hideInputIndex]);
                hideInput.hide();
            }
        };

        return thisFlightSearch;
    };


    /*
    Name:
    Class FlightSearchMarket
    Param:
    None
    Return:
    An instance of FlightSearchMarket
    Functionality:
    The object that initializes the market data for the AvailabilitySearchInput control
    Notes:

    Class Hierarchy:
    SkySales -> FlightSearchMarket
    */
    SKYSALES.Class.FlightSearchMarket = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisFlightSearchMarket = SKYSALES.Util.extendObject(parent),
            marketInputArray = [],
            stationInputArray = [],
            stationDropDownArray = [],
            macInputArray = [];

        thisFlightSearchMarket.flightSearch = null;
        thisFlightSearchMarket.index = -1;
        thisFlightSearchMarket.validationMessageObject = {};

        thisFlightSearchMarket.validationObjectIdArray = [];
        thisFlightSearchMarket.stationInputIdArray = [];
        thisFlightSearchMarket.stationDropDownIdArray = [];
        thisFlightSearchMarket.marketInputIdArray = [];
        thisFlightSearchMarket.macInputIdArray = [];
        thisFlightSearchMarket.marketDateIdArray = [];
        thisFlightSearchMarket.lowFareAvailabilityArray = [];
        thisFlightSearchMarket.marketDateArray = [];

        thisFlightSearchMarket.init = function (json) {		
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();

            this.initMarketInputIdArray();
            this.initStationInputIdArray();
            this.initStationDropDownIdArray();
            this.initMacInputIdArray();
            this.initMarketDateIdArray();
            this.initLowFareAvailabilityArray();
        };

        thisFlightSearchMarket.initMacInputIdArray = function () {
            var i = 0,
                macInputId = null,
                macInput = {},
                macInputIdArray = this.macInputIdArray || [];

            for (i = 0; i < macInputIdArray.length; i += 1) {
                macInputId = macInputIdArray[i];
                macInput = new SKYSALES.Class.MacInput();
                macInput.init(macInputId);
                macInputArray[macInputArray.length] = macInput;
                macInput.showMac.call(macInput.stationInput);
            }
        };

        thisFlightSearchMarket.initMarketDateIdArray = function () {
            var i = 0,
                marketDateId = null,
                marketDate = {},
                marketDateIdArray = this.marketDateIdArray || [];

            for (i = 0; i < marketDateIdArray.length; i += 1) {
                marketDateId = marketDateIdArray[i];
                marketDate = new SKYSALES.Class.MarketDate();
                marketDate.init(marketDateId);
                this.marketDateArray[this.marketDateArray.length] = marketDate;
            }
        };

        thisFlightSearchMarket.initMarketInputIdArray = function () {
            var i = 0,
                marketInputId = null,
                marketInput = {},
                marketInputIdArray = this.marketInputIdArray || [];

            for (i = 0; i < marketInputIdArray.length; i += 1) {
                marketInputId = marketInputIdArray[i];
                marketInput = new SKYSALES.Class.MarketInput();
                marketInput.init(marketInputId);
                marketInputArray[marketInputArray.length] = marketInput;				
            }
        };

        thisFlightSearchMarket.initStationInputIdArray = function () {
            var i = 0,
                stationInputId = null,
                stationInput = {},
                stationInputIdArray = this.stationInputIdArray;				

            for (i = 0; i < stationInputIdArray.length; i += 1) {
                stationInputId = stationInputIdArray[i];
                stationInput = new SKYSALES.Class.StationInput();
                stationInput.init(stationInputId);				
                stationInputArray[stationInputArray.length] = stationInput;				
            }
        };

        thisFlightSearchMarket.initStationDropDownIdArray = function () {
            var i = 0,
                stationDropDownId = null,
                stationDropDown = {},
                stationDropDownIdArray = this.stationDropDownIdArray;

            for (i = 0; i < stationDropDownIdArray.length; i += 1) {
                stationDropDownId = stationDropDownIdArray[i];
                stationDropDown = new SKYSALES.Class.StationDropDown();
                stationDropDown.init(stationDropDownId);				
                stationDropDownArray[stationDropDownArray.length] = stationDropDown;
            }
        };

        thisFlightSearchMarket.initLowFareAvailabilityArray = function () {
            var i = 0,
                lowFareAvailability = null,
                lowFareAvailabilityArray = this.lowFareAvailabilityArray,
                len = lowFareAvailabilityArray.length,
                lowFareAvailabilityJson = {};

            for (i = 0; i < len; i += 1) {
                lowFareAvailability = new SKYSALES.Class.LowFareAvailability();
                lowFareAvailabilityJson = lowFareAvailabilityArray[i];
                lowFareAvailabilityJson.datePickerManager = this.marketDateArray[0].datePickerManager;
                lowFareAvailability.init(lowFareAvailabilityJson);
                lowFareAvailabilityArray[lowFareAvailabilityArray.length] = lowFareAvailability;				
            }
        };
        return thisFlightSearchMarket;
    };

    /*
    Name:
    Class LowFareAvailability
    Param:
    None
    Return:
    An instance of LowFareAvailability
    Functionality:
    Handles the functionality of the low fare finder on the trip planner view
    Notes:

    Class Hierarchy:
    SkySales -> LowFareAvailability
    */
    SKYSALES.Class.LowFareAvailability = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisLowFareAvailability = SKYSALES.Util.extendObject(parent),
            origin = '',
            destination = '',
            marketDate = '';

        thisLowFareAvailability.request = {};
        thisLowFareAvailability.url = 'TripPlannerLowFareSelectAjax-resource.aspx';
        thisLowFareAvailability.containerId = 'lowFareAvailabilityContainerId';
        thisLowFareAvailability.container = {};
        thisLowFareAvailability.showId = '';
        thisLowFareAvailability.show = null;
        thisLowFareAvailability.flightSearch = {};
        thisLowFareAvailability.tripPlannerSearchFlight = {};
        thisLowFareAvailability.originId = '';
        thisLowFareAvailability.destinationId = '';
        thisLowFareAvailability.marketDateId = '';
        thisLowFareAvailability.marketDateObject = {};
        thisLowFareAvailability.datePickerManager = {};
        thisLowFareAvailability.requestStartDate = null;
        thisLowFareAvailability.requestEndDate = null;
        thisLowFareAvailability.lowFareAvailabilityMisconfiguredErrorDivId = 'lowFareAvailabilityMisconfiguredErrorText';
        thisLowFareAvailability.lowFareAvailabilityMisconfiguredErrorText = '';

        thisLowFareAvailability.updateShow = function () {
            this.tripPlannerSearchFlight.tripPlannerSearchFlights.dontRequireOriginAndDestinationOnFlights();
            this.tripPlannerSearchFlight.requireOriginAndDestination();
            var isValid = this.validate();
            if (isValid) {
                this.populateRequest();
                this.sendLowFareAvailabilityRequest();
            }
        };

        thisLowFareAvailability.updateShowHandler = function () {
            thisLowFareAvailability.updateShow();
        };

        thisLowFareAvailability.validate = function () {
            return SKYSALES.Util.validate(this.show[0]);
        };

        thisLowFareAvailability.addEvents = function () {
            this.show.click(this.updateShowHandler);
        };

        thisLowFareAvailability.populateRequest = function () {
            var residentCountry = this.flightSearch.countryInputArray[0].input.val(),
                tripPlannerSearch = this.tripPlannerSearchFlight.tripPlannerSearchFlights.tripPlannerSearch,
                preferredFare = tripPlannerSearch.preferredFareDropDown.val(),
                discountCode = tripPlannerSearch.passengerDiscountDropDown.val(),
                passengerTypeDropDown = {},
                passengerTypeDropDowns = tripPlannerSearch.passengerTypeDropDowns.passengerTypeDropDownArray || [],
                passengerTypeDropDownsLength = passengerTypeDropDowns.length,
                i = 0,
                name = '',
                namePrefix = '',
                value = '',
                originVal = origin.val(),
                destinationVal = destination.val(),
                marketDateVal = marketDate.val(),
                marketDateValArray = marketDateVal.split('-'),
                marketYear = marketDateValArray[0],
                marketMonth = marketDateValArray[1] - 1,
                marketDay = marketDateValArray[2],
                formattedStartDate = {},
                formattedEndDate = {},
                today = new Date(),
                yesterday = new Date(),
                sevenDaysAgo = new Date(),
                startDate = new Date(),
                endDate = new Date();

            thisLowFareAvailability.marketDateObject = new Date(marketYear, marketMonth, marketDay);

            thisLowFareAvailability.request = {
                "Search.ResidentCountry": residentCountry,
                "Search.PreferredFare": preferredFare,
                "Search.DiscountCode": discountCode
            };
            for (i = 0; i < passengerTypeDropDownsLength; i += 1) {
                passengerTypeDropDown = passengerTypeDropDowns[i];
                name = passengerTypeDropDown.attr('name');
                value = passengerTypeDropDown.val();
                thisLowFareAvailability.request[name] = value;
            }
            yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            sevenDaysAgo = new Date(this.marketDateObject);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (yesterday > sevenDaysAgo) {
                startDate = yesterday;
            } else {
                startDate = sevenDaysAgo;
            }

            endDate = new Date(this.marketDateObject);
            endDate.setDate(endDate.getDate() + 7);
            thisLowFareAvailability.requestStartDate = startDate;
            thisLowFareAvailability.requestEndDate = endDate;

            namePrefix = 'Search.DateMarkets[0].';
            thisLowFareAvailability.request[namePrefix + 'OriginStation.MarketCode'] = originVal;
            thisLowFareAvailability.request[namePrefix + 'DestinationStation.MarketCode'] = destinationVal;
            formattedStartDate = SKYSALES.Util.dateToIsoString(startDate);
            thisLowFareAvailability.request[namePrefix + 'DepartureDate'] = formattedStartDate;
            formattedEndDate = SKYSALES.Util.dateToIsoString(endDate);
            thisLowFareAvailability.request[namePrefix + 'ArrivalDate'] = formattedEndDate;

            this.tripPlannerSearchFlight.hideTripIsUnavailable();
            this.tripPlannerSearchFlight.hideTripHasNoFares();
        };

        thisLowFareAvailability.sendLowFareAvailabilityRequest = function () {
            $.post(this.url, this.request, this.responseHandler);
        };

        thisLowFareAvailability.availabilityExists = function (schedules) {
            schedules = schedules || [];
            var availabilityExists = false,
                schedulesLength = schedules.length || 0,
                scheduleIndex = 0,
                journeyDateMarketList = [];

            while ((scheduleIndex < schedulesLength) && !availabilityExists) {
                journeyDateMarketList = schedules[scheduleIndex].JourneyDateMarketList;
                if (journeyDateMarketList.length > 0) {
                    availabilityExists = true;
                }
                scheduleIndex += 1;
            }
            return availabilityExists;
        };


        thisLowFareAvailability.makeDateMarketHash = function (schedules) {
            schedules = schedules || [];
            var dateMarketHash = {},
                scheduleIndex = 0,
                schedulesLength = schedules.length,
                schedule = {},
                journeyDateMarketList = [],
                journeyDateMarketListLength = 0,
                journeyDateMarketIndex = 0,
                journeyDateMarket,
                departureDate = {},
                departureMonthZeroBased = 0,
                journeys = [],
                segments = [],
                fares = [],
                paxFares = [],
                serviceCharges = [],
                serviceCharge = {},
                price = 0,
                key = '';

            for (scheduleIndex = 0; scheduleIndex < schedulesLength; scheduleIndex += 1) {
                schedule = schedules[scheduleIndex];
                journeyDateMarketList = schedule.JourneyDateMarketList;
                journeyDateMarketListLength = journeyDateMarketList.length;
                for (journeyDateMarketIndex = 0; journeyDateMarketIndex < journeyDateMarketListLength; journeyDateMarketIndex += 1) {
                    journeyDateMarket = journeyDateMarketList[journeyDateMarketIndex];
                    departureDate = journeyDateMarket.DepartureDate;
                    departureMonthZeroBased = departureDate.Month - 1;
                    key = 'date_' + '0' + '_' + departureDate.Year + '_' + departureMonthZeroBased + '_' + departureDate.Day;
                    journeys = journeyDateMarket.Journeys || [];
                    price = 0;
                    if (journeys.length) {
                        segments = journeys[0].Segments || [];
                        if (segments.length) {
                            fares = segments[0].Fares || [];
                            if (fares.length) {
                                paxFares = fares[0].PaxFares || [];
                                if (paxFares.length) {
                                    serviceCharges = paxFares[0].ServiceCharges || [];
                                    if (serviceCharges.length) {
                                        serviceCharge = serviceCharges[0] || {};
                                        price = serviceCharge.Amount || 0;
                                        price = parseFloat(price, 10);
                                    }
                                }
                            }
                        }
                    }
                    dateMarketHash[key] = {
                        "year": departureDate.Year,
                        "month": departureMonthZeroBased,
                        "day": departureDate.Day,
                        "containerId": key,
                        "price": price
                    };
                }
            }
            return dateMarketHash;
        };

        thisLowFareAvailability.processResponse = function (data) {
            var response = $(data),
                jsonStr = response.html(),
                json = SKYSALES.Json.parse(jsonStr),
                calendarAvailabilityInputJson = {
                    "containerId": "lowFareAvailabilityContainerId",
                    "templateId": "tripPlannerCalendar",
                    "totalTemplateId": "totalTemplateId",
                    "totalId": "totalId",
                    "marketArray": [],
                    "requestStartDate": this.requestStartDate,
                    "requestEndDate": this.requestEndDate
                },
                marketArray = [],
                market = {},
                tripAvailabilityResponse = json.TripAvailabilityResponse || {},
                schedules = tripAvailabilityResponse.Schedules || [],
                schedule = null,
                availabilityExists = null,
                journeyDateMarketList = [],
                firstJourneyDateMarketListLength = 0,
                lastJourneyDateMarketListLength = 0,
                firstJourneyDateMarket = {},
                lastJourneyDateMarket = {},
                tripPlannerCalendarAvailabilityInput = {};

            availabilityExists = this.availabilityExists(schedules);

            if (!availabilityExists) {
                this.tripPlannerSearchFlight.showTripIsUnavailable();
                this.container.hide();
            } else if (schedules.length > 0) {
                schedule = schedules[0];
                journeyDateMarketList = schedule.JourneyDateMarketList || [];
                firstJourneyDateMarketListLength = journeyDateMarketList.length;
                if (firstJourneyDateMarketListLength > 0) {
                    firstJourneyDateMarket = journeyDateMarketList[0];
                    market = {
                        "departureStation": firstJourneyDateMarket.DepartureStation,
                        "arrivalStation": firstJourneyDateMarket.ArrivalStation,
                        "selectedDate": this.marketDateObject,
                        "startYear": firstJourneyDateMarket.DepartureDate.Year,
                        "startMonth": firstJourneyDateMarket.DepartureDate.Month - 1,
                        "startDay": firstJourneyDateMarket.DepartureDate.Day
                    };

                    lastJourneyDateMarketListLength = journeyDateMarketList.length;
                    if (lastJourneyDateMarketListLength > 0) {
                        lastJourneyDateMarket = journeyDateMarketList[lastJourneyDateMarketListLength - 1];
                        market.endYear = lastJourneyDateMarket.DepartureDate.Year;
                        market.endMonth = lastJourneyDateMarket.DepartureDate.Month - 1;
                        market.endDay = lastJourneyDateMarket.DepartureDate.Day;
                    }
                }
                market.dateMarketHash = this.makeDateMarketHash(schedules);
                market.datePickerManager = this.datePickerManager;
                marketArray.push(market);
                calendarAvailabilityInputJson.marketArray = marketArray;

                tripPlannerCalendarAvailabilityInput = new SKYSALES.Class.TripPlannerCalendarAvailabilityInput();
                tripPlannerCalendarAvailabilityInput.init(calendarAvailabilityInputJson);
                this.container.show();
            }
        };

        thisLowFareAvailability.validateResponse = function (data) {
            var valid = true;

            if (data === '') {
                valid = false;
            } else if (!$(data)[0].innerHTML) {
                valid = false;
            }

            return valid;
        };

        thisLowFareAvailability.validateAndProcessResponse = function (data) {
            var dataObject = $(data),
                responseIsValid = this.validateResponse(dataObject);

            if (responseIsValid) {
                this.processResponse(dataObject);
            } else {
                alert(thisLowFareAvailability.lowFareAvailabilityMisconfiguredErrorText);
            }
        };

        thisLowFareAvailability.responseHandler = function (data) {
            thisLowFareAvailability.validateAndProcessResponse(data);
        };

        thisLowFareAvailability.ajaxErrorHandler = function (data) {
            thisLowFareAvailability.ajaxError(data);
        };

        thisLowFareAvailability.setVars = function () {
            var lowFareAvailabilityMisconfiguredErrorTextDiv = this.getById(this.lowFareAvailabilityMisconfiguredErrorDivId);

            if (lowFareAvailabilityMisconfiguredErrorTextDiv.length > 0) {
                thisLowFareAvailability.lowFareAvailabilityMisconfiguredErrorText = lowFareAvailabilityMisconfiguredErrorTextDiv.text();
            }
            thisLowFareAvailability.show = this.getById(this.showId);
            thisLowFareAvailability.container = this.getById(this.containerId);
            origin = this.getById(this.originId);
            destination = this.getById(this.destinationId);
            marketDate = this.getById(this.marketDateId);
            thisLowFareAvailability.flightSearch = this.tripPlannerSearchFlight.tripPlannerSearchFlights.tripPlannerSearch.flightSearch;
        };

        thisLowFareAvailability.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        return thisLowFareAvailability;
    };

    /*
    Name:
    Class MacInput
    Param:
    None
    Return:
    An instance of MacInput
    Functionality:
    Handles the functionality of the macs on the AvailabilitySearchInput control
    Notes:
    This class controls the mac html input controls
    Class Hierarchy:
    SkySales -> MacInput
    */
    SKYSALES.Class.MacInput = function () {
        var macInputBase = new SKYSALES.Class.SkySales(),
            thisMacInput = SKYSALES.Util.extendObject(macInputBase);

        thisMacInput.macHash = SKYSALES.Util.getResource().macHash;
        thisMacInput.stationHash = SKYSALES.Util.getResource().stationHash;
        thisMacInput.stationInputId = '';
        thisMacInput.macContainerId = '';
        thisMacInput.macLabelId = '';
        thisMacInput.macInputId = '';
        thisMacInput.macContainer = {};
        thisMacInput.stationInput = {};
        thisMacInput.macInput = {};
        thisMacInput.macLabel = {};

        thisMacInput.showMac = function () {
            var stationCode = $(this).val(),
                station = null,
                macCode = '',
                macText = '',
                mac = null;

            stationCode = stationCode || '';
            stationCode = stationCode.toUpperCase();

            thisMacInput.macInput.removeAttr('checked');
            thisMacInput.macContainer.hide();
            station = thisMacInput.stationHash[stationCode];
            if (station) {
                macCode = station.macCode;
                mac = thisMacInput.macHash[macCode];
                if (mac && mac.stations.length > 0) {
                    macText = mac.stations.join();
                    thisMacInput.macLabel.html(macText);
                    thisMacInput.macContainer.show();
                }
            }
        };

        thisMacInput.addEvents = function () {
            thisMacInput.stationInput.change(thisMacInput.showMac);
        };

        thisMacInput.setVars = function () {
            thisMacInput.stationInput = this.getById(thisMacInput.stationInputId);
            thisMacInput.macContainer = this.getById(thisMacInput.macContainerId);
            thisMacInput.macLabel = this.getById(thisMacInput.macLabelId);
            thisMacInput.macInput = this.getById(thisMacInput.macInputId);
        };

        thisMacInput.init = function (paramObject) {
            macInputBase.init.call(this, paramObject);
            thisMacInput.macContainer.hide();
            this.addEvents();
        };
        return thisMacInput;
    };

    /*
    Name:
    Class MarketDate
    Param:
    None
    Return:
    An instance of MarketDate
    Functionality:
    Handles the functionality of the dates on the AvailabilitySearchInput control
    Notes:
    The dates also effect the date selection calendar
    Class Hierarchy:
    SkySales -> MarketDate
    */
    SKYSALES.Class.MarketDate = function () {
        var marketDateBase = new SKYSALES.Class.SkySales(),
            thisMarketDate = SKYSALES.Util.extendObject(marketDateBase);

        thisMarketDate.dateFormat = SKYSALES.datepicker.datePickerFormat;
        thisMarketDate.dateDelimiter = SKYSALES.datepicker.datePickerDelimiter;
        thisMarketDate.marketDateId = '';
        thisMarketDate.marketDate = null;
        thisMarketDate.marketDayId = '';
        thisMarketDate.marketDay = null;
        thisMarketDate.marketMonthYearId = '';
        thisMarketDate.marketMonthYear = null;
        thisMarketDate.useJQueryDatePicker = true;
        thisMarketDate.datePickerManager = {};
        thisMarketDate.fullDateFormatString = 'mm/dd/yy';


        thisMarketDate.parseDate = function (dateStr) {
            var day = '',
                month = '',
                year = '',
                date = new Date(),
                dateData = '',
                formatChar = '',
                datePickerArray = [],
                i = 0,
                isoResult = SKYSALES.Util.parseIsoDate(dateStr);

            if (isoResult) {
                date = isoResult;
            } else if (dateStr.indexOf(thisMarketDate.dateDelimiter) > -1) {
                datePickerArray = dateStr.split(this.dateDelimiter);
                for (i = 0; i < this.dateFormat.length; i += 1) {
                    dateData = datePickerArray[i];
                    if (dateData.charAt(0) === '0') {
                        dateData = dateData.substring(1);
                    }
                    formatChar = this.dateFormat.charAt(i);
                    switch (formatChar) {
                        case 'm':
                            month = dateData;
                            break;
                        case 'd':
                            day = dateData;
                            break;
                        case 'y':
                            year = dateData;
                            break;
                    }
                }
                date = new Date(year, month - 1, day);
            }
            return date;
        };

        thisMarketDate.addEvents = function () {
            var initJson = {
                "isAOS": false,
                "yearMonth": this.marketMonthYear,
                "day": this.marketDay,
                "linkedDate": this.marketDate,
                "useJQueryDatePicker": this.useJQueryDatePicker,
                "fullDateFormatString": this.fullDateFormatString
            };

            thisMarketDate.datePickerManager = new SKYSALES.Class.DatePickerManager();
            this.datePickerManager.init(initJson);
        };

        thisMarketDate.setVars = function () {
            thisMarketDate.marketDate = this.getById(this.marketDateId);
            thisMarketDate.marketDay = this.getById(this.marketDayId);
            thisMarketDate.marketMonthYear = this.getById(this.marketMonthYearId);
        };

        thisMarketDate.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        // Checks if the 1st date is before the 2nd date.
        thisMarketDate.datesInOrder = function (dateArray) {
            var retVal = true,
                dateA = null,
                dateB = null;

            dateA = this.parseDate(dateArray[0]);
            dateB = this.parseDate(dateArray[1]);

            if (dateA > dateB) {
                retVal = false;
            }
            return retVal;
        };

        return thisMarketDate;
    };

    /*
    Name:
    Class CountryInput
    Param:
    None
    Return:
    An instance of CountryInput
    Functionality:
    Handles the functionality of the resident country on the AvailabilitySearchInput control
    Notes:
    The list of countries comes from the resource object
    Class Hierarchy:
    SkySales -> CountryInput
    */
    SKYSALES.Class.CountryInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCountryInput = SKYSALES.Util.extendObject(parent);

        thisCountryInput.countryInfo = SKYSALES.Util.getResource().countryInfo;
        thisCountryInput.countryInputId = '';
        thisCountryInput.input = {};
        thisCountryInput.defaultValue = null;
        thisCountryInput.showCode = true;

        thisCountryInput.populateCountryInput = function () {
            var json = {},
                countryInfo = this.countryInfo || {},
                defaultValue = this.defaultValue,
                countryArray = countryInfo.CountryList || [];

            if (defaultValue === null) {
                defaultValue = countryInfo.DefaultValue;
            }

            json = {
                "input": this.input,
                "objectArray": countryArray,
                "selectedItem": defaultValue,
                "showCode": this.showCode
            };
            SKYSALES.Util.populate(json);
        };

        thisCountryInput.setVars = function () {
            thisCountryInput.input = this.getById(this.countryInputId);
        };

        thisCountryInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.populateCountryInput();
            this.addEvents();
        };
        return thisCountryInput;
    };

    /*
    Name:
    Class DateInput
    Param:
    None
    Return:
    An instance of DateInput
    Functionality:
    Handles the functionality of the issue date on the PassengerInput control
    Class Hierarchy:
    SkySales -> DateInput
    */
    SKYSALES.Class.DateInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisDateInput = SKYSALES.Util.extendObject(parent);

        thisDateInput.yearStart = 1900;
        thisDateInput.yearEnd = 0;
        thisDateInput.dayCount = 31;
        thisDateInput.date = null;
        thisDateInput.dateId = '';
        thisDateInput.dateYear = null;
        thisDateInput.dateYearId = '';
        thisDateInput.dateYearValue = '';
        thisDateInput.dateMonth = null;
        thisDateInput.dateMonthId = '';
        thisDateInput.dateMonthValue = '';
        thisDateInput.dateDay = null;
        thisDateInput.dateDayId = '';
        thisDateInput.dateDayValue = '';
        thisDateInput.dateDayInfo = [];
        thisDateInput.dateMonthInfo = [];
        thisDateInput.dateYearInfo = [];
        thisDateInput.useOneBasedMonth = false;
        thisDateInput.useTwoDigitMonth = false;
        thisDateInput.showNumberMonth = false;
        thisDateInput.defaultDayOfMonth = '';

        thisDateInput.initDateInfo = function () {
            var resource = SKYSALES.Util.getResource() || {},
                monthInfo = resource.dateCultureInfo.monthNamesShort || [],
                monthName = '',
                len = 0,
                i = 0,
                monthIndex = 0,
                useOneBasedMonth = this.useOneBasedMonth,
                dayCount = this.dayCount,
                yearStart = this.yearStart,
                currentDate = new Date(),
                currentYear = currentDate.getFullYear(),
                yearEnd = this.yearEnd || currentYear,
                dateDayInfo = this.dateDayInfo,
                dateMonthInfo = this.dateMonthInfo,
                dateYearInfo = this.dateYearInfo,
                useTwoDigitMonth = this.useTwoDigitMonth,
                showNumberMonth = this.showNumberMonth;

            for (i = 1; i <= dayCount; i += 1) {
                dateDayInfo.push({
                    "name": i,
                    "code": i
                });
            }

            len = monthInfo.length;
            for (i = 0; i < len; i += 1) {
                monthIndex = i;
                monthName = monthInfo[i];

                if (monthName) {
                    if (showNumberMonth) {
                        monthName = monthIndex;
                        monthName = parseInt(monthName, 10);
                        monthName += 1;
                        if (monthName < 10) {
                            monthName = '0' + monthName;
                        }
                    }

                    if (useOneBasedMonth) {
                        monthIndex = i + 1;
                    }
                    if (useTwoDigitMonth && monthIndex < 10) {
                        monthIndex = '0' + monthIndex;
                    }

                    dateMonthInfo.push({
                        "name": monthName,
                        "code": monthIndex
                    });
                }
            }

            if (yearEnd < yearStart) {
                for (i = yearEnd; i <= yearStart; i += 1) {
                    dateYearInfo.push({
                        "name": i,
                        "code": i
                    });
                }
            } else {
                for (i = yearEnd; i >= yearStart; i -= 1) {
                    dateYearInfo.push({
                        "name": i,
                        "code": i
                    });
                }
            }

        };

        thisDateInput.initDropDown = function (objectArray, selectBox) {
            var selectParamObj = {};

            selectParamObj = {
                'objectArray': objectArray,
                'input': selectBox,
                'showCode': false,
                'clearOptions': false,
                'selectedItem': ''
            };

            SKYSALES.Util.populate(selectParamObj);
        };

        thisDateInput.initDropDownValues = function () {
            var date = null,
                year = '',
                month = '',
                day = '';

            if (this.dateYearValue !== '' && this.dateMonthValue !== '' && this.dateDayValue !== '') {

                date = new Date(this.dateYearValue, this.dateMonthValue - 1, this.dateDayValue);

                if (date) {
                    year = date.getFullYear();
                    month = date.getMonth();
                    day = date.getDate();

                    if (year !== 9999) {
                        this.dateYear.val(year);
                        this.dateMonth.val(month);
                        this.dateDay.val(day);

                        this.updateDate();
                    }
                }
            }
        };

        thisDateInput.updateDateHandler = function () {
            thisDateInput.updateDate();
        };

        thisDateInput.updateDate = function () {
            var value = '',
                date = null,
                year = 0,
                month = 0,
                day = 0,
                defaultDayOfMonth = this.defaultDayOfMonth;


            year = this.dateYear.val();
            month = this.dateMonth.val();
            day = this.dateDay.val();

            if (!day && defaultDayOfMonth === 'last') {
                year = parseInt(year, 10);
                month = parseInt(month, 10);
                day = 1;
                date = new Date(year, month, day);
                if (!this.useOneBasedMonth) {
                    date.setMonth(date.getMonth() + 1);
                }
                date.setDate(date.getDate() - 1);
                day = date.getDate();
            }

            if (year && month !== '' && day && month !== null) {
                year = parseInt(year, 10);
                month = parseInt(month, 10);
                if (this.useOneBasedMonth) {
                    month -= 1;
                }
                day = parseInt(day, 10);
                date = new Date(year, month, day);
                value = SKYSALES.Util.dateToIsoString(date);
            }

            this.date.val(value);
        };

        thisDateInput.setVars = function () {
            this.date = this.getById(this.dateId);
            this.dateYear = this.getById(this.dateYearId);
            this.dateMonth = this.getById(this.dateMonthId);
            this.dateDay = this.getById(this.dateDayId);
        };

        thisDateInput.addEvents = function () {
            this.dateYear.change(this.updateDateHandler);
            this.dateMonth.change(this.updateDateHandler);
            this.dateDay.change(this.updateDateHandler);
        };

        thisDateInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();

            this.initDateInfo();
            this.initDropDown(this.dateYearInfo, this.dateYear);
            this.initDropDown(this.dateMonthInfo, this.dateMonth);
            this.initDropDown(this.dateDayInfo, this.dateDay);
            this.initDropDownValues();

            this.addEvents();
        };

        return thisDateInput;
    };

    /*
    Name:
    Class FlightTypeInput
    Param:
    None
    Return:
    An instance of CountryInput
    Functionality:
    Handles the functionality of the flight type on the AvailabilitySearchInput control
    Notes:
    Flight type is the type of flight, as in Round Trip, One Way, or Open Jaw
    When you select a flight type the correct html fields are shown.
    Class Hierarchy:
    SkySales -> FlightTypeInput
    */
    SKYSALES.Class.FlightTypeInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisFlightTypeInput = SKYSALES.Util.extendObject(parent);

        thisFlightTypeInput.flightSearch = null;
        thisFlightTypeInput.index = -1;

        thisFlightTypeInput.flightTypeId = '';
        thisFlightTypeInput.hideInputIdArray = [];
        thisFlightTypeInput.hideInputArray = [];
        thisFlightTypeInput.input = {};

        thisFlightTypeInput.updateFlightTypeHandler = function () {
            thisFlightTypeInput.flightSearch.updateFlightType(thisFlightTypeInput);
        };

        thisFlightTypeInput.addEvents = function () {
            parent.addEvents.call(this);
            this.input.click(this.updateFlightTypeHandler);
        };

        thisFlightTypeInput.setVars = function () {
            parent.setVars.call(this);

            var hideInputIndex = 0,
                hideInput = null,
                hideInputArray = [];

            thisFlightTypeInput.input = this.getById(this.flightTypeId);
            for (hideInputIndex = 0; hideInputIndex < this.hideInputIdArray.length; hideInputIndex += 1) {
                hideInput = thisFlightTypeInput.getById(this.hideInputIdArray[hideInputIndex]);
                if (hideInput) {
                    hideInputArray[hideInputArray.length] = hideInput;
                }
            }
            thisFlightTypeInput.hideInputArray = $(hideInputArray);
        };

        thisFlightTypeInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };
        return thisFlightTypeInput;
    };

    /*
    Name:
    Class MarketInput
    Param:
    None
    Return:
    An instance of MarketInput
    Functionality:
    Handles the functionality of the markets on the AvailabilitySearchInput control
    Notes:
    Markets are a link between stations.
    When you select an orgin station only the valid destionation stations should be available for selection.
    Class Hierarchy:
    SkySales -> MarketInput
    */
    SKYSALES.Class.MarketInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisMarketInput = SKYSALES.Util.extendObject(parent),
            resource = SKYSALES.Util.getResource() || {};

        thisMarketInput.marketHash = resource.marketHash;
        thisMarketInput.stationList = resource.stationInfo.StationList || [];

        thisMarketInput.containerId = '';
        thisMarketInput.container = null;
        thisMarketInput.disableInputId = '';
        thisMarketInput.disableInput = null;
        thisMarketInput.originId = '';
        thisMarketInput.origin = null;
        thisMarketInput.destinationId = '';
        thisMarketInput.destination = null;
        thisMarketInput.toggleMarketCount = 0;

        thisMarketInput.toggleMarketHandler = function () {
            thisMarketInput.toggleMarket();
        };

        thisMarketInput.toggleMarket = function () {
            if ((this.toggleMarketCount % 2) === 0) {
                $(':input', this.container).attr('disabled', 'disabled');
            } else {
                $(':input', this.container).removeAttr('disabled');
            }
            thisMarketInput.toggleMarketCount += 1;			
        };

        thisMarketInput.updateMarketOriginHandler = function () {
            var origin = $(this).val();			
            thisMarketInput.updateMarketOrigin(origin);
        };

        thisMarketInput.updateMarketOrigin = function (origin) {
            var destinationArray = [],
                json = {};

            origin = origin.toUpperCase();			
            destinationArray = this.marketHash[origin];
            destinationArray = destinationArray || [];
            json = {
                "input": this.destination,
                "objectArray": destinationArray,
                "showCode": true
            };
            SKYSALES.Util.populate(json);
            this.destination.change();
        };

        thisMarketInput.addEvents = function () {
            this.origin.change(this.updateMarketOriginHandler);
            this.disableInput.click(this.toggleMarketHandler);
        };

        thisMarketInput.setVars = function () {
            thisMarketInput.container = this.getById(this.containerId);
            thisMarketInput.disableInput = this.getById(this.disableInputId);
            thisMarketInput.origin = this.getById(this.originId);			
            thisMarketInput.destination = this.getById(this.destinationId);
        };
		
        thisMarketInput.populateMarketInput = function (input) {
            var json = {};

            json = {
                "input": input,
                "objectArray": this.stationList,
                "showCode": true,				
            };			
            SKYSALES.Util.populate(json);
        };

        thisMarketInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.populateMarketInput(this.origin);
            this.populateMarketInput(this.destination);
            this.disableInput.click();
            this.disableInput.removeAttr('checked');
        };		
        return thisMarketInput;		
		
    };


    /*
    Name:
    Class StationInput
    Param:
    None
    Return:
    An instance of StationInput
    Functionality:
    Handles the functionality of the stations on the AvailabilitySearchInput control
    Notes:
    StationInput is the html form element where you type the origin or destination station
    Class Hierarchy:
    SkySales -> StationInput
    */
    SKYSALES.Class.StationInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisStationInput = SKYSALES.Util.extendObject(parent);

        thisStationInput.stationInputId = '';
        thisStationInput.stationInput = null;

        thisStationInput.setVars = function () {
            parent.setVars.call(this);
            thisStationInput.stationInput = this.getById(this.stationInputId);
        };

        thisStationInput.init = function (json) {
            parent.init.call(this, json);
            this.addEvents();
        };
        return thisStationInput;
    };

    /*
    Name:
    Class StationDropDown
    Param:
    None
    Return:
    An instance of StationDropDown
    Functionality:
    Handles the functionality of the stations on the AvailabilitySearchInput control
    Notes:
    StationDropDown is the html form element where you select the orgin or destination station
    Class Hierarchy:
    SkySales -> StationDropDown
    */
    SKYSALES.Class.StationDropDown = function () {
        var stationDropDownBase = new SKYSALES.Class.SkySales(),
            thisStationDropDown = SKYSALES.Util.extendObject(stationDropDownBase);

        thisStationDropDown.selectBoxId = '';
        thisStationDropDown.selectBox = null;
        thisStationDropDown.inputId = '';
        thisStationDropDown.input = null;

        thisStationDropDown.updateStationDropDown = function () {
            var stationCode = $(this).val();
            if (stationCode) {
                thisStationDropDown.selectBox.val(stationCode);
            }
        };

        thisStationDropDown.updateStationInput = function () {
            var stationCode = $(this).val();
            thisStationDropDown.input.val(stationCode);
            thisStationDropDown.input.change();
        };

        thisStationDropDown.addEvents = function () {
            thisStationDropDown.input.change(thisStationDropDown.updateStationDropDown);
            thisStationDropDown.selectBox.change(thisStationDropDown.updateStationInput);
        };

        thisStationDropDown.setVars = function () {
            thisStationDropDown.selectBox = this.getById(thisStationDropDown.selectBoxId);
            thisStationDropDown.input = this.getById(thisStationDropDown.inputId);
        };

        thisStationDropDown.init = function (paramObject) {
            stationDropDownBase.init.call(this, paramObject);
            this.addEvents();
            thisStationDropDown.input.change();
        };
        return thisStationDropDown;
    };

    /*
    Name:
    TravelDocumentInput
    Param:
    None
    Return:
    An instance of TravelDocumentInput
    Functionality:
    The object that sets the travel document information of the TravelDocumentInput control for registration
    Class Hierarchy:
    TravelDocumentInput
    */
    SKYSALES.Class.TravelDocumentInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTravelDocumentInput = SKYSALES.Util.extendObject(parent);

        thisTravelDocumentInput.instanceName = '';
        thisTravelDocumentInput.delimiter = '_';

        thisTravelDocumentInput.travelDocumentInfoId = '';
        thisTravelDocumentInput.travelDocumentInfo = null;
        thisTravelDocumentInput.documentNumberId = '';
        thisTravelDocumentInput.documentNumber = null;
        thisTravelDocumentInput.documentTypeId = '';
        thisTravelDocumentInput.documentType = null;
        thisTravelDocumentInput.documentIssuingCountryId = '';
        thisTravelDocumentInput.documentIssuingCountry = null;
        thisTravelDocumentInput.documentBirthCountryId = '';
        thisTravelDocumentInput.documentBirthCountry = null;
        thisTravelDocumentInput.documentExpYearId = '';
        thisTravelDocumentInput.documentExpYear = null;
        thisTravelDocumentInput.documentExpMonthId = '';
        thisTravelDocumentInput.documentExpMonth = null;
        thisTravelDocumentInput.documentExpDayId = '';
        thisTravelDocumentInput.documentExpDay = null;
        thisTravelDocumentInput.actionId = '';
        thisTravelDocumentInput.action = null;
        thisTravelDocumentInput.travelDocumentKey = '';

        thisTravelDocumentInput.missingDocumentText = '';
        thisTravelDocumentInput.missingDocumentTypeText = '';
        thisTravelDocumentInput.invalidExpDateText = '';
        thisTravelDocumentInput.emptyExpDateText = '';
        thisTravelDocumentInput.invalidDaysOfMonthTextPre = '';
        thisTravelDocumentInput.invalidDaysOfMonthTextMid = '';
        thisTravelDocumentInput.invalidDaysOfMonthTextPost = '';
        thisTravelDocumentInput.missingDocumentNumberText = '';
        thisTravelDocumentInput.missingDocumentCountryText = '';

        thisTravelDocumentInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisTravelDocumentInput.setVars = function () {
            thisTravelDocumentInput.travelDocumentInfo = this.getById(this.travelDocumentInfoId);
            thisTravelDocumentInput.documentType = this.getById(this.documentTypeId);
            thisTravelDocumentInput.documentNumber = this.getById(this.documentNumberId);
            thisTravelDocumentInput.documentIssuingCountry = this.getById(this.documentIssuingCountryId);
            thisTravelDocumentInput.documentBirthCountry = this.getById(this.documentBirthCountryId);
            thisTravelDocumentInput.documentExpYear = this.getById(this.documentExpYearId);
            thisTravelDocumentInput.documentExpMonth = this.getById(this.documentExpMonthId);
            thisTravelDocumentInput.documentExpDay = this.getById(this.documentExpDayId);
            thisTravelDocumentInput.action = this.getById(this.actionId);
        };

        thisTravelDocumentInput.setTravelDocumentInfo = function () {
            var travelDocumentKey = '',
                documentType = this.documentType.val(),
                documentNumber = this.documentNumber.val(),
                documentIssuingCountry = this.documentIssuingCountry.val(),
                birthCountry = this.documentBirthCountry.val();

            if (documentType && documentNumber && documentIssuingCountry) {
                //travelDocumentKey should always start with the delimiter.
                //travelDocumentKey format is as follows: _<DOC TYPE>_<DOC NUMBER>_<ISSUING COUNTRY>_<BIRTH COUNTRY>
                travelDocumentKey = this.delimiter + documentType + this.delimiter + documentNumber + this.delimiter + documentIssuingCountry + this.delimiter + birthCountry;
                this.travelDocumentInfo.val(travelDocumentKey);
            }
            return true;
        };

        thisTravelDocumentInput.validateTravelDocumentHandler = function () {
            var result = thisTravelDocumentInput.validateTravelDocument();
            return result;
        };

        thisTravelDocumentInput.validateTravelDocument = function () {
            this.setTravelDocumentInfo();
            var action = this.action[0],
                result = SKYSALES.Util.validate(action) && this.validateInput();
            return result;
        };

        thisTravelDocumentInput.addEvents = function () {
            this.action.click(this.validateTravelDocumentHandler);
        };

        thisTravelDocumentInput.validateInput = function () {
            var retVal = true,
                msg = '',
                invalidDateMsg = '',
                documentNumberValue = this.documentNumber.val() || '',
                documentExpYearValue = this.documentExpYear.val() || '',
                documentExpMonthValue = this.documentExpMonth.val() || '',
                documentExpDayValue = this.documentExpDay.val() || '',
                documentTypeValue = this.documentType.val() || '',
                documentIssuingCountryValue = this.documentIssuingCountry.val() || '',
                isPassedDate = false,
                isValidDate = false,
                documentExpMonthText = '';

            if (documentNumberValue || documentTypeValue || documentIssuingCountryValue || documentExpYearValue || documentExpMonthValue || documentExpDayValue) {
                if (!documentNumberValue) {
                    msg = msg + this.missingDocumentNumberText + "\n";
                }
                if (!documentTypeValue) {
                    msg = msg + this.missingDocumentTypeText + "\n";
                }
                if (!documentIssuingCountryValue) {
                    msg = msg + this.missingDocumentCountryText + "\n";
                }

                isValidDate = this.checkDaysOfMonth(documentExpDayValue, documentExpMonthValue, documentExpYearValue);
                isPassedDate = this.isPastDate(documentExpDayValue, documentExpMonthValue, documentExpYearValue);
                if (documentExpDayValue && documentExpMonthValue && documentExpYearValue) {
                    if (!isValidDate) {
                        documentExpMonthText = this.documentExpMonth.find(':selected').text();
                        invalidDateMsg = this.invalidDaysOfMonthTextPre + documentExpDayValue;
                        invalidDateMsg += this.invalidDaysOfMonthTextMid + documentExpMonthText + this.invalidDaysOfMonthTextPost;
                        msg = msg + invalidDateMsg + "\n";
                    } else if (!isPassedDate) {
                        msg = msg + this.invalidExpDateText + "\n";
                    }
                } else {
                    msg = msg + this.emptyExpDateText + "\n";
                }

                if (msg) {
                    window.alert(this.missingDocumentText + "\n" + msg);
                    retVal = false;
                }
            }
            return retVal;
        };

        thisTravelDocumentInput.checkDaysOfMonth = function (day, month, year) {
            year = window.parseInt(year, 10);
            month = window.parseInt(month, 10);
            day = window.parseInt(day, 10);
            var retVal = false,
                lastDayInFeb = null,
                daysInFeb = -1,
                daysInMonth = null;

            if (year && month && day) {
                month -= 1;
                lastDayInFeb = new Date();
                lastDayInFeb.setMonth(2);
                lastDayInFeb.setDate(1);
                lastDayInFeb.setDate(lastDayInFeb.getDate() - 1);
                daysInFeb = lastDayInFeb.getDate();
                daysInMonth = [31, daysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (day <= daysInMonth[month]) {
                    retVal = true;
                }
            }
            return retVal;
        };

        thisTravelDocumentInput.isPastDate = function (day, month, year) {
            year = window.parseInt(year, 10);
            month = window.parseInt(month, 10);
            day = window.parseInt(day, 10);
            var retVal = false,
                today = null,
                compareDate = null;
            if (year && month && day) {
                month -= 1;
                today = new Date();
                compareDate = new Date(year, month, day);
                if (compareDate > today) {
                    retVal = true;
                }
            }
            return retVal;
        };

        return thisTravelDocumentInput;
    };

    /*
    Name:
    Class ControlGroup
    Param:
    None
    Return:
    An instance of ControlGroup
    Functionality:
    Handles a ControlGroup validation
    Notes:

    Class Hierarchy:
    SkySales -> ControlGroup
    */
    SKYSALES.Class.ControlGroup = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisControlGroup = SKYSALES.Util.extendObject(parent);

        thisControlGroup.actionId = 'SkySales';
        thisControlGroup.action = null;

        thisControlGroup.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };
        thisControlGroup.setVars = function () {
            parent.setVars.call(this);
            thisControlGroup.action = this.getById(this.actionId);
        };
        thisControlGroup.addEvents = function () {
            parent.addEvents.call(this);
            this.action.click(this.validateHandler);
        };
        thisControlGroup.validateHandler = function () {
            var retVal = thisControlGroup.validate();
            return retVal;
        };
        thisControlGroup.validate = function () {
            var actionDom = this.action[0],
                retVal = SKYSALES.Util.validate(actionDom);
            return retVal;
        };
        return thisControlGroup;
    };

    /*
    Name:
    Class ControlGroupRegister
    Param:
    None
    Return:
    An instance of ControlGroupRegister
    Functionality:
    Handles a ControlGroupRegister validation
    Notes:

    Class Hierarchy:
    SkySales -> ControlGroupRegister
    */
    SKYSALES.Class.ControlGroupRegister = function () {
        var parent = new SKYSALES.Class.ControlGroup(),
            thisControlGroupRegister = SKYSALES.Util.extendObject(parent);

        thisControlGroupRegister.travelDocumentInput = null;

        thisControlGroupRegister.setSettingsByObject = function (json) {
            parent.setSettingsByObject.call(this, json);
            var travelDocumentInput = new SKYSALES.Class.TravelDocumentInput();
            travelDocumentInput.init(this.travelDocumentInput);
            thisControlGroupRegister.travelDocumentInput = travelDocumentInput;
        };
        thisControlGroupRegister.validateHandler = function () {
            var retVal = thisControlGroupRegister.validate();
            return retVal;
        };
        thisControlGroupRegister.validate = function () {
            var retVal = false;
            retVal = (this.travelDocumentInput.setTravelDocumentInfo() && this.travelDocumentInput.validateExpDate());
            if (retVal) {
                retVal = parent.validate.call(this);
            }
            return retVal;
        };
        return thisControlGroupRegister;
    };



    /*
    Name:
    Class PersonInput
    Param:
    None
    Return:
    An instance of PersonInput
    Functionality:
    Handles the PersonInput control
    Class Hierarchy:
    SkySales -> PersonInput
    */
    SKYSALES.Class.PersonInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPersonInput = SKYSALES.Util.extendObject(parent),
            resource = SKYSALES.Util.getResource();

        thisPersonInput.countryInputId = '';
        thisPersonInput.countryInput = null;
        thisPersonInput.stateInputId = '';
        thisPersonInput.stateInput = null;
        thisPersonInput.emptyStateSelect = '';
        thisPersonInput.defaultProvinceStateCode = '';
        thisPersonInput.defaultCountryCode = '';
        thisPersonInput.countryStateHash = null;
        thisPersonInput.clientHash = resource.clientHash;
        thisPersonInput.countryArray = resource.countryInfo.CountryList;
        thisPersonInput.allStateArray = resource.provinceStateInfo.ProvinceStateList;
        thisPersonInput.enableSeatLocation = false;
        thisPersonInput.seatLocationInputId = '';
        thisPersonInput.seatLocationInput = null;
        thisPersonInput.seatLocationHiddenFieldId = '';
        thisPersonInput.seatLocationHiddenField = null;
        thisPersonInput.seatTypeInputId = '';
        thisPersonInput.seatTypeInput = null;
        thisPersonInput.seatTypeArray = [];
        thisPersonInput.seatLocationArray = [];
        thisPersonInput.defaultSeatLocation = '';
        thisPersonInput.defaultSeatType = '';

        thisPersonInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initCountryInput();
            this.initStateInput();
            this.initializeSeatPreferences();
        };

        thisPersonInput.initCountryInput = function () {
            var json = {},
                countryArray = this.countryArray || [];

            json = {
                "selectedItem": this.defaultCountryCode,
                "input": this.countryInput,
                "objectArray": countryArray,
                "showCode": false
            };
            SKYSALES.Util.populate(json);
        };

        thisPersonInput.initStateInput = function () {
            var json = {},
                allStateArray = this.allStateArray || [],
                state,
                i = 0,
                len = allStateArray.length,
                defaultState = this.defaultCountryCode + '|' + this.defaultProvinceStateCode;

            if (this.defaultProvinceStateCode.indexOf("|") > -1) {
                defaultState = this.defaultProvinceStateCode;
            }

            for (i = 0; i < len; i += 1) {
                state = allStateArray[i];
                state.code = state.ccode + "|" + state.scode;
            }

            if ((defaultState === '|') || defaultState.indexOf('|') === (defaultState.length - 1)) {
                defaultState = '';
            }

            json = {
                "selectedItem": defaultState,
                "input": this.stateInput,
                "objectArray": allStateArray,
                "showCode": false
            };
            SKYSALES.Util.populate(json);
        };

        thisPersonInput.getCountryStateHash = function () {
            var countryIndex = 0,
                stateIndex = 0,
                stateArray = [],
                state = null,
                country = null,
                countryStateHash = {},
                countryArrayLength = 0,
                stateArrayLength = 0,
                countryArray = this.countryArray,
                allStateArray = this.allStateArray;

            countryArrayLength = countryArray.length;
            for (countryIndex = 0; countryIndex < countryArrayLength; countryIndex += 1) {
                country = countryArray[countryIndex];
                stateArray = [];
                stateArray.push({
                    "name": this.emptyStateSelect,
                    "code": "",
                    "ccode": "",
                    "scode": ""
                });
                stateArrayLength = allStateArray.length;
                for (stateIndex = 0; stateIndex < stateArrayLength; stateIndex += 1) {
                    state = allStateArray[stateIndex];
                    if (state.ccode === country.code) {
                        stateArray.push(state);
                    }
                }
                countryStateHash[country.code] = stateArray;
            }
            return countryStateHash;
        };

        thisPersonInput.updateCountryHandler = function () {
            thisPersonInput.updateCountry();
        };

        thisPersonInput.updateCountry = function () {
            var countryState = this.stateInput.val(),
                countryStateArray = countryState.split('|'),
                country = '';

            if (countryStateArray.length === 2) {
                country = countryStateArray[0];
                this.countryInput.val(country);
            }
        };

        thisPersonInput.updateStateHandler = function () {
            thisPersonInput.updateState();
        };

        thisPersonInput.updateState = function () {
            var country = this.countryInput.val(),
                stateArray = [],
                stateObject = {},
                stateObjectArray = [],
                i = 0,
                len = 0,
                countryStateHash = this.getCountryStateHash(),
                paramObject = {};

            stateArray = countryStateHash[country];
            stateArray = stateArray || [];
            if (stateArray.length === 0) {
                stateObjectArray.push({
                    "name": this.emptyStateSelect,
                    "code": "",
                    "ccode": "",
                    "scode": ""
                });
                stateArray = this.allStateArray;
            }
            len = stateArray.length;
            for (i = 0; i < len; i += 1) {
                stateObject = stateArray[i];
                stateObjectArray.push(stateObject);
            }
            paramObject = {
                'objectArray': stateObjectArray,
                'input': this.stateInput,
                'showCode': false,
                'clearOptions': true
            };
            SKYSALES.Util.populate(paramObject);
        };

        thisPersonInput.addEvents = function () {
            this.countryInput.change(this.updateStateHandler);
            this.stateInput.change(this.updateCountryHandler);
            this.seatLocationInput.change(this.updateSeatLocationHiddenHandler);
        };

        thisPersonInput.updateSeatLocationHiddenHandler = function () {
            thisPersonInput.updateSeatLocationHidden();
        };

        thisPersonInput.updateSeatLocationHidden = function () {
            var seatLocationDropDownList = this.seatLocationInput || {},
                seatLocationValue = seatLocationDropDownList.val(),
                seatLocationHiddenField = this.seatLocationHiddenField || {};

            seatLocationHiddenField.val(seatLocationValue);
        };

        thisPersonInput.setVars = function () {
            thisPersonInput.countryInput = this.getById(this.countryInputId);
            thisPersonInput.stateInput = this.getById(this.stateInputId);
            thisPersonInput.seatLocationHiddenField = this.getById(this.seatLocationHiddenFieldId);
            thisPersonInput.seatLocationInput = this.getById(this.seatLocationInputId);
            thisPersonInput.seatTypeInput = this.getById(this.seatTypeInputId);
        };

        thisPersonInput.populateSeatDropDowns = function () {
            var seatTypeJson = {},
                seatLocationJson = {};

            seatTypeJson = {
                "selectBox": this.seatTypeInput,
                "objectArray": this.seatTypeArray,
                "selectedItem": this.defaultSeatType
            };

            SKYSALES.Util.populateSelect(seatTypeJson);

            seatLocationJson = {
                "selectBox": this.seatLocationInput,
                "objectArray": this.seatLocationArray,
                "selectedItem": this.defaultSeatLocation
            };

            SKYSALES.Util.populateSelect(seatLocationJson);
        };

        thisPersonInput.updateSeatLocationDropDownList = function () {
            var enableSeatLocationOptionDropDownList = this.enableSeatLocation || false,
                seatLocationDropDown = this.seatLocationInput || {};

            if (enableSeatLocationOptionDropDownList) {
                seatLocationDropDown.removeAttr('disabled');
            } else {
                seatLocationDropDown.attr('disabled', 'disabled');
            }
        };

        thisPersonInput.initializeSeatPreferences = function () {
            this.populateSeatDropDowns();
            this.updateSeatLocationDropDownList();
            this.updateSeatLocationHidden();
        };

        return thisPersonInput;
    };

    /*
    Name:
    Class AgencyInput
    Param:
    None
    Return:
    An instance of AgencyInput
    Functionality:
    Handles the AgencyInput control
    Notes:
    Class Hierarchy:
    SkySales -> PersonInput -> AgencyInput
    */
    SKYSALES.Class.AgencyInput = function () {
        var parent = new SKYSALES.Class.PersonInput(),
            thisAgencyInput = SKYSALES.Util.extendObject(parent);

        thisAgencyInput.updateCountryHandler = function () {
            thisAgencyInput.updateCountry();
        };

        thisAgencyInput.updateStateHandler = function () {
            thisAgencyInput.updateState();
        };

        thisAgencyInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initCountryInput();
            this.initStateInput();
        };
        return thisAgencyInput;
    };

    /*
    Name:
    Class ContactInput
    Param:
    None
    Return:
    An instance of ContactInput
    Functionality:
    Handles the ContactInput control
    Notes:
    Auto populates from the clientHash cookie
    when you enter in a name that matches the one on the cookie.
    Class Hierarchy:
    SkySales -> ContactInput
    */
    SKYSALES.Class.ContactInput = function () {
        var parent = new SKYSALES.Class.PersonInput(),
            thisContactInput = SKYSALES.Util.extendObject(parent);

        thisContactInput.clientId = '';
        thisContactInput.keyIdArray = [];
        thisContactInput.keyArray = [];
        thisContactInput.clientStoreIdHash = null;
        thisContactInput.imContactId = '';
        thisContactInput.imContact = null;
        thisContactInput.currentContactData = {};
        thisContactInput.logOutButton = null;

        thisContactInput.clearCurrentContactHandler = function () {
            thisContactInput.clearCurrentContact();
        };

        thisContactInput.clearCurrentContact = function () {
            var clientId = this.clientId;
            this.getById(clientId + '_DropDownListTitle').val('');
            this.getById(clientId + '_TextBoxFirstName').val('');
            this.getById(clientId + '_TextBoxMiddleName').val('');
            this.getById(clientId + '_TextBoxLastName').val('');
            this.getById(clientId + '_TextBoxAddressLine1').val('');
            this.getById(clientId + '_TextBoxAddressLine2').val('');
            this.getById(clientId + '_TextBoxAddressLine3').val('');
            this.getById(clientId + '_TextBoxCity').val('');
            this.getById(clientId + '_DropDownListStateProvince').val('');
            this.getById(clientId + '_DropDownListCountry').val('');
            this.getById(clientId + '_TextBoxPostalCode').val('');
            this.getById(clientId + '_TextBoxHomePhone').val('');
            this.getById(clientId + '_TextBoxWorkPhone').val('');
            this.getById(clientId + '_TextBoxOtherPhone').val('');
            this.getById(clientId + '_TextBoxFax').val('');
            this.getById(clientId + '_TextBoxEmailAddress').val('');
        };

        thisContactInput.populateCurrentContactHandler = function () {
            thisContactInput.populateCurrentContact();
        };

        thisContactInput.populateCurrentContact = function () {
            if (this.currentContactData) {
                if (this.imContact.attr("checked") === true) {
                    this.populateContactFields();
                } else {
                    this.clearCurrentContact();
                }
            }
        };

        thisContactInput.populateContactFields = function () {
            var clientId = this.clientId,
                currentContactData = this.currentContactData;

            this.getById(clientId + '_DropDownListTitle').val(currentContactData.title);
            this.getById(clientId + '_TextBoxFirstName').val(currentContactData.firstName);
            this.getById(clientId + '_TextBoxMiddleName').val(currentContactData.middleName);
            this.getById(clientId + '_TextBoxLastName').val(currentContactData.lastName);
            this.getById(clientId + '_TextBoxAddressLine1').val(currentContactData.streetAddressOne);
            this.getById(clientId + '_TextBoxAddressLine2').val(currentContactData.streetAddressTwo);
            this.getById(clientId + '_TextBoxAddressLine3').val(currentContactData.streetAddressThree);
            this.getById(clientId + '_TextBoxCity').val(currentContactData.city);
            this.getById(clientId + '_DropDownListStateProvince').val(currentContactData.country + "|" + currentContactData.stateProvince);
            this.getById(clientId + '_DropDownListCountry').val(currentContactData.country);
            this.getById(clientId + '_TextBoxPostalCode').val(currentContactData.postalCode);
            this.getById(clientId + '_TextBoxHomePhone').val(currentContactData.eveningPhone);
            this.getById(clientId + '_TextBoxWorkPhone').val(currentContactData.dayPhone);
            this.getById(clientId + '_TextBoxOtherPhone').val(currentContactData.mobilePhone);
            this.getById(clientId + '_TextBoxFax').val(currentContactData.faxPhone);
            this.getById(clientId + '_TextBoxEmailAddress').val(currentContactData.email);
        };

        thisContactInput.updateCountryHandler = function () {
            thisContactInput.updateCountry();
        };

        thisContactInput.updateStateHandler = function () {
            thisContactInput.updateState();
        };

        thisContactInput.getKey = function () {
            var i = 0,
                keyArray = this.keyArray,
                keyObject = null,
                key = '',
                len = keyArray.length;

            for (i = 0; i < len; i += 1) {
                keyObject = keyArray[i];
                key += keyObject.val();
            }
            key = this.clientId + '_' + (key.toLowerCase());
            return key;
        };

        thisContactInput.populateClientStoreIdHash = function () {
            var clientHash = this.clientHash,
                i = 0,
                keyValueStr = '',
                keyValueArray = [],
                singleKeyValueStr = '',
                eqIndex = -1,
                key = this.getKey(),
                value = null;

            thisContactInput.clientStoreIdHash = {};
            if (key && clientHash && clientHash[key]) {
                thisContactInput.clientStoreIdHash = this.clientStoreIdHash || {};
                keyValueStr = clientHash[key];
                keyValueArray = keyValueStr.split('&');
                for (i = 0; i < keyValueArray.length; i += 1) {
                    singleKeyValueStr = keyValueArray[i];
                    eqIndex = singleKeyValueStr.indexOf('=');
                    if (eqIndex > -1) {
                        key = singleKeyValueStr.substring(0, eqIndex);
                        value = singleKeyValueStr.substring(eqIndex + 1, singleKeyValueStr.length);
                        if (key) {
                            thisContactInput.clientStoreIdHash[key] = value;
                        }
                    }
                }
            }
        };

        thisContactInput.autoPopulateFormHandler = function () {
            thisContactInput.autoPopulateForm();
        };

        thisContactInput.autoPopulateForm = function () {
            var clientStoreIdHash = this.clientStoreIdHash,
                key = '',
                value = '';

            this.populateClientStoreIdHash();

            for (key in clientStoreIdHash) {
                if (clientStoreIdHash.hasOwnProperty(key)) {
                    value = clientStoreIdHash[key];
                    this.getById(key).val(value);
                }
            }
        };

        thisContactInput.addEvents = function () {
            var i = 0,
                keyArray = this.keyArray,
                key = null,
                len = keyArray.length;

            parent.addEvents.call(this);

            for (i = 0; i < len; i += 1) {
                key = keyArray[i];
                key.change(this.autoPopulateFormHandler);
            }
            this.imContact.click(this.populateCurrentContactHandler);
            this.logOutButton.click(this.clearCurrentContactHandler);
        };

        thisContactInput.setVars = function () {
            var i = 0,
                keyIdArray = this.keyIdArray,
                keyArray = this.keyArray,
                keyId = '';

            parent.setVars.call(this);

            for (i = 0; i < keyIdArray.length; i += 1) {
                keyId = keyIdArray[i];
                keyArray[keyArray.length] = this.getById(keyId);
            }
            thisContactInput.imContact = this.getById(this.imContactId);
            thisContactInput.logOutButton = this.getById('MemberLoginContactView_ButtonLogOut');
        };

        thisContactInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initCountryInput();
            this.initStateInput();
        };
        return thisContactInput;
    };

    /*
    Name:
    Class ToggleView
    Param:
    None
    Return:
    An instance of ToggleView
    Functionality:
    The ToggleView class is used to show and hide dom elements.
    Notes:
    It is set up so that you can click different elements to show and hide the dom object.
    You can have a link that you click to show the element, and anothe that you click to hide it.
    showId is the id of the html element that you click to show the element
    hideId is the id of the html element that you click to hide the element
    elementId is the id of the element you are showing and hiding
    Class Hierarchy:
    SkySales -> ToggleView
    */
    SKYSALES.Class.ToggleView = function () {
        var toggleView = new SKYSALES.Class.SkySales(),
            thisToggleView = SKYSALES.Util.extendObject(toggleView);

        thisToggleView.showId = '';
        thisToggleView.hideId = '';
        thisToggleView.elementId = '';

        thisToggleView.show = null;
        thisToggleView.hide = null;
        thisToggleView.element = null;

        thisToggleView.setVars = function () {
            toggleView.setVars.call(this);
            thisToggleView.show = this.getById(this.showId);
            thisToggleView.hide = this.getById(this.hideId);
            thisToggleView.element = this.getById(this.elementId);
        };

        thisToggleView.init = function (paramObj) {
            this.setSettingsByObject(paramObj);
            this.setVars();
            this.addEvents();
        };

        thisToggleView.updateShowHandler = function () {
            thisToggleView.updateShow();
        };

        thisToggleView.updateHideHandler = function () {
            thisToggleView.updateHide();
        };

        thisToggleView.updateShow = function () {
            this.element.show('slow');
        };

        thisToggleView.updateHide = function () {
            this.element.hide();
        };

        thisToggleView.updateToggleHandler = function () {
            thisToggleView.updateToggle();
        };

        thisToggleView.updateToggle = function () {
            if (this.element.is(':visible')) {
                this.updateHide();
            } else {
                this.updateShow();
            }
        };

        thisToggleView.addEvents = function () {
            toggleView.addEvents.call(this);

            if (this.showId === this.hideId) {
                this.show.click(this.updateToggleHandler);
            } else {
                this.show.click(this.updateShowHandler);
                this.hide.click(this.updateHideHandler);
            }
        };
        return thisToggleView;
    };

    SKYSALES.Class.ToggleTabsAndView = function () {
        var parent = new SKYSALES.Class.ToggleView(),
            thisToggleTabsAndView = SKYSALES.Util.extendObject(parent);

        thisToggleTabsAndView.updateShowHandler = function () {
            thisToggleTabsAndView.updateShow();
        };

        thisToggleTabsAndView.updateHideHandler = function () {
            thisToggleTabsAndView.updateHide();
        };

        thisToggleTabsAndView.updateShow = function () {
            this.element.show();
        };

        thisToggleTabsAndView.updateHide = function () {
            this.hide.addClass('activeSummaryTab');
            this.show.removeClass('activeSummaryTab');
            this.element.hide();
        };

        return thisToggleTabsAndView;
    };

    SKYSALES.Class.TcThumbnails = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTcThumbnails = SKYSALES.Util.extendObject(parent);

        thisTcThumbnails.enlargeId = "";
        thisTcThumbnails.thumbnailArray = [];
        thisTcThumbnails.selected = null;
        thisTcThumbnails.imageDescriptionId = "";
        thisTcThumbnails.imageDescription = null;

        thisTcThumbnails.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            //this.addEvents();
            this.initThumbnailArray();
        };

        thisTcThumbnails.initThumbnailArray = function () {
            var i = 0,
                thumbnailArray = this.thumbnailArray || [],
                len = thumbnailArray.length,
                thumbnail = null;

            for (i = 0; i < len; i += 1) {
                thumbnail = new SKYSALES.Class.TcThumbnail();
                thumbnail.enlargeId = this.enlargeId;
                thumbnail.ref = this;

                thumbnail.init(thumbnailArray[i]);
                thumbnailArray[i] = thumbnail;
                if (thumbnail.isDefault) {
                    thumbnail.thumbnail.click();
                }
            }
        };

        thisTcThumbnails.setVars = function () {
            parent.setVars.call(this);
            thisTcThumbnails.imageDescription = this.getById(this.imageDescriptionId);
        };

        thisTcThumbnails.showSelected = function (thumbnail) {
            if (this.selected) {
                this.selected.thumbnail.removeClass('activeThumbnail');
            }
            thumbnail.thumbnail.addClass('activeThumbnail');
            this.selected = thumbnail;
        };

        return thisTcThumbnails;
    };

    SKYSALES.Class.TcThumbnail = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTcThumbnail = SKYSALES.Util.extendObject(parent);

        thisTcThumbnail.thumbnailId = "";
        thisTcThumbnail.thumbnail = null;
        thisTcThumbnail.imgSrc = "";
        thisTcThumbnail.enlargeId = "";
        thisTcThumbnail.enlarge = null;
        thisTcThumbnail.ref = null;
        thisTcThumbnail.imgDesc = "";
        thisTcThumbnail.isDefault = false;

        thisTcThumbnail.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisTcThumbnail.setVars = function () {
            this.thumbnail = this.getById(this.thumbnailId);
            this.enlarge = this.getById(this.enlargeId);
        };

        thisTcThumbnail.addEvents = function () {
            this.thumbnail.click(this.updateEnlargeImageHandler);
        };

        thisTcThumbnail.updateEnlargeImageHandler = function () {
            thisTcThumbnail.updateEnlargeImage();
        };

        thisTcThumbnail.updateEnlargeImage = function () {
            this.enlarge.attr('src', this.imgSrc);
            this.ref.showSelected(this);
            this.ref.imageDescription.text(this.imgDesc);
        };

        return thisTcThumbnail;
    };

    /*
    Name:
    Class PaymentInputBase
    Param:
    None
    Return:
    An instance of PaymentInputBase
    Functionality:
    Handles the payment input control's fields
    Notes:
    This class holds the ids and objects of the payment input fields
    Class Hierarchy:
    SkySales -> PaymentInputBase
    */
    SKYSALES.Class.PaymentInputBase = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentInputBase = SKYSALES.Util.extendObject(parent);

        thisPaymentInputBase.paymentInputCreditCardTypeId = '';
        thisPaymentInputBase.paymentInputCreditCardType = {};
        thisPaymentInputBase.paymentInputCreditCardNumberId = '';
        thisPaymentInputBase.paymentInputCreditCardNumber = {};
        thisPaymentInputBase.paymentInputCreditCardExpirationMonthId = '';
        thisPaymentInputBase.paymentInputCreditCardExpirationMonth = {};
        thisPaymentInputBase.paymentInputCreditCardExpirationYearId = '';
        thisPaymentInputBase.paymentInputCreditCardExpirationYear = {};
        thisPaymentInputBase.paymentInputCreditCardHolderNameId = '';
        thisPaymentInputBase.paymentInputCreditCardHolderName = {};
        thisPaymentInputBase.paymentInputCreditCardAmountId = '';
        thisPaymentInputBase.paymentInputCreditCardAmount = {};
        thisPaymentInputBase.paymentInputCreditCardCvvId = '';
        thisPaymentInputBase.paymentInputCreditCardCvv = {};
        thisPaymentInputBase.paymentInputCreditCardIssueNumberId = '';
        thisPaymentInputBase.paymentInputCreditCardIssueNumber = {};

        thisPaymentInputBase.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        thisPaymentInputBase.setVars = function () {
            thisPaymentInputBase.paymentInputCreditCardAmount = this.getById(this.paymentInputCreditCardAmountId);
            thisPaymentInputBase.paymentInputCreditCardCvv = this.getById(this.paymentInputCreditCardCvvId);
            thisPaymentInputBase.paymentInputCreditCardExpirationMonth = this.getById(this.paymentInputCreditCardExpirationMonthId);
            thisPaymentInputBase.paymentInputCreditCardExpirationYear = this.getById(this.paymentInputCreditCardExpirationYearId);
            thisPaymentInputBase.paymentInputCreditCardHolderName = this.getById(this.paymentInputCreditCardHolderNameId);
            thisPaymentInputBase.paymentInputCreditCardNumber = this.getById(this.paymentInputCreditCardNumberId);
            thisPaymentInputBase.paymentInputCreditCardType = this.getById(this.paymentInputCreditCardTypeId);
            thisPaymentInputBase.paymentInputCreditCardIssueNumber = this.getById(this.paymentInputCreditCardIssueNumberId);
        };

        return thisPaymentInputBase;
    };


    /*
    Name:
    Class InlineDCC
    Param:
    None
    Return:
    An instance of InlineDCC
    Functionality:
    This class represents a InlineDCC
    Notes:
    Class Hierarchy:
    SkySales -> PaymentInputBase -> InlineDCC
    */
    SKYSALES.Class.InlineDCC = function () {
        var parent = SKYSALES.Class.PaymentInputBase(),
            thisInlineDcc = SKYSALES.Util.extendObject(parent);

        thisInlineDcc.inlineDCCOfferKeyInputId = '';
        thisInlineDcc.cultureCode = '';
        thisInlineDcc.foreignAmountId = '';
        thisInlineDcc.foreignCurrencyNameId = '';
        thisInlineDcc.foreignCurrencySymbolId = '';
        thisInlineDcc.ownCurrencyAmountId = '';
        thisInlineDcc.ownCurrencyNameId = '';
        thisInlineDcc.ownCurrencySymbolId = '';
        thisInlineDcc.rejectInlineDccRadioButtonId = '';
        thisInlineDcc.acceptInlineDccRadioButtonId = '';
        thisInlineDcc.doubleOptOutId = '';
        thisInlineDcc.inlineDCCAjaxAttemptedId = '';
        thisInlineDcc.inlineDCCAjaxSucceededId = '';
        thisInlineDcc.dccId = '';
        thisInlineDcc.inlineDCCConversionLabelId = '';
        thisInlineDcc.paymentMethodInputId = '';
        thisInlineDcc.paymentMethodInput = {};
        thisInlineDcc.amountInputId = '';
        thisInlineDcc.accountNumberInputId = '';
        thisInlineDcc.currencyCode = '';
        thisInlineDcc.feeAmt = null;
        thisInlineDcc.inlineDCCJson = {};
        thisInlineDcc.inlineDCCActive = false;
        thisInlineDcc.paymentMethod = null;

        thisInlineDcc.setDCCVars = function (paymentMethod) {
            thisInlineDcc.dcc = this.getById(this.dccId);
            thisInlineDcc.inlineDCCConversionLabel = this.getById(this.inlineDCCConversionLabelId);
            thisInlineDcc.paymentMethodInput = paymentMethod.methodInput;
            thisInlineDcc.accountNoTextBox = paymentMethod.accountNumber;
            thisInlineDcc.amountTextBox = paymentMethod.amountDom;
            thisInlineDcc.inlineDCCAjaxAttempted = this.getById(this.inlineDCCAjaxAttemptedId);
            thisInlineDcc.inlineDCCAjaxSucceeded = this.getById(this.inlineDCCAjaxSucceededId);
            thisInlineDcc.inlineDCCActive = paymentMethod.inlineDCCActive;
        };

        thisInlineDcc.inlineDCCAjaxRequestHandler = function () {
            thisInlineDcc.getInlineDCC();
        };

        thisInlineDcc.addEvents = function () {
            if (this.accountNoTextBox) {
                this.accountNoTextBox.change(this.inlineDCCAjaxRequestHandler);
            }
        };

        thisInlineDcc.init = function (json) {
            this.setSettingsByObject(json);
        };

        thisInlineDcc.getInlineDCC = function (paymentMethod) {

            this.setDCCVars(paymentMethod);
            this.clearInlineDCCOffer();

            var params = {},
                paymentMethodKey = paymentMethod.key,
                feeAmt = 0,
                inlineDCCActive = paymentMethod.inlineDCCActive,
                paymentType = paymentMethod.paymentType,
                paymentFeeHash = paymentType.paymentTypes.paymentFees.paymentFeeHash,
                paymentFee = {},
                accountNumberValue = paymentMethod.accountNumberValue,
                acctNumber = 0,
                amount = 0;

            if (inlineDCCActive) {

                paymentFee = paymentFeeHash[paymentMethodKey] || {};
                feeAmt = paymentFee.amount || 0;

                if (!acctNumber) {
                    //get the account number
                    acctNumber = paymentMethod.accountNumber.val();

                    if (!acctNumber) {
                        acctNumber = paymentMethod.maskedNumber;
                    }
                }
                if (!amount) {
                    //get the amount
                    amount = this.amountTextBox.val();
                }
                if (amount && acctNumber) {
                    params = {
                        'amount': amount,
                        'paymentFee': feeAmt,
                        'currencyCode': this.currencyCode,
                        'accountNumber': acctNumber,
                        'accountNumberId': accountNumberValue,
                        'paymentMethod': paymentMethodKey,
                        'cultureCode': this.cultureCode
                    };
                    if (this.currencyCode && amount && acctNumber && (0 < parseFloat(amount)) && (12 <= acctNumber.length)) {
                        this.inlineDCCAjaxSucceeded.val('false');
                        this.paymentMethod = paymentMethod;
                        $.post('DccOffer-rest.aspx', params, this.inlineDCCResponseHandler);
                    }
                } else {
                    this.clearInlineDCCOffer();
                }
            } else {
                this.clearInlineDCCOffer();
            }
        };

        thisInlineDcc.clearInlineDCCOffer = function () {
            this.dcc.html('');
        };

        thisInlineDcc.setVarsAfterAjaxResponse = function (dccOffer) {
            thisInlineDcc.foreignAmount = dccOffer.foreignCurrencyAmount;
            thisInlineDcc.foreignCurrencyName = dccOffer.foreignCurrencyName;
            thisInlineDcc.foreignCurrencySymbol = dccOffer.foreignCurrencySymbol;
            thisInlineDcc.ownCurrencyAmount = dccOffer.ownCurrencyAmount;
            thisInlineDcc.ownCurrencyName = dccOffer.ownCurrencyName;
            thisInlineDcc.ownCurrencySymbol = dccOffer.ownCurrencySymbol;

            thisInlineDcc.rejectInlineDccRadioButton = this.getById(this.rejectInlineDccRadioButtonId);
            thisInlineDcc.acceptInlineDccRadioButton = this.getById(this.acceptInlineDccRadioButtonId);
        };

        thisInlineDcc.foreignUpdateConversionLabel = function () {
            this.inlineDCCConversionLabel.text('(' + ' ' + this.foreignAmount + ' ' + this.foreignCurrencyName + ')');
        };

        thisInlineDcc.ownUpdateConversionLabel = function () {
            this.inlineDCCConversionLabel.text('');
        };

        thisInlineDcc.noThanks = function () {
            this.getById('dccCont').show('slow');
        };

        thisInlineDcc.noShowThanks = function () {
            this.getById('dccCont').hide('slow');
        };

        thisInlineDcc.updateAcceptRadioBtn = function (acceptChecked) {
            this.acceptInlineDccRadioButton.attr('checked', acceptChecked);
            this.rejectInlineDccRadioButton.attr('checked', !acceptChecked);

            this.foreignUpdateConversionLabel();
        };

        thisInlineDcc.updateInlineDCCOffer = function (data) {
            var offer = {},
                dccOfferKeyInput = this.getById(this.inlineDCCOfferKeyInputId),
                dcc = this.dcc,
                dccDivContent = "",
                template = "",
                paymentMethod = this.paymentMethod,
                paymentType = paymentMethod.paymentType,
                paymentMethodKey = paymentType.getCurrentPaymentMethodKey(),
                accountNumberValue = paymentMethod.accountNumber.val(),
                key = '';

            if (data) {
                offer = SKYSALES.Json.parse(data);
                if (offer) {
                    this.inlineDCCAjaxAttempted.val('true');

                    key = 'ExternalAccount:' + offer.paymentMethodCode;
                    if (key === paymentMethodKey && offer.accountNumber === accountNumberValue) {

                        if (offer.paymentMethodCode) {
                            // make sure at least one field in DccOffer was set
                            this.inlineDCCAjaxSucceeded.val('true');
                        }
                        // store the latest offer so it can be routed back to the server
                        dccOfferKeyInput.val(data);
                        dcc.empty();

                        if (offer.applicable === true) {
                            template = $("#inlineDccTemplate").html();
                            template = SKYSALES.Util.replace(template, "<!--", "");
                            template = SKYSALES.Util.replace(template, "-->", "");

                            dccDivContent = SKYSALES.Util.supplant(template, offer);
                            dcc.append(dccDivContent);
                        }

                        this.setVarsAfterAjaxResponse(offer);
                        this.updateAcceptRadioBtn(offer.acceptByDefault);
                    }
                }
            }
        };

        thisInlineDcc.inlineDCCResponseHandler = function (data) {
            thisInlineDcc.updateInlineDCCOffer(data);
        };
        return thisInlineDcc;
    };


    /*
    Name:
    Class PaymentFees
    Param:
    None
    Return:
    An instance of PaymentFees
    Functionality:
    This class represents a PaymentFees
    Notes:
    Class Hierarchy:
    SkySales  -> PaymentFees
    */
    SKYSALES.Class.PaymentFees = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentFees = SKYSALES.Util.extendObject(parent);

        thisPaymentFees.paymentFeeArray = [];
        thisPaymentFees.paymentFeeHash = {};
        thisPaymentFees.quotedAmount = -1;
        thisPaymentFees.templateId = '';
        thisPaymentFees.template = null;
        thisPaymentFees.submitName = '';
        thisPaymentFees.url = 'PaymentFeesAjax-resource.aspx';
        thisPaymentFees.quotedAmountName = '';
        thisPaymentFees.keyName = '';
        thisPaymentFees.key = '';
        thisPaymentFees.paymentMethod = {};

        thisPaymentFees.setVars = function () {
            parent.setVars.call(this);
            thisPaymentFees.template = this.getById(this.templateId);
        };

        thisPaymentFees.updatePaymentAmountHandler = function () {
            thisPaymentFees.updatePaymentAmount();
        };

        thisPaymentFees.updatePaymentAmount = function (key, amount) {
            var submitName = this.submitName,
                quotedAmount = amount,
                quotedAmountName = this.quotedAmountName,
                keyName = this.keyName,
                postHash = {},
                eventTargetName = '__EVENTTARGET';

            postHash[quotedAmountName] = quotedAmount;
            postHash[keyName] = key;
            postHash[eventTargetName] = '';
            postHash[submitName] = 'UpdatePaymentArray';
            $.post(this.url, postHash, this.updatePaymentFeeArrayHandler);
        };

        thisPaymentFees.updatePaymentFeeArrayHandler = function (data) {
            thisPaymentFees.updatePaymentFeeArray(data);
        };

        thisPaymentFees.updatePaymentFeeArray = function (data) {
            data = $(data).text();
            data = SKYSALES.Json.parse(data) || {};
            thisPaymentFees.paymentFeeArray = data.paymentFeeArray || [];
            thisPaymentFees.quotedAmount = data.quotedAmount || 0;
            thisPaymentFees.key = data.key || '';
            this.initPaymentFeeHash();
            this.updatePaymentFee(this.key, this.quotedAmount);
        };

        thisPaymentFees.updatePaymentFeeHandler = function () {
            thisPaymentFees.updatePaymentFee();
        };

        thisPaymentFees.updatePaymentFee = function (key, amount) {
            var paymentFee = this.paymentFeeHash[key] || {},
                quotedAmount = this.quotedAmount,
                paymentMethod = this.paymentMethod;

            this.deactivatePaymentFees();

            amount = parseFloat(amount, 10);
            quotedAmount = parseFloat(quotedAmount, 10);

            if (quotedAmount === amount) {
                this.activatePaymentFees(paymentFee);
                if (paymentMethod) {
                    paymentMethod.paymentType.paymentTypes.inlineDCC.getInlineDCC(paymentMethod);
                }
            } else {
                this.updatePaymentAmount(key, amount);
            }
        };

        thisPaymentFees.activatePaymentFees = function (paymentFee) {
            var html = '',
                paymentFeeAmount = paymentFee.amount;

            paymentFeeAmount = parseFloat(paymentFeeAmount, 10);
            if (paymentFeeAmount > 0) {
                html = this.getHtml(paymentFee);
                this.container.html(html);
                this.container.show();
            }
        };

        thisPaymentFees.deactivatePaymentFees = function () {
            var html = '';
            this.container.html(html);
            this.container.hide();
        };

        thisPaymentFees.getHtml = function (paymentFee) {
            var html = '';
            html = this.template.text();
            html = SKYSALES.Util.supplant(html, paymentFee);
            return html;
        };

        thisPaymentFees.initPaymentFeeHash = function () {
            var paymentFeeArray = this.paymentFeeArray || [],
                paymentFee = null,
                i = 0,
                len = paymentFeeArray.length,
                paymentFeeHash = {},
                key = '';

            for (i = 0; i < len; i += 1) {
                paymentFee = new SKYSALES.Class.PaymentFee();
                paymentFee.init(paymentFeeArray[i]);
                key = paymentFee.key;
                paymentFeeHash[key] = paymentFee;
            }
            this.paymentFeeHash = paymentFeeHash;
        };

        thisPaymentFees.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initPaymentFeeHash();
        };

        return thisPaymentFees;
    };

    /*
    Name:
    Class PaymentFee
    Param:
    None
    Return:
    An instance of PaymentFee
    Functionality:
    This class represents a PaymentFee
    Notes:
    Class Hierarchy:
    SkySales  -> PaymentFee
    */
    SKYSALES.Class.PaymentFee = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentFee = SKYSALES.Util.extendObject(parent);

        thisPaymentFee.amount = -1;
        thisPaymentFee.total = -1;
        thisPaymentFee.feeCode = -1;
        thisPaymentFee.isFixedAmount = false;
        thisPaymentFee.key = '';
        thisPaymentFee.amountFormatted = "";
        thisPaymentFee.totalFormatted = "";

        thisPaymentFee.init = function (json) {
            this.setSettingsByObject(json);
            thisPaymentFee.amount = parseFloat(this.amount, 10);
            thisPaymentFee.total = parseFloat(this.total, 10);
        };
        return thisPaymentFee;
    };

    /*
    Name:
    Class PaymentTypes
    Param:
    None
    Return:
    An instance of PaymentTypes
    Functionality:
    This class represents a PaymentTypes
    Notes:
    This summary is at a high level and does not include every minute detail of the payment page flow. This will give you a basic understanding of
    what is going on in the payment page involving payments, inline dcc, and payment fees. When the payment page is loaded, every init class is called
    starting with PaymentTypes and following this order: PaymentTypes.init -> InlineDCC.init -> PaymentFees.init -> PaymentType.init ->
    PaymentMethods.init -> PaymentFields.init. Once all the init functions have been called, all the activate methods fire in the following order:
    PaymentTypes.activate - > PaymentType.activate -> PaymentMethods.activate -> PaymentFields.activate. During this process, two key actions that are
    called. First, when PaymentMethods activates, it makes a call to updatePaymentFees. Inside of updatePaymentFees is where getInlineDCC is first called.
    The second key action is when PaymentMethods and PaymentFields call addEvents. Remember that stored payments and regular payments are now considered
    the same thing, distinguished only by a boolean value. So, this means that both of these types of payments share the same PaymentFields. With
    that said, when addEvents are called for paymentMethods and paymentFields, there are multiple handlers for the same type of event. When one is
    called they will check to see if they are a stored payment or not and that is what will minimize having multiple calls to getInlineDCC and
    updatePaymentFees. Also note that when an event is fired it will call up the chain to PaymentTypes than call paymentFees or
    InlineDCC.
    Class Hierarchy:
    SkySales  -> PaymentTypes
    */
    SKYSALES.Class.PaymentTypes = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentTypes = SKYSALES.Util.extendObject(parent);

        thisPaymentTypes.paymentTypeArray = [];
        thisPaymentTypes.paymentFees = {};
        thisPaymentTypes.showDeviceFingerprint = false;
        thisPaymentTypes.passThroughForChargePaymentArray = [];
        thisPaymentTypes.passThroughForHoldPaymentArray = [];
        thisPaymentTypes.inlineDCC = {};
        thisPaymentTypes.storedPaymentInputId = "";
        thisPaymentTypes.storedPaymentInput = {};

        thisPaymentTypes.initPaymentTypeArray = function () {
            var paymentTypeArray = this.paymentTypeArray || [],
                paymentType = null,
                i = 0,
                len = paymentTypeArray.length,
                hasDefault = false;

            for (i = 0; i < len; i += 1) {
                paymentType = new SKYSALES.Class.PaymentType();
                paymentType.paymentTypes = this;
                paymentType.init(paymentTypeArray[i]);
                paymentTypeArray[i] = paymentType;

                if (paymentType.isDefault === true && hasDefault === false) {
                    paymentType.activate();
                    hasDefault = true;
                }
            }
            this.paymentTypeArray = paymentTypeArray;
        };

        thisPaymentTypes.initPassThroughPaymentArray = function (nameSpaceId, paymentMethod) {
            nameSpaceId = nameSpaceId || '';
            paymentMethod = paymentMethod || {};
            var passThroughForChargePaymentArray = this.passThroughForChargePaymentArray || [],
                passThroughForHoldPaymentArray = this.passThroughForHoldPaymentArray || [],
                passThroughPayment = null,
                passThroughPaymentJson = null,
                i = 0,
                paymentInputContentIds = {},
                paymentMethodType = paymentMethod.paymentMethodType || '',
                paymentMethodCode = paymentMethod.paymentMethodCode || '',
                paymentMethodTypeCode = nameSpaceId + paymentMethodType + '_' + paymentMethodCode + '_',
                passThroughPaymentArray = passThroughForChargePaymentArray.concat(passThroughForHoldPaymentArray),
                len = passThroughPaymentArray.length;

            for (i = 0; i < len; i += 1) {
                passThroughPaymentJson = passThroughPaymentArray[i];
                passThroughPayment = new SKYSALES.Class.PassThroughPayment();
                //paymentType.paymentTypes = this;
                paymentInputContentIds = {
                    "paymentInputCreditCardTypeId": paymentMethodType + "_PaymentMethodCode",
                    "paymentInputCreditCardNumberId": paymentMethodTypeCode + "ACCTNO",
                    "paymentInputCreditCardExpirationMonthId": paymentMethodTypeCode + "EXPDAT_MONTH",
                    "paymentInputCreditCardExpirationYearId": paymentMethodTypeCode + "EXPDAT_YEAR",
                    "paymentInputCreditCardHolderNameId": paymentMethodTypeCode + "CC::AccountHolderName",
                    "paymentInputCreditCardCvvId": paymentMethodTypeCode + "CC::VerificationCode",
                    "paymentInputCreditCardIssueNumberId": paymentMethodTypeCode + "CC::IssueNumber"
                };
                passThroughPaymentJson.paymentInputContentIds = paymentInputContentIds;
                passThroughPayment.init(passThroughPaymentJson);
                passThroughPaymentArray[i] = passThroughPayment;
            }
            this.passThroughPaymentArray = passThroughPaymentArray;
        };

        thisPaymentTypes.initPaymentFees = function () {
            var paymentFees;
            paymentFees = new SKYSALES.Class.PaymentFees();
            paymentFees.init(this.paymentFees);
            this.paymentFees = paymentFees;
        };

        thisPaymentTypes.updatePaymentTypes = function (activePaymentType) {
            var paymentTypeArray = this.paymentTypeArray || [],
                paymentType = null,
                i = 0,
                len = paymentTypeArray.length;

            if (activePaymentType) {
                for (i = 0; i < len; i += 1) {
                    paymentType = paymentTypeArray[i];
                    paymentType.deactivate();
                }
                activePaymentType.activate();
            }
        };

        thisPaymentTypes.enableDeviceFingerprint = function () {
            var deviceFingerprintLoaded = SKYSALES.Class.PaymentTypes.deviceFingerprintLoaded;
            if (this.showDeviceFingerprint === true && deviceFingerprintLoaded === false) {
                SKYSALES.Class.PaymentTypes.deviceFingerprintLoaded = true;
                $('body').append('<iframe id="deviceFingerprint" src="DeviceFingerprint.aspx" width="0" height="0"></iframe>');
            }
        };

        thisPaymentTypes.initDCC = function () {
            var inlineDCC = new SKYSALES.Class.InlineDCC();
            inlineDCC.init(this.inlineDCC);
            this.inlineDCC = inlineDCC;
        };

        thisPaymentTypes.setVars = function () {
            thisPaymentTypes.storedPaymentInput = this.getById(this.storedPaymentInputId);
        };

        thisPaymentTypes.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initDCC();
            this.initPaymentFees();
            this.initPassThroughPaymentArray();
            this.initPaymentTypeArray();
            this.enableDeviceFingerprint();
        };

        return thisPaymentTypes;
    };
    SKYSALES.Class.PaymentTypes.deviceFingerprintLoaded = false;

    /*
    Name:
    Class PaymentType
    Param:
    None
    Return:
    An instance of PaymentType
    Functionality:
    This class represents a PaymentType
    Notes:
    Class Hierarchy:
    SkySales  -> PaymentType
    */
    SKYSALES.Class.PaymentType = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentType = SKYSALES.Util.extendObject(parent);

        thisPaymentType.paymentTypes = null;
        thisPaymentType.actionId = "";
        thisPaymentType.action = null;
        thisPaymentType.paymentMethodActionId = "";
        thisPaymentType.paymentMethodAction = null;
        thisPaymentType.isDefault = false;
        thisPaymentType.nameSpaceName = "";
        thisPaymentType.nameSpaceId = "";
        thisPaymentType.hint = '';

        thisPaymentType.paymentMethodArray = [];

        thisPaymentType.setVars = function () {
            parent.setVars.call(this);
            thisPaymentType.action = this.getById(this.actionId);
            thisPaymentType.paymentMethodAction = this.getById(this.paymentMethodActionId);
        };

        thisPaymentType.addEvents = function () {
            this.action.click(this.updatePaymentTypeHandler);
            this.paymentMethodAction.change(this.updatePaymentMethodHandler);
        };

        thisPaymentType.updatePaymentTypeHandler = function (e) {
            e.preventDefault();
            thisPaymentType.updatePaymentType();
            return false;
        };

        thisPaymentType.updatePaymentType = function () {
            this.paymentTypes.updatePaymentTypes(this);
        };

        thisPaymentType.deactivate = function () {
            this.action.removeClass('tabactive');
            this.container.hide();
            var paymentMethodArray = this.paymentMethodArray || [],
                paymentMethod = null,
                i = 0,
                len = paymentMethodArray.length,
                nameSpaceName = this.nameSpaceName,
                paymentMethodAction = this.paymentMethodAction,
                name = paymentMethodAction.attr('name') || '',
                hint = this.hint,
                hintObj = new SKYSALES.Hint();

            if (hint !== '' && paymentMethodAction.length > 0) {
                hintObj.removeEventFunction.call(paymentMethodAction[0]);
                SKYSALES.Util.removeAttribute(paymentMethodAction, 'hint', hint);
            }

            name = SKYSALES.Util.replace(name, nameSpaceName, '');
            this.paymentMethodAction.attr('name', name);

            for (i = 0; i < len; i += 1) {
                paymentMethod = paymentMethodArray[i];
                paymentMethod.deactivate();
            }
        };

        thisPaymentType.activate = function () {
            this.action.addClass('tabactive');
            this.container.show();
            var nameSpaceName = this.nameSpaceName,
                paymentMethodAction = this.paymentMethodAction,
                name = paymentMethodAction.attr('name') || '',
                hint = this.hint,
                hintObj = new SKYSALES.Hint(),
                paymentMethod = this.getActivePaymentMethod();

            if (hint !== '' && paymentMethodAction.length > 0) {
                SKYSALES.Util.setAttribute(paymentMethodAction, 'hint', hint);
                hintObj.eventFunction.call(paymentMethodAction[0]);
            }

            name = nameSpaceName + name;
            paymentMethodAction.attr('name', name);


            this.updatePaymentMethod(paymentMethod.staticKey);
        };

        thisPaymentType.getActivePaymentMethod = function () {
            var paymentMethodArray = this.paymentMethodArray || [],
                paymentMethodAction = this.paymentMethodAction.val(),
                retVal = {},
                paymentMethod = {},
                len = paymentMethodArray.length,
                i = 0;

            if (len > 0) {
                retVal = paymentMethodArray[0];

                for (i = 0; i < len; i += 1) {
                    paymentMethod = paymentMethodArray[i];
                    if (paymentMethod.staticKey === paymentMethodAction) {
                        retVal = paymentMethod;
                        break;
                    }
                }
            }

            return retVal;
        };

        thisPaymentType.initPaymentMethodArray = function () {
            var paymentMethodArray = this.paymentMethodArray || [],
                paymentMethod = null,
                i = 0,
                len = paymentMethodArray.length;

            for (i = 0; i < len; i += 1) {
                paymentMethod = new SKYSALES.Class.PaymentMethod();
                paymentMethod.paymentType = this;
                paymentMethod.nameSpaceName = this.nameSpaceName;
                paymentMethod.init(paymentMethodArray[i]);
                paymentMethodArray[i] = paymentMethod;
            }
            this.paymentMethodArray = paymentMethodArray;
        };

        thisPaymentType.updatePaymentMethodHandler = function () {
            var key = $(this).val();
            thisPaymentType.updatePaymentMethod(key);
        };

        thisPaymentType.getCurrentStoredPaymentId = function () {
            var currentStoredPaymentId = '',
                paymentMethod = this.paymentMethodAction,
                paymentMethodValue = paymentMethod.val();

            currentStoredPaymentId = this.getStoredPaymentIdFromValue(paymentMethodValue);
            return currentStoredPaymentId;
        };

        thisPaymentType.getStoredPaymentIdFromValue = function (paymentMethodValue) {
            paymentMethodValue = paymentMethodValue || '';
            var storedPaymentId = 0,
                paymentMethodArray = paymentMethodValue.split('-');

            if (paymentMethodArray.length > 1) {
                storedPaymentId = paymentMethodArray[1];
            }
            return storedPaymentId;
        };

        thisPaymentType.getCurrentPaymentMethodKey = function () {
            var currentPaymentMethodKey = '',
                paymentMethod = this.paymentMethodAction,
                paymentMethodValue = paymentMethod.val();

            currentPaymentMethodKey = this.getPaymentMethodKeyFromValue(paymentMethodValue);
            return currentPaymentMethodKey;
        };

        thisPaymentType.getPaymentMethodKeyFromValue = function (paymentMethodValue) {
            paymentMethodValue = paymentMethodValue || '';
            var paymentMethodKey = '',
                paymentMethodArray = paymentMethodValue.split('-');

            paymentMethodKey = paymentMethodArray[0];
            return paymentMethodKey;
        };

        thisPaymentType.updatePaymentMethod = function (staticKey) {
            staticKey = staticKey || '';
            var key = staticKey,
                paymentMethodArray = this.paymentMethodArray || [],
                paymentMethod = {},
                i = 0,
                len = paymentMethodArray.length,
                indexOfStoredPaymentSeparator = key.indexOf('-'),
                paymentIDDelimiterIndex = key.indexOf('_'),
                paymentId = '';

            if (indexOfStoredPaymentSeparator > -1) {
                key = key.substring(0, indexOfStoredPaymentSeparator);
            }

            if (paymentIDDelimiterIndex > -1) {
                paymentId = key.substring(paymentIDDelimiterIndex + 1, key.length);
                key = key.substring(0, paymentIDDelimiterIndex);
            }

            for (i = 0; i < len; i += 1) {
                paymentMethod = paymentMethodArray[i];
                paymentMethod.deactivate();
            }

            for (i = 0; i < len; i += 1) {
                paymentMethod = paymentMethodArray[i];

                if (staticKey === paymentMethod.staticKey) {
                    paymentMethod.activate();
                    if (paymentId) {
                        paymentMethod.updateRefundPaymentAmount(paymentId);
                    }
                }
            }
        };

        thisPaymentType.setPaymentFieldsOnStoredPayments = function () {
            var paymentMethodArray = this.paymentMethodArray,
                paymentMethod = null,
                storedPaymentMethod = null,
                i = 0,
                len = paymentMethodArray.length,
                j = 0;

            for (i = 0; i < len; i += 1) {
                storedPaymentMethod = paymentMethodArray[i];
                if (storedPaymentMethod.isStoredPayment) {
                    for (j = 0; j < len; j += 1) {
                        paymentMethod = paymentMethodArray[j];
                        if (!paymentMethod.isStoredPayment && storedPaymentMethod.key === paymentMethod.key) {
                            storedPaymentMethod.paymentFieldArray = paymentMethod.paymentFieldArray;
                        }
                    }
                }
            }
        };

        thisPaymentType.setPaymentFieldsOnBookingPayments = function () {
            var paymentMethodArray = this.paymentMethodArray,
                paymentMethod = null,
                BookingPaymentMethod = null,
                i = 0,
                len = paymentMethodArray.length,
                j = 0;

            for (i = 0; i < len; i += 1) {
                BookingPaymentMethod = paymentMethodArray[i];
                if (BookingPaymentMethod.isBookingPayment) {
                    for (j = 0; j < len; j += 1) {
                        paymentMethod = paymentMethodArray[j];
                        if (!paymentMethod.isBookingPayment && BookingPaymentMethod.key === paymentMethod.key) {
                            BookingPaymentMethod.paymentFieldArray = paymentMethod.paymentFieldArray;
                        }
                    }
                }
            }
        };

        thisPaymentType.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initPaymentMethodArray();
        };

        return thisPaymentType;
    };

    /*
    Name:
    Class PaymentMethod
    Param:
    None
    Return:
    An instance of PaymentMethod
    Functionality:
    This class represents a PaymentMethod
    Notes:
    Class Hierarchy:
    SkySales  -> PaymentMethod
    */
    SKYSALES.Class.PaymentMethod = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentMethod = SKYSALES.Util.extendObject(parent);

        thisPaymentMethod.paymentInputJson = {};
        thisPaymentMethod.paymentInput = {};
        thisPaymentMethod.paymentType = null;
        thisPaymentMethod.isDefault = false;
        thisPaymentMethod.key = '';
        thisPaymentMethod.staticKey = '';
        thisPaymentMethod.accountNumberId = '';
        thisPaymentMethod.accountNumberValue = 0;
        thisPaymentMethod.accountNumber = null;
        thisPaymentMethod.amountId = '';
        thisPaymentMethod.amountDom = null;
        thisPaymentMethod.paymentFieldArray = [];
        thisPaymentMethod.nameSpaceName = '';
        thisPaymentMethod.isStoredPayment = false;
        thisPaymentMethod.isBookingPayment = false;
        thisPaymentMethod.inlineDCCActive = false;
        thisPaymentMethod.paymentMethodType = '';
        thisPaymentMethod.paymentMethodCode = '';
        thisPaymentMethod.maskedNumber = '';
        thisPaymentMethod.expirationYear = '';
        thisPaymentMethod.expirationMonth = '';
        thisPaymentMethod.expirationYearInputId = '';
        thisPaymentMethod.expirationYearInput = '';
        thisPaymentMethod.expirationMonthInputId = '';
        thisPaymentMethod.expirationMonthInput = '';
        thisPaymentMethod.cardNameIdArray = [];
        thisPaymentMethod.cardNameArray = [];
        thisPaymentMethod.cardNameValue = '';
        thisPaymentMethod.isActive = false;
        thisPaymentMethod.accountNumberTextId = '';
        thisPaymentMethod.accountNumberText = null;
        thisPaymentMethod.refundAmount = 0;
        thisPaymentMethod.refundAmountFormatted = '';
        thisPaymentMethod.clearFields = false;
        thisPaymentMethod.supportPaymentFees = true;

        thisPaymentMethod.initPaymentFieldArray = function () {
            var paymentFieldArray = this.paymentFieldArray || [],
                paymentField = null,
                i = 0,
                len = paymentFieldArray.length;

            for (i = 0; i < len; i += 1) {
                paymentField = new SKYSALES.Class.PaymentField();
                paymentField.nameSpaceName = this.nameSpaceName;
                paymentField.init(paymentFieldArray[i]);
                paymentFieldArray[i] = paymentField;
            }
            this.paymentFieldArray = paymentFieldArray;
        };

        thisPaymentMethod.deactivate = function () {
            this.container.hide();
            var paymentFieldArray = this.paymentFieldArray || [],
                paymentField = null,
                i = 0,
                len = paymentFieldArray.length;

            thisPaymentMethod.isActive = false;

            if (this.clearFields) {
                this.clearStoredFields();
            }

            for (i = 0; i < len; i += 1) {
                paymentField = paymentFieldArray[i];
                paymentField.deactivate();
            }
        };

        thisPaymentMethod.activate = function () {
            var paymentFieldArray = this.paymentFieldArray || [],
                paymentField = null,
                i = 0,
                len = paymentFieldArray.length,
                amountDom = this.amountDom,
                amount = amountDom.val(),
                paymentType = this.paymentType,
                paymentTypes = paymentType.paymentTypes,
                paymentFees = paymentTypes.paymentFees,
                accountNumber = this.accountNumber,
                accountNumberText = this.accountNumberText;

            thisPaymentMethod.isActive = true;

            if (!this.isStoredPayment) {
                accountNumber.show();
                accountNumberText.html('');
            }

            if (len === 0) {
                this.paymentType.setPaymentFieldsOnStoredPayments();
                this.paymentType.setPaymentFieldsOnBookingPayments();
                paymentFieldArray = this.paymentFieldArray || [];
                len = paymentFieldArray.length;
            }

            if (this.isStoredPayment) {
                this.populateStoredFields();
            }

            for (i = 0; i < len; i += 1) {
                paymentField = paymentFieldArray[i];
                paymentField.activate(this);
            }

            this.container.show();

            if (this.supportPaymentFees) {
                paymentFees.paymentMethod = this;
                paymentFees.updatePaymentAmount(this.key, amount);
                paymentTypes.initPassThroughPaymentArray(paymentType.nameSpaceId, this);
            }
        };

        thisPaymentMethod.populateStoredFields = function () {
            var accountNumber = this.accountNumber,
                cardNameArray = this.cardNameArray,
                i = 0,
                len = cardNameArray.length,
                cardName = null,
                cardNameValue = this.cardNameValue,
                accountNumberText = this.accountNumberText,
                storedPaymentKey = this.staticKey || "",
                storedPaymentKeyArray = storedPaymentKey.split('-'),
                storedPaymentKeyArrayLength = storedPaymentKeyArray.length,
                storedPaymentInput = this.paymentType.paymentTypes.storedPaymentInput || {};

            accountNumber.val(this.maskedNumber);
            accountNumber.hide();
            accountNumberText.html(this.maskedNumber);

            for (i = 0; i < len; i += 1) {
                cardName = cardNameArray[i];
                cardName.val(cardNameValue);
            }

            if (storedPaymentKeyArrayLength === 2 && this.key === storedPaymentKeyArray[0]) {
                storedPaymentInput.val(storedPaymentKeyArray[1]);
            }

            if (this.expirationMonth.length === 1) {
                this.expirationMonth = '0' + this.expirationMonth;
            }
            this.expirationYearInput.val(this.expirationYear);
            this.expirationMonthInput.val(this.expirationMonth);
            this.expirationYearInput.change();
        };

        thisPaymentMethod.clearStoredFields = function () {
            var accountNumber = this.accountNumber,
                cardNameArray = this.cardNameArray,
                i = 0,
                len = cardNameArray.length,
                cardName = null,
                storedPaymentInput = this.paymentType.paymentTypes.storedPaymentInput || {};

            accountNumber.val('');

            for (i = 0; i < len; i += 1) {
                cardName = cardNameArray[i];
                cardName.val('');
            }

            storedPaymentInput.val('');

            if (this.expirationMonth.length === 1) {
                this.expirationMonth = '0' + this.expirationMonth;
            }
            this.expirationYearInput.val('');
            this.expirationMonthInput.val('');
            this.expirationYearInput.change();
        };

        thisPaymentMethod.updatePaymentAmountHandler = function () {
            thisPaymentMethod.updatePaymentAmount();
        };

        thisPaymentMethod.updatePaymentAmount = function () {
            var amountDom = this.amountDom,
                amount = amountDom.val(),
                paymentType = this.paymentType || {},
                paymentTypes = paymentType.paymentTypes || {},
                paymentFees = paymentTypes.paymentFees;

            if (this.isActive && paymentFees) {
                paymentFees.updatePaymentAmount(this.key, amount);
            }
        };

        thisPaymentMethod.updateRefundPaymentAmount = function () {
            var amountDom = this.amountDom || {};

            amountDom.val(this.refundAmountFormatted);
        };

        thisPaymentMethod.setVars = function () {
            var i = 0,
                cardNameId = '',
                cardName = null,
                cardNameIdArray = this.cardNameIdArray,
                len = cardNameIdArray.length;

            parent.setVars.call(this);
            thisPaymentMethod.amountDom = this.getById(this.amountId);
            thisPaymentMethod.accountNumber = this.getById(this.accountNumberId);
            thisPaymentMethod.accountNumberText = this.getById(this.accountNumberTextId);
            thisPaymentMethod.methodInput = this.paymentType.paymentMethodAction;
            thisPaymentMethod.expirationYearInput = this.getById(this.expirationYearInputId);
            thisPaymentMethod.expirationMonthInput = this.getById(this.expirationMonthInputId);
            for (i = 0; i < len; i += 1) {
                cardNameId = cardNameIdArray[i];
                cardName = this.getById(cardNameId);
                this.cardNameArray.push(cardName);
            }
        };

        thisPaymentMethod.updatePaymentAccountNumberHandler = function () {
            thisPaymentMethod.updatePaymentAccountNumber();
        };

        thisPaymentMethod.updatePaymentAccountNumber = function () {
            if (this.isActive) {
                this.paymentType.paymentTypes.inlineDCC.getInlineDCC(this);
            }
        };

        thisPaymentMethod.addEvents = function () {
            this.amountDom.change(this.updatePaymentAmountHandler);
            this.accountNumber.change(this.updatePaymentAccountNumberHandler);
        };

        thisPaymentMethod.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();

            this.initPaymentFieldArray();
        };

        return thisPaymentMethod;
    };

    /*
    Name:
    Class PaymentFields
    Param:
    None
    Return:
    An instance of PaymentField
    Functionality:
    This class represents a PaymentField
    Notes:
    Class Hierarchy:
    SkySales  -> PaymentField
    */
    SKYSALES.Class.PaymentField = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPaymentField = SKYSALES.Util.extendObject(parent);

        //thisPaymentField.paymentMethod = null;
        thisPaymentField.nameSpaceName = "";
        thisPaymentField.requiredType = "";
        thisPaymentField.requiredError = "";
        thisPaymentField.validationFunction = null;
        thisPaymentField.validationFunctionParams = [];
        thisPaymentField.validationTypeError = "";
        thisPaymentField.valueMaxLength = -1;
        thisPaymentField.valueMinLength = -1;
        thisPaymentField.fieldType = "";
        thisPaymentField.maxValue = "";
        thisPaymentField.maxLengthError = "";
        thisPaymentField.minValue = "";
        thisPaymentField.minLengthError = "";
        thisPaymentField.valueRegEx = "";
        thisPaymentField.valueType = "";
        thisPaymentField.hint = "";

        thisPaymentField.deactivate = function () {
            var nameSpaceName = this.nameSpaceName,
                name = this.container.attr('name') || '';

            name = SKYSALES.Util.replace(name, nameSpaceName, '');
            this.container.attr('name', name);
            this.removeAttributes();
        };

        thisPaymentField.activate = function (paymentMethod) {
            var nameSpaceName = this.nameSpaceName,
                name = this.container.attr('name') || '';

            name = nameSpaceName + name;
            this.container.attr('name', name);
            this.addAttributes(paymentMethod);
        };

        thisPaymentField.removeAttributes = function () {
            var requiredType = this.requiredType,
                requiredError = "",
                valueMaxLength = this.valueMaxLength,
                maxLengthError = this.maxLengthError,
                valueMinLength = this.valueMinLength,
                minLengthError = this.minLengthError,
                valueRegEx = this.valueRegEx,
                valueType = this.valueType,
                validationFunction = this.validationFunction,
                validationFunctionParams = this.validationFunctionParams,
                validationTypeError = this.validationTypeError,
                fieldType = this.fieldType || '',
                hint = this.hint,
                hintObj = new SKYSALES.Hint(),
                e = this.container;

            requiredType = requiredType.toLowerCase();
            fieldType = fieldType.toLowerCase();

            if (requiredType === "required") {
                SKYSALES.Util.removeRequiredAttribute(e);
            }
            valueType = valueType.toLowerCase();
            SKYSALES.Util.removeAttribute(e, 'requirederror', requiredError);
            SKYSALES.Util.removeAttribute(e, 'validationtype', valueType);
            SKYSALES.Util.removeAttribute(e, 'validationfunction', validationFunction);
            SKYSALES.Util.removeAttribute(e, 'validationfunctionparams', validationFunctionParams);
            SKYSALES.Util.removeAttribute(e, 'validationtypeerror', validationTypeError);
            SKYSALES.Util.removeAttribute(e, 'minlength', valueMinLength);
            SKYSALES.Util.removeAttribute(e, 'maxlength', valueMaxLength);
            SKYSALES.Util.removeAttribute(e, 'minlengtherror', minLengthError);
            SKYSALES.Util.removeAttribute(e, 'maxlengtherror', maxLengthError);
            SKYSALES.Util.removeAttribute(e, 'regex', valueRegEx);

            if (fieldType === 'amount') {
                SKYSALES.Util.removeAttribute(e, 'maxvalue');
                SKYSALES.Util.removeAttribute(e, 'minvalue');
            }

            if (hint !== '' && e.length > 0) {
                hintObj.removeEventFunction.call(e[0]);
                SKYSALES.Util.removeAttribute(e, 'hint', hint);
            }
        };

        thisPaymentField.addAttributes = function (paymentMethod) {
            var requiredType = this.requiredType,
                requiredError = this.requiredError,
                valueMaxLength = this.valueMaxLength,
                maxLengthError = this.maxLengthError,
                valueMinLength = this.valueMinLength,
                minLengthError = this.minLengthError,
                valueRegEx = this.valueRegEx,
                valueType = this.valueType,
                validationFunction = this.validationFunction,
                validationFunctionParams = this.validationFunctionParams,
                validationTypeError = this.validationTypeError,
                hint = this.hint,
                fieldType = this.fieldType || '',
                maxValue = this.maxValue || '',
                minValue = this.minValue || '',
                isStoredPayment = paymentMethod.isStoredPayment,
                e = this.container,
                hintObj = new SKYSALES.Hint(),
                setAttribute = SKYSALES.Util.setAttribute;

            valueType = valueType.toLowerCase();
            fieldType = fieldType.toLowerCase();
            requiredType = requiredType.toLowerCase();

            if (!isStoredPayment || fieldType !== 'accountnumber') {
                if (requiredType === "required") {
                    SKYSALES.Util.setRequiredAttribute(e);
                }

                if (requiredType === 'notallowed') {
                    e.css('visibility', 'hidden');
                }

                setAttribute(e, 'requirederror', requiredError);
                setAttribute(e, 'validationtype', valueType);
                setAttribute(e, 'validationtypeerror', validationTypeError);
                setAttribute(e, 'minlength', valueMinLength);
                setAttribute(e, 'maxlength', valueMaxLength);
                setAttribute(e, 'minlengtherror', minLengthError);
                setAttribute(e, 'maxlengtherror', maxLengthError);
                setAttribute(e, 'regex', valueRegEx);

                if (fieldType === 'amount') {
                    if (paymentMethod.isBookingPayment) {
                        maxValue = paymentMethod.refundAmount;
                    }
                    maxValue = maxValue.toString();

                    setAttribute(e, 'maxvalue', maxValue);
                    setAttribute(e, 'minvalue', minValue);
                }

                if (validationFunction) {
                    setAttribute(e, 'validationfunction', validationFunction);
                    setAttribute(e, 'validationfunctionparams', validationFunctionParams);
                }
            }

            if (hint !== '' && e.length > 0) {
                setAttribute(e, 'hint', hint);
                hintObj.eventFunction.call(e[0]);
            }
        };

        thisPaymentField.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        return thisPaymentField;
    };

    /*
    Name:
    Class BookingPayment
    Param:
    None
    Return:
    An instance of BookingPayment
    Functionality:
    This class represents a BookingPayment
    Notes:
    Class Hierarchy:
    SkySales  -> BookingPayment
    */
    SKYSALES.Class.BookingPayment = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisBookingPayment = SKYSALES.Util.extendObject(parent);

        thisBookingPayment.paymentId = '';
        thisBookingPayment.paymentMethodType = '';
        thisBookingPayment.paymentMethodCode = '';
        thisBookingPayment.refundAmount = '';

        thisBookingPayment.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        return thisBookingPayment;
    };


    /*
    Name:
    Class PriceDisplay
    Param:
    None
    Return:
    An instance of PriceDisplay
    Functionality:
    Handles the PriceDisplay control
    Notes:
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> PriceDisplay
    */
    SKYSALES.Class.PriceDisplay = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPriceDisplay = SKYSALES.Util.extendObject(parent);

        thisPriceDisplay.toggleViewIdArray = null;

        thisPriceDisplay.init = function (json) {
            this.setSettingsByObject(json);

            var toggleViewIdArray = this.toggleViewIdArray || [],
                i = 0,
                toggleView = null;
            for (i = 0; i < toggleViewIdArray.length; i += 1) {
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdArray[i]);
                thisPriceDisplay.toggleViewIdArray[i] = toggleView;
            }
        };
        return thisPriceDisplay;
    };

    /*
    Name:
    Class FlightDisplay
    Param:
    None
    Return:
    An instance of FlightDisplay
    Functionality:
    Handles the FlightDisplay control
    Notes:
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> FlightDisplay
    */
    SKYSALES.Class.FlightDisplay = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisFlightDisplay = SKYSALES.Util.extendObject(parent);

        thisFlightDisplay.toggleViewIdArray = null;

        thisFlightDisplay.init = function (json) {
            this.setSettingsByObject(json);

            var toggleViewIdArray = this.toggleViewIdArray || [],
                i = 0,
                toggleView = null;
            for (i = 0; i < toggleViewIdArray.length; i += 1) {
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdArray[i]);
                thisFlightDisplay.toggleViewIdArray[i] = toggleView;
            }
        };
        return thisFlightDisplay;
    };

    /*
    Name:
    Class UpgradeAvailabilityInput
    Param:
    None
    Return:
    An instance of UpgradeAvailabilityInput
    Function:
    Handles the UpgradeAvailabilityInput control in SkySales and will hold all the cabin upgrade options for all segments
    Class Hierarchy:
    SkySales -> UpgradeAvailabilityInput
    */

    SKYSALES.Class.UpgradeAvailabilityInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisUpgradeAvailabilityInput = SKYSALES.Util.extendObject(parent);
        thisUpgradeAvailabilityInput.cabinUpgradeSegmentArray = [];

        thisUpgradeAvailabilityInput.init = function (json) {
            this.setSettingsByObject(json);
            this.initCabinUpgradeSegmentArray();
        };

        thisUpgradeAvailabilityInput.initCabinUpgradeSegmentArray = function () {
            var i = 0,
                cabinUpgradeSegmentArray = this.cabinUpgradeSegmentArray || [],
                len = cabinUpgradeSegmentArray.length,
                cabinUpgrade = null;

            for (i = 0; i < len; i += 1) {
                cabinUpgrade = new SKYSALES.Class.CabinUpgradeSegment();
                cabinUpgrade.init(cabinUpgradeSegmentArray[i]);
                thisUpgradeAvailabilityInput.cabinUpgradeSegmentArray[i] = cabinUpgrade;
            }
        };

        return thisUpgradeAvailabilityInput;
    };

    /*
    Name:
    Class CabinUpgradeSegment
    Param:
    None
    Return:
    An instance of CabinUpgradeSegment
    Function:
    Represents the selected upgrade and the other upgrade options for that particular segment
    Class Hierarchy:
    SkySales -> CabinUpgradeSegment
    */

    SKYSALES.Class.CabinUpgradeSegment = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCabinUpgradeSegment = SKYSALES.Util.extendObject(parent);

        thisCabinUpgradeSegment.segmentInputId = '';
        thisCabinUpgradeSegment.segmentInput = null;

        thisCabinUpgradeSegment.cabinUpgradeOptionsArray = [];

        thisCabinUpgradeSegment.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initCabinUpgradeOptionsArray();
        };

        thisCabinUpgradeSegment.initCabinUpgradeOptionsArray = function () {
            var i = 0,
                optionsArray = this.cabinUpgradeOptionsArray || [],
                len = optionsArray.length,
                upgradeOption = null;

            for (i = 0; i < len; i += 1) {
                upgradeOption = new SKYSALES.Class.CabinUpgrade();
                upgradeOption.init(optionsArray[i]);
                upgradeOption.cabinUpgradeSegment = this;
                thisCabinUpgradeSegment.cabinUpgradeOptionsArray[i] = upgradeOption;
            }
        };

        thisCabinUpgradeSegment.setVars = function () {
            thisCabinUpgradeSegment.segmentInput = this.getById(this.segmentInputId);
        };

        return thisCabinUpgradeSegment;
    };

    /*
    Name:
    Class CabinUpgrade
    Param:
    None
    Return:
    An instance of CabinUpgrade
    Function:
    Represents the individual cabin upgrade option
    Class Hierarchy:
    SkySales -> CabinUpgrade
    */

    SKYSALES.Class.CabinUpgrade = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCabinUpgrade = SKYSALES.Util.extendObject(parent);

        thisCabinUpgrade.upgradeOptionId = '';
        thisCabinUpgrade.upgradeOption = null;

        thisCabinUpgrade.optionValue = '';
        thisCabinUpgrade.cabinUpgradeSegment = null;

        thisCabinUpgrade.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisCabinUpgrade.setVars = function () {
            thisCabinUpgrade.upgradeOption = this.getById(this.upgradeOptionId);
        };

        thisCabinUpgrade.addEvents = function () {
            this.upgradeOption.click(this.updateDataHandler);
        };

        thisCabinUpgrade.updateDataHandler = function () {
            thisCabinUpgrade.updateData();
        };

        thisCabinUpgrade.updateData = function () {
            var cabinUpgradeSegment = this.cabinUpgradeSegment || {},
                segmentInput = cabinUpgradeSegment.segmentInput;
            segmentInput.val(this.optionValue);
        };

        return thisCabinUpgrade;
    };

    /*
    Name:
    Class RandomImage
    Param:
    None
    Return:
    An instance of RandomImage
    Functionality:
    Handles the RandomImage on the search view
    Notes:
    This class can be used to display a random image,
    provided it has a list of uri that point to images,
    and a dom node to place the image.
    Class Hierarchy:
    SkySales -> RandomImage
    */
    SKYSALES.Class.RandomImage = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisRandomImage = SKYSALES.Util.extendObject(parent);

        thisRandomImage.imageUriArray = [];

        thisRandomImage.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.setAsBackground();
        };

        thisRandomImage.getRandomNumber = function () {
            var randomNumberMax = this.imageUriArray.length,
                randomNumber = Math.floor(Math.random() * randomNumberMax);
            return randomNumber;
        };

        thisRandomImage.setAsBackground = function () {
            var randomNumber = this.getRandomNumber(),
                uri = 'url(' + this.imageUriArray[randomNumber] + ')';
            this.container.css('background-image', uri);
        };
        return thisRandomImage;
    };

    /*
    Name:
    Class DropDown
    Param:
    None
    Return:
    An instance of DropDown
    Functionality:
    The DropDown class is a combo box.
    Notes:
    Provided with an input box, and an array of objects that have a code and name property
    it will turn the text box into a combo box that attemps to help you auto complete what you are typing
    given the data provided.
    The way to turn an input box into a combo box is
    var selectParamObj = {
    'input': $(inputBox),
    'options': [ { "code": "", "name": name } ]
    };
    SKYSALES.Class.DropDown.getDropDown(selectParamObj);
    Class Hierarchy:
    DropDown
    */
    SKYSALES.Class.DropDown = function (paramObject) {
        paramObject = paramObject || {};
        var parent = new SKYSALES.Class.SkySales(),
            thisDrop = SKYSALES.Util.extendObject(parent);

        thisDrop.container = {};
        thisDrop.name = '';
        thisDrop.showCode = true;
        thisDrop.options = [];
        thisDrop.currentFilteredOptions = [];
        thisDrop.dropDownContainer = null;
        thisDrop.dropDownContainerInput = null;
        thisDrop.document = null;
        thisDrop.optionList = null;
        thisDrop.optionActiveClass = 'optionActive';
        thisDrop.timeOutObj = null;
        thisDrop.timeOut = 225;
        thisDrop.minCharLength = 2;
        thisDrop.optionMax = 100;
        thisDrop.html = '<div></div><div class="dropDownContainer"></div>';
        thisDrop.autoComplete = true;

        thisDrop.getOptionHtml = function (search) {
            search = search || '';
            search = search.toLowerCase();

            var option = {},
                prop = '',
                optionHtml = '',
                optionCount = 0,
                optionHash = this.options,
                showCode = this.showCode,
                optionName = '',
                optionCode = '',
                optionClass = '';

            thisDrop.currentFilteredOptions = [];

            if (search.length < thisDrop.minCharLength) {
                optionHtml = '';
            } else {
                for (prop in optionHash) {
                    if (optionHash.hasOwnProperty(prop)) {
                        option = optionHash[prop];
                        optionName = option.name || '';
                        optionName = optionName.toLowerCase();
                        optionCode = option.code || '';
                        optionCode = optionCode.toLowerCase();

                        if ((optionName.indexOf(search) > -1) || (optionCode.indexOf(search) > -1)) {
                            thisDrop.currentFilteredOptions[thisDrop.currentFilteredOptions.length] = [optionName, optionCode];
                            if (option.optionClass) {
                                optionClass = ' class="' + option.optionClass + '"';
                            } else {
                                optionClass = '';
                            }
                            optionHtml += '<div' + optionClass + '><span>' + option.code + '</span>' + option.name;
                            if (showCode) {
                                optionHtml += ' (' + option.code + ')';
                            }
                            optionHtml += '</div>';
                            optionCount += 1;
                        }
                    }
                }
            }
            return optionHtml;
        };

        thisDrop.close = function () {
            if (thisDrop.timeOutObj) {
                window.clearTimeout(thisDrop.timeOutObj);
            }
            thisDrop.document.unbind('click', thisDrop.close);
            if (thisDrop.optionList) {
                thisDrop.optionList.unbind('hover');
                thisDrop.optionList.unbind('click');
            }
            thisDrop.optionList = null;
            thisDrop.dropDownContainer.html('');
        };


        thisDrop.getActiveOptionIndex = function () {
            var activeOptionIndex = -1,
                activeOption = $('.' + thisDrop.optionActiveClass, thisDrop.dropDownContainer);
            if (thisDrop.optionList && (activeOption.length > 0)) {
                activeOptionIndex = thisDrop.optionList.index(activeOption[0]);
            }
            return activeOptionIndex;
        };

        thisDrop.arrowDown = function () {
            var activeOptionIndex = thisDrop.getActiveOptionIndex();
            if (thisDrop.optionList) {
                if ((activeOptionIndex === -1) && (thisDrop.optionList.length > 0)) {
                    thisDrop.optionActive.call(thisDrop.optionList[0]);
                } else if (thisDrop.optionList.length > activeOptionIndex + 1) {
                    thisDrop.optionInActive.call(thisDrop.optionList[activeOptionIndex]);
                    thisDrop.optionActive.call(thisDrop.optionList[activeOptionIndex + 1]);
                } else {
                    thisDrop.arrowDownOpen();
                }
            } else {
                thisDrop.arrowDownOpen();
            }
        };

        thisDrop.arrowDownOpen = function () {
            var oldMinCharLength = thisDrop.minCharLength;
            thisDrop.minCharLength = 0;
            thisDrop.open();
            thisDrop.minCharLength = oldMinCharLength;
        };

        thisDrop.arrowUp = function () {
            var activeOptionIndex = thisDrop.getActiveOptionIndex();
            if (thisDrop.optionList) {
                if ((activeOptionIndex === -1) && (thisDrop.optionList.length > 0)) {
                    thisDrop.optionActive.call(thisDrop.optionList[0]);
                } else if ((activeOptionIndex > 0) && (thisDrop.optionList.length > 0)) {
                    thisDrop.optionInActive.call(thisDrop.optionList[activeOptionIndex]);
                    thisDrop.optionActive.call(thisDrop.optionList[activeOptionIndex - 1]);
                }
            }
        };

        thisDrop.selectButton = function () {
            var activeOptionIndex = thisDrop.getActiveOptionIndex(),
                oldOptionMax = thisDrop.optionMax;
            if (activeOptionIndex > -1) {
                thisDrop.selectOption.call(thisDrop.optionList[activeOptionIndex]);
            } else if (thisDrop.autoComplete === true) {
                thisDrop.optionMax = 1;
                thisDrop.open();
                if (thisDrop.optionList && (thisDrop.optionList.length > 0)) {
                    thisDrop.selectOption.call(thisDrop.optionList[0]);
                }
                thisDrop.optionMax = oldOptionMax;
            }
        };

        /*
        40: down arrow
        38: up arrow
        32: space
        9: tab
        13: enter
        */

        thisDrop.keyEvent = function (key) {
            var retVal = true,
                keyNum = key.which;
            if (keyNum === 40) {
                thisDrop.arrowDown();
                thisDrop.autoComplete = true;
                retVal = false;
            } else if (keyNum === 38) {
                thisDrop.arrowUp();
                thisDrop.autoComplete = true;
                retVal = false;
            } else if (keyNum === 9) {
                thisDrop.selectButton();
                thisDrop.inputBlur();
            } else if (keyNum === 13) {
                thisDrop.selectButton();
                thisDrop.autoComplete = false;
                retVal = false;
            } else {
                thisDrop.autoComplete = true;
            }
            return retVal;
        };

        thisDrop.inputKeyEvent = function (key) {
            var retVal = true,
                keyNum = key.which;
            if ((keyNum !== 40) && (keyNum !== 38) && (keyNum !== 9) && (keyNum !== 13)) {
                if (thisDrop.timeOutObj) {
                    window.clearTimeout(thisDrop.timeOutObj);
                }
                thisDrop.timeOutObj = window.setTimeout(thisDrop.open, thisDrop.timeOut);
                retVal = false;
            }
            return retVal;
        };

        thisDrop.catchEvent = function () {
            return false;
        };

        thisDrop.open = function () {
            var iframeHtml = '',
                iframe = null,
                search = thisDrop.dropDownContainerInput.val(),
                optionHtml = thisDrop.getOptionHtml(search),
                height = 0,
                containerWidth = 0;
            thisDrop.dropDownContainer.html(optionHtml);
            thisDrop.addOptionEvents();
            thisDrop.dropDownContainer.click(thisDrop.catchEvent);
            thisDrop.document.click(thisDrop.close);

            thisDrop.dropDownContainer.show();
            if (thisDrop.optionList && (thisDrop.optionList.length > 0) && thisDrop.optionActive) {
                thisDrop.optionActive.call(thisDrop.optionList[0]);
            }
            containerWidth = thisDrop.dropDownContainer.width();

            //if ($.browser.msie) {
            //    height = thisDrop.dropDownContainer.height();
            //    iframeHtml = '<iframe src="#"></iframe>';
            //    thisDrop.dropDownContainer.prepend(iframeHtml);
            //    iframe = $('iframe', thisDrop.dropDownContainer);
            //    iframe.width(containerWidth);
            //    iframe.height(height);
            //}
        };

        thisDrop.optionActive = function () {
            var option = $(this);
            thisDrop.optionList.removeClass(thisDrop.optionActiveClass);
            option.addClass(thisDrop.optionActiveClass);
        };

        thisDrop.optionInActive = function () {
            var option = $(this);
            option.removeClass(thisDrop.optionActiveClass);
        };

        thisDrop.selectOption = function () {
            var searchLower = thisDrop.dropDownContainerInput.val().toLowerCase(),
                text = $('span', this).text(),
                searchMatchesSelectedText = false,
                filteredOptions = thisDrop.currentFilteredOptions,
                optionName = '',
                optionCode = '',
                i = 0;

            for (i = 0; i < filteredOptions.length; i += 1) {
                optionName = filteredOptions[i][0];
                optionCode = filteredOptions[i][1];
                optionName = optionName.toLowerCase();
                optionCode = optionCode.toLowerCase();

                if ((optionName.indexOf(searchLower) > -1) || (optionCode.indexOf(searchLower) > -1)) {
                    if (optionCode.indexOf(text.toLowerCase()) > -1) {
                        searchMatchesSelectedText = true;
                    }
                }
                if (searchMatchesSelectedText) {
                    break;
                }
            }

            if (searchMatchesSelectedText) {
                thisDrop.dropDownContainerInput.val(text);
                thisDrop.close();
                thisDrop.dropDownContainerInput.change();
            }
        };

        thisDrop.addOptionEvents = function () {
            thisDrop.optionList = $('div', thisDrop.dropDownContainer);
            thisDrop.optionList.hover(thisDrop.optionActive, thisDrop.optionInActive);
            thisDrop.optionList.click(thisDrop.selectOption);
        };

        thisDrop.inputBlur = function () {
            thisDrop.close();
        };

        thisDrop.addEvents = function (paramObject) {
            thisDrop.dropDownContainerInput = paramObject.input;
            thisDrop.dropDownContainer = $('div.dropDownContainer', thisDrop.container);
            thisDrop.document = $(document);
            thisDrop.dropDownContainerInput.keyup(thisDrop.inputKeyEvent);
            thisDrop.dropDownContainerInput.keydown(thisDrop.keyEvent);
        };

        thisDrop.init = function (paramObject) {
            thisDrop.setSettingsByObject(paramObject);
            var html = thisDrop.html;
            paramObject.input.attr('autocomplete', 'off');
            paramObject.input.wrap('<span class="dropDownOuterContainer"></span>');
            paramObject.input.after(html);
            thisDrop.container = paramObject.input.parent('span.dropDownOuterContainer');
            thisDrop.addEvents(paramObject);
            SKYSALES.Class.DropDown.dropDownArray[SKYSALES.Class.DropDown.dropDownArray.length] = thisDrop;
        };
        thisDrop.init(paramObject);
        return thisDrop;
    };

    SKYSALES.Class.DropDown.dropDownArray = [];

    SKYSALES.Class.DropDown.getDropDown = function (selectParamObj) {
        var retVal = null,
            i = 0,
            dropDown = null,
            dropDownArray = SKYSALES.Class.DropDown.dropDownArray,
            input = null,
            inputCompare = selectParamObj.input[0];
        for (i = 0; i < dropDownArray.length; i += 1) {
            dropDown = dropDownArray[i];
            input = dropDown.dropDownContainerInput[0];
            if (input && inputCompare && input === inputCompare) {
                retVal = dropDownArray[i];
                if (selectParamObj.options) {
                    retVal.options = selectParamObj.options;
                }
            }
        }
        if (!retVal) {
            retVal = new SKYSALES.Class.DropDown(selectParamObj);
        }
        return retVal;
    };

    SKYSALES.Class.DatePickerManager = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisDatePickerManager = SKYSALES.Util.extendObject(parent),
            allDayOptionArray = [],
            yearMonthDelimiter = '-',
            yearMonthFormatString = 'yy-mm',
        // In DatePicker, 'yy' means a 4-digit year
            firstDateOption = 'first',
            validateYearMonthRegExp = new RegExp('\\d{4}-\\d{2}'),
            today = new Date();

        thisDatePickerManager.isAOS = false;
        thisDatePickerManager.yearMonth = null;
        thisDatePickerManager.day = null;
        thisDatePickerManager.linkedDate = null;
        thisDatePickerManager.useJQueryDatePicker = true;
        thisDatePickerManager.yearMonthOptionArray = [];
        thisDatePickerManager.fullDateFormatString = 'mm/dd/yy';
        thisDatePickerManager.beginDateBound = new Date();
        thisDatePickerManager.endDateBound = new Date();
        thisDatePickerManager.currentDate = new Date();

        thisDatePickerManager.setBeginDateBound = function (beginDateBound) {
            thisDatePickerManager.beginDateBound = beginDateBound;
            thisDatePickerManager.yearMonthOptionArray = [];
        };

        thisDatePickerManager.setEndDateBound = function (endDateBound) {
            thisDatePickerManager.endDateBound = endDateBound;
            thisDatePickerManager.yearMonthOptionArray = [];
        };

        // Accepts a date object to return the number of days in the month
        thisDatePickerManager.getDaysInMonth = function (dateParam) {
            var daysNotInMonthDate = new Date(dateParam.getFullYear(), dateParam.getMonth(), 32),
                daysNotInMonth = daysNotInMonthDate.getDate();
            return 32 - daysNotInMonth;
        };

        // Checks if the day is in the correct format (2 digit numeric)
        thisDatePickerManager.validateDay = function (dayParam) {
            dayParam = dayParam || '';
            return dayParam.match(/\d{2}/);
        };

        // Checks if the year-month is in the correct format
        thisDatePickerManager.validateYearMonth = function (yearMonthParam) {
            yearMonthParam = yearMonthParam || '';
            return yearMonthParam.match(validateYearMonthRegExp);
        };

        thisDatePickerManager.getDate = function (yearMonthParam, dayParam) {
            var retDate = null,
                yearIndex = 0,
                monthIndex = 1,
                yearMonthArray = [],
                yearVal = 0,
                monthVal = 0;

            yearMonthParam = yearMonthParam || this.yearMonth.val();
            dayParam = dayParam || this.day.val();
            if (yearMonthParam && dayParam) {
                yearMonthArray = yearMonthParam.split(yearMonthDelimiter);

                if (true === this.isAOS) {
                    yearIndex = 1;
                    monthIndex = 0;
                }
                yearVal = yearMonthArray[yearIndex];
                monthVal = yearMonthArray[monthIndex] - 1;
                retDate = new Date(yearVal, monthVal, dayParam);
            } else {
                retDate = this.currentDate;
            }

            return retDate;
        };

        // Accepts a year-month and day parameters and returns it as a date object.
        thisDatePickerManager.parseDate = function (yearMonthParam, dayParam) {
            var retDate = new Date(),
                validateDayVal = dayParam,
                validateYearMonthVal = this.validateYearMonth(yearMonthParam),
                currentDate = {},
                daysInMonth = 31,
                dayVal = 1;

            if (validateDayVal && validateYearMonthVal) {
                currentDate = this.getDate(yearMonthParam, dayParam);
                daysInMonth = this.getDaysInMonth(currentDate);

                dayVal = dayParam;
                if (dayParam > daysInMonth) {
                    dayVal = daysInMonth;
                }
                retDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayVal);
            } else {
                retDate = new Date();
            }

            return retDate;
        };

        // Update the selected value of the datepicker to be the same as the value of the dropdown fields when clicked.
        thisDatePickerManager.readLinked = function () {

            var currentDate = this.parseDate(this.yearMonth.val(), this.day.val()),
                dateString = SKYSALES.Util.dateToIsoString(currentDate);
				$('.hasDatepicker').css("display","inline-block"); //fixhgp

				if (this.yearMonth.attr("id").indexOf('_DropDownListMarketMonth1') > -1 || this.yearMonth.attr("id").indexOf('_DropDownListMarketDay1') > -1){
					var NextDate = currentDate
					NextDate.setDate(NextDate.getDate()+2);
					AuxdateString = SKYSALES.Util.dateToIsoString(NextDate);
					$("select[id*='_DropDownListMarketMonth2']").val(AuxdateString.substring(0, 7)).trigger('change');
					$("select[id*='_DropDownListMarketDay2']").val(Number(AuxdateString.substring(8, 10))).trigger('change');
				}

            this.linkedDate.val(dateString);
            return {};
        };

        thisDatePickerManager.readLinkedHandler = function () {
            return thisDatePickerManager.readLinked();
        };

        thisDatePickerManager.trimDaysBeforeBeginDateBound = function (dayArray) {
            var beginYearBound = this.beginDateBound.getFullYear(),
                beginMonthBound = this.beginDateBound.getMonth(),
                beginDayBound = this.beginDateBound.getDate(),
                firstDayInArray = parseInt(dayArray[0].code, 10),
                daysToTrimFromLeft = 0,
                currentYear = this.currentDate.getFullYear(),
                currentMonth = this.currentDate.getMonth();

            if ((currentMonth === beginMonthBound) && (currentYear === beginYearBound)) {
                if (firstDayInArray < beginDayBound) {
                    daysToTrimFromLeft = beginDayBound - firstDayInArray;
                    dayArray.splice(0, daysToTrimFromLeft);
                }
            }
            return dayArray;
        };

        thisDatePickerManager.dayArrayIndexOf = function (code, dayArray) {
            var dayArrayLength = dayArray.length,
                i = 0,
                dayOption = {},
                codeToFindIndex = -1,
                parsedCode;

            for (i = 0; i < dayArrayLength; i += 1) {
                dayOption = dayArray[i];
                parsedCode = parseInt(dayOption.code, 10);
                if (parsedCode === code) {
                    codeToFindIndex = i;
                    break;
                }
            }
            return codeToFindIndex;
        };

        thisDatePickerManager.trimDaysAfterEndDateBound = function (dayArray) {
            var endYearBound = this.endDateBound.getFullYear(),
                endMonthBound = this.endDateBound.getMonth(),
                endDayBound = this.endDateBound.getDate(),
                dayArrayLength = dayArray.length,
                lastDayInArray = dayArray[dayArrayLength - 1].code,
                daysToTrimFromRight = 0,
                startRemoveIndex = 0,
                currentYear = this.currentDate.getFullYear(),
                currentMonth = this.currentDate.getMonth();

            if ((currentMonth === endMonthBound) && (currentYear === endYearBound)) {
                if (lastDayInArray > endDayBound) {
                    startRemoveIndex = this.dayArrayIndexOf(endDayBound, dayArray) + 1;
                    if (startRemoveIndex >= 0) {
                        daysToTrimFromRight = lastDayInArray - endDayBound;
                        dayArray.splice(startRemoveIndex, daysToTrimFromRight);
                    }
                }
            }
            return dayArray;
        };

        thisDatePickerManager.removeDaysOutsideOfBounds = function (dayArray) {
            dayArray = this.trimDaysBeforeBeginDateBound(dayArray);
            dayArray = this.trimDaysAfterEndDateBound(dayArray);
            return dayArray;
        };

        thisDatePickerManager.dayPopulate = function (selectDate) {
            var day = selectDate.getDate(),
                daysInMonth = this.getDaysInMonth(selectDate),
                daysInMonthDifference = 31 - daysInMonth,
                dayOptionArray = SKYSALES.Util.cloneArray(allDayOptionArray),
                removeDaysAfterThisIndex = 31,
                daySelectJson = {};

            if (daysInMonthDifference > 0) {
                removeDaysAfterThisIndex = 31 - daysInMonthDifference;
                dayOptionArray.splice(removeDaysAfterThisIndex, daysInMonthDifference);
            }
            dayOptionArray = this.removeDaysOutsideOfBounds(dayOptionArray);
            daySelectJson = {
                "selectedItem": day,
                "objectArray": dayOptionArray,
                "input": this.day,
                "clearOptions": true
            };
            SKYSALES.Util.populate(daySelectJson);
        };

        thisDatePickerManager.getYearMonthOptionArray = function () {
            var optionArray = this.yearMonthOptionArray,
                monthToAdd = 0,
                zeroPadding = '0',
                yearToAdd = 2009,
                i = 0,
                monthNamesShort = {},
                name = '',
                code = '',
                beginDateBound = this.beginDateBound,
                endDateBound = this.endDateBound,
                firstDateInMonth = {},
                lastDateInMonth = {},
                lastDayInMonth = 31;

            if (optionArray.length === 0) {
                monthToAdd = beginDateBound.getMonth();
                yearToAdd = beginDateBound.getFullYear();
                monthNamesShort = SKYSALES.Resource.dateCultureInfo.monthNamesShort;
                for (i = 0; i < 12; i += 1) {
                    firstDateInMonth = new Date(yearToAdd, monthToAdd, 1);
                    lastDayInMonth = this.getDaysInMonth(firstDateInMonth);
                    lastDateInMonth = new Date(yearToAdd, monthToAdd, lastDayInMonth);
                    if ((lastDateInMonth >= beginDateBound) && (firstDateInMonth <= endDateBound)) {
                        name = monthNamesShort[monthToAdd];
                        if (monthToAdd < 9) {
                            zeroPadding = '0';
                        } else {
                            zeroPadding = '';
                        }
                        code = yearToAdd + '-' + zeroPadding + (monthToAdd + 1);
                        optionArray[i] = {
                            "name": name,
                            "code": code
                        };
                    } else if (lastDateInMonth > this.endDateBound) {
                        break;
                    }
                    monthToAdd += 1;
                    if (monthToAdd > 11) {
                        monthToAdd = 0;
                        yearToAdd += 1;
                    }
                }
            }
            return optionArray;
        };

        thisDatePickerManager.yearMonthPopulate = function (selectDate) {
            var optionArray = this.getYearMonthOptionArray(),
                yearMonthString = $.datepicker.formatDate(yearMonthFormatString, selectDate),
                populateJson = {};

            populateJson = {
                "selectedItem": yearMonthString,
                "objectArray": optionArray,
                "input": this.yearMonth,
                "clearOptions": true
            };

            SKYSALES.Util.populate(populateJson);
        };

        thisDatePickerManager.datePopulate = function (selectDate) {
            if (!selectDate) {
                selectDate = this.currentDate;
            } else {
                thisDatePickerManager.currentDate = selectDate;
            }
            this.yearMonthPopulate(selectDate);
            this.dayPopulate(selectDate);
            this.copyDayAndYearMonthInputToLinkedDate();
        };

        // Ensures that the datepicker and the date fields are in sync when an update was done to the year
        thisDatePickerManager.repopulateDayInputAndUpdateLinkedDate = function () {
            var dayVal = this.day.val(),
                currentDate = this.getDate(this.yearMonth.val(), 1),
                daysInMonth = this.getDaysInMonth(currentDate),
                formattedDateString = '';

            if (dayVal > daysInMonth) {
                dayVal = daysInMonth;
            }
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayVal);
            if (currentDate < this.beginDateBound) {
                currentDate = this.beginDateBound;
            }
            thisDatePickerManager.currentDate = currentDate;
            this.dayPopulate(currentDate);
            formattedDateString = SKYSALES.Util.dateToIsoString(currentDate);
            this.linkedDate.val(formattedDateString);
        };

        thisDatePickerManager.repopulateDayInputAndUpdateLinkedDateHandler = function () {
            thisDatePickerManager.repopulateDayInputAndUpdateLinkedDate();
        };

        // Update select controls to match the date picker selection
        thisDatePickerManager.setYearMonthAndDayInput = function (dateString) {
            var yearMonthString = '',
                selectedDate = SKYSALES.Util.parseIsoDate(dateString);

            if (selectedDate) {
                yearMonthString = $.datepicker.formatDate(yearMonthFormatString, selectedDate);
                this.yearMonth.val(yearMonthString);
                this.repopulateDayInputAndUpdateLinkedDate();
                this.dayPopulate(selectedDate);
                this.readLinked();
            }
            thisDatePickerManager.currentDate = selectedDate;
        };

        thisDatePickerManager.setYearMonthAndDayInputHandler = function (dateString) {
            thisDatePickerManager.setYearMonthAndDayInput(dateString);
        };

        // Ensures that the datepicker and the date fields are in sync when an update was done to the day
        thisDatePickerManager.copyDayAndYearMonthInputToLinkedDate = function () {
            var yearMonthVal = this.yearMonth.val(),
                dayVal = this.day.val(),
                currentDate = this.parseDate(yearMonthVal, dayVal),
                formattedDateString = SKYSALES.Util.dateToIsoString(currentDate);

            this.linkedDate.val(formattedDateString);
            thisDatePickerManager.currentDate = currentDate;
        };

        thisDatePickerManager.copyDayAndYearMonthInputToLinkedDateHandler = function () {
            thisDatePickerManager.copyDayAndYearMonthInputToLinkedDate();
        };

        // Create an array of day objects.
        thisDatePickerManager.createAllDayOptionArray = function () {
            var retArray = [],
                optionIterator = 1,
                option = {};

            for (optionIterator = 1; optionIterator <= 31; optionIterator += 1) {
                option = {};
                option.name = optionIterator;
                option.code = optionIterator;
                retArray[optionIterator - 1] = option;
            }
            return retArray;
        };

        thisDatePickerManager.dateLastDayOfMonthOneYearFromToday = function () {
            var nextYear = today.getFullYear() + 1,
                month = today.getMonth(),
                dateLastDayOfMonthOneYearFromToday = new Date(nextYear, month, 0);
            return dateLastDayOfMonthOneYearFromToday;
        };

        thisDatePickerManager.setVars = function () {
            this.beginDateBound.setDate(today.getDate() - 1);
            this.endDateBound = this.dateLastDayOfMonthOneYearFromToday();
            if (true === this.isAOS) {
                yearMonthDelimiter = '/';
                yearMonthFormatString = 'm/yy';
                validateYearMonthRegExp = new RegExp('\\d{1,2}\\/\\d{4}');
                firstDateOption = 'eq(1)';
            }
            // Create an array of day objects
            allDayOptionArray = this.createAllDayOptionArray();
        };

        thisDatePickerManager.initInputs = function () {
            var setDayDate = new Date();

            // Get the default selected date
            if (this.isAOS) {
                setDayDate = new Date(this.linkedDate.val());
            } else {
                setDayDate = this.getDate(this.yearMonth.val(), this.day.val());
            }
            if (setDayDate !== null) {
                thisDatePickerManager.currentDate = setDayDate;
                this.dayPopulate(setDayDate);
                thisDatePickerManager.currentDate = setDayDate;
                if (!this.isAOS) {
                    this.copyDayAndYearMonthInputToLinkedDate();
                }
            }
        };

        thisDatePickerManager.getMaxDate = function () {
            var yearMonthLast = null,
                maxDate = new Date(),
                daysInMonth = 31;

            if (this.yearMonth.val() !== null) {
                yearMonthLast = $('option:last', this.yearMonth).val();
                maxDate = this.getDate(yearMonthLast, 1);
                daysInMonth = this.getDaysInMonth(maxDate);
                maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), daysInMonth);
            } else {
                maxDate.setYear(maxDate.getFullYear() + 1);
            }
            return maxDate;
        };

        thisDatePickerManager.addEventsToJQueryDatePicker = function () {
            var minDate = new Date(),
                maxDate = {},
                resource = SKYSALES.Util.getResource(),
                dateCultureInfo = resource.dateCultureInfo,
                datePickerSettings = SKYSALES.datepicker,
                datePickerParams = {};

            minDate.setDate(minDate.getDate() - 1);
            maxDate = this.getMaxDate();
            if (this.useJQueryDatePicker) {

                datePickerParams = {
                    'beforeShow': this.readLinkedHandler,
                    'onSelect': this.setYearMonthAndDayInputHandler,
                    'minDate': minDate,
                    'maxDate': maxDate,
                    'showOn': 'both',
                    'buttonImageOnly': true,
                    'buttonImage': '/assets/images/icons/icn-calendar.png',
                    'buttonText': 'Calendar',
                    'numberOfMonths': 2,
                    'mandatory': true,
                    'monthNames': dateCultureInfo.monthNames,
                    'monthNamesShort': dateCultureInfo.monthNamesShort,
                    'dayNames': dateCultureInfo.dayNames,
                    'dayNamesShort': dateCultureInfo.dayNamesShort,
                    'dayNamesMin': dateCultureInfo.dayNamesMin,
                    'closeText': datePickerSettings.closeText,
                    'prevText': datePickerSettings.prevText,
                    'nextText': datePickerSettings.nextText,
                    'currentText': datePickerSettings.currentText,
                    'dateFormat': 'yy-mm-dd'
                };
                // Attach the input to the datepicker
                this.linkedDate.datepicker(datePickerParams);
            }
        };

        thisDatePickerManager.addEvents = function () {
            this.yearMonth.change(this.repopulateDayInputAndUpdateLinkedDateHandler);
            this.day.change(this.copyDayAndYearMonthInputToLinkedDateHandler);
            this.addEventsToJQueryDatePicker();
        };

        thisDatePickerManager.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initInputs();
            this.addEvents();
        };

        return thisDatePickerManager;
    };

    //Code to deal with the old way of getting the form on the page
    SKYSALES.initializeSkySalesForm = function () {
        document.SkySales = document.forms.SkySales;
    };

    //Returns the skysales html form
    SKYSALES.getSkySalesForm = function () {
        var skySalesForm = $('SkySales')[0];
        return skySalesForm;
    };

    /*
    Name:
    Class Common
    Param:
    None
    Return:
    An instance of Common
    Functionality:
    Provide common functionality and events on every view.
    Notes:
    This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
    Common
    */
    SKYSALES.Common = function () {
        var thisCommon = this,
            countryInfo = null;

        thisCommon.allInputObjects = null;

        thisCommon.initializeCommon = function () {
            var hint = new SKYSALES.Hint();
            thisCommon.addKeyDownEvents();
            thisCommon.addSetAndEraseEvents();
            thisCommon.setValues();
            hint.addHintEvents();
        };

        thisCommon.setValues = function () {
            var setValue = function () {
                if ((this.jsvalue !== null) && (this.jsvalue !== undefined)) {
                    this.value = this.jsvalue;
                }
            };
            thisCommon.getAllInputObjects().each(setValue);
        };

        thisCommon.stopSubmit = function () {
            return false;
        };

        thisCommon.resetSubmit = function () {
            var form = $('form');
            form.unbind('submit', thisCommon.stopSubmit);
        };

        thisCommon.addKeyDownEvents = function () {
            var keyFunction = function (e) {
                var form = $('form');
                if (e.keyCode === 13) {
                    // Stop the enter key in opera
                    form.submit(thisCommon.stopSubmit);
                    e.preventDefault();
                    e.stopPropagation();
                    // remove the submit handler to allow the form to submit on button press
                    setTimeout(thisCommon.resetSubmit, 25);
                    return false;
                }
                return true;
            };
            this.getAllInputObjects().keydown(keyFunction);
        };

        thisCommon.getAllInputObjects = function () {
            if (thisCommon.allInputObjects === null) {
                thisCommon.allInputObjects = $(':input');
            }
            return thisCommon.allInputObjects;
        };

        thisCommon.addSetAndEraseEvents = function () {
            var focusFunction = null,
                blurFunction = null,
                eventFunction = null;

            focusFunction = function () {
                var input = $(this),
                    requiredEmpty = SKYSALES.Util.getAttributeValue(input, 'requiredempty');

                thisCommon.eraseElement(this, requiredEmpty);
            };
            blurFunction = function () {
                var input = $(this),
                    requiredEmpty = SKYSALES.Util.getAttributeValue(input, 'requiredempty');

                thisCommon.setElement(this, requiredEmpty);
                input.change();
            };
            eventFunction = function () {
                var input = $(this),
                    requiredEmpty = null;

                requiredEmpty = SKYSALES.Util.getAttributeValue(input, 'requiredempty');

                if ((requiredEmpty !== null) && (requiredEmpty !== undefined)) {
                    //hack prevent focus on hidden elements in IE (which will throw an exception)
                    if (input.is(':text') && (input.is(':hidden') === false)) {
                        input.focus(focusFunction);
                        input.blur(blurFunction);
                    }
                }
            };
            thisCommon.getAllInputObjects().each(eventFunction);
        };

        thisCommon.eraseElement = function (element, defaultValue) {
            if (element.value === defaultValue) {
                element.value = "";
            }
        };

        thisCommon.setElement = function (element, defaultValue) {
            if (element.value === "") {
                element.value = defaultValue;
            }
        };

        thisCommon.getCountryInfo = function () {
            if (countryInfo === null) {
                countryInfo = window.countryInfo;
            }
            return countryInfo;
        };
        thisCommon.setCountryInfo = function (arg) {
            countryInfo = arg;
            return thisCommon;
        };

        thisCommon.isEmpty = function (element, defaultValue) {
            var val = null,
                retVal = false;

            if (element && defaultValue === undefined) {
                if (element.requiredempty) {
                    defaultValue = element.requiredempty;
                } else {
                    defaultValue = '';
                }
            }

            val = SKYSALES.Common.getValue(element);
            if ((val === null) || (val === undefined) || (val.length === 0) || (val === defaultValue)) {
                retVal = true;
            }
            return retVal;
        };

        thisCommon.stripeTables = function () {
            $(".stripeMe tr:even").addClass("alt");
            return thisCommon;
        };
    };

    //Adds an event to the dom, and sets a function handler
    SKYSALES.Common.addEvent = function (obj, eventString, functionRef) {
        $(obj).bind(eventString, functionRef);
    };

    //Returns the value of an html form element
    SKYSALES.Common.getValue = function (e) {
        var val = null;
        if (e) {
            val = $(e).val();
            return val;
        }
        return null;
    };

    SKYSALES.Util.getRequiredFlag = function () {
        return '*';
    };

    SKYSALES.Util.formatInputLabel = function (e) {
        var id = e.attr('id'),
            requiredFlag = SKYSALES.Util.getRequiredFlag(),
            label = null,
            labelText = '',
            required = '',
            requiredFlagIndex = -1;

        if (id) {
            label = $("label[for=" + id + "]");
            labelText = label.text();
            if (labelText) {
                required = SKYSALES.Util.getAttributeValue(e, 'required');
                required = required || '';
                required = required.toString().toLowerCase();
                requiredFlagIndex = labelText.indexOf(requiredFlag);
                if (requiredFlagIndex === 0) {
                    labelText = labelText.substring(1);
                }
                if (required === 'true') {
                    labelText = requiredFlag + labelText;
                }
                label.text(labelText);
            }
        }
    };

    /*
    Name:
    Class Dhtml
    Param:
    None
    Return:
    An instance of Dhtml
    Functionality:
    Provides methods that return the x and y position of an element on the dom
    Notes:
    This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
    Dhtml
    */
    SKYSALES.Dhtml = function () {
        var thisDhtml = this;
        thisDhtml.getX = function (obj) {
            var pos = 0;
            if (obj.x) {
                pos += obj.x;
            } else if (obj.offsetParent) {
                while (obj.offsetParent) {
                    pos += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
            }
            return pos;
        };

        thisDhtml.getY = function (obj) {
            var pos = 0;
            if (obj.y) {
                pos += obj.y;
            } else if (obj) {
                while (obj) {
                    pos += obj.offsetTop;
                    obj = obj.offsetParent;
                }
            }
            return pos;
        };
        return thisDhtml;
    };

    /*
    Name:
    Class Hint
    Param:
    None
    Return:
    An instance of Hint
    Functionality:
    A hint is shown as a helpful tip to the user about a html form field.
    Such as showing the user what the valid characters are for their password,
    when they are registering as a new user
    Notes:
    This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
    Hint
    */
    SKYSALES.Hint = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisHint = SKYSALES.Util.extendObject(parent);

        thisHint.addHintEvents = function () {
            SKYSALES.common.getAllInputObjects().each(this.eventFunction);
        };

        thisHint.eventFunction = function () {
            var hint = SKYSALES.Util.getAttributeValue($(this), 'hint');
            if (hint) {
                if (this.tagName && (this.tagName.toString().toLowerCase() === 'input')) {
                    thisHint.addHintFocusEvents(this);
                } else {
                    thisHint.addHintHoverEvents(this);
                }
            }
        };

        thisHint.removeEventFunction = function () {
            var obj = $(this),
                hint = SKYSALES.Util.getAttributeValue(obj, 'hint');
            if (hint) {
                if (this.tagName && (this.tagName.toString().toLowerCase() === 'input')) {
                    obj.unbind('focus');
                    obj.unbind('blur');
                } else {
                    obj.unbind('mouseenter');
                    obj.unbind('mouseleave');
                }
            }
        };

        thisHint.addHintFocusEvents = function (obj, hintText) {
            var focusFunction = null,
                blurFunction = null;

            focusFunction = function () {
                thisHint.showHint(obj, hintText);
            };
            blurFunction = function () {
                thisHint.hideHint(obj, hintText);
            };
            if ($(obj).is(':hidden') === false) {
                $(obj).focus(focusFunction);
                $(obj).blur(blurFunction);
            }
        };

        thisHint.addHintHoverEvents = function (obj, hintText) {
            var showFunction = null,
                hideFunction = null;

            showFunction = function () {
                thisHint.showHint(obj, hintText);
            };
            hideFunction = function () {
                thisHint.hideHint(obj, hintText);
            };
            $(obj).hover(showFunction, hideFunction);
        };

        thisHint.getHintDivId = function () {
            return "cssHint";
        };

        thisHint.showHint = function (obj, hintHtml, xOffset, yOffset, referenceId) {
            var hintDivId = thisHint.getHintDivId(),
                jQueryHintDiv = this.getById(hintDivId),
                x = 0,
                y = 0,
                defaultXOffset = 0,
                defaultYOffset = 0,
                hint = SKYSALES.Util.getAttributeValue($(obj), 'hint'),
                referenceObject = null,
                dhtml = null,
                leftX = 0,
                leftY = 0;

            if (xOffset === undefined) {
                xOffset = obj.hintxoffset;
            }
            if (yOffset === undefined) {
                yOffset = obj.hintyoffset;
            }

            if (referenceId === undefined) {
                referenceId = obj.hintReferenceid;
            }
            referenceObject = this.getById(referenceId)[0];

            dhtml = new SKYSALES.Dhtml();
            if (!referenceObject) {
                x = dhtml.getX(obj);
                y = dhtml.getY(obj);
                if (xOffset === undefined) {
                    x += obj.offsetWidth + 5;
                }
            } else {
                x = dhtml.getX(referenceObject);
                y = dhtml.getY(referenceObject);
                if (xOffset === undefined) {
                    x += referenceObject.offsetWidth + 5;
                }
            }

            if (!hintHtml && hint) {
                hintHtml = hint;
            }
            jQueryHintDiv.html(hintHtml);
            jQueryHintDiv.show();
            xOffset = (xOffset !== undefined) ? xOffset : defaultXOffset;
            yOffset = (yOffset !== undefined) ? yOffset : defaultYOffset;
            leftX = parseInt(xOffset, 10) + parseInt(x, 10);
            leftY = parseInt(yOffset, 10) + parseInt(y, 10);
            jQueryHintDiv.css('left', leftX + 'px');
            jQueryHintDiv.css('top', leftY + 'px');
        };

        thisHint.hideHint = function () {
            var hintDivId = thisHint.getHintDivId();
            this.getById(hintDivId).hide();
        };

        return thisHint;
    };

    /*
    Name:
    Class ValidationErrorReadAlong
    Param:
    None
    Return:
    An instance of ValidationErrorReadAlong
    Functionality:
    To provide a way of showing the user validation error messages so that they can fix them in a user friendly way
    Notes:
    This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
    ValidationErrorReadAlong
    */
    SKYSALES.ValidationErrorReadAlong = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisReadAlong = SKYSALES.Util.extendObject(parent);

        thisReadAlong.objId = '';
        thisReadAlong.obj = null;
        thisReadAlong.errorMessage = '';
        thisReadAlong.isError = false;
        thisReadAlong.hasBeenFixed = false;
        thisReadAlong.hasValidationEvents = false;

        thisReadAlong.getValidationErrorHtml = function () {
	
            var validatonErrorHtml ='<div class="modal fade modalalert error modalalertpay" id="validationErrorContainerReadAlongIFrame" tabindex="-1" role="dialog">'
            validatonErrorHtml += '<div class="modal-dialog center" role="document">'
            validatonErrorHtml += '<div class="modal-content">'
            validatonErrorHtml += '<div class="modal-header">'
            validatonErrorHtml += '</div>'
            validatonErrorHtml += '<div class="modal-body">'
            validatonErrorHtml += '<div id="validationErrorContainerReadAlongList"></div>'
            validatonErrorHtml += '</div > '
            validatonErrorHtml += '<div class="modal-footer">'
            validatonErrorHtml += '<button id="validationErrorContainerReadAlongCloseButton" type="button" class="btn btn-secondary btn-outline" data-dismiss="modal">Aceptar</button>'
            validatonErrorHtml += '</div>'
            validatonErrorHtml += '</div>'
            validatonErrorHtml += '</div>'
            validatonErrorHtml += '</div>'


				
			
			return validatonErrorHtml;
        };
        thisReadAlong.getValidationErrorCloseId = function () {
            return 'validationErrorContainerReadAlongCloseButton';
        };
        thisReadAlong.getValidationErrorListId = function () {

            return 'validationErrorContainerReadAlongList';
        };
        thisReadAlong.getValidationErrorIFrameId = function () {
            return 'validationErrorContainerReadAlongIFrame';
        };
        thisReadAlong.getValidationErrorDivId = function () {
            return 'validationErrorContainerReadAlong';
        };
        thisReadAlong.getFixedClass = function () {
            return 'fixedValidationError';
        };
        thisReadAlong.addCloseEvent = function () {
            var closeId = thisReadAlong.getValidationErrorCloseId(),
                closeFunction = null;
            closeFunction = function () {
                thisReadAlong.hide();
            };
            this.getById(closeId).click(closeFunction);
        };
        thisReadAlong.addValidationErrorDiv = function () {
            var mainContent = this.getById('SkySales');
            
            mainContent.append(thisReadAlong.getValidationErrorHtml());
			$('#validationErrorContainerReadAlongIFrame').modal("show")
        };
        thisReadAlong.hide = function () {
            var iFrameId = thisReadAlong.getValidationErrorIFrameId(),
                divId = thisReadAlong.getValidationErrorDivId();
            this.getById(iFrameId).hide();
            this.getById(divId).hide();
        };
        thisReadAlong.addFocusEvent = function () {
            var data = {
                obj: this
            },
                eventFunction = null;

            eventFunction = function (event) {
                var obj = event.data.obj,
                    hint = null,
                    readAlongDivObj = null,
                    readAlongDivWidth = 0,
                    readAlongDivHeight = 0,
                    x = 0,
                    y = 0,
                    dhtml = null,
                    iFrameObj = null;

                if (obj.isError === true) {
                    hint = new SKYSALES.Hint();
                    hint.hideHint();
                    readAlongDivObj = thisReadAlong.getById(thisReadAlong.getValidationErrorDivId());
                    readAlongDivWidth = parseInt(readAlongDivObj.width(), 10) + 5;
                    readAlongDivHeight = parseInt(readAlongDivObj.height(), 10) + 5;
                    dhtml = new SKYSALES.Dhtml();
                    x = dhtml.getX(obj.obj);
                    y = dhtml.getY(obj.obj);
                    x = x + this.offsetWidth + 5;
                    y = y - 72;
                    /* Start IE 6 Hack */
                    //if ($.browser.msie) {
                    //    iFrameObj = thisReadAlong.getById(thisReadAlong.getValidationErrorIFrameId());
                    //    iFrameObj.css('position', 'absolute');
                    //    iFrameObj.show();
                    //    iFrameObj.width(readAlongDivWidth - 25);
                    //    iFrameObj.height(readAlongDivHeight - 5);
                    //    iFrameObj.css('left', x + 16);
                    //    iFrameObj.css('top', y);
                    //}
                    /* End IE 6 Hack */
                    readAlongDivObj.css('left', x);
                    readAlongDivObj.css('top', y);
                    readAlongDivObj.css('position', 'absolute');
                    readAlongDivObj.show('slow');
                    return false;
                }
            };

            if ($(this.obj).is(':hidden') === false) {
                $(this.obj).bind("focus", data, eventFunction);
            }
        };

        thisReadAlong.addBlurEvent = function (index) {
            var data = {
                obj: this
            },
                eventFunction = null;

            eventFunction = function (event) {
                var obj = event.data.obj,
                    validateObj = new SKYSALES.Validate(null, '', '', null),
                    errorMessage = '',
                    isFixed = false,
                    allFixed = true,
                    listId = '',
                    listObj = null,
                    fixedClass = '',
                    fixedFunction = null;

                validateObj.validateSingleElement(this);

                errorMessage = validateObj.errors;
                if (validateObj.validationErrorArray.length > 0) {
                    if (validateObj.validationErrorArray[0].isError === false) {
                        isFixed = true;
                    }
                }
                listId = obj.getValidationErrorListId();
                listObj = thisReadAlong.getById(listId).find('li').eq(index);
                fixedClass = obj.getFixedClass();
                fixedFunction = function () {
                    if ((allFixed === true) && ($(this).attr("class").indexOf('hidden') === -1) && ($(this).attr("class").indexOf(fixedClass) === -1)) {
                        allFixed = false;
                    }
                };
                if (isFixed === true) {
                    obj.hasBeenFixed = true;
                    listObj.addClass(fixedClass);
                    allFixed = true;
                    thisReadAlong.getById(listId).find('li').each(fixedFunction);
                    if (allFixed === true) {
                        thisReadAlong.hide();
                    }
                } else {
                    obj.hasBeenFixed = false;
                    listObj.removeClass(fixedClass);
                    listObj.removeClass('hidden');
                    obj.isError = true;
                    obj.errorMessage = errorMessage;
                    listObj.text(errorMessage);
                }
                return false;
            };
            $(this.obj).bind("blur", data, eventFunction);
        };
        return thisReadAlong;
    };

    SKYSALES.errorsHeader = 'Please correct the following.\n\n';

    /*
    Name:
    Class Validate
    Param:
    None
    Return:
    An instance of Validate
    Functionality:
    Provides a way of validating html form elements before they are submitted to the server
    Notes:
    This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
    Validate
    */
    SKYSALES.Validate = function (form, controlID, errorsHeader, regexElementIdFilter) {


        var parent = new SKYSALES.Class.SkySales(),
            thisValidate = SKYSALES.Util.extendObject(parent),
            checkDateRangeExists = null;




        if (errorsHeader === undefined) {
            errorsHeader = SKYSALES.errorsHeader;
        }
        // set up properties
        thisValidate.form = form;
        thisValidate.namespace = controlID;
        thisValidate.errors = '';
        thisValidate.validationErrorArray = [];
        thisValidate.setfocus = null;
        thisValidate.clickedObj = null;
        thisValidate.errorDisplayMethod = 'read_along';
        thisValidate.errorsHeader = errorsHeader;
        thisValidate.namedErrors = [];

        //array of date strings
        thisValidate.dateRangeArray = [];

        if (regexElementIdFilter) {
            thisValidate.regexElementIdFilter = regexElementIdFilter;
        }
        // set up attributes
        thisValidate.requiredAttribute = 'required';
        thisValidate.requiredEmptyAttribute = 'requiredempty';
        thisValidate.validationTypeAttribute = 'validationtype';
        thisValidate.regexAttribute = 'regex';
        thisValidate.minLengthAttribute = 'minlength';
        thisValidate.numericMinLengthAttribute = 'numericminlength';
        thisValidate.maxLengthAttribute = 'maxlength';
        thisValidate.numericMaxLengthAttribute = 'numericmaxlength';
        thisValidate.minValueAttribute = 'minvalue';
        thisValidate.maxValueAttribute = 'maxvalue';
        thisValidate.equalsAttribute = 'equals';
        thisValidate.dateRangeAttribute = 'daterange';
        thisValidate.dateRange1HiddenIdAttribute = 'date1hiddenid';
        thisValidate.dateRange2HiddenIdAttribute = 'date2hiddenid';

        // set up error handling attributes
        thisValidate.defaultErrorAttribute = 'error';
        thisValidate.requiredErrorAttribute = 'requirederror';
        thisValidate.validationTypeErrorAttribute = 'validationtypeerror';
        thisValidate.regexErrorAttribute = 'regexerror';
        thisValidate.minLengthErrorAttribute = 'minlengtherror';
        thisValidate.maxLengthErrorAttribute = 'maxlengtherror';
        thisValidate.minValueErrorAttribute = 'minvalueerror';
        thisValidate.maxValueErrorAttribute = 'maxvalueerror';
        thisValidate.equalsErrorAttribute = 'equalserror';
        thisValidate.dateRangeErrorAttribute = 'daterangeerror';

        // set up error handling default errors
        thisValidate.defaultError = '{label} is invalid.';
        thisValidate.defaultRequiredError = '{label} is required.';
        thisValidate.defaultValidationTypeError = '{label} is invalid.';
        thisValidate.defaultRegexError = '{label} is invalid.';
        thisValidate.defaultMinLengthError = '{label} is too short in length.';
        thisValidate.defaultMaxLengthError = '{label} is too long in length.';
        thisValidate.defaultMinValueError = '{label} must be greater than {minValue}.';
        thisValidate.defaultMaxValueError = '{label} must be less than {maxValue}.';
        thisValidate.defaultEqualsError = '{label} is not equal to {equals}';
        thisValidate.defaultNotEqualsError = '{label} cannot equal {equals}';

        thisValidate.defaultValidationErrorClass = 'incorrect';
        thisValidate.defaultValidationErrorLabelClass = 'validationErrorLabel';

        // add methods to object
        thisValidate.run = function () {
            var nodeArray = $(':input', SKYSALES.getSkySalesForm()).get(),
                e = null,
                i = 0;
            // run validation on the form elements
            for (i = 0; i < nodeArray.length; i += 1) {
                e = nodeArray[i];
                if (!this.isExemptFromValidation(e)) {
                    thisValidate.validateSingleElement(e);
                }

            }
            return thisValidate.outputErrors();
        };
        thisValidate.runBySelector = function (selectorString) {
            var nodeArray = $(selectorString).find(':input').get(),
                node = null,
                i = 0;
            // run validation on the form elements
            for (i = 0; i < nodeArray.length; i += 1) {
                node = nodeArray[i];
                thisValidate.validateSingleElement(node);
            }
            return false;
        };
        thisValidate.validateSingleElement = function (e) {
           
            if( $("#" + e.id + "_container").length>0){
                $("#" + e.id + "_container").removeClass(this.defaultValidationErrorClass);  
            }
            else{
                $("#" + e.id + "_container").addClass(this.defaultValidationErrorClass);
            }
        
        
            if( $("#" + e.id).length>0 && $("#" + e.id + "_container").length == 0){
                $("#" + e.id).removeClass("incorrect-input");
            }
            else{
                $("#" + e.id).addClass("incorrect-input");
            }

            //$("label[for=" + e.id + "]").eq(0).removeClass(this.defaultValidationErrorLabelClass);

            var validationError = new SKYSALES.ValidationErrorReadAlong(),
                value;

            validationError.objId = e.id;
            validationError.obj = e;

            this.validationErrorArray[thisValidate.validationErrorArray.length] = validationError;
            this.validateRequired(e);
            // only validate the rest if they actually have something
            value = thisValidate.getValue(e);
            if ((thisValidate.errors.length < 1) && (value !== null) && (value !== "")) {
                thisValidate.validateType(e);
                thisValidate.validateRegex(e);
                thisValidate.validateMinLength(e);
                thisValidate.validateMaxLength(e);
                thisValidate.validateMinValue(e);
                thisValidate.validateMaxValue(e);
                thisValidate.validateEquals(e);
                thisValidate.validateDateRange(e);
            }
        };
        thisValidate.outputErrors = function () {
            // if there is an error output it
			
            var errorDisplayMethod = this.errorDisplayMethod.toString().toLowerCase(),
                errorHtml = '',
                errorArray = [],
                i = 0,
                showDefaultErrorMethod = true;

            if (this.errors) {
				//$( "#ModalFormErrors" ).remove();
				
				
				/*var modalHtml =	'<div class="modal fade" id="ModalFormErrors" tabindex="-1" role="dialog" aria-hidden="true">'
				modalHtml += '<div class="modal-dialog">';
				modalHtml += '<div class="modal-content">';
				modalHtml += '<div class="modal-sub-content bg-white">';
				modalHtml += '<div class="modal-header">';
				modalHtml += '<button type="button" class="close" data-dismiss="modal">';
				modalHtml += '<span aria-hidden="true">x</span>';
				modalHtml += '<span class="sr-only">Close</span>';
				modalHtml += '</button>';
				modalHtml += '<h4 class="modal-title">'+$('#ModalErrorsTitle').text()+'</h4>';
				modalHtml += '</div>';
				modalHtml += '<div class="bg-white" id="ModalListErrors"></div>';*/
				
				errorArray = thisValidate.errors.split('\n');
				/*errorHtml = '<ul class="validationErrorList" >';*/
				errorHtml += '<ul class="validationErrorList" >';
				for (i = 0; i < errorArray.length; i += 1) {
					if (errorArray[i] !== '') {
						errorHtml += '<li  class="validationErrorListItem">' + errorArray[i] + '<\/li>';
					}
				}

				errorHtml += '<\/ul>';
				errorChances+=1;
				

				/*
				modalHtml +=	errorHtml;
				//modalHtml += '<div class="modal-footer">';
				//modalHtml += '<button type="button" class="btn btn-primary" data-dismiss="modal">'+$('#ModalErrorsClose').text()+'</button>';
				//modalHtml += '</div>';	
				modalHtml += '</div>';
				modalHtml += '</div>';
				modalHtml += '</div>';
				modalHtml += '</div>';*/

				//$('#mainContent').append(modalHtml);
				//$('#ModalFormErrors').modal("show")
				//errorChances+=1;
					
                /*errorHtml += '<div class="errorSectionHeader" >' + this.errorsHeader + '<\/div>';
                errorArray = thisValidate.errors.split('\n');
                errorHtml += '<ul class="validationErrorList" >';
                for (i = 0; i < errorArray.length; i += 1) {
                    if (errorArray[i] !== '') {
                        errorHtml += '<li class="validationErrorListItem" >' + errorArray[i] + '<\/li>';
                    }
                }
                errorHtml += '<\/ul>';*/

               if (errorDisplayMethod.indexOf('read_along') > -1) {

                    thisValidate.outputErrorsReadAlong(errorHtml);
                    showDefaultErrorMethod = false;
                }
                if (errorDisplayMethod.indexOf('alert') > -1) {
                    alert(thisValidate.errorsHeader + thisValidate.errors);
                }
                if (showDefaultErrorMethod === true) {
                    alert(thisValidate.errorsHeader + thisValidate.errors);
                }

                if (thisValidate.setfocus) {
                    if ($(thisValidate.setfocus).is(':hidden') === false) {
                        thisValidate.setfocus.blur();
                        thisValidate.setfocus.focus();
						
                    }
					
                }
				
				//Click to Call and Click to chat, open the chat window at the third error.
				try{
					if(errorChances!=undefined && errorChances > 0){
					
					//errorMess = thisValidate.errors.toString();
					var pattern = /(\n)/ig;
					errorMess = thisValidate.errors.replace(pattern,',');
					
					
					lpTag.sdes = lpTag.sdes||[];
					lpTag.sdes.push(
						{
							"type": "error",  //MANDATORY
							"error": {
							"message": errorMess,  // MENSAJE DE ERROR (SI EXISTE)
							"code":'01'
									}
						}
					);
					//alert(errorMess)
				   }
				}
				catch (exception)
				{
					//alert("hola")
				}
				
				
                return false;
			
            }else {
                return true;
            }
        };
        thisValidate.outputErrorsReadAlong = function () {
            var i = 0,
                errorHtmlLocal = '',
                validationError = null,
                validateObject = this,
                addErrorEventFunction = null;

            addErrorEventFunction = function (index) {
                this.hasValidationEvents = true;
                this.addFocusEvent(index);
                this.addBlurEvent(index);
            };

            validateObject.validationErrorReadAlong = new SKYSALES.ValidationErrorReadAlong();
            validateObject.readAlongDivId = this.getById(this.validationErrorReadAlong.getValidationErrorDivId()).attr('id');
            if (validateObject.readAlongDivId === undefined) {
                validateObject.validationErrorReadAlong.addValidationErrorDiv();
                validateObject.validationErrorReadAlong.addCloseEvent();
            }


            errorHtmlLocal += '<ul class="validationErrorList" >';
            for (i = 0; i < validateObject.validationErrorArray.length; i += 1) {
                validationError = this.validationErrorArray[i];
                if (validationError.isError === true) {

                    errorHtmlLocal += '<li class="validationErrorListItem" >' + validationError.errorMessage + '<\/li>';
                } else {
                    errorHtmlLocal += '<li class="validationErrorListItem hidden" >' + validationError.errorMessage + '<\/li>';
                }
            }
            this.getById(validateObject.validationErrorReadAlong.getValidationErrorListId()).html(errorHtmlLocal);

            $(validateObject.validationErrorArray).each(addErrorEventFunction);
        };
        thisValidate.checkFocus = function (e) {
            if (!thisValidate.setfocus) {
                thisValidate.setfocus = e;
            }
        };
        thisValidate.setError = function (e, errorAttribute, defaultTypeError) {
            var nameStr = '',
                error = '',
                dollarOne = '',
                i = 0,
                validationError = null,
                results,
                errorObjId = '';

            if (e.type === 'radio') {
                nameStr = e.getAttribute('name');
                if (nameStr.length > 0) {
                    if (thisValidate.namedErrors[nameStr] !== undefined) {
                        return;
                    }
                    thisValidate.namedErrors[nameStr] = nameStr;
                }
            }

            error = this.attributeValue(e, errorAttribute);
            if (!error) {
                error = this.attributeValue(e, this.defaultErrorAttribute);
                if (!error) {
                    if (defaultTypeError) {
                        error = defaultTypeError;
                    } else {
                        error = this.defaultError;
                    }
                }
            }

            // this would make more sense but it doesn't work
            // so I'll do each explicitly while I make this work
            results = error.match(/\{\s*(\w+)\s*\}/g);
            if (results) {
                for (i = 0; i < results.length; i += 1) {
                    dollarOne = results[i].replace(/\{\s*(\w+)\s*\}/, '$1');
                    error = error.replace(/\{\s*\w+\s*\}/, thisValidate.cleanAttributeForErrorDisplay(e, dollarOne));
                }
            }

            
            if( $("#" + e.id + "_container").length>0){
                $("#" + e.id + "_container").addClass(this.defaultValidationErrorClass);
            }
            else{
                $("#" + e.id + "_container").addClass(this.defaultValidationErrorClass);
            }


            if( $("#" + e.id).length>0 && $("#" + e.id + "_container").length == 0){
                $("#" + e.id).addClass("incorrect-input");
            }
            else{
                $("#" + e.id).addClass("incorrect-input");
            }
           

            $("label[for=" + e.id + "]").eq(0).addClass(thisValidate.defaultValidationErrorLabelClass);
            this.errors += error + '\n';

            errorObjId = e.id;
            for (i = 0; i < thisValidate.validationErrorArray.length; i += 1) {
                validationError = thisValidate.validationErrorArray[i];
                if (validationError.objId === errorObjId) {
                    validationError.errorMessage = error;
                    validationError.isError = true;
                    break;
                }
            }
            this.checkFocus(e);

        };
        thisValidate.cleanAttributeForErrorDisplay = function (e, attributeName) {
            var requiredString = '',
                requiredFlag = SKYSALES.Util.getRequiredFlag(),
                attribute = '',
                minMaxRegex = /^(minvalue|maxvalue)$/i,
                regex = new RegExp('[^\\d.,]', 'g'),
                element = $(e),
                retVal = '';

            if (!attributeName) {
                attributeName = '';
            }

            attributeName = attributeName.toLowerCase();

            if (attributeName === 'label') {
                attribute = $("label[for=" + element.attr('id') + "]").text();
                requiredString = requiredFlag;
                retVal = SKYSALES.Util.replace(attribute, requiredString, '');
            }

            if (!retVal) {
                retVal = this.attributeValue(e, attributeName);
            }

            if (!retVal) {
                retVal = attributeName;
            } else if (attributeName.match(minMaxRegex)) {
                retVal = SKYSALES.Util.replace(retVal, regex, '');
                retVal = SKYSALES.Util.convertToLocaleCurrency(retVal);
            }

            return retVal;
        };
		
		
		
        thisValidate.attributeValue = function (e, attributeName) {
            e = $(e);
            var retVal = SKYSALES.Util.getAttributeValue(e, attributeName);
            if (typeof retVal !== 'string') {
                retVal = '';
            }
            return retVal;
        };

        thisValidate.validateRequired = function (e) {
            var requiredAttribute = thisValidate.requiredAttribute,
                requiredEmptyAttribute = thisValidate.requiredEmptyAttribute,
                required = this.attributeValue(e, requiredAttribute),
                requiredEmptyString = this.attributeValue(e, requiredEmptyAttribute),
                value = null,
                radioName = '',
                isRadioGroupChecked = false;

            thisValidate.radioGroupHash = {};

            if (required !== undefined) {
                required = required.toString().toLowerCase();
                if (requiredEmptyString) {
                    requiredEmptyString = requiredEmptyString.toString().toLowerCase();
                }
                if (required === 'true') {
                    value = thisValidate.getValue(e);
                    if ((e.type === 'checkbox') && (e.checked === false)) {
                        value = '';
                    } else if (e.type === 'radio') {
                        radioName = e.getAttribute('name');
                        if (thisValidate.radioGroupHash[radioName] === undefined) {
                            thisValidate.radioGroupHash[radioName] = $("input[name='" + radioName + "']");
                        }
                        isRadioGroupChecked = thisValidate.radioGroupHash[radioName].is(':checked');
                        if (!isRadioGroupChecked) {
                            value = '';
                        }
                    }
                    // this will not produce an error if value === 0
                    if ((value === undefined) || (value === null) || (value === '') || (value === 'Nombre(s)') || (value === 'Apellido(s)') || (value === 'Apellidos') || (value === 'First Name') || (value === 'Last Name') || (value.toLowerCase() === requiredEmptyString)) {
                        thisValidate.setError(e, thisValidate.requiredErrorAttribute, thisValidate.defaultRequiredError);
                    }
                }
            }
        };
        thisValidate.validateType = function (e) {
            var type = this.attributeValue(e, this.validationTypeAttribute),
                value = this.getValue(e),
                input = $(e),
                validationFunction = SKYSALES.Util.getAttributeValue(input, 'validationfunction') || '',
                validationFunctionParams = SKYSALES.Util.getAttributeValue(input, 'validationfunctionparams') || [],
                validationFunctionResult = true;

            if (type && value !== null) {
                type = type.toLowerCase();
                if ((type === 'address') && (!value.match(thisValidate.stringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'alphanumeric') && (!value.match(thisValidate.alphaNumericPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'amount') && (!thisValidate.validateAmount(value))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'country') && (!value.match(thisValidate.stringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'email') && (!value.match(thisValidate.emailPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'mod10') && (!thisValidate.validateMod10(value))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'name') && (!value.match(thisValidate.stringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'numeric') && (!thisValidate.validateNumeric(value))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type.indexOf('date') === 0) && (!thisValidate.validateDate(e, type, value))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'state') && (!value.match(thisValidate.stringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'string') && (!value.match(thisValidate.stringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'uppercasestring') && (!value.match(thisValidate.upperCaseStringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if ((type === 'zip') && (!value.match(thisValidate.stringPattern))) {
                    thisValidate.setValidateTypeError(e);
                } else if (type === 'function') {
                    if ($.isFunction(validationFunction)) {
                        validationFunctionResult = validationFunction.apply(this, validationFunctionParams);
                    }
                    if (!validationFunctionResult) {
                        thisValidate.setValidateTypeError(e);
                    }
                }
            }
        };
        thisValidate.validateRegex = function (e) {
            var regex = this.attributeValue(e, thisValidate.regexAttribute),
                value = thisValidate.getValue(e);
            if ((value !== null) && regex && (!value.match(regex))) {
                this.setError(e, thisValidate.regexErrorAttribute, thisValidate.defaultRegexError);
            }
        };
        thisValidate.parseCulturizedFloat = function (a) {
            var resource = null,
                groupSeparator = null,
                decimalSeparator = null;

            resource = SKYSALES.Util.getResource();
            groupSeparator = resource.currencyCultureInfo.groupSeparator;
            decimalSeparator = resource.currencyCultureInfo.decimalSeparator;

            if (!a || !a.length) {
                return null;
            }

            a = a.split(groupSeparator).join('');
            a = a.split(decimalSeparator).join('.');

            a = a.replace(/\s/g, '');

            return parseFloat(a);
        };
        thisValidate.validateMinLength = function (e) {
            var length = this.attributeValue(e, thisValidate.minLengthAttribute),
                numericLength = this.attributeValue(e, thisValidate.numericMinLengthAttribute),
                value = this.getValue(e);

            if ((0 < length) && (value !== null) && (value.length < length)) {
                thisValidate.setError(e, thisValidate.minLengthErrorAttribute, thisValidate.defaultMinLengthError);
            } else if ((0 < numericLength) && (0 < value.length) && (SKYSALES.Util.replace(value, thisValidate.numericStripper, '').length < numericLength)) {
                thisValidate.setError(e, thisValidate.minLengthErrorAttribute, thisValidate.defaultMinLengthError);
            }
        };
        thisValidate.validateMaxLength = function (e) {
            var length = this.attributeValue(e, thisValidate.maxLengthAttribute),
                numericLength = this.attributeValue(e, thisValidate.numericMaxLengthAttribute),
                value = this.getValue(e);

            if ((0 < length) && (value !== null) && (length < value.length)) {
                thisValidate.setError(e, thisValidate.maxLengthErrorAttribute, thisValidate.defaultMaxLengthError);
            } else if ((0 < numericLength) && (0 < value.length) && (numericLength < SKYSALES.Util.replace(value, thisValidate.numericStripper, '').length)) {
                thisValidate.setError(e, thisValidate.maxLengthErrorAttribute, thisValidate.defaultMaxLengthError);
            }
        };
        thisValidate.validateMinValue = function (e) {
            var min = this.attributeValue(e, thisValidate.minValueAttribute),
                value = thisValidate.parseCulturizedFloat(this.getValue(e));

            if ((value !== null) && (min !== undefined) && (0 < min.length)) {
                if ((5 < min.length) && (min.substring(0, 5) === '&gt;=')) {
                    if (value < parseFloat(min.substring(5, min.length))) {
                        thisValidate.setError(e, thisValidate.minValueErrorAttribute, thisValidate.defaultMinValueError);
                    }
                } else if ((4 < min.length) && (min.substring(0, 4) === '&gt;')) {
                    if (value <= parseFloat(min.substring(4, min.length))) {
                        thisValidate.setError(e, thisValidate.minValueErrorAttribute, thisValidate.defaultMinValueError);
                    }
                } else if (value < parseFloat(min)) {
                    thisValidate.setError(e, thisValidate.minValueErrorAttribute, thisValidate.defaultMinValueError);
                }
            }
        };
        thisValidate.validateMaxValue = function (e) {
            var max = this.attributeValue(e, this.maxValueAttribute),
                value = thisValidate.parseCulturizedFloat(this.getValue(e));

            if ((value !== null) && (max !== undefined) && (0 < max.length)) {
                if ((5 < max.length) && (max.substring(0, 5) === '&lt;=')) {
                    if (value > parseFloat(max.substring(5, max.length))) {
                        thisValidate.setError(e, thisValidate.maxValueErrorAttribute, thisValidate.defaultMaxValueError);
                    }
                } else if ((4 < max.length) && (max.substring(0, 4) === '&lt;')) {
                    if (value >= parseFloat(max.substring(4, max.length))) {
                        thisValidate.setError(e, thisValidate.maxValueErrorAttribute, thisValidate.defaultMaxValueError);
                    }
                } else if (value > parseFloat(max)) {
                    thisValidate.setError(e, thisValidate.maxValueErrorAttribute, thisValidate.defaultMaxValueError);
                }
            }
        };
        thisValidate.validateEquals = function (e) {
            // eventually this should be equipped to do string
            // comparison as well as other element comparisons
            var equal = this.attributeValue(e, thisValidate.equalsAttribute),
                value = thisValidate.getValue(e);

            if ((value !== null) && (equal !== undefined) && (0 < equal.length)) {
                if ((2 < equal.length) && (equal.substring(0, 2) === '!=')) {
                    if (value === equal.substring(2, equal.length)) {
                        thisValidate.setError(e, thisValidate.equalsErrorAttribute, thisValidate.defaultEqualsError);
                    }
                }
            }
        };

        checkDateRangeExists = function (dateHidden2) {
            var parent = dateHidden2.parent(),
                parent2 = parent.parent(),
                noDateRangeIE = parent.is(':hidden'),
                noDateRangeNonIE = parent2.is(':hidden'),
                retVal = !(noDateRangeIE || noDateRangeNonIE);
            return retVal;
        };
        thisValidate.checkIfValidateDateRangeNeeded = function (e) {
            var date = this.attributeValue(e, thisValidate.dateRangeAttribute),
                date1HiddenId = this.attributeValue(e, thisValidate.dateRange1HiddenIdAttribute),
                date2HiddenId = this.attributeValue(e, thisValidate.dateRange2HiddenIdAttribute),
                idLastChar = '',
                idSuffix = '',
                id = e.id,
                startValidate = false,
                dateRangeExists = false,
                dateHidden1 = null,
                dateHidden2 = null;

            if ((date !== undefined) && (0 < date.length)) {
                //parse from the id the trailing "count" value
                //e.g. DROPDOWNLISTMARKETDAY2 -> extract 2
                idLastChar = id.charAt(id.length - 1);
                if (this.validateNumeric(idLastChar)) {
                    idSuffix = idLastChar;
                }

                //for flight search page only run check on the first month in the range
                if (('1' === idSuffix) || ('' === idSuffix)) {
                    // If one of the date range items is hidden then it's one way and the validation shouldn't check a pair of dates.
                    dateHidden2 = this.getById(date2HiddenId);
                    dateRangeExists = checkDateRangeExists(dateHidden2);
                    if (dateRangeExists) {
                        startValidate = true;
                        dateHidden1 = this.getById(date1HiddenId);
                        thisValidate.dateRangeArray[0] = dateHidden1.val();
                        thisValidate.dateRangeArray[1] = dateHidden2.val();
                    }
                }
            }
            return startValidate;
        };
        thisValidate.validateDateRange = function (e) {
            var marketDate = null,
                datesInOrder = false,
                startValidate = false;

            // Determine if date range needs to be validated. If "startValidate" is
            // true, it means that we need to check if the date range is valid.
            startValidate = thisValidate.checkIfValidateDateRangeNeeded(e);

            if (startValidate) {
                marketDate = new SKYSALES.Class.MarketDate();
                datesInOrder = marketDate.datesInOrder(this.dateRangeArray);
                if (!datesInOrder) {
                    this.setError(e, this.dateRangeErrorAttribute, this.defaultError);
                }
            }
        };
        thisValidate.isExemptFromValidation = function (e) {
            if (e.id.indexOf(this.namespace) !== 0) {
                return true;
            }

            if (this.regexElementIdFilter && (!e.id.match(this.regexElementIdFilter))) {
                return true;
            }

            return false;
        };

        // add validation type methods
        thisValidate.setValidateTypeError = function (e) {
            this.setError(e, this.validationTypeErrorAttribute, this.defaultValidationTypeError);
        };
        thisValidate.validateAmount = function (amount) {
            var nbspPattern = /\xA0/g;  //non-breaking space pattern
            this.generateAmountPattern();

            amount = SKYSALES.Util.replace(amount, nbspPattern, " ");

            if ((!amount.match(this.amountPattern)) || (amount === 0)) {
                return false;
            }

            return true;
        };
        thisValidate.validateDate = function (e, type, value) {
            var lowerCaseType = '',
                today = new Date(),
                yearValue,
                monthValue,
                valueDate,
                currentYear,
                currentMonth;

            if (type) {
                lowerCaseType = type.toLowerCase();
            }
            value = value || '';

            if ((lowerCaseType === 'dateyear') && ((value < today.getFullYear()) || (!value.match(thisValidate.dateYearPattern)))) {
                return false;
            } else if ((lowerCaseType === 'datemonth') && (!value.match(thisValidate.dateMonthPattern))) {
                //just make sure it is two digits for now
                return false;
            } else if ((lowerCaseType === 'dateday') && (!value.match(thisValidate.DateDayPattern))) {
                //just make sure it is two digits for now
                return false;
            } else if (lowerCaseType === 'dateexpiration') {
                valueDate = SKYSALES.Util.parseIsoDate(value);
                yearValue = valueDate.getFullYear();
                monthValue = valueDate.getMonth();
                currentYear = today.getFullYear();
                currentMonth = today.getMonth();

                if (yearValue < currentYear || (yearValue === currentYear && monthValue < currentMonth)) {
                    return false;
                }
            }

            return true;
        };
        thisValidate.validateMod10 = function (cardNumber) {
            var ccCheckRegExp = /\D/,
                cardNumbersOnly = SKYSALES.Util.replace(cardNumber, / /g, ""),
                numberProduct,
                checkSumTotal = 0,
                productDigitCounter = 0,
                digitCounter = 0;

            if (!ccCheckRegExp.test(cardNumbersOnly)) {
                while (cardNumbersOnly.length < 16) {
                    cardNumbersOnly = '0' + cardNumbersOnly;
                }

                for (digitCounter = cardNumbersOnly.length - 1; 0 <= digitCounter; digitCounter -= 2) {
                    checkSumTotal += parseInt(cardNumbersOnly.charAt(digitCounter), 10);
                    numberProduct = (cardNumbersOnly.charAt(digitCounter - 1) * 2);
                    numberProduct += '';
                    for (productDigitCounter = 0; productDigitCounter < numberProduct.length; productDigitCounter += 1) {
                        checkSumTotal += parseInt(numberProduct.charAt(productDigitCounter), 10);
                    }
                }

                return (checkSumTotal % 10 === 0);
            }
            return false;
        };

        // Validates if the data passed is numeric
        thisValidate.validateNumeric = function (number) {
            if (!number.match(thisValidate.numericPattern)) {
                return false;
            }

            return true;
        };

        thisValidate.getValue = function (e) {
            return SKYSALES.Common.getValue(e);
        };

        //this.nonePattern = '^\.*$';
        thisValidate.stringPattern = new RegExp('^.+$');
        thisValidate.upperCaseStringPattern = /^[A-Z]([A-Z|\s])*$/;
        thisValidate.numericPattern = /^\d+$/;
        thisValidate.numericStripper = /\D/g;
        thisValidate.alphaNumericPattern = /^\w+$/;

        //accepts a period, a comma, a space or a nonbreaking space as delimiter
        thisValidate.amountPattern = /^(\d+((\.|,|\s|\xA0)\d+)*)$/;

        thisValidate.dateYearPattern = /^\d{4}$/;
        thisValidate.dateMonthPattern = /^\d{2}$/;
        thisValidate.dateDayPattern = /^\d{2}$/;

        thisValidate.emailPattern = /^\w+([\.\-\']?\w+)*@\w+([\.\-\']?\w+)*(\.\w{1,8})$/;

        //Generates pattern for amount field type validation.
        thisValidate.generateAmountPattern = function () {
            var resource = null,
                groupSeparator = null,
                decimalSeparator = null,
                regExpattern = null,
                pattern = '',
                nbspPattern = /\xA0/g; //Non-breaking space pattern.
            resource = SKYSALES.Util.getResource();
            groupSeparator = resource.currencyCultureInfo.groupSeparator;
            decimalSeparator = resource.currencyCultureInfo.decimalSeparator;

            //check if either the group or decimal separator uses a non-breaking space, then replace by a normal space.
            groupSeparator = SKYSALES.Util.replace(groupSeparator, nbspPattern, " ");
            decimalSeparator = SKYSALES.Util.replace(decimalSeparator, nbspPattern, " ");

            pattern = '^(\\d+(\\' + groupSeparator + '\\d+)*)(\\' + decimalSeparator + '\\d+)?$';
            regExpattern = new RegExp(pattern);
            thisValidate.amountPattern = regExpattern;
        };

        return thisValidate;
    };

    SKYSALES.Util.validateBySelector = function (selectorString) {
        var validate = null,
            clickedObj = null;
        if (selectorString !== undefined) {
            // run validation on the form elements
            validate = new SKYSALES.Validate(null, '', SKYSALES.errorsHeader, null);
            validate.clickedObj = clickedObj;
            validate.runBySelector(selectorString);
            return validate.outputErrors();
        }
        return true;
    };


	SKYSALES.Util.SendScheduleForm = function(){
		var SubmitId = $('.submit-schedule').attr("id");
		$('#ModalMinTimeErrors').modal("hide")
		$('#AgreeentInputMinimumTime').val('true');
		$('#'+SubmitId).click();
	}
	SKYSALES.Util.validateMinTime = function () {
			if($('#ModalMinTimeErrors').css("display") != 'block' && $('#AgreeentInputMinimumTime').val()=='false'){
				var markets = $("#selectMainBody .schedule-container   input:checked"),
				keys = [];
				var MinTimeError = false;
				var MessageError = '';
				var Flight = '';
				$(markets).each(function (i) {
					keys[i] = $(this).val();
					var DataSellKey =   keys[i].split('~ ~~');
					var DateTimeMarket = DataSellKey[1].substring(4,20)
					var diff = Math.abs(new Date() - new Date(DateTimeMarket));
					var minutes = Math.floor((diff/1000)/60);

					if(minutes < 240){
						if(MinimumTimeData != 'undefined'){
								MessageError = (i==0) ? MinimumTimeData.MessageDeparture : MinimumTimeData.MessageReturn;
						}else{
							Flight = (i==0) ? 'Partida' : 'Regreso';
							MessageError += '<ul><li>El vuelo de '+ Flight + ' sale en menos de 4 horas. Queda bajo tu responsabilidad  cumplir los procedimientos de abordaje'+'</li></ul>';
						}
					}
				});
				if(MessageError!=''){
					var modalHtml =	'<div class="modal fade" id="ModalMinTimeErrors" tabindex="-1" role="dialog" aria-hidden="true">'
					modalHtml += '<div class="modal-dialog">';
					modalHtml += '<div class="modal-content">';
					modalHtml += '<div class="modal-sub-content bg-white">';
					modalHtml += '<div class="modal-header">';
					modalHtml += '<button type="button" class="close" data-dismiss="modal">';
					modalHtml += '<span aria-hidden="true">x</span>';
					modalHtml += '<span class="sr-only">Close</span>';
					modalHtml += '</button>';
					modalHtml += '</div>';
					modalHtml += '<div class="bg-white" >'+MessageError+'</div>';
					modalHtml += '<div class="modal-footer" >';
					modalHtml += '<button type="button" class="btn btn-default" data-dismiss="modal">'+MinimumTimeData.btnClose+'</button>  <input type="button" value="'+MinimumTimeData.btnContinue+'" name="SubmitFormFromModal" id="SubmitFormFromModal" onclick="SKYSALES.Util.SendScheduleForm()" class="btn btn-primary"/>'
					modalHtml +='</div>';
					modalHtml += '</div>';
					modalHtml += '</div>';
					modalHtml += '</div>';
					modalHtml += '</div>';
					$('#mainContent').append(modalHtml);
					$('#ModalMinTimeErrors').modal("show")

					return false;
				}
			}

        return true;
    };


    SKYSALES.Util.validate = function (controlID, elementName, filter) {
        var clickedObj = null,
            controlIdString = '',
            validate = null,
            e = null;
        //make sure we can run this javascript
        if (document.getElementById && document.createTextNode) {
            // check if you can getAttribute if you can it is an element use the id.
            if (controlID.getAttribute) {
                controlIdString = controlID.getAttribute("id");
                clickedObj = controlID;
                controlID = SKYSALES.Util.replace(controlIdString, /_[a-zA-Z0-9]+$/, "");
            }
            validate = new SKYSALES.Validate(SKYSALES.getSkySalesForm(), controlID + '_', SKYSALES.errorsHeader, filter);
            validate.clickedObj = clickedObj;

            if (elementName) {
                e = elementName;
                if (!elementName.getAttribute) {
                    e = document.getElementById(controlID + "_" + elementName);
                }
                validate.validateSingleElement(e);
                return validate.outputErrors();
            }

            return validate.run();
        }
        // could not use javascript rely on server validation
        return true;
    };

    SKYSALES.Util.displayPopUpConverter = function () {
        var url = 'CurrencyConverter.aspx',
            converterWindow = window.converterWindow;
        if (!window.converterWindow || converterWindow.closed) {
            converterWindow = window.open(url, 'converter', 'width=360,height=220,toolbar=0,status=0,location=0,menubar=0,scrollbars=0,resizable=0');
        } else {
            converterWindow.open(url, 'converter', 'width=360,height=220,toolbar=0,status=0,location=0,menubar=0,scrollbars=0,resizable=0');
            if ($(converterWindow).is(':hidden') === false) {
                converterWindow.focus();
            }
        }
    };

    /* Page Behaviors */

    SKYSALES.toggleAtAGlanceEvent = function () {
        $(this).next().toggle();
    };
    SKYSALES.toggleAtAGlance = function () {
        $("div.atAGlanceDivHeader").click(SKYSALES.toggleAtAGlanceEvent);
    };

    SKYSALES.initializeTime = function () {
        var i = 0,
            timeOptions = "";
        for (i = 0; i < 23; i += 1) {
            timeOptions += "<option value=" + i + ">" + i + "</option>";
        }
        if (timeOptions !== "") {
            $("select.Time").append(timeOptions);
        }
    };

    SKYSALES.aosAvailabilityShow = function () {
        $(this).parent().find('div.hideShow').show('slow');
        return false;
    };

    SKYSALES.aosAvailabilityHide = function () {
        $(this).parent().parent('.hideShow').hide('slow');
        return false;
    };

    SKYSALES.dropDownMenuEvent = function () {
        $("div.slideDownUp").toggle('fast');
        return false;
    };

    SKYSALES.faqHideShow = function () {
        $(this).parent('dt').next('.accordianSlideContent').slideToggle("slow");
    };

    SKYSALES.equipHideShow = function () {
        $('div#moreSearchOptions').slideToggle("slow");
        return false;
    };

    SKYSALES.initializeAosAvailability = function () { /* AOS Availability */
        $('.hideShow').hide();
        $('.showContent').click(SKYSALES.aosAvailabilityShow);
        $('.hideContent').click(SKYSALES.aosAvailabilityHide); /* Drop-down menus */
        $('.toggleSlideContent').click(SKYSALES.dropDownMenuEvent);
        $('.accordian').click(SKYSALES.faqHideShow);
        $('.showEquipOpt').click(SKYSALES.equipHideShow);
        $('.hideEquipOpt').click(SKYSALES.equipHideShow);
    };





    SKYSALES.common = new SKYSALES.Common();

    SKYSALES.Util.sendAspFormFields = function () {
        var theForm = document.SkySales,
            clearAllValidity = null,
            eventTargetElement = window.document.getElementById('eventTarget'),
            eventArgumentElement = window.document.getElementById('eventArgument'),
            viewStateElement = window.document.getElementById('viewState');

        if (!theForm.onsubmit || (theForm.onsubmit() !== false)) {
            eventTargetElement.name = '__EVENTTARGET';
            eventArgumentElement.name = '__EVENTARGUMENT';
            viewStateElement.name = '__VIEWSTATE';
            if (theForm.checkValidity) {
                clearAllValidity = function () {
                    $(this).removeAttr("required");
                };
                SKYSALES.common.getAllInputObjects().each(clearAllValidity);
            }
        }
        return true;
    };

    SKYSALES.Util.initStripeTable = function () {
        $('.itemResult').hide();

        var stripeMeInputHandler = function () {
            $('.stripeMe tr').removeClass("over");
            $(this).parent().parent().addClass("over");
        };
        $('.stripeMe input').click(stripeMeInputHandler);
    };

    SKYSALES.initTableSorter = function () {
        /*$("table.sortMe").tablesorter({
            sortList: [[0, 0]],
            widgets: ['zebra'],
            headers: {
                5: {
                    sorter: false
                }
            }
        });*/
    };

    SKYSALES.Util.ready = function () {
        $('form').submit(SKYSALES.Util.sendAspFormFields);

        //Turn validation object tags into javascript, this must run before initializeCommon

        //Initialize objects
        SKYSALES.Util.initObjects('ready');
        SKYSALES.initializeSkySalesForm();

        SKYSALES.Util.initStripeTable();
        SKYSALES.initializeAosAvailability();
    };

    SKYSALES.Util.load = function () {
        //Initialize objects
        SKYSALES.Util.initObjects('load');

        //Initialize Common
        SKYSALES.common.initializeCommon();

        SKYSALES.toggleAtAGlance();
        SKYSALES.initTableSorter();

    };

    /*
    Name:
    Class CalendarAvailabilityInputBase
    Param:
    None
    Return:
    An instance of CalendarAvailabilityInputBase
    Functionality:
    Displays the low fare calendar
    Notes:
    This is the container object that has an array of markets
    Class Hierarchy:
    SkySales -> CalendarAvailabilityInputBase
    */
    SKYSALES.Class.CalendarAvailabilityInputBase = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCalendarAvailabilityBase = SKYSALES.Util.extendObject(parent);

        thisCalendarAvailabilityBase.containerId = 'availabilityInputContainerId';
        thisCalendarAvailabilityBase.container = null;

        thisCalendarAvailabilityBase.templateId = 'availabilityInputTemplateId';
        thisCalendarAvailabilityBase.template = null;

        thisCalendarAvailabilityBase.totalTemplateId = 'totalTemplateId';
        thisCalendarAvailabilityBase.totalTemplate = null;

        thisCalendarAvailabilityBase.totalId = 'totalId';
        thisCalendarAvailabilityBase.total = null;

        thisCalendarAvailabilityBase.marketArray = [];
        thisCalendarAvailabilityBase.marketClass = '';

        thisCalendarAvailabilityBase.requestStartDate = null;
        thisCalendarAvailabilityBase.requestEndDate = null;

        thisCalendarAvailabilityBase.pointsLabelAppend = '';
        thisCalendarAvailabilityBase.pointsSuffix = '';

        thisCalendarAvailabilityBase.init = function (json) {
            this.setSettingsByObject(json);
            this.initMarketArray();
            this.setVars();
            this.draw();
            this.setVarsAfterDraw();
            this.addEvents();
            this.selectInitialDateMarkets();

        };

        thisCalendarAvailabilityBase.setVars = function () {
            thisCalendarAvailabilityBase.container = this.getById(this.containerId);
            thisCalendarAvailabilityBase.template = this.getById(this.templateId);
            thisCalendarAvailabilityBase.totalTemplate = this.getById(this.totalTemplateId);
        };

        thisCalendarAvailabilityBase.initMarketArray = function () {
            var i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null;
            for (i = 0; i < len; i += 1) {
                market = new SKYSALES.Class[this.marketClass]();
                market.availabilityInput = this;
                market.marketIndex = i;
                market.containerId = 'market_' + i;
                market.selectedDateContainerId = 'selectedDate_' + i;
                market.requestStartDate = this.requestStartDate;
                market.requestEndDate = this.requestEndDate;
                market.init(marketArray[i]);
                marketArray[i] = market;
            }
        };

        thisCalendarAvailabilityBase.setVarsAfterDraw = function () {
            thisCalendarAvailabilityBase.total = this.getById(this.totalId);

            var i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null;
            for (i = 0; i < len; i += 1) {
                market = marketArray[i];
                market.setVarsAfterDraw();
            }
        };

        thisCalendarAvailabilityBase.addEvents = function () {
            var i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null;
            for (i = 0; i < len; i += 1) {
                market = marketArray[i];
                market.addEvents();
            }
        };

        thisCalendarAvailabilityBase.selectInitialDateMarkets = function () {
            var i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null;
            for (i = 0; i < len; i += 1) {
                market = marketArray[i];
                market.selectInitialDateMarket();
            }
        };

        thisCalendarAvailabilityBase.getHtml = function () {
            var html = this.template.text(),
                marketHtml = '',
                i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null;

            for (i = 0; i < len; i += 1) {
                market = marketArray[i];
                marketHtml += market.getHtml();
            }
            html = SKYSALES.Util.replace(html, /\[marketArray\]/, marketHtml);
            return html;
        };

		thisCalendarAvailabilityBase.drawHeaders = function () {
            var html = this.template.text(),
                marketHtml = '',
                i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null;
			var header = "";
            for (i = 0; i < len; i += 1) {
				if($('#TableCalendarHeader_'+i).length > 0){
					$('#TableCalendarHeader_'+i).before($('#headMarket_'+i).html())
				}else{
					$('#market_'+i).append($('#headMarket_'+i).html())
				}
            }
            $('#AuxMonthHeaders').remove();
            //return html;
        };

        thisCalendarAvailabilityBase.draw = function () {
            var html = this.getHtml();
            this.container.html(html);
        };

        thisCalendarAvailabilityBase.updateTotalAmount = function () {
            var totalhtml = this.totalTemplate.text(),
                totalClass = new SKYSALES.Class.CalendarAvailabilityTotals(),
                totalStr = '';

            totalClass.marketArray = this.marketArray;
            totalClass.getTotals();

            totalStr = SKYSALES.Util.formatAmount(totalClass.totalPrice, totalClass.totalPoints, this.pointsLabelAppend, this.pointsSuffix);
            totalhtml = SKYSALES.Util.replace(totalhtml, /\[totalAmount\]/, totalStr);

            this.total.html(totalhtml);
        };

        return thisCalendarAvailabilityBase;
    };

    /*
    Name:
    Class CalendarAvailabilityTotals
    Param:
    None
    Return:
    An instance of CalendarAvailabilityTotals
    Functionality:
    Holds both the total price and points
    Notes:
    This is the container object that has an array of markets
    Class Hierarchy:
    SkySales -> CalendarAvailabilityTotals
    */
    SKYSALES.Class.CalendarAvailabilityTotals = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCalendarAvailabilityTotals = SKYSALES.Util.extendObject(parent);

        thisCalendarAvailabilityTotals.totalPoints = 0;
        thisCalendarAvailabilityTotals.totalPrice = 0;
        thisCalendarAvailabilityTotals.marketArray = [];

        thisCalendarAvailabilityTotals.init = function (json) {
            this.setSettingsByObject(json);
        };

        thisCalendarAvailabilityTotals.getFormattedPrice = function (price) {
            var formattedPrice = "";

            if (price !== null && price >= 0) {
                formattedPrice = SKYSALES.Util.convertToLocaleCurrency(price);
                if (formattedPrice === "") {
                    formattedPrice = price.toString();
                }
            }
            return formattedPrice;
        };


        thisCalendarAvailabilityTotals.getTotals = function () {
            var i = 0,
                marketArray = this.marketArray || [],
                len = marketArray.length,
                market = null,
                dateMarket = null,
                dateMarketPoints = 0,
                dateMarketPrice = 0,
                totalPrice = 0,
                totalPoints = 0;


            for (i = 0; i < len; i += 1) {
                market = marketArray[i];
                dateMarket = market.selectedDateMarket || {};
                dateMarketPrice = dateMarket.price || 0;
                dateMarketPoints = dateMarket.points || 0;
                totalPrice += dateMarketPrice;
                totalPoints += dateMarketPoints;
            }

            thisCalendarAvailabilityTotals.totalPoints = SKYSALES.Util.convertToLocaleInteger(totalPoints);
            thisCalendarAvailabilityTotals.totalPrice = this.getFormattedPrice(totalPrice);

        };

        return thisCalendarAvailabilityTotals;
    };


    /*
    Name:
    Class CalendarAvailabilityInput
    Param:
    None
    Return:
    An instance of CalendarAvailabilityInput
    Functionality:
    Displays the low fare calendar
    Notes:
    This is the container object that has an array of markets
    Class Hierarchy:
    SkySales -> CalendarAvailabilityInputBase -> CalendarAvailabilityInput
    */
    SKYSALES.Class.CalendarAvailabilityInput = function () {
        var parent = new SKYSALES.Class.CalendarAvailabilityInputBase(),
            thisCalendarAvailabilityInput = SKYSALES.Util.extendObject(parent);

        thisCalendarAvailabilityInput.init = function (json) {
            this.setSettingsByObject(json);
            parent.marketClass = 'CalendarAvailabilityMarket';
            this.initMarketArray();
            this.setVars();
            this.draw();
            this.setVarsAfterDraw();
            this.addEvents();
            this.selectInitialDateMarkets();
			this.drawHeaders(); //hgp
        };

        return thisCalendarAvailabilityInput;
    };

    /*
    Name:
    Class TripPlannerCalendarAvailabilityInput
    Param:
    None
    Return:
    An instance of TripPlannerCalendarAvailabilityInput
    Functionality:
    Displays the low fare calendar
    Notes:
    This is the container object that has an array of markets
    Class Hierarchy:
    SkySales -> CalendarAvailabilityInputBase -> TripPlannerCalendarAvailabilityInput
    */
    SKYSALES.Class.TripPlannerCalendarAvailabilityInput = function () {
        var parent = new SKYSALES.Class.CalendarAvailabilityInputBase(),
            thisTripPlannerCalendarAvailabilityInput = SKYSALES.Util.extendObject(parent);

        thisTripPlannerCalendarAvailabilityInput.datePickerManager = {};

        thisTripPlannerCalendarAvailabilityInput.init = function (json) {
            this.setSettingsByObject(json);
            parent.marketClass = 'TripPlannerCalendarAvailabilityMarket';
            this.initMarketArray();
            this.setVars();
            this.draw();
            this.setVarsAfterDraw();
            this.addEvents();
            this.selectInitialDateMarkets();
        };

        return thisTripPlannerCalendarAvailabilityInput;
    };

    /*
    Name:
    Class CalendarAvailabilityMarketBase
    Param:
    None
    Return:
    An instance of CalendarAvailabilityMarketBase
    Functionality:
    Represents a single calendar in the low fare calendar view
    Notes:

    Class Hierarchy:
    SkySales -> CalendarAvailabilityMarketBase
    */
    SKYSALES.Class.CalendarAvailabilityMarketBase = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCalendarAvailabilityMarketBase = SKYSALES.Util.extendObject(parent);

        thisCalendarAvailabilityMarketBase.containerId = '';
        thisCalendarAvailabilityMarketBase.container = null;
        thisCalendarAvailabilityMarketBase.selectedDateContainerId = '';
        thisCalendarAvailabilityMarketBase.selectedDateContainer = null;
        thisCalendarAvailabilityMarketBase.templateId = 'marketTemplateId';
        thisCalendarAvailabilityMarketBase.template = null;
        thisCalendarAvailabilityMarketBase.selectedDateTemplateId = 'selectedDateTemplateId';
        thisCalendarAvailabilityMarketBase.selectedDateTemplate = null;
        thisCalendarAvailabilityMarketBase.noFlightsTemplateId = 'noFlightsTemplateId';
        thisCalendarAvailabilityMarketBase.noFlightsTemplate = null;

        thisCalendarAvailabilityMarketBase.availabilityInput = null;
        thisCalendarAvailabilityMarketBase.dateMarketHash = {};
        thisCalendarAvailabilityMarketBase.marketIndex = -1;
        thisCalendarAvailabilityMarketBase.departureStation = '';
        thisCalendarAvailabilityMarketBase.arrivalStation = '';
        thisCalendarAvailabilityMarketBase.selectedDateMarket = null;
        thisCalendarAvailabilityMarketBase.selectedDate = '';
        thisCalendarAvailabilityMarketBase.selectedClass = 'selected';
        thisCalendarAvailabilityMarketBase.dateMarketPrefix = 'date_';

        thisCalendarAvailabilityMarketBase.inputDayId = '';
        thisCalendarAvailabilityMarketBase.inputDay = null;
        thisCalendarAvailabilityMarketBase.inputMonthId = '';
        thisCalendarAvailabilityMarketBase.inputMonth = null;
        thisCalendarAvailabilityMarketBase.inputYearId = '';
        thisCalendarAvailabilityMarketBase.inputYear = null;

        thisCalendarAvailabilityMarketBase.startYear = '';
        thisCalendarAvailabilityMarketBase.startMonth = '';
        thisCalendarAvailabilityMarketBase.startDay = '';
        thisCalendarAvailabilityMarketBase.startDate = '';
        thisCalendarAvailabilityMarketBase.firstBlockDate = '';

        thisCalendarAvailabilityMarketBase.endYear = '';
        thisCalendarAvailabilityMarketBase.endMonth = '';
        thisCalendarAvailabilityMarketBase.endDay = '';
        thisCalendarAvailabilityMarketBase.endDate = '';
        thisCalendarAvailabilityMarketBase.lastBlockDate = '';
        thisCalendarAvailabilityMarketBase.requestStartDate = null;
        thisCalendarAvailabilityMarketBase.requestEndDate = null;

        thisCalendarAvailabilityMarketBase.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initStartDate();
            this.initEndDate();
            this.initFirstBlockDate();
            this.initLastBlockDate();
            this.initDateMarketHash();
        };

        thisCalendarAvailabilityMarketBase.setVars = function () {
            thisCalendarAvailabilityMarketBase.template = this.getById(this.templateId);
            thisCalendarAvailabilityMarketBase.inputDay = this.getById(this.inputDayId);
            thisCalendarAvailabilityMarketBase.inputMonth = this.getById(this.inputMonthId);
            thisCalendarAvailabilityMarketBase.inputYear = this.getById(this.inputYearId);
            thisCalendarAvailabilityMarketBase.noFlightsTemplate = this.getById(this.noFlightsTemplateId);
        };

        thisCalendarAvailabilityMarketBase.setVarsAfterDraw = function () {
            thisCalendarAvailabilityMarketBase.container = this.getById(this.containerId);
            thisCalendarAvailabilityMarketBase.selectedDateContainer = this.getById(this.selectedDateContainerId);
            thisCalendarAvailabilityMarketBase.selectedDateTemplate = this.getById(this.selectedDateTemplateId);

            var dateMarketHash = this.dateMarketHash || {},
                key = '',
                dateMarket = null;

            for (key in dateMarketHash) {
                if (dateMarketHash.hasOwnProperty(key)) {
                    dateMarket = dateMarketHash[key];
                    if (dateMarket) {
                        dateMarket.setVarsAfterDraw();
                    }
                }
            }
        };

        thisCalendarAvailabilityMarketBase.addEvents = function () {
            this.container.click(this.updateFareHandler);
        };


        thisCalendarAvailabilityMarketBase.getDateMarketKey = function (eventInfo) {
            var target = eventInfo.target,
                dateMarketKey = target.id;

            if (dateMarketKey === "") {
                dateMarketKey = $(target).parent('div.day').attr('id') || '';
            }
            return dateMarketKey;
        };

        thisCalendarAvailabilityMarketBase.updateFareEvent = function (eventInfo) {
            var dateMarketKey = this.getDateMarketKey(eventInfo);
            this.updateFare(dateMarketKey);
			if(dateMarketKey != ''){
				this.updateSummary(dateMarketKey);
			}
        };


		thisCalendarAvailabilityMarketBase.updateSummary = function(dateMarketKey){
			var dateMarket = this.dateMarketHash[dateMarketKey],
                html = '',
                price = 0,
				baseFare =  0,
				discountBaseFareSRC = 0,
				discountBaseFareADT = 0,

                //universitarios
                discountBaseFareACC = 0,
                discountBaseFareACD = 0,
                discountBaseFareACE = 0,
                 //universitarios

				discountBaseFareCHD = 0,
				discountBaseFareFREE = 0,
				discountBaseFareCNN = 0,
				taxes = 0,
				taxesSRC = 0,
				taxesADT = 0,

                 //universitarios
                taxesACC = 0,
                taxesACD = 0,
                taxesACE = 0,
                 //universitarios

				taxesCHD = 0,
				taxesFREE = 0,
				taxesCNN = 0,
                points = 0,
                amount = 0,
                marketIndex = 0;

			price = dateMarket.price;
			priceSRC = dateMarket.priceSRC;
			priceFREE = dateMarket.priceFREE;

			baseFare = dateMarket.baseFare;
			taxes = dateMarket.taxes;
			taxesSRC = dateMarket.taxesSRC;
			taxesADT = dateMarket.taxesADT;

		    //universitarios
			taxesACC = dateMarket.taxesACC;
			taxesACD = dateMarket.taxesACD;
			taxesACE = dateMarket.taxesACE;
		    //universitarios

			taxesCHD = dateMarket.taxesCHD;
			taxesFREE = dateMarket.taxesFREE;
			taxesCNN = dateMarket.taxesCNN;

			discountBaseFareSRC = dateMarket.discountBaseFareSRC;
			discountBaseFareADT = dateMarket.discountBaseFareADT;

		    //universitarios
			discountBaseFareACC = dateMarket.discountBaseFareACC;
			discountBaseFareACD = dateMarket.discountBaseFareACD;
			discountBaseFareACE = dateMarket.discountBaseFareACE;
		    //universitarios


			discountBaseFareCHD = dateMarket.discountBaseFareCHD;
			discountBaseFareFREE = dateMarket.discountBaseFareFREE;
			discountBaseFareCNN = dateMarket.discountBaseFareCNN;

			marketIndex = dateMarket.marketIndex


			if(price!=null && (price!='0.0001' && price!='0.0002')){
				var modalHtml =	'<div class="modal fade" id="ModalLoadingFares" tabindex="-1" role="dialog" aria-hidden="true">'
				//modalHtml += '<div class="modal-dialog">';
				//modalHtml += '<div class="progress">';
				//modalHtml += '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">45% Complete</span></div>';
				//modalHtml += '</div>';
				//modalHtml += '</div>';
				//modalHtml += '</div>';
				//$('#mainContent').find('#ModalLoadingFares').remove();
				//$('#mainContent').append(modalHtml);
				//$('#ModalLoadingFares').modal("show")

				DataCulture = "en-US";
				var cultureCountry = DataCulture;
				var labelBaseFare = '';
				var labelDiscount = '';

				var adtTitle = "";
				var srcTitle = "";
				var chdTitle = "";
				var freeTitle = "";
				var cnnTitle = "";

				var month = parseInt(dateMarket.month, 10) + 1
				var completeDate = dateMarket.year + '-' + month + '-'+ dateMarket.day;

				var TotalADT, TotalCHD, TotalACC, TotalACD, TotalACE, TotalFREE, TotalINF, grandTotal, TotalBaseFare, TotalDiscounts, TotalTaxes;
				TotalADT = TotalCHD = TotalFREE = TotalINF=TotalACC=TotalACD=TotalACE = grandTotal = 0;
				TotalADT = $("#flightSearchContainer select[id*='DropDownListPassengerType_ADT']").val();

			    //universitarios
				TotalACC = $("#flightSearchContainer select[id*='DropDownListPassengerType_ACC']").val();
				TotalACD = $("#flightSearchContainer select[id*='DropDownListPassengerType_ACD']").val();
				TotalACE = $("#flightSearchContainer select[id*='DropDownListPassengerType_ACE']").val();
			    //universitarios

				TotalCHD = $("#flightSearchContainer select[id*='DropDownListPassengerType_CHD']").val();
				TotalINF = $("#flightSearchContainer select[id*='DropDownListPassengerType_INFANT']").val();
				TotalFREE = $("#flightSearchContainer select[id*='DropDownListPassengerType_FREE']").val();

				var objHeaders=SkysalesObjSummaryPrice["tableHeaders"];
				var objPaxTypes=SkysalesObjSummaryPrice["paxTypes"];
				var objMarketTypes=SkysalesObjSummaryPrice["marketTypes"];
				var objTotalLbl=SkysalesObjSummaryPrice["totalLabels"];

				var tableHTML = '';
				var PassengersHTML = '';
				var marketType = "market_"+marketIndex;
				TotalBaseFare=TotalDiscounts=TotalTaxes=0;

				tableHTML +='<div class="section-content">'

					if(TotalADT > 0){

						TotalBaseFare =Number(TotalADT*baseFare)
						TotalDiscounts =Number(TotalADT*discountBaseFareADT)
						TotalTaxes =Number(TotalADT*taxesADT)

						tableHTML += '<input type="hidden" id="totalPassengerADT_Market'+marketIndex+'" value="'+(Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes))+'"/>'
					}

			    //universitarios
					if (TotalACC > 0) {

					    TotalBaseFare = Number(TotalACC * baseFare)
					    TotalDiscounts = Number(TotalACC * discountBaseFareACC)
					    TotalTaxes = Number(TotalACC * taxesACC)
					    console.log(TotalBaseFare)
					    console.log(TotalDiscounts)
					    console.log(TotalTaxes)
					    tableHTML += '<input type="hidden" id="totalPassengerACC_Market' + marketIndex + '" value="' + (Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes)) + '"/>'
					}

					if (TotalACD > 0) {

					    TotalBaseFare = Number(TotalACD * baseFare)
					    TotalDiscounts = Number(TotalACD * discountBaseFareACD)
					    TotalTaxes = Number(TotalACD * taxesACD)

					    tableHTML += '<input type="hidden" id="totalPassengerACD_Market' + marketIndex + '" value="' + (Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes)) + '"/>'
					}

					if (TotalACE > 0) {

					    TotalBaseFare = Number(TotalACE * baseFare)
					    TotalDiscounts = Number(TotalACE * discountBaseFareACE)
					    TotalTaxes = Number(TotalACE * taxesACE)

					    tableHTML += '<input type="hidden" id="totalPassengerACE_Market' + marketIndex + '" value="' + (Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes)) + '"/>'
					}
			    //universitarios

					if(TotalFREE > 0){

						TotalBaseFare +=Number(TotalFREE*baseFare)
						TotalDiscounts +=Number(TotalFREE*discountBaseFareFREE)
						TotalTaxes +=Number(TotalFREE*taxesFREE)

						tableHTML += '<input type="hidden" id="totalPassengerFREE_Market'+marketIndex+'" value="'+(Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes))+'"/>'
					}

					if(TotalCHD > 0){
						TotalBaseFare +=Number(TotalCHD*baseFare)
						TotalDiscounts +=Number(TotalCHD*discountBaseFareCHD)
						TotalTaxes +=Number(TotalCHD*taxesCHD)
						tableHTML += '<input type="hidden" id="totalPassengerCHD_Market'+marketIndex+'" value="'+(Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes))+'"/>'
					}

					tableHTML +='<div class="row"><div class="col-md-7 col-sm-7 col-xs-6">'+objHeaders['fare']+'</div><div class="col-md-5 col-sm-5 col-xs-6 text-right"><b>'+dateMarket.getFormattedAnyPrice(TotalBaseFare)+'</b></div></div>';
					if(TotalDiscounts>0) {
						tableHTML +='<div class="row text-blue"><div class="col-md-7 col-sm-7 col-xs-6">'+objHeaders['disc']+'</div><div class="col-md-5 col-sm-5 col-xs-6 text-right text-blue">-'+dateMarket.getFormattedAnyPrice(TotalDiscounts)+'</div></div>';
					}
					tableHTML +='<div class="row"><div class="col-md-7 col-sm-7 col-xs-6">'+objHeaders['tax']+'</div><div class="col-md-5 col-sm-5 col-xs-6 text-right">'+dateMarket.getFormattedAnyPrice(TotalTaxes)+'</div></div>';
					var marketType=(marketIndex==0) ? objTotalLbl["goingOut"] :  objTotalLbl["commingBack"] ;


					var totalByMarket = Number(TotalBaseFare) - Number(TotalDiscounts) + Number(TotalTaxes)

					tableHTML +='<div class="total-market"><input type="hidden" id="auxSummaryGrandTotal'+marketIndex+'" value="'+totalByMarket+'"/>'+ marketType+' <span id="summaryGrandTotal'+marketIndex+'">'+dateMarket.getFormattedAnyPrice(totalByMarket)+'</span></div></div>';




					var BaseFarePaxType, TaxesPaxType;
					BaseFarePaxType = TaxesPaxType = 0;
					PassengersHTML += '<div class="section-content">';
					var sum;
					if(TotalADT > 0){
						sum = 0;
						setTimeout(function(){
							$("input[id^='totalPassengerADT']").each(function(index) {
								sum += Number($(this).val());
							});
							PassengersHTML += '<div><span>'+TotalADT+'</span>'+' '+objPaxTypes['adt']+'<span class="pull-right">'+dateMarket.getFormattedAnyPrice(sum)+'</span></div>';
						},20)


					}

			    //universitarios
					if (TotalACC > 0) {
					    sum = 0;
					    setTimeout(function () {
					        $("input[id^='totalPassengerACC']").each(function (index) {
					            sum += Number($(this).val());
					        });
					        PassengersHTML += '<div><span>' + TotalACC + '</span>' + ' ' + objPaxTypes['acc'] + '<span class="pull-right">' + dateMarket.getFormattedAnyPrice(sum) + '</span></div>';
					    }, 20)


					}
					if (TotalACD > 0) {
					    sum = 0;
					    setTimeout(function () {
					        $("input[id^='totalPassengerACD']").each(function (index) {
					            sum += Number($(this).val());
					        });
					        PassengersHTML += '<div><span>' + TotalACD + '</span>' + ' ' + objPaxTypes['acd'] + '<span class="pull-right">' + dateMarket.getFormattedAnyPrice(sum) + '</span></div>';
					    }, 20)


					}
					if (TotalACE > 0) {
					    sum = 0;
					    setTimeout(function () {
					        $("input[id^='totalPassengerACE']").each(function (index) {
					            sum += Number($(this).val());
					        });
					        PassengersHTML += '<div><span>' + TotalACE + '</span>' + ' ' + objPaxTypes['ace'] + '<span class="pull-right">' + dateMarket.getFormattedAnyPrice(sum) + '</span></div>';
					    }, 20)


					}

			    //universitarios


					if(TotalCHD > 0){
						sum = 0;
						setTimeout(function(){

						$("input[id^='totalPassengerCHD']").each(function() {
							sum += Number($(this).val());
						});

						PassengersHTML += '<div><span>'+TotalCHD+'</span>'+' '+objPaxTypes['chd']+'<span class="pull-right">'+dateMarket.getFormattedAnyPrice(sum)+'</span></div>';
						},20)
					}
					if(TotalINF > 0){
					setTimeout(function(){
						BaseFarePaxType = Number(TotalINF*0);
						TaxesPaxType= Number(TotalINF*0);
						PassengersHTML += '<div><span>'+TotalINF+'</span>'+' '+objPaxTypes['inf']+'<span class="pull-right">'+dateMarket.getFormattedAnyPrice(0.00000009)+'</span></div>';
						},20)
					}
					setTimeout(function(){
					PassengersHTML += '</div>';
					},150);



				if(marketIndex==0){
					 $('#SummaryGoingOut .section-content').remove();
					 $('#SummaryGoingOut').append(tableHTML);
					 $('#SummaryGoingOut .section-title').removeClass("hide");
					 $('#SummaryGoingOut .section-title span').removeClass("closed");
					 $('#SummaryGoingOut .section-title span').addClass("expand");
				}
				if(marketIndex==1){
					$('#SummaryCommingBack .section-content').remove();
					 $('#SummaryCommingBack').append(tableHTML);
					 $('#SummaryCommingBack .section-title').removeClass("hide");
					 $('#SummaryCommingBack .section-title span').removeClass("closed");
					 $('#SummaryCommingBack .section-title span').addClass("expand");
					 $('#SummaryCommingBack').removeClass('hide')
				}

				grandTotal=0;
				if($("#SummaryPrice #summaryGrandTotal0").length>0){
					grandTotal = grandTotal + Number($("#auxSummaryGrandTotal0").val());
				}
				if($("#SummaryPrice #summaryGrandTotal1").length>0){
					grandTotal =  grandTotal + Number($("#auxSummaryGrandTotal1").val());
				}


				grandTotalHTML = '<div>Total</div><span><b>'+dateMarket.getFormattedAnyPrice(grandTotal)+'</b></span><b> '+SkysalesObjSummaryPrice['currency']+'</b>';


				$('#SummaryPrice').removeClass("hide");
				//$('#PassengerList .section-title').next().remove();

				setTimeout(function(){
				//alert("entra");
				$('#PassengerList .section-title').next().remove();

				//$('#PassengerList .section-title').after(PassengersHTML);
				}, 500)

                $('#PassengerList').next().remove();
				$('#SectionsFlight').prev().remove();
				//$('#SectionsFlight').before('<div class="total">'+grandTotalHTML+'</div>');
				$('#SectionsFlight').next().remove();
				$('#SectionsFlight').after('<div class="total">'+grandTotalHTML+'</div>');

			//	$('#ModalLoadingFares').modal("hide")
			}
		}



        thisCalendarAvailabilityMarketBase.updateFareHandler = function (eventInfo) {
            thisCalendarAvailabilityMarketBase.updateFareEvent(eventInfo);
        };

        thisCalendarAvailabilityMarketBase.updateFare = function (dateMarketKey) {
            var dateMarket = this.dateMarketHash[dateMarketKey],
                html = '',
                price = ',',
                points = ',',
                amount = '',
                day = -1,
                month = -1,
                year = -1;

            if (dateMarket && (dateMarket.price >= 0 || dateMarket.points > 0)) {
                this.deactivateAllDateMarkets();
                dateMarket.activate();
                thisCalendarAvailabilityMarketBase.selectedDateMarket = dateMarket;
                html = this.selectedDateTemplate.text();
                html = SKYSALES.Util.replace(html, /\[formattedDate\]/, dateMarket.formattedDate);
                price = dateMarket.getFormattedPrice();
                points = SKYSALES.Util.convertToLocaleInteger(dateMarket.points);
                amount = SKYSALES.Util.formatAmount(price, points, dateMarket.pointsLabelAppend, dateMarket.pointsSuffix);
                html = SKYSALES.Util.replace(html, /\[amount\]/, amount);
                this.selectedDateContainer.html(html);
                year = parseInt(dateMarket.year, 10);
                this.inputYear.val(year);
                month = parseInt(dateMarket.month, 10) + 1;
                this.inputMonth.val(month);
                day = parseInt(dateMarket.day, 10);
                this.inputDay.val(day);
                this.availabilityInput.updateTotalAmount();
            }
        };

        thisCalendarAvailabilityMarketBase.selectInitialDateMarket = function () {
            var key = this.dateMarketPrefix + this.marketIndex + '_' + this.selectedDate;
            this.updateFare(key);
        };

        thisCalendarAvailabilityMarketBase.deactivateAllDateMarkets = function () {
            var selectedClass = this.selectedClass,
                dateMarketHash = this.dateMarketHash || {},
                key = '',
                dateMarket = null;

            for (key in dateMarketHash) {
                if (dateMarketHash.hasOwnProperty(key)) {
                    dateMarket = dateMarketHash[key];
                    dateMarket.deactivate(selectedClass);
                }
            }
        };

        thisCalendarAvailabilityMarketBase.initStartDate = function () {
            thisCalendarAvailabilityMarketBase.startDate = new Date(this.startYear, this.startMonth, this.startDay);
        };

        thisCalendarAvailabilityMarketBase.initEndDate = function () {
            thisCalendarAvailabilityMarketBase.endDate = new Date(this.endYear, this.endMonth, this.endDay);
        };

        thisCalendarAvailabilityMarketBase.initFirstBlockDate = function () {
            var startDate = this.startDate,
                newTime,
                dayOfWeek = startDate.getDay(),
                firstBlockDate = new Date();

            newTime = this.addDays(startDate, dayOfWeek * -1);
            firstBlockDate.setTime(newTime);
            thisCalendarAvailabilityMarketBase.firstBlockDate = firstBlockDate;
        };

        thisCalendarAvailabilityMarketBase.initLastBlockDate = function () {
            var daysInWeek = 7,
                endDate = this.endDate,
                dayOfWeek = endDate.getDay(),
                daysToAdd = daysInWeek - dayOfWeek,
                newTime = 0,
                lastBlockDate = new Date();

            newTime = this.addDays(endDate, daysToAdd);
            lastBlockDate.setTime(newTime);
            thisCalendarAvailabilityMarketBase.lastBlockDate = lastBlockDate;
        };

        thisCalendarAvailabilityMarketBase.getMarketHashKey = function (date) {
            date = date || new Date();
            var key = this.dateMarketPrefix + this.marketIndex + '_' + date.getFullYear() + '_' + date.getMonth() + '_' + date.getDate();
            return key;
        };

        thisCalendarAvailabilityMarketBase.initDateMarketHash = function () {
            var date = new Date(),
                stopDate = this.lastBlockDate,
                dateMarketHash = this.dateMarketHash || {},
                key = '',
                newTime = 0,
                dateMarket = null;
            date.setTime(this.firstBlockDate.getTime());
            while (date < stopDate) {
                key = this.getMarketHashKey(date);
                dateMarket = new SKYSALES.Class.CalendarAvailabilityDateMarket();
                dateMarket.market = this;
                dateMarketHash[key] = dateMarketHash[key] || {};
                dateMarket.init(dateMarketHash[key]);
                dateMarket.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                dateMarket.availableClass = this.availableClass;

                dateMarketHash[key] = dateMarket;

		         //Fix to date october 30. The same case in thisCalendarAvailabilityMarketBase.getMarketHtml
				DaysToAdd = ((((date.getMonth() + 1) == 10 && date.getDate() == 28 && date.getFullYear()) == 2018) || (((date.getMonth() + 1) == 10 && date.getDate() == 29 && date.getFullYear()) == 2017)) ?  1.1 : 1 ;

                newTime = this.addDays(date, DaysToAdd);
                date.setTime(newTime);
            }
        };

        thisCalendarAvailabilityMarketBase.getMonthName = function (month) {
            month = parseInt(month, 10);
            var monthName = '',
                resource = null,
                monthNames = null;
            resource = SKYSALES.Util.getResource();
            monthNames = resource.dateCultureInfo.monthNames;
            if (monthNames.length > month) {
                monthName = monthNames[month];
            }
            return monthName;
        };

        thisCalendarAvailabilityMarketBase.getDayNameArray = function () {
            var resource = null,
                dayNames = null;
            resource = SKYSALES.Util.getResource();
            dayNames = resource.dateCultureInfo.dayNamesShort || [];
            return dayNames;
        };

        thisCalendarAvailabilityMarketBase.supplantDayNames = function (html) {
            var dayNameArray = this.getDayNameArray(),
                i = 0,
                len = dayNameArray.length,
                dayNameRegex = null,
                dayNameStr = '',
                dayName = '';
            for (i = 0; i < len; i += 1) {
                dayName = dayNameArray[i];
                dayNameStr = '\\[daysOfWeek' + i + '\\]';
                dayNameRegex = new RegExp(dayNameStr);
                html = SKYSALES.Util.replace(html, dayNameRegex, dayName);
            }
            return html;
        };

        thisCalendarAvailabilityMarketBase.getHtml = function () {
            var html = '';
            if (this.startYear) {
                html = this.template.text();
            } else {
                html = this.noFlightsTemplate.text();
            }
            html = this.supplant(html);
            return html;
        };

        thisCalendarAvailabilityMarketBase.supplant = function (html) {
            html = html || '';
            var monthName = this.getMonthName(this.startMonth),
                marketHtml = '';

            html = SKYSALES.Util.replace(html, /\[startDateMonth\]/, monthName);
            html = SKYSALES.Util.replace(html, /\[startDateYear\]/, this.startYear);
            html = SKYSALES.Util.replace(html, /\[marketIndex\]/g, this.marketIndex);
            html = SKYSALES.Util.replace(html, /\[departureStation\]/, this.departureStation);
            html = SKYSALES.Util.replace(html, /\[arrivalStation\]/, this.arrivalStation);
            html = this.supplantDayNames(html);

            marketHtml = this.getMarketHtml();
            html = SKYSALES.Util.replace(html, /\[dateMarketHash\]/, marketHtml);
            return html;
        };

        thisCalendarAvailabilityMarketBase.getMarketHtml = function () {
            var html = '',
                htmlArray = [],
                date = new Date(),
                stopDate = this.lastBlockDate,
                dateMarketHash = this.dateMarketHash || {},
                key = '',
                newTime = 0,
                dateMarket = null,
                dateMarketHtml = '';

            date.setTime(this.firstBlockDate.getTime());

            while (date < stopDate) {
                key = this.getMarketHashKey(date);
                dateMarket = dateMarketHash[key];
                dateMarketHtml = dateMarket.getHtml();
                htmlArray.push(dateMarketHtml);

		        //Fix to date october 30. The same case in thisCalendarAvailabilityMarketBase.initDateMarketHash. If you have a problem
				//in October with a repeat day just change de date.getDate() for the repeated day!!! MAP 020512 ,
				DaysToAdd = ((((date.getMonth() + 1) == 10 && date.getDate() == 28 && date.getFullYear()) == 2018) || (((date.getMonth() + 1) == 10 && date.getDate() == 29 && date.getFullYear()) == 2017)) ?  1.1 : 1 ;

                newTime = this.addDays(date, DaysToAdd);
                date.setTime(newTime);
            }
            html = htmlArray.join('');
            return html;
        };

        thisCalendarAvailabilityMarketBase.addDays = function (origDate, numDays) {
            var time = origDate.getTime() + (numDays * 24 * 60 * 60 * 1000);
            return time;
        };

        thisCalendarAvailabilityMarketBase.getDateMarketArray = function () {
            var dateMarketHash = this.dateMarketHash || {},
                key = '',
                dateMarket = null,
                dateMarketArray = [];

            for (key in dateMarketHash) {
                if (dateMarketHash.hasOwnProperty(key)) {
                    dateMarket = dateMarketHash[key];
                    dateMarketArray.push(dateMarket);
                }
            }
            return dateMarketArray;
        };

        return thisCalendarAvailabilityMarketBase;
    };


    /*
    Name:
    Class CalendarAvailabilityMarket
    Param:
    None
    Return:
    An instance of CalendarAvailabilityMarket
    Functionality:
    Represents a single calendar in the low fare calendar view
    Notes:

    Class Hierarchy:
    SkySales -> CalendarAvailabilityMarketBase -> CalendarAvailabilityMarket
    */
    SKYSALES.Class.CalendarAvailabilityMarket = function () {
        var parent = new SKYSALES.Class.CalendarAvailabilityMarketBase(),
            thisCalendarAvailabilityMarket = SKYSALES.Util.extendObject(parent);

        thisCalendarAvailabilityMarket.availableClass = '';

        thisCalendarAvailabilityMarket.updateFareHandler = function (eventInfo) {
            thisCalendarAvailabilityMarket.updateFareEvent(eventInfo);
        };

        return thisCalendarAvailabilityMarket;
    };

    /*
    Name:
    Class TripPlannerCalendarAvailabilityMarket
    Param:
    None
    Return:
    An instance of TripPlannerCalendarAvailabilityMarket
    Functionality:
    Represents a single calendar in the low fare calendar view
    Notes:

    Class Hierarchy:
    SkySales -> CalendarAvailabilityMarketBase -> TripPlannerCalendarAvailabilityMarket
    */
    SKYSALES.Class.TripPlannerCalendarAvailabilityMarket = function () {
        var parent = new SKYSALES.Class.CalendarAvailabilityMarketBase(),
            thisTripPlannerCalendarAvailabilityMarket = SKYSALES.Util.extendObject(parent);

        thisTripPlannerCalendarAvailabilityMarket.datePickerManager = {};
        thisTripPlannerCalendarAvailabilityMarket.availableClass = 'available';

        thisTripPlannerCalendarAvailabilityMarket.updateDateDropDowns = function (eventInfo) {
            var dateMarketKey = this.getDateMarketKey(eventInfo),
                dateMarket = this.dateMarketHash[dateMarketKey],
                price = dateMarket.price,
                dateClicked = dateMarket.date;

            if (price) {
                this.datePickerManager.datePopulate(dateClicked);
                this.availabilityInput.container.hide();
            }
        };

        thisTripPlannerCalendarAvailabilityMarket.updateDateDropDownsHandler = function (eventInfo) {
            thisTripPlannerCalendarAvailabilityMarket.updateDateDropDowns(eventInfo);
        };

        thisTripPlannerCalendarAvailabilityMarket.addEvents = function () {
            this.container.click(this.updateDateDropDownsHandler);
        };

        return thisTripPlannerCalendarAvailabilityMarket;
    };

    /*
    Name:
    Class CalendarAvailabilityDateMarket
    Param:
    None
    Return:
    An instance of CalendarAvailabilityDateMarket
    Functionality:
    Represents a single day of a calendar in the low fare calendar view
    Notes:

    Class Hierarchy:
    SkySales -> CalendarAvailabilityDateMarket
    */
    SKYSALES.Class.CalendarAvailabilityDateMarket = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCalendarAvailabilityDateMarket = SKYSALES.Util.extendObject(parent);

        thisCalendarAvailabilityDateMarket.market = null;
		thisCalendarAvailabilityDateMarket.marketIndex = null;
        thisCalendarAvailabilityDateMarket.date = null;

        thisCalendarAvailabilityDateMarket.containerId = '';
        thisCalendarAvailabilityDateMarket.container = null;
        thisCalendarAvailabilityDateMarket.templateId = 'dateMarketTemplateId';
        thisCalendarAvailabilityDateMarket.template = null;
        thisCalendarAvailabilityDateMarket.defaultJourneyTemplateId = 'dateMarketJourneyDefaultTemplateId';
        thisCalendarAvailabilityDateMarket.defaultJourneyTemplate = null;

        thisCalendarAvailabilityDateMarket.price = null;
		thisCalendarAvailabilityDateMarket.baseFare = null; /*hgp*/
        thisCalendarAvailabilityDateMarket.discountBaseFareSRC = null; /*hgp*/
        thisCalendarAvailabilityDateMarket.discountBaseFareADT = null; /*hgp*/
        thisCalendarAvailabilityDateMarket.discountBaseFareACC = null; /*map*/
        thisCalendarAvailabilityDateMarket.discountBaseFareACD = null; /*map*/
        thisCalendarAvailabilityDateMarket.discountBaseFareACE = null; /*map*/
        thisCalendarAvailabilityDateMarket.discountBaseFareCHD = null; /*hgp*/
        thisCalendarAvailabilityDateMarket.discountBaseFareFREE = null; /*hgp*/
        thisCalendarAvailabilityDateMarket.discountBaseFareCNN = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.priceSRC = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.priceFREE = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.taxes = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.taxesSRC = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.taxesADT = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.taxesACC = null; /*map*/
		thisCalendarAvailabilityDateMarket.taxesACD = null; /*map*/
		thisCalendarAvailabilityDateMarket.taxesACE = null; /*map*/
		thisCalendarAvailabilityDateMarket.taxesCHD = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.taxesFREE = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.taxesCNN = null; /*hgp*/
		thisCalendarAvailabilityDateMarket.discountPorcent = null;/*hgp*/
		thisCalendarAvailabilityDateMarket.classOfService = null;/*hgp*/
		thisCalendarAvailabilityDateMarket.fareBasis = null;/*hgp*/
        thisCalendarAvailabilityDateMarket.formattedDate = '';
        thisCalendarAvailabilityDateMarket.year = -1;
        thisCalendarAvailabilityDateMarket.month = -1;
        thisCalendarAvailabilityDateMarket.day = -1;
        thisCalendarAvailabilityDateMarket.points = null;
        thisCalendarAvailabilityDateMarket.pointsSuffix = 'pts';
        thisCalendarAvailabilityDateMarket.pointsLabelAppend = ' & ';

        thisCalendarAvailabilityDateMarket.availableClass = 'available';

        thisCalendarAvailabilityDateMarket.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        thisCalendarAvailabilityDateMarket.setVars = function () {
            thisCalendarAvailabilityDateMarket.template = this.getById(this.templateId);
        };

        thisCalendarAvailabilityDateMarket.setVarsAfterDraw = function () {
            thisCalendarAvailabilityDateMarket.container = this.getById(this.containerId);
        };

        thisCalendarAvailabilityDateMarket.getFormattedPrice = function () {
            var price = this.price,
                formattedPrice = '';

            if (price !== null && price >= 0) {
                formattedPrice = SKYSALES.Util.convertToLocaleCurrency(price);
                if (formattedPrice === '') {
                    formattedPrice = price.toString();
                }
            }
            return formattedPrice;
        };

		thisCalendarAvailabilityDateMarket.getFormattedAnyPrice = function (price) {
            var formattedPrice = "";

            if (price !== null && price > 0) {

                formattedPrice = SKYSALES.Util.convertToLocaleCurrency(price);
                if (formattedPrice === "") {
                    formattedPrice = price.toString();
                }
            }
            return formattedPrice;
        };

        thisCalendarAvailabilityDateMarket.getHtml = function () {
            var html = this.template.text();
            html = this.supplant(html);
            return html;
        };

        thisCalendarAvailabilityDateMarket.daySupplantValue = function () {
            var market = this.market,
                nbsp = '&nbsp;',
                requestStartDate = market.requestStartDate,
                requestEndDate = market.requestEndDate,
                marketDate = this.date,
                day = marketDate.getDate();

            if (requestStartDate && requestEndDate) {
                if (requestStartDate && requestEndDate) {
                    if (marketDate < requestStartDate || marketDate > requestEndDate) {
                        day = nbsp;
                    }
                }
            }
            return day;
        };

        thisCalendarAvailabilityDateMarket.supplant = function (html) {
            var price = this.price,
				discountPorcent = this.discountPorcent,
				classOfService = this.classOfService,
				fareBasis = this.fareBasis,
                formattedPrice = this.getFormattedPrice(),
                priceString = '',
                marketDate = this.date,
                year = marketDate.getFullYear().toString(),
                twoDigitYear = '',
                month = marketDate.getMonth(),
                showMonth = 0,
				showMonthName = this.getMonthName(month),
                day = this.daySupplantValue(),
                market = this.market,
                availableClass = '',
                points = SKYSALES.Util.convertToLocaleInteger(this.points);


			    resource = SKYSALES.Util.getResource();
				decimalSeparator = resource.currencyCultureInfo.decimalSeparator;

				dateCultureInfo = resource.dateCultureInfo;

				var Sunday = '';
				Sunday = dateCultureInfo.dayNames[0]

				var CurrentDate = new Date();

            showMonth = month + 1;

            twoDigitYear = year.charAt(2) + year.charAt(3);

            html = SKYSALES.Util.replace(html, /\[day\]/g, day);
            html = SKYSALES.Util.replace(html, /\[month\]/g, month);
            //html = SKYSALES.Util.replace(html, /\[showMonth\]/g, showMonth);
			html = html.replace(/\[showMonth\]/g, showMonthName);
            html = SKYSALES.Util.replace(html, /\[year\]/g, year);
            html = SKYSALES.Util.replace(html, /\[twoDigitYear\]/g, twoDigitYear);
            html = SKYSALES.Util.replace(html, /\[marketIndex\]/g, market.marketIndex);

            if (price > 0) {
                availableClass = this.availableClass;
            }


			if (discountPorcent != null) {
    				var auxDiscount = discountPorcent;
    				var legend = '';

    				//No eliminar
    				auxDiscount = auxDiscount.replace('*SRC','<span class="discountSRC">');
    				auxDiscount = auxDiscount.replace('SRC*','</span>');

    				auxDiscount = auxDiscount.replace('*ADT','<span class="discountADT">');
    				auxDiscount = auxDiscount.replace('ADT*', '</span>');

    				auxDiscount = auxDiscount.replace('*ACC', '<span class="discountADT">');
    				auxDiscount = auxDiscount.replace('ACC*', '</span>');
    				auxDiscount = auxDiscount.replace('*ACD', '<span class="discountADT">');
    				auxDiscount = auxDiscount.replace('ACD*', '</span>');
    				auxDiscount = auxDiscount.replace('*ACE', '<span class="discountADT">');
    				auxDiscount = auxDiscount.replace('ACE*', '</span>');

    				auxDiscount = auxDiscount.replace('*CHD','<span class="discountCHD">');
    				auxDiscount = auxDiscount.replace('CHD*','</span>');

					auxDiscount = auxDiscount.replace('*CNN','<span class="discountCHD">');
    				auxDiscount = auxDiscount.replace('CNN*','</span>');


    				discountPorcent = "";


					if(auxDiscount.search(/-10/i) > 0){
						discountPorcent = "10%"
					}
					if(auxDiscount.search(/-15/i) > 0){
						discountPorcent = "15%"
					}
					if(auxDiscount.search(/-20/i) > 0){
						discountPorcent = "20%"
					}
					if(auxDiscount.search(/-25/i) > 0){
						discountPorcent = "25%"
					}
					if(auxDiscount.search(/-30/i) > 0){
						discountPorcent = "30%"
					}
					if(auxDiscount.search(/-35/i) > 0){
						discountPorcent = "35%"
					}
					if(auxDiscount.search(/-40/i) > 0){
						discountPorcent = "40%"
					}
					if(auxDiscount.search(/-45/i) > 0){
						discountPorcent = "45%"
					}
					if(auxDiscount.search(/-50/i) > 0){
						discountPorcent = "50%"
					}
					if(auxDiscount.search(/-55/i) > 0){
						discountPorcent = "55%"
					}
    				if(auxDiscount.search(/-60/i) > 0){
						discountPorcent = "60%"
					}
				    if(auxDiscount.search(/-70/i) > 0){
						discountPorcent = "70%"
					}
					if(auxDiscount.search(/-100/i) > 0){
						discountPorcent = ""
					}
					var iconPromo= '';
					if(auxDiscount.search(/-100/i) > 0){
						iconPromo = '<span class="v alentins-day"></span>';
					}

					if( classOfService == 'D' || classOfService == 'F' ){							
						discountPorcent = 'PROMO';
					}
					
					/*if( classOfService == 'Q' || classOfService == 'E' || classOfService == 'F' || classOfService == 'C' || discountPorcent!=""){							
						discountPorcent = 'outlet';
					}*/


					/*if(fareBasis == 'V4O' || fareBasis == 'X4O'){
						legend = 'PROMO';
					} 		*/

					//if(classOfService == 'T' || classOfService == 'Q' || classOfService == 'E'){
						//legend = 'PROMO';
					//}

					/*if(classOfService=='W' || classOfService == 'N'  || classOfService == 'R' ){
						html = html.replace(/\[discountPorcent\]/, "<span class='special-fare' />");
					}	*/

					/*if(classOfService=='C'){
						html = html.replace(/\[discountPorcent\]/, "<span class='special-far' />");
					}*/

					if(fareBasis.indexOf('ESALE2')>=0  ){
						 html = html.replace(/\[discountPorcent\]/, "");
					}

					html = html.replace(/\[discountPorcent\]/, '<span class="discount-percent">'+discountPorcent+"</span>")
						//promo word

					html = html.replace(/\[iconPromo\]/, iconPromo);

					if(legend == "PROMO"){
						html = html.replace(/\[PromoLegend\]/, '<span class="special-promo">PROMO</span>');
					}else{
						html = html.replace(/\[PromoLegend\]/, '');
					}


                }else{
    				html = html.replace(/\[discountPorcent\]/, '');
					html = html.replace(/\[PromoLegend\]/, '');
					html = html.replace(/\[iconPromo\]/, '');
    			}


            priceString = SKYSALES.Util.formatAmount(formattedPrice, points, this.pointsLabelAppend, this.pointsSuffix);
			var PriceToShow = '';
			if(price == '0.0001' && (Number(marketDate.getTime() > Number(CurrentDate.getTime())))){
				var SoldOutLegend = '';

				SoldOutLegend = (dateCultureInfo.dayNames[0].toUpperCase() == 'DOMINGO') ? 'Vendido' : 'Sold Out' ;

				 html = SKYSALES.Util.replace(html, /\[amount\]/g, '<span class="sold-out">'+SoldOutLegend+'</span>');
			}
			else if(price == '0.0002'){
				 html = SKYSALES.Util.replace(html, /\[amount\]/g, '<span class="sold-out">-</span>');
			}else{
				if(price=='0.0001'){
					html = SKYSALES.Util.replace(html, /\[amount\]/g, '');
				}else{
					html = SKYSALES.Util.replace(html, /\[amount\]/g, priceString.split(decimalSeparator)[0]);
				}
			}

            html = SKYSALES.Util.replace(html, /\[availableClass\]/g, availableClass);

            return html;
        };

        thisCalendarAvailabilityDateMarket.activate = function () {
            var selectedClass = this.market.selectedClass,
                availableClass = this.availableClass;
            this.container.removeClass(availableClass);
            this.container.addClass(selectedClass);
        };

        thisCalendarAvailabilityDateMarket.deactivate = function () {
            var selectedClass = this.market.selectedClass,
                availableClass = this.availableClass;

            this.container.removeClass(selectedClass);
            this.container.addClass(availableClass);
        };

		thisCalendarAvailabilityDateMarket.getMonthName = function (month) {
            month = parseInt(month, 10);
            var monthName = '',
                resource = null,
                monthNames = null;
            resource = SKYSALES.Util.getResource();
            monthNames = resource.dateCultureInfo.monthNamesShort;
            if (monthNames.length > month) {
                monthName = monthNames[month];
            }
            return monthName;
        };

        return thisCalendarAvailabilityDateMarket;
    };

    SKYSALES.Class.ItemDescriptions = function () { //container
        var parent = new SKYSALES.Class.SkySales(),
            thisItemDescriptions = SKYSALES.Util.extendObject(parent);

        thisItemDescriptions.itemDescriptionsArray = [];

        thisItemDescriptions.addLongDescriptions = function (longDescriptionParamObj) {
            var itemLongdescription = new SKYSALES.Class.ToggleView();
            itemLongdescription.init(longDescriptionParamObj);
        };

        thisItemDescriptions.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initItemDescriptionsArray();
        };

        thisItemDescriptions.initItemDescriptionsArray = function () {
            var i = 0,
                itemDescriptionsArray = this.itemDescriptionsArray || [],
                len = itemDescriptionsArray.length,
                itemDescription = null;
            for (i = 0; i < len; i += 1) {
                itemDescription = new SKYSALES.Class.ItemDescription();
                itemDescription.init(itemDescriptionsArray[i]);
                itemDescriptionsArray[i] = itemDescription;
            }
        };

        return thisItemDescriptions;
    };

    SKYSALES.Class.ItemDescription = function () {
        var parent = new SKYSALES.Class.ToggleView(),
            thisItemDescription = SKYSALES.Util.extendObject(parent);

        thisItemDescription.itemId = "";
        thisItemDescription.contentType = "";
        thisItemDescription.detailsAvailable = false;
        thisItemDescription.longDescription = "";
        thisItemDescription.noDescriptionAvailableMessage = "";
        thisItemDescription.messageDivId = "";
        thisItemDescription.messageDiv = null;
        thisItemDescription.itemKey = "";
        thisItemDescription.getItemDescriptionUri = "GetItemDescriptionAjax-resource.aspx";
        thisItemDescription.getItemDetailsUri = "GetItemDetails.aspx";
        thisItemDescription.ajaxParams = "";
        thisItemDescription.addressId = '';
        thisItemDescription.addressDom = null;
        thisItemDescription.infoNeeded = false;
        thisItemDescription.ratingCode = "";
        thisItemDescription.thumbFilename = "";
        thisItemDescription.itemName = "";

        thisItemDescription.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisItemDescription.setVars = function () {
            parent.setVars.call(this);
            thisItemDescription.messageDiv = this.getById(this.messageDivId);
            thisItemDescription.ajaxParams = {
                "itemKey": this.itemKey
            };
            thisItemDescription.longDescription = SKYSALES.Util.decodeUriComponent(thisItemDescription.longDescription);
            thisItemDescription.addressDom = this.getById(this.addressId);
        };

        thisItemDescription.updateShowHandler = function () {
            thisItemDescription.updateShow();
        };

        thisItemDescription.updateShow = function () {
            this.sendItemDescriptionRequest();
        };

        thisItemDescription.sendItemDescriptionRequest = function () {
            window.open(this.getItemDetailsUri + "?itemId=" + this.itemId +
                "&itemKey=" + this.itemKey +
                "&addressId=" + this.addressId +
                "&infoNeeded=" + this.infoNeeded +
                "&ratingCode=" + this.ratingCode +
                "&thumbFilename=" + this.thumbFilename +
                "&itemName=" + this.itemName, "mywindow", "status=1,resizable=1,scrollbars=1,location=1,width=750,height=600");
        };

        thisItemDescription.updateAddressHandler = function (data) {
            thisItemDescription.updateAddress(data);
        };

        thisItemDescription.updateAddress = function (data) {
            this.addressDom.html(data);
        };

        thisItemDescription.updateElement = function (message) {
            if (message.length > 0) {
                this.messageDiv.html(message);
            } else {
                this.messageDiv.html(thisItemDescription.noDescriptionAvailableMessage);
            }
        };

        thisItemDescription.getItemDescriptionHandler = function (data) {
            if (data.length > 0) {
                data = SKYSALES.Util.decodeUriComponent(data);
                thisItemDescription.longDescription = data;
            }
            thisItemDescription.updateElement(data);
            parent.updateShow.call(thisItemDescription);
        };

        return thisItemDescription;
    };

    SKYSALES.Class.ItemSummary = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisItemSummary = SKYSALES.Util.extendObject(parent);

        thisItemSummary.itemId = "";
        thisItemSummary.item = null;
        thisItemSummary.summaryId = "";
        thisItemSummary.summary = null;
        thisItemSummary.addressId_openerpage = "";
        thisItemSummary.addressId_samepage = "";
        thisItemSummary.address = null;
        thisItemSummary.addressValue = "";
        thisItemSummary.iframeId = "";
        thisItemSummary.iframe = null;
        thisItemSummary.iframeSrc = "";
        thisItemSummary.infoNeeded = "false";

        thisItemSummary.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.draw();
        };

        thisItemSummary.setVars = function () {
            parent.setVars.call(this);
            this.summary = this.getById(this.summaryId);
            this.iframe = this.getById(this.iframeId);
            if (this.infoNeeded === "false") {
                this.item = window.opener.$('#' + this.itemId);
                this.address = window.opener.$('#' + this.addressId_openerpage);
            } else {
                this.address = this.getById(this.addressId_samepage);
            }
        };

        thisItemSummary.draw = function () {
            var item = null,
                itemHtml = "",
                text = "",
                address = this.address,
                addressValue = this.addressValue;

            address.html(addressValue);

            if (this.infoNeeded === "false") {
                item = this.item.clone();

                item.find('p.openCloseLink').remove();
                item.find('div.itemDesc > h4').remove();
                item.find('div#additionalDetails').remove();
                text = item.find('div.itemDesc > h3').text();
                item.find('div.itemDesc > h3').replaceWith("<h3>" + text + "</h3>");
                item.find('div.itemDesc').attr('id', 'popupDesc');
                itemHtml = item.html();
                this.summary.html(itemHtml);
            }

            this.iframe.html('<iframe src=' + this.iframeSrc + ' width="750" height="400">a</iframe>');

        };

        return thisItemSummary;
    };

    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    taxAndFeeInclusiveDisplay.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */

    SKYSALES.taxAndFeeInclusiveDisplayDataRequestHandler = function taxAndFeeInclusiveDisplayDataRequestHandler(keys, markets) {


        var keyDelimiter = ',',
            params = {
                "flightKeys": keys.join(keyDelimiter),
                "numberOfMarkets": markets,
                "keyDelimeter": keyDelimiter
            },
            addAllUpPricingEvents = null,
            allUpPricingToggleView = null,
            allUpPricingToggleViewJson = null,
            updateTaxAndFeeInclusiveDivBodyHandler = null;

        addAllUpPricingEvents = function () {
            if (SKYSALES.common) {
                SKYSALES.common.stripeTables();
            }
            allUpPricingToggleView = new SKYSALES.Class.ToggleView();
            allUpPricingToggleViewJson = {
                "elementId": "allUpPricing",
                "hideId": "closeTotalPrice",
                "showId": "taxAndFeeInclusiveTotal"
            };
            allUpPricingToggleView.init(allUpPricingToggleViewJson);
			$('[data-toggle=tooltip]').tooltip();
			$('.link-popover').click(function (e) {
				$('.link-popover').not(this).popover('hide');
				e.preventDefault();
			});
        };

        updateTaxAndFeeInclusiveDivBodyHandler = function (data) {			

            if (window.$) {
				$('#PurchaseDetailList').html($(data).find('#PriceDetailList'))
                $('#PurchaseDetailTable').html($(data).find('#PriceDetailTable'))

				JsonResponse = $(data).find('#RequestObject');
				if(JsonResponse.length>0){
    				var ResponseObject = $.parseJSON(JsonResponse.text().replace(/(<([^>]+)>)/ig, ''))
                    
                    
                    $.each( ResponseObject['Markets'], function( key, value ) {
                                              
                       $('#InfoContainerMarket_'+key+' .time').html(value.DepartureTime)                                                
                        $('#HiddenInfoContainerMarket_'+key+' .date').html(value.DepartureDate)                                                                       
                       $('#HiddenInfoContainerMarket_'+key+' .time').html(value.DepartureTime)                                                                       
                                                
                    });

                    var PaxDetail = '';
                    $.each(ResponseObject['Passengers'],function(key, value){
                        if(value.PaxCount>0){
                            PaxDetail +=  value.PaxCount+' '+value.PaxType + ', ';
                            
                        }
                    })        
                    PaxDetail = PaxDetail.substring(0, PaxDetail.length-2);

                    //$('.info_container .passengers').html(ResponseObject['PassengersCount']);                      
                    //$('.info_container .pass_detail').html(PaxDetail)    

                    $('#SummaryTotalPrice').html(ResponseObject["TotalPrice"])
                    $('#SummaryTotalPrice').append('<span>'+ResponseObject["CurrencyCode"]+'</span>')
                    
                    
                }
            }

			addAllUpPricingEvents();
		$('.left-section-detail .section-title').click(function(){
			$(this).next().toggle('fast');
			if($(this).find('span').hasClass("closed")){
				$(this).find('span').removeClass("closed");
				$(this).find('span').addClass("expand");
			}else{
				$(this).find('span').removeClass("expand");
				$(this).find('span').addClass("closed");
			}
		})
			$('#ModalLoadingFares').modal("hide");
        };

		var allowAjax = true;

		if(allowAjax == true){
            
			$.get('NewTaxAndFeeInclusiveDisplayAjax-resource.aspx', params, updateTaxAndFeeInclusiveDivBodyHandler);
		}

    };


// MAX REDESIGN CHANGES
	SKYSALES.memberLoginHandler = function memberLoginHandler () {
    // INIT
    $('#TextBoxUserID_container').removeClass('incorrect');
    $('#PasswordFieldNewPassword_container').removeClass('incorrect');
    $('#PasswordFieldConfirmNewPassword_container').removeClass('incorrect');
    $('#login-butt').removeAttr('disable', 'disable');

    var loginType = 0
    if ($('#ReEnterPassword').attr('display') == 'none') {
      var data = {'TextBoxUserID': $('#TextBoxUserID').val(), 'PasswordFieldPassword': $('#PasswordFieldPassword').val() }
    }else {
      var data = {'TextBoxUserID': $('#TextBoxUserID').val(), 'PasswordFieldPassword': $('#PasswordFieldPassword').val(),  'PasswordFieldNewPassword': $('#PasswordFieldNewPassword').val()}
    }

    $.ajax({
      type: 'POST',
      url: 'MemberLoginInputAjax-resource.aspx',
      data: data,
      beforeSend: function () {}
    }).done(function (data, msg) {
      JsonResponse = data.replace(/(<([^>]+)>)/ig, '')

        if (/^[\],:{}\s]*$/.test(JsonResponse.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        var ResponseObject = $.parseJSON(JsonResponse)
        $('#LoginModal .progress-bar').remove()
        if (ResponseObject['LogonResponse']['code'] == 'SUCCESS') {
          $('#LoginModal').modal('hide')
          window.location = window.location.pathname + '?culture=' + ResponseObject['LogonResponse']['cultureCode']
        }else {
          if (ResponseObject['LogonResponse']['code'] == 'RESETPASS') {
            $('#ReEnterPassword').css('display', 'block')
            $('#register-box').css('display', 'none')
            $('#register-box').css('display', 'none')
            $('#login-butt').attr('disabled', 'disabled')
          }else {
            $('#TextBoxUserID_container').addClass('incorrect')
            $('#PasswordFieldPassword_container').addClass('incorrect')
            if ($('#ReEnterPassword').attr('display') == 'block') {
              $('#PasswordFieldNewPassword_container').addClass('incorrect')
            }
          }
        }
      }else {
        $('#InputsSectionLogin').css('display', 'none')
        $('#SessionExpiredMessage').css('display', 'block')
      }
    }).fail(function (jqXHR, textStatus) {})
  }
  // MAX REDESIGN CHANGES
	
	SKYSALES.AvailabilityHandler = function AvailabilityHandler(DepartureStation, ArrivalStation) {
		$("#TermsAndBannerContainer").append
		   	   var modalHtml =	'<div class="modal fade" id="ModalLoadingFares" tabindex="-1" role="dialog" aria-hidden="true">'
				modalHtml += '<div class="modal-dialog">';
				modalHtml += '<div class="progress">';
				modalHtml += '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">45% Complete</span></div>';
				modalHtml += '</div>';
				modalHtml += '</div>';
				modalHtml += '</div>';
				//$('#mainContent').find('#TermsAndBannerContainer').remove();
				$('#TermsAndBannerContainer').append(modalHtml);
				$('#ModalLoadingFares').modal("show")
		
		
	
		var loginType=0;
		var data={"DepartureStation": DepartureStation, "ArrivalStation": ArrivalStation }


        $.ajax({
		  type: "POST",
		  url: "AvailabilityAjax-resource.aspx",
		  data: data,
		  beforeSend: function(){
			$('#LoginError').addClass("hidden");
			$('#LoginModal .progress-bar').remove();
			$('#TextBoxUserID').before('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
		   }
		}).done(function( data, msg ) {
			 JsonResponse = data.replace(/(<([^>]+)>)/ig,"")

			if (/^[\],:{}\s]*$/.test(JsonResponse.replace(/\\["\\\/bfnrtu]/g, '@').
				replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
				replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
					 var ResponseObject = $.parseJSON(JsonResponse);
					//console.log(ResponseObject);
						
					$("select[id*='_DropDownListMarketMonth1']").val(ResponseObject["DateWithDiscount"]["YEAR"]+"-"+ResponseObject["DateWithDiscount"]["MONTH"]).trigger('change');
					$("select[id*='_DropDownListMarketDay1']").val(ResponseObject["DateWithDiscount"]["DAY"]).trigger('change');
					$('input[id*="TextBoxMarketOrigin1"]').val(DepartureStation);
					$('input[id*="TextBoxMarketDestination1"]').val(ArrivalStation);					 
					$('select[id*="_DropDownListFareTypes"]').val("O");					 
					//$('select[id*="__DropDownListPaxDiscount"]').val("O");	

					$("#OriginStation").val(ResponseObject["DateWithDiscount"]["DEPARTURESTATION"]);
					$("#DestinationStation").val(ResponseObject["DateWithDiscount"]["ARRIVALSTATION"])						
										
					$('input[id*="OneWay"]:radio').click();
					$('input[id*="RoundTrip"]:radio').attr('checked',false);
					$('input[id*="RoundTrip"]:radio').attr('disabled',true);
				 				  
				   document.getElementById("AvailabilitySearchInputCalendarSelectGenericPromoL16View_ButtonSubmit").click();				   
						
			}else{
					$('#InputsSectionLogin').css("display","none");
					$('#SessionExpiredMessage').css("display","block");
			}

		}).fail(function( jqXHR, textStatus ) {
			//console.log("error")
		});
    };

	SKYSALES.SendToLowestFare = function SendToLowestFare(DepartureStation, DepartureStationDesc, ArrivalStation, ArrivalStationDesc, DateOfLowestDate) {
			
			var PartsOfDate = DateOfLowestDate.split(" ");
			
			$("select[id*='_DropDownListMarketMonth1']").val(PartsOfDate[0]+"-"+PartsOfDate[1]).trigger('change');
			$("select[id*='_DropDownListMarketDay1']").val(PartsOfDate[2]).trigger('change');
			$("select[id*='_DropDownListSearchBy']").val("columnView").trigger('change');
			
			$('input[id*="TextBoxMarketOrigin1"]').val(DepartureStation);
			$('input[id*="TextBoxMarketDestination1"]').val(ArrivalStation);					 

			$("#OriginStation").val(DepartureStationDesc)					
			$("#DestinationStation").val(ArrivalStationDesc)						
								
			$('input[id*="OneWay"]:radio').click();
			$('input[id*="RoundTrip"]:radio').attr('checked',false);
			$('input[id*="RoundTrip"]:radio').attr('disabled',true);
			
		    //document.getElementById(IdSkySalesClient+"_ButtonSubmit").click();
									  
			$('input[id*="_ButtonSubmit"]').click();
	}	
	
	// MAX REDESIGN CHANGES
	 SKYSALES.forgotPasswordHandler = function forgotPasswordHandler () {
    $.ajax({
      type: 'POST',
      url: 'ForgotPasswordInputAjax-resource.aspx',
      data: {'TextBoxUserID': $('#TextBoxForgotPassword').val()},
      beforeSend: function () {
        $('#ForgotPasswordError').addClass('hidden')
      }
    }).done(function (data, msg) {
      JsonResponse = data.replace(/(<([^>]+)>)/ig, '')
      var ResponseObject = $.parseJSON(JsonResponse)
      $('#LoginModal .progress-bar').remove()
      $('#ForgotPasswordError').removeClass('hidden')
      $('#ForgotPasswordError').html(ResponseObject['ForgotPasswordResponse']['desc'])
    }).fail(function (jqXHR, textStatus) {})
  }
  // MAX REDESIGN CHANGES

		SKYSALES.FindBooking = function FindBooking(ActionType) {

		if(ActionType=='CheckIn'){
			var auxData = {"TextBoxRecordLocator": $('#TextBoxRecordLocatorCheckIn').val(), "TextBoxFirstName": $('#TextBoxFirstNameCheckIn').val(), "TextBoxLastName": $('#TextBoxLastNameCheckIn').val(), "TextBoxActionType":ActionType}
		}else{
			var auxData = {"TextBoxRecordLocator": $('#TextBoxRecordLocatorMyBooking').val(), "TextBoxFirstName": $('#TextBoxFirstNameMyBooking').val(), "TextBoxLastName": $('#TextBoxLastNameMyBooking').val(), "TextBoxActionType":ActionType}
		}

        $.ajax({
		  type: "POST",
		  url: "FindBookingInputAjax-resource.aspx",
		  data: auxData,
		  beforeSend: function(){
			$('#tab-search3 .progress-bar').remove();
			if(ActionType=='CheckIn'){
				$('#PaneCheckIn').before('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
			}else{
				$('#PaneMyBooking').before('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
			}
		   }
		}).done(function( data, msg ) {

			 JsonResponse = data.replace(/(<([^>]+)>)/ig,"")
			 var ResponseObject = $.parseJSON(JsonResponse);
			 //console.log(ResponseObject);
			 $('#tab-search3 .progress-bar').remove();
			 $('#tab-search3 .response-ajax').remove();
			 if(ActionType=='CheckIn'){
				if(ResponseObject["FindBookingResponse"]["code"]=='FOUND'){
				  window.location = 'ViewFlight.aspx';
				}else{
					$('#PaneCheckIn').after('<div class="response-ajax alert alert-warning marg-top-10">'+ResponseObject["FindBookingResponse"]["desc"]+'</div>');
				}
			 }else{
				if(ResponseObject["FindBookingResponse"]["code"]=='FOUND'){
				  window.location = 'ItineraryRead.aspx';			
				}else if(ResponseObject["FindBookingResponse"]["code"]=='FOUNDAMADEUS'){
				 // window.location = 'https://testinterline.interjet.com.mx/Booking/Retrieve?RL='+ResponseObject["FindBookingResponse"]["RecordLocator"]+'&FN='+ResponseObject["FindBookingResponse"]["FirstName"]+'&LN='+ResponseObject["FindBookingResponse"]["LastName"]+''
				window.location = 'https://interline.interjet.com.mx/Booking/Retrieve?RL='+ResponseObject["FindBookingResponse"]["RecordLocator"]+'&FN='+ResponseObject["FindBookingResponse"]["FirstName"]+'&LN='+ResponseObject["FindBookingResponse"]["LastName"]+''				
				}				
				else{
					$('#PaneMyBooking').after('<div class="response-ajax alert alert-warning marg-top-10">'+ResponseObject["FindBookingResponse"]["desc"]+'</div>');
				}
			 }

		}).fail(function( jqXHR, textStatus ) {
			//console.log("has ocurred an error")
		});
    };

		SKYSALES.FindBookingA = function FindBookingA(ActionType) {

		if(ActionType=='CheckIn'){
			var auxData = {"TextBoxRecordLocator": $('#TextBoxRecordLocatorCheckIn').val(), "TextBoxFirstName": $('#TextBoxFirstNameCheckIn').val(), "TextBoxLastName": $('#TextBoxLastNameCheckIn').val(), "TextBoxActionType":ActionType}
		}else{
			var auxData = {"TextBoxRecordLocator": $('#TextBoxRecordLocatorMyBooking').val(), "TextBoxFirstName": $('#TextBoxFirstNameMyBooking').val(), "TextBoxLastName": $('#TextBoxLastNameMyBooking').val(), "TextBoxActionType":ActionType}
		}

        $.ajax({
		  type: "POST",
		  url: "FindAmadeusInputAjax-resource.aspx",
		  data: auxData,
		  beforeSend: function(){
			$('#tab-search3 .progress-bar').remove();
			if(ActionType=='CheckIn'){
				$('#PaneCheckIn').before('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
			}else{
				$('#PaneMyBooking').before('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
			}
		   }
		}).done(function( data, msg ) {

			 JsonResponse = data.replace(/(<([^>]+)>)/ig,"")
			 var ResponseObject = $.parseJSON(JsonResponse);
			 //console.log(ResponseObject);
			 $('#tab-search3 .progress-bar').remove();
			 $('#tab-search3 .response-ajax').remove();
			 if(ActionType=='CheckIn'){
				if(ResponseObject["FindBookingResponse"]["code"]=='FOUND'){
				  window.location = 'ViewFlight.aspx';
				}else{
					$('#PaneCheckIn').after('<div class="response-ajax alert alert-warning marg-top-10">'+ResponseObject["FindBookingResponse"]["desc"]+'</div>');
				}
			 }else{
				if(ResponseObject["FindBookingResponse"]["code"]=='FOUND'){
				  window.location = 'ItineraryRead.aspx';			
				}else if(ResponseObject["FindBookingResponse"]["code"]=='FOUNDAMADEUS'){
				 // window.location = 'https://testinterline.interjet.com.mx/Booking/Retrieve?RL='+ResponseObject["FindBookingResponse"]["RecordLocator"]+'&FN='+ResponseObject["FindBookingResponse"]["FirstName"]+'&LN='+ResponseObject["FindBookingResponse"]["LastName"]+''
				window.location = 'https://interline.interjet.com.mx/Booking/Retrieve?RL='+ResponseObject["FindBookingResponse"]["RecordLocator"]+'&FN='+ResponseObject["FindBookingResponse"]["FirstName"]+'&LN='+ResponseObject["FindBookingResponse"]["LastName"]+''				
				}				
				else{
					$('#PaneMyBooking').after('<div class="response-ajax alert alert-warning marg-top-10">'+ResponseObject["FindBookingResponse"]["desc"]+'</div>');
				}
			 }

		}).fail(function( jqXHR, textStatus ) {
			//console.log("has ocurred an error")
		});
    };
	
	SKYSALES.FindBookingByRecordLocator = function FindBookingByRecordLocator(ActionType) {

		var auxData = {"TextBoxRecordLocator": $('#TextBoxRecordLocator').val()}	
		console.log(auxData);
        $.ajax({
		  type: "POST",
		  url: "RetrieveBookingInputAjax-resource.aspx",
		  data: auxData,
		  beforeSend: function(){
			$('#tab-search3 .progress-bar').remove();			
				$('#PaneMyBooking').before('<div id="ProgressBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
		}
		}).done(function( data, msg ) {

			 JsonResponse = data.replace(/(<([^>]+)>)/ig,"")
			 var ResponseObject = $.parseJSON(JsonResponse);
			 console.log(ResponseObject);				
				if(ResponseObject["RetrieveBookingResponse"]["code"]=='FOUND'){
				  window.location = 'RecordLocatorPassengers.aspx';
				}else{
					if (ResponseObject["RetrieveBookingResponse"]["code"]=='RESERVACION NO VALIDA'){						
						$('#ModalPNR').modal("show");
						$("#ProgressBar.active").remove();
						
					}else{						
						$("#ProgressBar.active").remove();
						$('#PaneMyBooking').after('<div class="response-ajax alert alert-warning marg-top-10">'+ResponseObject["FindBookingResponse"]["desc"]+'</div>');
					}	
				}					

		}).fail(function( jqXHR, textStatus ) {
			//console.log("has ocurred an error")
		});
    };


	
	
    /*
    Name:
    Class AvailabilityInputBase
    Param:
    None
    Return:
    An instance of AvailabilityInputBase
    Functionality:
    The object that keeps track of the pop-up windows showing the flight information in the availablity screens
    Notes:
    The journeyInfoList is set down to the browser via JSON that is created in the XSLT file.
    The XSLT creates a new SKYSALES.Class.AvailabilityInputBase and then sets the SKYSALES.availabilityInput.journeyInfoList
    property to an array of JourneyInfo objects. It then calls SKYSALES.AvailabilityInputBase.init

    Class Hierarchy:
    SkySales -> AvailabilityInputBase
    */
    SKYSALES.Class.AvailabilityInputBase = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisAvailabilityInputBase = SKYSALES.Util.extendObject(parent);

        thisAvailabilityInputBase.journeyInfoArray = [];
        thisAvailabilityInputBase.journeyInfoList = [];

        thisAvailabilityInputBase.init = function (json) {
            this.setSettingsByObject(json);
            this.initJourneyInfoContainers();
        };

        thisAvailabilityInputBase.initJourneyInfoContainers = function () {
            var i = 0,
                journeyInfoList = this.journeyInfoList || [],
                journeyInfo = {};
            for (i = 0; i < journeyInfoList.length; i += 1) {
                journeyInfo = new SKYSALES.Class.JourneyInfo();
                journeyInfo.init(journeyInfoList[i]);
                this.journeyInfoArray.push(journeyInfo);
            }
        };

        return thisAvailabilityInputBase;
    };

    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    availabilityInput.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */

    /*
    Dependencies:
    This file depends on other JavaScript files to be there at run time.

    jquery.js:
    $ is a jquery variable
    common.js:
    SKYSALES namespace is used to avoid name collisions.
    TaxAndFeeInclusiveDisplay.js
    Calls taxAndFeeInclusiveDisplayDataRequestHandler

    General Notes:
    This JavaScript is used with the AvailabilityInput control

    */

    /*
    Name:
    Class AvailabilityInput
    Param:
    None
    Return:
    An instance of AvailabilityInput
    Functionality:
    The object that initializes the AvailabilityInput control
    Notes:
    The journeyInfoList is set down to the browser via JSON that is created in the XSLT file.
    The XSLT creates a new SKYSALES.Class.AvailabilityInput and then sets the parent class's journeyInfoList
    property to an array of JourneyInfo objects during init.
    This class also attemps to call taxAndFeeInclusiveDisplayDataRequestHandler that is in TaxAndFeeInclusiveDisplay.js
    Class Hierarchy:
    SkySales -> AvailabilityInputBase -> AvailabilityInput
    */

    SKYSALES.Class.AvailabilityInput = function () {
        var parent = new SKYSALES.Class.AvailabilityInputBase(),
            thisAvailabilityInput = SKYSALES.Util.extendObject(parent);

        thisAvailabilityInput.detailsLinks = null;
        thisAvailabilityInput.dateMarketLowestFareList = [];
        thisAvailabilityInput.dateMarketLowestFareArray = [];

        thisAvailabilityInput.getPriceItineraryInfo = function () {
            if (SKYSALES.taxAndFeeInclusiveDisplayDataRequestHandler) {

                //var markets = $("#selectMainBody .availabilityTable tr td[class^='fareCol'] :radio['checked]"), fixhgp
				var markets = $(".schedule-container input:checked"),
                    keys = [];
					
                $(markets).each(function (i) {
                    keys[i] = $(this).val();
                });

				
                SKYSALES.taxAndFeeInclusiveDisplayDataRequestHandler(keys, markets.length);
            }
        };
        thisAvailabilityInput.showPreselectedFares = function (keyArray) {
            var keyIndex = 0;
            for (keyIndex = 0; keyIndex < keyArray.length; keyIndex += 1) {
                if (keyArray[keyIndex] !== null) {
                    this.getById(keyArray[keyIndex]).click();
                }
            }
        };

        thisAvailabilityInput.updateFareSelectedHandler = function () {

            var id = this.id || '';
            thisAvailabilityInput.updateFareSelected(id);

        };

        thisAvailabilityInput.updateFareSelected = function (id) {

            this.getPriceItineraryInfo();
            this.updateFareRules(id);
        };

        thisAvailabilityInput.updateFareRuleSelected = function (id) {
            this.updateFareRules(id);
        };

        thisAvailabilityInput.updateFareRules = function (id) {


            var regex = /(RadioButtonMkt[0-9]+Fare[0-9]+)$/,
                matchArray = [],
                fareId = '',
                fareRuleKey = '',
                journeyInfoArray = this.journeyInfoArray || [],
                journeyInfoIndex = 0,
                journeyInfoLength = journeyInfoArray.length,
                journeyInfo = null,
                fareArray = null,
                fareArrayIndex = 0,
                fareArrayLength = 0,
                fare = null,
                fareRuleContainer = SKYSALES.Util.getFareRuleContainer();

			//console.log(fareRuleContainer);
            if (fareRuleContainer && id) {
                matchArray = regex.exec(id) || [];

                if (matchArray.length > 1) {

                    fareId = matchArray[1];

                    journeyLoop:
                    for (journeyInfoIndex = 0; journeyInfoIndex < journeyInfoLength; journeyInfoIndex += 1) {

                        journeyInfo = journeyInfoArray[journeyInfoIndex];

                        fareArray = journeyInfo.fareArray || [];
                        fareArrayLength = fareArray.length;
                        for (fareArrayIndex = 0; fareArrayIndex < fareArrayLength; fareArrayIndex += 1) {
                            fare = fareArray[fareArrayIndex];

                            if (fareId === fare.fareId) {
                                fareRuleKey = fare.fareRuleKey;

                                if (fareRuleKey) {

                                    fareRuleContainer.updateFareRule(journeyInfo.marketIndex, fareRuleKey);
                                }
                                break journeyLoop;
                            }
                        }
                    }
                }
            }
        };

         thisAvailabilityInput.addGetPriceItineraryInfoEvents = function () {
            $(".schedule-container  :radio").click(this.updateFareSelectedHandler);
        };
        thisAvailabilityInput.ajaxEquipmentProperties = function () {

        };
        thisAvailabilityInput.addEquipmentPropertiesAjaxEvent = function () {
            $(this).click(thisAvailabilityInput.ajaxEquipmentProperties);
        };
        thisAvailabilityInput.addEquipmentPropertiesAjaxEvents = function () {
            thisAvailabilityInput.detailsLinks.each(thisAvailabilityInput.addEquipmentPropertiesAjaxEvent);
        };
        thisAvailabilityInput.addEvents = function () {
            thisAvailabilityInput.addGetPriceItineraryInfoEvents();
            thisAvailabilityInput.addEquipmentPropertiesAjaxEvents();
        };
        thisAvailabilityInput.setVars = function () {
            thisAvailabilityInput.detailsLinks = $('.showContent');
        };

        thisAvailabilityInput.initLowestPriceSelection = function () {
            var dateMarketLowestFareInfo = null,
                dateMarketLowestFareList = this.dateMarketLowestFareList,
                i = 0;
            for (i = 0; i < dateMarketLowestFareList.length; i += 1) {
                dateMarketLowestFareInfo = new SKYSALES.Class.LowestFareInfo();
                dateMarketLowestFareInfo.init(dateMarketLowestFareList[i]);
                thisAvailabilityInput.dateMarketLowestFareArray[thisAvailabilityInput.dateMarketLowestFareArray.length] = dateMarketLowestFareInfo;
                this.updateFareSelected(dateMarketLowestFareInfo.lowestFareControlId);
            }
        };
        thisAvailabilityInput.init = function (json) {
            parent.init.call(this, json);
            this.setSettingsByObject(json);

            if (SKYSALES.taxAndFeeInclusiveDisplayDataRequestHandler) {
                this.setVars();
                this.addEvents();
            }
            //mark the radio buttons of the lowest fares as checked
            //this.initLowestPriceSelection(); fixhgp
            //get itinerary price based on lowest fares checked
            if (SKYSALES.taxAndFeeInclusiveDisplayDataRequestHandler) {
                this.getPriceItineraryInfo();
            }
        };
        return thisAvailabilityInput;
    };

    /*
    Name:
    Class LowestFareInfo
    Param:
    None
    Return:
    an instance of LowestFareInfo
    Functionality:
    The object that initializes the LowestFareInfo control
    Notes:
    The LowestFareInfo is sent down to the browser via JSON that is created in the XSLT file.
    The XSLT creates a new SKYSALES.availabilityInput.dateMarketLowestFareList and then the
    SKYSALES.availabilityInput.init function calls the SKYSALES.availabilityInput.initLowestPriceSelection which will
    select the radio button sent down as the lowest fare control id.This class also attemps to call
    taxAndFeeInclusiveDisplayDataRequestHandler that is in TaxAndFeeInclusiveDisplay.js
    Class Hierarchy:
    AvailabilityInput
    */

    SKYSALES.Class.LowestFareInfo = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisLowestFareInfo = SKYSALES.Util.extendObject(parent);

        thisLowestFareInfo.tripMarketIndex = '';
        thisLowestFareInfo.marketIndex = '';
        thisLowestFareInfo.dateMarketIndex = '';
        thisLowestFareInfo.lowestFareControlId = "";
        thisLowestFareInfo.lowestFareControl = null;
        thisLowestFareInfo.lowestFareSellKey = '';
        thisLowestFareInfo.lowestJourneySellKey = '';

        thisLowestFareInfo.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.selectDateMarketLowestFare();
        };
        thisLowestFareInfo.setVars = function () {
            parent.setVars.call(this);
            var key = this.lowestFareSellKey + '|' + this.lowestJourneySellKey;

           //thisLowestFareInfo.lowestFareControl = $('input[value =' + key + ']', this.container);			 fixhgp
		   thisLowestFareInfo.lowestFareControl = $('input[value ="' + key + '"]', this.container);
		   //console.log(thisLowestFareInfo.lowestFareControl);
        };

        thisLowestFareInfo.selectDateMarketLowestFare = function () {
            var lowestFare = this.lowestFareControl || {};

            if (lowestFare) {

                lowestFare.attr('checked', 'checked');
            }
        };
        return thisLowestFareInfo;
    };

    /*
    Name:
    Class JourneyInfo
    Param:
    None
    Return:
    An instance of JourneyInfo
    Functionality:
    The object that represents the journey information on the AvailabilityInput control
    Notes:
    When the user clicks a link to view more details about the flight it gets the data and shows it in a floating div.
    It uses AJAX to get data about the equipment that the journey will use.
    The AJAX response sends the equipment data in the form of a JSON object.
    Class Hierarchy:
    AvailabilityInput
    */
    SKYSALES.Class.JourneyInfo = function () {
        var parent = new SKYSALES.Class.SkySales(),

            thisJourneyInfo = SKYSALES.Util.extendObject(parent);
        thisJourneyInfo.equipmentInfoUri = 'EquipmentPropertiesDisplayAjax-resource.aspx';
        thisJourneyInfo.key = '';
        thisJourneyInfo.journeyContainerId = "";
        thisJourneyInfo.activateJourneyId = "";
        thisJourneyInfo.activateJourney = null;
        thisJourneyInfo.deactivateJourneyId = "";
        thisJourneyInfo.deactivateJourney = null;
        thisJourneyInfo.journeyContainer = null;
        thisJourneyInfo.legInfoArray = [];
        thisJourneyInfo.clientName = 'EquipmentPropertiesDisplayControlAjax';
        thisJourneyInfo.fareArray = {};
        thisJourneyInfo.marketIndex = -1;

        thisJourneyInfo.init = function (paramObject) {
            this.setSettingsByObject(paramObject);
            this.setVars();
            this.addEvents();
        };
        thisJourneyInfo.setVars = function () {
            thisJourneyInfo.journeyContainer = this.getById(thisJourneyInfo.journeyContainerId);
            thisJourneyInfo.activateJourney = this.getById(thisJourneyInfo.activateJourneyId);
            thisJourneyInfo.deactivateJourney = this.getById(thisJourneyInfo.deactivateJourneyId);
        };
        thisJourneyInfo.addEvents = function () {
            thisJourneyInfo.activateJourney.click(thisJourneyInfo.show);
            thisJourneyInfo.deactivateJourney.click(thisJourneyInfo.hide);
        };

        thisJourneyInfo.showWithDataHandler = function (data) {
            thisJourneyInfo.showWithData(data);
        };
        thisJourneyInfo.showWithData = function (data) {
            var legInfoStr = $(data).html(),
                legInfoJson = SKYSALES.Json.parse(legInfoStr),
                legInfoHash = legInfoJson.legInfo,
                legInfo = null,
                prop = '',
                propertyContainer = null,
                propertyHtml = '',
                equipmentPropertyArray = null,
                len = -1,
                i = 0,
                equipmentProperty = null,
                propertyValue = '';

            for (prop in legInfoHash) {
                if (legInfoHash.hasOwnProperty(prop)) {
                    propertyHtml = '';
                    legInfo = legInfoHash[prop];
                    if (legInfo.legIndex !== undefined) {
                        propertyContainer = this.getById('propertyContainer_' + thisJourneyInfo.key + '_' + legInfo.legIndex);
                        equipmentPropertyArray = legInfo.equipmentPropertyArray;
                        len = equipmentPropertyArray.length;

                        for (i = 0; i < len; i += 1) {
                            equipmentProperty = equipmentPropertyArray[i];
                            propertyValue = equipmentProperty.value;
                            if (propertyValue) {
                                propertyValue = ': ' + propertyValue;
                            }
                            propertyHtml += '<div>' + '<p>' + equipmentProperty.name + propertyValue + '<\/p>' + '<\/div>';
                        }
                        propertyContainer.html(propertyHtml);
                    }
                }
            }
            this.journeyContainer.show('slow');
        };
        thisJourneyInfo.show = function () {
            var legInfoArray = thisJourneyInfo.legInfoArray,
                legInfo = null,
                postHash = {},
                prop = '',
                i = 0,
                propName = thisJourneyInfo.clientName;
            for (i = 0; i < legInfoArray.length; i += 1) {
                legInfo = legInfoArray[i];
                for (prop in legInfo) {
                    if (legInfo.hasOwnProperty(prop)) {
                        postHash[propName + '$legInfo_' + prop + '_' + i] = legInfo[prop];
                    }
                }
            }
            $.post(thisJourneyInfo.equipmentInfoUri, postHash, thisJourneyInfo.showWithDataHandler);
        };
        thisJourneyInfo.hide = function () {
            thisJourneyInfo.journeyContainer.hide();
        };
        return thisJourneyInfo;
    };

    SKYSALES.Util.getFareRuleContainer = function () {
        var fareRuleContainer = SKYSALES.common.fareRuleContainer;
        return fareRuleContainer;
    };

    /*
    Name:
    Class FareRule
    Param:
    None
    Return:
    An instance of FareRule
    Functionality:
    The object that represents a single fare rule
    Notes:
    Class Hierarchy:
    SkySales -> FareRule
    */
    SKYSALES.Class.FareRuleContainer = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisFareRuleContainer = SKYSALES.Util.extendObject(parent);

        thisFareRuleContainer.fareRuleArray = [];
        thisFareRuleContainer.containerId = '';

        thisFareRuleContainer.init = function (paramObject) {
            this.setSettingsByObject(paramObject);
            SKYSALES.common.fareRuleContainer = this;
        };
        thisFareRuleContainer.updateFareRule = function (marketIndex, fareRuleKey) {

            marketIndex = parseInt(marketIndex, 10);
            marketIndex += 1;
            var fareRuleArray = this.fareRuleArray || [],
                i = 0,
                len = fareRuleArray.length,
                fareRule = null,
                rule = '',
                defaultRuleKey = 'default_' + marketIndex,
                fareRuleKeyList = [],
                j = 0,
                arrayLen = 0,
                ruleNode = null;

		//fixhgp
          for (i = 0; i < len; i += 1) {
                fareRule = fareRuleArray[i];
                fareRuleKeyList = fareRule.key.fareRuleKeyList || [];

                arrayLen = fareRule.key.length;

                // loop through list of fare rule keys
                for (j = 0; j < arrayLen; j += 1) {
                    if (fareRule.key === fareRuleKey.toLowerCase()) {
                        rule = fareRule.rule;
                        break;
                    }
                }
            }

          /*  for (i = 0; i < len; i += 1) {
                fareRule = fareRuleArray[i];
                fareRuleKeyList = fareRule.key.fareRuleKeyList || [];
                arrayLen = fareRuleKeyList.length;

                // loop through list of fare rule keys
                for (j = 0; j < arrayLen; j += 1) {
                    if (fareRuleKeyList[j] === fareRuleKey.toLowerCase()) {
                        rule = fareRule.rule;
                        break;
                    }
                }
            }*/
            if (!rule) {
                for (i = 0; i < len; i += 1) {
                    fareRule = fareRuleArray[i];
                    if (fareRule.key === defaultRuleKey) {
                        rule = fareRule.rule;
                        break;
                    }
                }
            }
            ruleNode = this.getById('fareRule' + marketIndex);

            ruleNode.html(rule);
        };
        return thisFareRuleContainer;
    };



    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    ssrPassengerInput.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */

    /*
    Name:
    Class SsrPassengerInput
    Param:
    None
    Return:
    An instance of SsrPassengerInput
    Functionality:
    This class represents an SsrPassengerInput
    It is used to sell ssrs at any point in the booking flow
    Notes:
    Class Hierarchy:
    SkySales -> SsrPassengerInput
    */
    SKYSALES.Class.SsrPassengerInput = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisSsrPassengerInput = SKYSALES.Util.extendObject(parent);

        thisSsrPassengerInput.ssrFormArray = null;
        thisSsrPassengerInput.ssrFeeArray = null;
        thisSsrPassengerInput.errorMsgOverMaxPerPassenger = 'There has been an error';
        thisSsrPassengerInput.ssrButtonIdArray = null;
        thisSsrPassengerInput.ssrButtonArray = null;
        thisSsrPassengerInput.buttonTrackId = "";
        thisSsrPassengerInput.buttonTrack = null;

        thisSsrPassengerInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            $('table.ssrSoldContainer :input', this.container).attr("disabled", "disabled");
        };

        thisSsrPassengerInput.setVars = function () {
            thisSsrPassengerInput.buttonTrack = this.getById(this.buttonTrackId);
            thisSsrPassengerInput.ssrButtonIdArray = this.ssrButtonIdArray || [];
            var ssrButtonArray = [],
                i = 0,
                ssrButton = null,
                ssrButtonId = '';
            for (i = 0; i < this.ssrButtonIdArray.length; i += 1) {
                ssrButtonId = this.ssrButtonIdArray[i];
                ssrButton = this.getById(ssrButtonId);
                if (ssrButton.length > 0) {
                    ssrButtonArray[ssrButtonArray.length] = ssrButton;
                }
            }
            thisSsrPassengerInput.ssrButtonArray = ssrButtonArray;
        };

        thisSsrPassengerInput.addEvents = function () {
            this.addButtonClickedEvents();
        };

        thisSsrPassengerInput.addButtonClickedEvents = function () {
            var i = 0,
                ssrButton = null;
            for (i = 0; i < this.ssrButtonArray.length; i += 1) {
                ssrButton = this.ssrButtonArray[i];
                ssrButton.click(this.updateButtonTrackHandler);
            }
        };

        thisSsrPassengerInput.updateButtonTrackHandler = function () {
            thisSsrPassengerInput.buttonTrack.val(this.id);
        };

        thisSsrPassengerInput.setSettingsByObject = function (json) {
            parent.setSettingsByObject.call(this, json);

            var i = 0,
                ssrFormArray = this.ssrFormArray || [],
                ssrForm = null,
                ssrFeeArray = this.ssrFeeArray || [],
                ssrFee = null;

            for (i = 0; i < ssrFormArray.length; i += 1) {
                ssrForm = new SKYSALES.Class.SsrForm();
                ssrForm.index = i;
                ssrForm.ssrPassengerInput = this;
                ssrForm.init(ssrFormArray[i]);
                ssrFormArray[i] = ssrForm;
            }

            for (i = 0; i < ssrFeeArray.length; i += 1) {
                ssrFee = new SKYSALES.Class.SsrFormFee();
                ssrFee.index = i;
                ssrFee.ssrPassengerInput = this;
                ssrFee.init(ssrFeeArray[i]);
                ssrFeeArray[i] = ssrFee;
            }
        };

        thisSsrPassengerInput.deactivateSsrFormNotes = function () {
            var i = 0,
                ssrFormArray = this.ssrFormArray,
                ssrForm = null;

            for (i = 0; i < ssrFormArray.length; i += 1) {
                ssrForm = ssrFormArray[i];
                ssrForm.deactivateNoteDiv();
            }
        };
        return thisSsrPassengerInput;
    };



    /*
    Name:
    Class SsrForm
    Param:
    None
    Return:
    An instance of SsrForm
    Functionality:
    An SsrForm represents a row on the SsrPassengerInput
    Notes:
    Class Hierarchy:
    SkySales -> SsrForm
    */
    SKYSALES.Class.SsrForm = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisSsrForm = SKYSALES.Util.extendObject(parent);

        thisSsrForm.maximumDropDownLimit = 0;
        thisSsrForm.ssrPassengerId = '';
        thisSsrForm.ssrPassenger = null;
        thisSsrForm.ssrCodeId = '';
        thisSsrForm.ssrCode = null;
        thisSsrForm.ssrQuantityId = '';
        thisSsrForm.ssrQuantity = null;
        thisSsrForm.ssrNoteId = '';
        thisSsrForm.ssrNote = null;
        thisSsrForm.ssrNoteIframeId = '';
        thisSsrForm.ssrNoteIframe = null;
        thisSsrForm.ssrNoteCloseId = '';
        thisSsrForm.ssrNoteClose = null;
        thisSsrForm.ssrNoteDivId = '';
        thisSsrForm.ssrNoteDiv = null;
        thisSsrForm.ssrNoteImageId = '';
        thisSsrForm.ssrNoteImage = null;
        thisSsrForm.ssrNoteCancelId = '';
        thisSsrForm.ssrNoteCancel = null;
        thisSsrForm.ssrFlightId = '';
        thisSsrForm.ssrFlight = null;
        thisSsrForm.ssrAmountId = '';
        thisSsrForm.ssrAmount = null;
        thisSsrForm.ssrCurrencyId = '';
        thisSsrForm.ssrCurrency = null;
        thisSsrForm.index = -1;
        thisSsrForm.ssrPassengerInput = null;

        thisSsrForm.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.updateSsrAmount();
        };

        thisSsrForm.setVars = function () {
            thisSsrForm.ssrNote = this.getById(this.ssrNoteId);
            thisSsrForm.ssrNoteDiv = this.getById(this.ssrNoteDivId);
            thisSsrForm.ssrNoteClose = this.getById(this.ssrNoteCloseId);
            thisSsrForm.ssrNoteCancel = this.getById(this.ssrNoteCancelId);
            thisSsrForm.ssrNoteImage = this.getById(this.ssrNoteImageId);
            thisSsrForm.ssrNoteIframe = this.getById(this.ssrNoteIframeId);
            thisSsrForm.ssrQuantity = this.getById(this.ssrQuantityId);
            thisSsrForm.ssrPassenger = this.getById(this.ssrPassengerId);
            thisSsrForm.ssrCode = this.getById(this.ssrCodeId);
            thisSsrForm.ssrCurrency = this.getById(this.ssrCurrencyId);
            thisSsrForm.ssrFlight = this.getById(this.ssrFlightId);
            thisSsrForm.ssrAmount = this.getById(this.ssrAmountId);
        };

        thisSsrForm.addEvents = function () {
            this.addNoteEvents();
            this.addQuantityEvents();
            this.addSSRCodeEvents();
            this.addFlightEvents();
        };

        thisSsrForm.addFlightEvents = function () {
            this.ssrFlight.change(this.updateSsrAmountHandler);
        };

        thisSsrForm.updateSsrQuantityHandler = function () {
            thisSsrForm.updateSsrQuantity();
        };

        thisSsrForm.updateSsrAmountHandler = function () {
            thisSsrForm.updateSsrAmount();
        };

        thisSsrForm.addSSRCodeEvents = function () {
            this.ssrCode.change(this.updateSsrQuantityHandler);
            this.ssrCode.change(this.updateSsrAmountHandler);
        };

        thisSsrForm.addQuantityEvents = function () {
            this.ssrQuantity.change(this.updateSsrAmountHandler);
            this.ssrQuantity.blur(this.updateSsrAmountHandler);
        };

        thisSsrForm.updateSsrAmount = function () {
            var ssrAmount = this.ssrAmount,
                ssrAmountFormatted = SKYSALES.Util.convertToLocaleCurrency('0.00'),
                ssrPassengerValue = this.ssrPassenger.val(),
                ssrCodeValue = this.ssrCode.val(),
                ssrQuantityValue = this.ssrQuantity.val(),
                re = /^[0-9]+$/,
                j = 0,
                ssrPassengerInput = this.ssrPassengerInput,
                ssrFeeArray = ssrPassengerInput.ssrFeeArray,
                ssrFee = null,
                ssrFlightValue = '',
                amount = 0;

            ssrAmount.val(ssrAmountFormatted);
            ssrQuantityValue = $.trim(ssrQuantityValue);

            if (re.test(ssrQuantityValue)) {
                ssrFlightValue = this.ssrFlight.val();

                for (j = 0; j < ssrFeeArray.length; j += 1) {
                    ssrFee = ssrFeeArray[j];

                    if ((ssrFlightValue === "all") || (ssrFlightValue === ssrFee.segmentKey)) {
                        if ((ssrPassengerValue === ssrFee.passengerNumber) && (ssrCodeValue === ssrFee.ssrCode)) {
                            amount += (ssrFee.amount * ssrQuantityValue);
                        }
                    }
                }
                ssrAmountFormatted = SKYSALES.Util.convertToLocaleCurrency(amount);
                ssrAmount.val(ssrAmountFormatted);
            } else {
                this.ssrQuantity.val(0);
            }
        };

        thisSsrForm.updateSsrQuantity = function () {
            var maximumDropDownLimit = this.maximumDropDownLimit,
                ssrPassengerValue = this.ssrPassenger.val(),
                ssrCodeValue = this.ssrCode.val(),
                ssrFlightValue = this.ssrFlight.val(),
                i = 0,
                j = 0,
                ssrPassengerInput = this.ssrPassengerInput,
                ssrFeeArray = ssrPassengerInput.ssrFeeArray,
                ssrFee = null,
                ssrQuantityValue = this.ssrQuantity.val(),
                maxPerPassenger = 0,
                newOpt = null,
                ssrQuantityInput = this.ssrQuantity[0];

            maximumDropDownLimit = window.parseInt(maximumDropDownLimit, 10);
            ssrQuantityValue = parseInt(ssrQuantityValue, 10);

            for (i = 0; i < ssrFeeArray.length; i += 1) {
                ssrFee = ssrFeeArray[i];
                if ((ssrFlightValue === "all") || (ssrFlightValue === ssrFee.segmentKey)) {
                    if ((ssrPassengerValue === ssrFee.passengerNumber) && (ssrCodeValue === ssrFee.ssrCode)) {
                        maxPerPassenger = parseInt(ssrFee.maxPerPassenger, 10);
                        if (maxPerPassenger === 0) {
                            maxPerPassenger = maximumDropDownLimit;
                            maxPerPassenger = parseInt(maxPerPassenger, 10);
                            if (ssrQuantityValue >= maxPerPassenger) {
                                maxPerPassenger = ssrQuantityValue;
                                maxPerPassenger = maxPerPassenger + 1;
                            }
                        }

                        if (ssrQuantityInput.options) {

                            while (ssrQuantityInput.options.length > 0) {
                                ssrQuantityInput.options[0] = null;
                            }

                            for (j = 0; j <= maxPerPassenger; j += 1) {
                                newOpt = new window.Option(j, j);
                                ssrQuantityInput.options[j] = newOpt;
                                if (ssrQuantityValue === j) {
                                    this.ssrQuantity.val(j);
                                }
                            }
                        }

                        if (ssrQuantityValue > maxPerPassenger) {
                            this.ssrQuantity.val(maxPerPassenger);
                            alert(this.getErrorMsgOverMaxPerPassenger());
                        } else {
                            this.ssrQuantity.val(ssrQuantityValue);
                        }
                    }
                }
            }
        };

        thisSsrForm.getErrorMsgOverMaxPerPassenger = function () {
            var retVal = '';
            retVal = this.ssrPassengerInput.errorMsgOverMaxPerPassenger;
            return retVal;
        };

        thisSsrForm.clearAndDeactivateNoteDiv = function () {
            var ssrNote = this.ssrNote,
                isDisabled = ssrNote.is(':disabled');

            if (isDisabled === false) {
                ssrNote.val('');
            }
            this.deactivateNoteDiv();
        };

        thisSsrForm.deactivateNoteDiv = function () {
            this.ssrNoteDiv.hide();
            this.ssrNoteIframe.hide();
        };

        thisSsrForm.activateNoteDiv = function () {
            // Reset the floating ssrNote divs
            this.ssrPassengerInput.deactivateSsrFormNotes();

            var ssrNoteImage = this.ssrNoteImage[0],
                dhtml = SKYSALES.Dhtml(),
                left = dhtml.getX(ssrNoteImage),
                top = dhtml.getY(ssrNoteImage),
                isDisabled = false;

            this.ssrNoteDiv.css('left', left + 'px');
            this.ssrNoteDiv.css('top', top + 'px');
            this.ssrNoteDiv.show();

            this.ssrNoteIframe.css('left', left + 'px');
            this.ssrNoteIframe.css('top', top + 'px');
            this.ssrNoteIframe.show();

            isDisabled = this.ssrNote.is(':disabled');
            if (isDisabled === false) {
                this.ssrNote.click();
            }
        };

        thisSsrForm.ssrNoteCancelHandler = function () {
            thisSsrForm.clearAndDeactivateNoteDiv();
        };

        thisSsrForm.ssrNoteCloseHandler = function () {
            thisSsrForm.deactivateNoteDiv();
        };

        thisSsrForm.ssrNoteImageHandler = function () {
            thisSsrForm.activateNoteDiv();
        };

        thisSsrForm.addNoteEvents = function () {
            this.ssrNoteCancel.mouseup(this.ssrNoteCancelHandler);
            this.ssrNoteClose.mouseup(this.ssrNoteCloseHandler);
            this.ssrNoteImage.mouseup(this.ssrNoteImageHandler);
        };
        return thisSsrForm;
    };

    /*
    Name:
    Class SsrFormFee
    Param:
    None
    Return:
    An instance of SsrFormFee
    Functionality:
    An SsrForm represents a fee that is used to show the amount for an SsrForm
    Notes:
    Class Hierarchy:
    SkySales -> SsrFormFee
    */
    SKYSALES.Class.SsrFormFee = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisSsrFormFee = SKYSALES.Util.extendObject(parent);

        thisSsrFormFee.journeyIndex = -1;
        thisSsrFormFee.segmentIndex = -1;
        thisSsrFormFee.segmentKey = '';
        thisSsrFormFee.passengerNumber = -1;
        thisSsrFormFee.ssrCode = '';
        thisSsrFormFee.feeCode = '';
        thisSsrFormFee.amount = 0;
        thisSsrFormFee.currencyCode = '';
        thisSsrFormFee.maxPerPassenger = 0;
        thisSsrFormFee.index = -1;
        thisSsrFormFee.ssrPassengerInput = null;

        return thisSsrFormFee;
    };

    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    passengerInput.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */
    /*
    Dependencies:
    This file depends on other JavaScript files to be there at run time.

    jquery.js:
    $ is a jquery variable
    common.js:
    SKYSALES namespace is used to avoid name collisions.

    General Notes:
    This is the base file for passengerInput view
    */

    /*
    Name:
    Class PassengerApis
    Param:
    None
    Return:
    An instance of PassengerApis
    Functionality:
    The object that represents the contact data to populate any passenger on the passenger view
    Notes:
    Class Hierarchy:
    SkySales -> PassengerApis
    */
    SKYSALES.Class.PassengerApis = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassengerApis = SKYSALES.Util.extendObject(parent);

        thisPassengerApis.toggleViewIdArray = [];

        thisPassengerApis.init = function (json) {
            this.setSettingsByObject(json);

            var toggleViewIdArray = this.toggleViewIdArray || [],
                i = 0,
                toggleView = null,
                len = toggleViewIdArray.length;

            for (i = 0; i < len; i += 1) {
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdArray[i]);
                if (toggleView.show.is(':checked')) {
                    toggleView.updateShow();
                }
            }
        };

        return thisPassengerApis;
    };


    /*
    Name:
    Class ContactData
    Param:
    None
    Return:
    An instance of ContactData
    Functionality:
    The object that represents the contact data to populate any passenger on the passenger view
    Notes:
    Class Hierarchy:
    SkySales -> ContactData
    */
    SKYSALES.Class.ContactData = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisContactData = SKYSALES.Util.extendObject(parent);

        thisContactData.passengerContactDataArray = [];

        thisContactData.title = '';
        thisContactData.gender = '';
        thisContactData.firstName = '';
        thisContactData.middleName = '';
        thisContactData.lastName = '';
        thisContactData.customerNumber = '';
        thisContactData.birthDay = '';
        thisContactData.birthMonth = '';
        thisContactData.birthYear = '';
        thisContactData.nationality = '';
        thisContactData.residentCountry = '';
        thisContactData.programCode = '';
        thisContactData.programNumber = '';

        thisContactData.init = function (json) {
            this.setSettingsByObject(json);
            this.initPassengerContactDataArray();
            this.setVars();
            this.addEvents();
        };

        thisContactData.initPassengerContactDataArray = function () {
            var i = 0,
                passengerContactData = {},
                passengerContactDataArray = this.passengerContactDataArray || [],
                len = passengerContactDataArray.length;

            for (i = 0; i < len; i += 1) {
                passengerContactData = new SKYSALES.Class.PassengerContactData();
                passengerContactData.contactData = this;
                passengerContactData.init(passengerContactDataArray[i]);
                passengerContactDataArray[i] = passengerContactData;
            }
        };
        return thisContactData;
    };

    /*
    Name:
    Class PassengerContactData
    Param:
    None
    Return:
    An instance of PassengerContactData
    Functionality:
    The object that represents a single passenger on the passenger view so it can be populated when clicking i am this traveller
    Notes:
    Class Hierarchy:
    SkySales -> PassengerContactData
    */
    SKYSALES.Class.PassengerContactData = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassengerContactData = SKYSALES.Util.extendObject(parent);

        thisPassengerContactData.actionId = '';
        thisPassengerContactData.action = null;
        thisPassengerContactData.passengerNumber = -1;
        thisPassengerContactData.contactData = null;

        thisPassengerContactData.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisPassengerContactData.setVars = function () {
            thisPassengerContactData.action = this.getById(this.actionId);
        };

        thisPassengerContactData.addEvents = function () {
            this.action.click(this.populatePassengerHandler);
        };

        thisPassengerContactData.populatePassengerHandler = function () {
            thisPassengerContactData.populatePassenger(this, thisPassengerContactData.passengerNumber);
        };

        thisPassengerContactData.populatePassenger = function (object, index) {
            var passengerFields = null,
                fieldIdentifiers = null,
                isChecked = false,
                contactData = this.contactData,
                fieldsetIndex = -1;

            //Don't even do anything unless contactData is available
            if (contactData) {
                //get the fieldset that has all the fields for the passenger passed in
                fieldsetIndex = index - 1;
                passengerFields = $('#passengerInputContent>fieldset:eq(' + index + ')');
                //these are the items that are maped to the contactData item included in the passengerFields control
                fieldIdentifiers = [
                    {
                        "name": "DropDownListTitle",
                        "value": contactData.title
                    },
                    {
                        "name": "TextBoxFirstName",
                        "value": contactData.firstName
                    },
                    {
                        "name": "TextBoxMiddleName",
                        "value": contactData.middleName
                    },
                    {
                        "name": "TextBoxLastName",
                        "value": contactData.lastName
                    },
                    {
                        "name": "TextBoxCustomerNumber",
                        "value": contactData.customerNumber
                    },
                    {
                        "name": "DropDownListBirthDateDay",
                        "value": contactData.birthDay
                    },
                    {
                        "name": "DropDownListBirthDateMonth",
                        "value": contactData.birthMonth
                    },
                    {
                        "name": "DropDownListBirthDateYear",
                        "value": contactData.birthYear
                    },
                    {
                        "name": "DropDownListGender",
                        "value": contactData.gender
                    },
                    {
                        "name": "DropDownListNationality",
                        "value": contactData.nationality
                    },
                    {
                        "name": "DropDownListResidentCountry",
                        "value": contactData.residentCountry
                    },
                    {
                        "name": "TextBoxProgramNumber",
                        "value": contactData.programNumber
                    },
                    {
                        "name": "DropDownListProgram",
                        "value": contactData.programCode
                    }
                ];

                isChecked = $('#' + object.id).is(':checked');
                if (isChecked) {
                    $.map(fieldIdentifiers, function (obj) {
                        if (obj) {
                            $(":input[id*=" + obj.name + "]", passengerFields).val(obj.value);
                        }
                    });
                } else {
                    $.map(fieldIdentifiers, function (obj) {
                        if (obj) {
                            $(":input[id*=" + obj.name + "]", passengerFields).val('');
                        }
                    });
                }

            }
        };
        return thisPassengerContactData;
    };

    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    flightStatus.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */
    SKYSALES.Class.CityText = function (textNode) {
        this.textNode = textNode;
        this.x = textNode.getAttribute('x');
        this.y = textNode.getAttribute('y');
        this.stringLength = 0;
        this.endX = 0;
        this.endY = 0;
        this.errorCount = 0;
        this.svgImage = document.getElementById('flightStatusImageId');
        this.svgImageWidth = this.svgImage.getAttribute('width');
        this.svgImageHeight = this.svgImage.getAttribute('height');
        this.midX = 0;

        this.moveText = function () {
            if (this.errorCount === 0) {
                this.alignCenter();
                // place the city name relative to the city
                this.placeRelativeToCity();
                this.nudgeIntoPlace();
            } else {
                this.handleError();
            }
        };

        this.alignCenter = function () {
            this.midX = this.getStringLength() / 2;
            this.setX((this.getX() - this.midX));
            this.textNode.setAttribute("x", (this.getX()));
        };

        this.nudgeIntoPlace = function () {
            // Adjust for long city names, or cities in the east
            while ((this.getEndX() + 165) >= this.svgImageWidth) {
                this.setX((this.getX() - 1));
                this.textNode.setAttribute("x", this.getX());
            }

            // Adjust for cities in the west
            while ((this.getX()) <= 1) {
                this.setX((this.getX() + 1));
                this.textNode.setAttribute("x", this.getX());
            }

            // Adjust for cities in the north
            while ((this.getY()) <= 10) {
                this.setY((this.getY() + 1));
                this.textNode.setAttribute("y", this.getY());
            }

            // Adjust for cities in the south
            while ((this.getY() + 165) >= this.svgImageHeight) {
                this.setY((this.getY() - 1));
                this.textNode.setAttribute("y", this.getY());
            }
        };

        this.placeRelativeToCity = function () {
            var direction = 'top';
            if ((this.getY()) <= 10) {
                direction = 'bottom';
            }
            if (direction === 'bottom') {
                this.setY((this.getY() + 3));
            } else {
                // Default to top
                this.setY((this.getY() - 3));
            }
            this.textNode.setAttribute("y", this.getY());
        };

        this.setY = function (yIn) {
            this.y = yIn;
        };

        this.getY = function () {
            return parseInt(this.y, 10);
        };

        this.setX = function (xIn) {
            this.x = xIn;
        };

        this.getX = function () {
            return parseInt(this.x, 10);
        };

        this.getEndX = function () {
            if (this.errorCount === 0) {
                this.endX = this.getX() + this.getStringLength();
                if (this.endX === this.getX()) {
                    this.handleError();
                }
                return this.endX;
            }
            this.handleError();
        };

        this.getY = function () {
            return parseInt(this.y, 10);
        };

        this.getStringLength = function () {
            if (this.errorCount === 0) {
                if (!this.stringLength) {
                    this.stringLength = this.textNode.getComputedTextLength();
                    if (this.stringLength === 0) {
                        this.handleError();
                    }
                }
                return this.stringLength;
            }
            this.handleError();
        };

        this.handleError = function () {
            if (this.errorCount === 0) {
                this.x = parseInt(this.x, 10) - 20;
                textNode.setAttribute('x', this.x);
            }
            this.errorCount += 1;
        };
    };

    SKYSALES.Class.FlightPath = function (objectId, rotateId, currentLeg, percentageComplete) {
        this.objectId = objectId;
        this.object = document.getElementById(objectId);
        this.rotateId = rotateId;
        this.rotate = document.getElementById(rotateId);
        this.currentLeg = currentLeg.toLowerCase();
        this.currentLegArray = this.currentLeg.split('_');
        this.origin = document.getElementById(this.currentLegArray[0]);
        this.destination = document.getElementById(this.currentLegArray[1]);
        this.originX = parseInt(this.origin.getAttribute('cx'), 10);
        this.originY = parseInt(this.origin.getAttribute('cy'), 10);
        this.destinationX = parseInt(this.destination.getAttribute('cx'), 10);
        this.destinationY = parseInt(this.destination.getAttribute('cy'), 10);
        this.percentageComplete = percentageComplete;
        this.distance = null;
        this.distanceTraveled = null;
        this.slope = null;
        this.positionX = null;
        this.positionY = null;

        this.moveToCurrentPosition = function () {
            var obj = this.getObject();
            obj.setAttributeNS(null, 'transform', 'translate(' + this.getPositionX() + ',' + this.getPositionY() + ')');
        };

        this.moveToCurrentRotation = function () {
            var dx = this.destinationX - this.originX,
                dy = this.destinationY - this.originY,
                angle = 0.0,
                rotate_amount = 0,
                rotate_string = '';

            if (dx < 0.0) {
                angle = Math.atan(this.getSlope()) + Math.PI;
            } else if (dy < 0.0) {
                angle = Math.atan(this.getSlope()) + (2 * Math.PI);
            } else {
                angle = Math.atan(this.getSlope());
            }
            rotate_amount = (angle * 180) / Math.PI;
            rotate_amount = rotate_amount + 180;
            rotate_string = 'rotate(' + rotate_amount + ')';
            this.rotate.setAttributeNS(null, 'transform', rotate_string);
        };

        this.getCurrentPosition = function () {
            var currentDistance = 0,
                currentX = this.originX,
                currentY = this.originY,
                b = 0;

            if (this.percentageComplete > 0) {

                while (currentDistance <= this.getDistanceTraveled()) {
                    // b is the b in y = mx + b
                    // where x and y is the point (x,y)
                    // m = slope and b is the y intercept
                    b = currentY - (this.getSlope() * currentX);
                    if (this.originX > this.destinationX) {
                        currentX = currentX - 1;
                    } else {
                        currentX = currentX + 1;
                    }
                    currentY = (currentX * this.getSlope()) + b;
                    currentDistance = Math.sqrt(Math.pow((currentX - this.originX), 2) + Math.pow((currentY - this.originY), 2));
                    //setTimeout();
                    //alert("CURRENT: " + currentDistance + " DISTANCE TRAVELED: " + this.getDistanceTraveled());
                }
                //alert('(' + currentX + ',' + currentY + ')');
                this.positionX = currentX;
                this.positionY = currentY;
            } else {
                this.positionX = this.originX;
                this.positionY = this.originY;
            }
        };

        this.getObject = function () {
            if (!this.object) {
                this.object = document.getElementById(objectId);
            }
            return this.object;
        };

        this.getRotate = function () {
            if (!this.rotate) {
                this.rotate = document.getElementById(rotateId);
            }
            return this.rotate;
        };

        this.getPositionX = function () {
            if (this.percentageComplete <= 0) {
                this.positionX = this.destinationX;
            }
            return this.positionX;
        };

        this.getPositionY = function () {
            if (this.percentageComplete <= 0) {
                this.positionY = this.destinationY;
            }
            return this.positionY;
        };

        this.getSlope = function () {
            if (!this.slope) {
                this.slope = ((this.destinationY - this.originY) / (this.destinationX - this.originX));
            }
            return this.slope;
        };

        this.getDistance = function () {
            if (!this.distance) {
                this.distance = Math.sqrt(Math.pow((this.destinationX - this.originX), 2) + Math.pow((this.destinationY - this.originY), 2));
            }
            return this.distance;
        };

        this.getDistanceTraveled = function () {
            if (!this.distanceTraveled) {
                this.distanceTraveled = this.distance * (this.percentageComplete * 0.01);
            }
            return this.distanceTraveled;
        };

        this.setCurrentPosition = function () {
            this.getDistance();
            this.getDistanceTraveled();
            this.getSlope();
            this.getCurrentPosition();
        };

        this.setCurrentPosition();
    };

    SKYSALES.Util.calculatePosition = function (objectId, rotateId, currentLeg, percentageComplete) {
        var flightPath = new SKYSALES.Class.FlightPath(objectId, rotateId, currentLeg, percentageComplete);
        flightPath.moveToCurrentPosition();
        flightPath.moveToCurrentRotation();
    };

    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    bookingRetrieveInput.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */
    /*
    Name:
    Class ControlGroupBookingRetrieve
    Param:
    None
    Return:
    An instance of ControlGroupBookingRetrieve
    Functionality:
    Handles a ControlGroupBookingRetrieve validation
    Notes:

    Class Hierarchy:
    SkySales -> ControlGroupBookingRetrieve
    */
    SKYSALES.Class.ControlGroupBookingRetrieve = function () {
        var parent = new SKYSALES.Class.ControlGroup(),
            thisControlGroupBookingRetrieve = SKYSALES.Util.extendObject(parent);

        thisControlGroupBookingRetrieve.bookingRetrieve = null;

        thisControlGroupBookingRetrieve.init = function (json) {
            this.setSettingsByObject(json);

            var bookingRetrieve = new SKYSALES.Class.BookingRetrieve();
            bookingRetrieve.init(json);
            thisControlGroupBookingRetrieve.bookingRetrieve = bookingRetrieve;

            this.setVars();
            this.addEvents();
        };

        thisControlGroupBookingRetrieve.validateHandler = function () {
            var retVal = thisControlGroupBookingRetrieve.validate();
            return retVal;
        };
        thisControlGroupBookingRetrieve.validate = function () {
            var retVal = false,
                bookingRetrieve = this.bookingRetrieve;
            retVal = bookingRetrieve.isOneSectionPopulated();
            if (retVal) {
                retVal = parent.validate.call(this);
            }
            return retVal;
        };
        return thisControlGroupBookingRetrieve;
    };

    /*
    Name:
    Class BookingRetrieve
    Param:
    None
    Return:
    An instance of BookingRetrieve
    Functionality:
    Handles a BookingRetrieve
    Notes:

    Class Hierarchy:
    SkySales -> FlightSearch -> BookingRetrieve
    */
    SKYSALES.Class.BookingRetrieve = function () {
        var parent = new SKYSALES.Class.FlightSearch(),
            thisBookingRetrieve = SKYSALES.Util.extendObject(parent);

        thisBookingRetrieve.marketArray = [];
        thisBookingRetrieve.missingInformation = '';
        thisBookingRetrieve.sectionValidation = {};

        thisBookingRetrieve.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisBookingRetrieve.setVars = function () {
            parent.setVars.call(this);
            var i = 0,
                len = 0,
                sectionValidation = this.sectionValidation,
                sectionArray = [],
                prop = '',
                validate = null;

            for (prop in sectionValidation) {
                if (sectionValidation.hasOwnProperty(prop)) {
                    sectionArray = sectionValidation[prop] || [];
                    len = sectionArray.length;
                    for (i = 0; i < len; i += 1) {
                        validate = sectionArray[i];
                        validate.input = this.getById(validate.id);
                    }
                }
            }
        };

        thisBookingRetrieve.isOneSectionPopulated = function () {
            var i = 0,
                len = 0,
                sectionValidation = this.sectionValidation,
                sectionArray = [],
                prop = '',
                validate = null,
                input = null,
                retVal = false,
                value = '',
                requiredempty = '',
                sectionIsPopulated = true;

            for (prop in sectionValidation) {
                if (sectionValidation.hasOwnProperty(prop)) {
                    sectionArray = sectionValidation[prop] || [];
                    len = sectionArray.length;
                    sectionIsPopulated = true;
                    for (i = 0; i < len; i += 1) {
                        validate = sectionArray[i];
                        input = validate.input[0];
                        if (input) {
                            value = input.value;
                            requiredempty = value.requiredempty || '';
                            if (value === requiredempty) {
                                value = '';
                            }
                            if (!value) {
                                sectionIsPopulated = false;
                                break;
                            }
                        }
                    }
                    if (sectionIsPopulated) {
                        retVal = true;
                        break;
                    }
                }
            }
            if (!retVal) {
                //TODO: Make this trigger a validation error, instead of an alert
                alert(this.missingInformation);
            }
            return retVal;
        };

        return thisBookingRetrieve;
    };

    /*
    Name:
    Class CheckInPassengerInput
    Param:
    None
    Return:
    An instance of CheckInPassengerInput
    Functionality:
    Handles a CheckInPassengerInput
    Notes:

    Class Hierarchy:
    SkySales -> CheckInPassengerInput
    */
    SKYSALES.Class.CheckInPassengerInput = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCheckInPassengerInput = SKYSALES.Util.extendObject(parent);

        thisCheckInPassengerInput.checkInPassengerJourneyArray = [];

        thisCheckInPassengerInput.init = function (json) {
            this.setSettingsByObject(json);
            this.initCheckInPassengerJourneyArray();
        };

        thisCheckInPassengerInput.initCheckInPassengerJourneyArray = function () {
            var i = 0,
                checkInPassengerJourneyArray = this.checkInPassengerJourneyArray || [],
                len = checkInPassengerJourneyArray.length,
                checkInPassengerJourney = null;
            for (i = 0; i < len; i += 1) {
                checkInPassengerJourney = new SKYSALES.Class.CheckInPassengerJourney();
                checkInPassengerJourney.init(checkInPassengerJourneyArray[i]);
                checkInPassengerJourneyArray[i] = checkInPassengerJourney;
            }
        };

        return thisCheckInPassengerInput;
    };

    /*
    Name:
    Class CheckInPassengerJourney
    Param:
    None
    Return:
    An instance of CheckInPassengerJourney
    Functionality:
    Handles a CheckInPassengerJourney
    Notes:

    Class Hierarchy:
    SkySales -> CheckInPassengerJourney
    */
    SKYSALES.Class.CheckInPassengerJourney = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisCheckInPassengerJourney = SKYSALES.Util.extendObject(parent);

        thisCheckInPassengerJourney.checkInInputId = '';
        thisCheckInPassengerJourney.checkInInput = null;
        thisCheckInPassengerJourney.baggageInputId = '';
        thisCheckInPassengerJourney.baggageInput = null;

        thisCheckInPassengerJourney.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.checkInInputUpdate();
        };

        thisCheckInPassengerJourney.setVars = function () {
            thisCheckInPassengerJourney.checkInInput = this.getById(this.checkInInputId);
            thisCheckInPassengerJourney.baggageInput = this.getById(this.baggageInputId);
        };

        thisCheckInPassengerJourney.addEvents = function () {
            this.checkInInput.click(this.checkInInputUpdateHandler);
        };

        thisCheckInPassengerJourney.checkInInputUpdateHandler = function () {
            thisCheckInPassengerJourney.checkInInputUpdate();
        };

        thisCheckInPassengerJourney.checkInInputUpdate = function () {
            var isChecked = this.checkInInput.is(':checked');
            if (isChecked) {
                this.baggageInput.removeAttr('disabled');
            } else {
                this.baggageInput.attr('disabled', 'disabled');
            }
        };

        return thisCheckInPassengerJourney;
    };


    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    aos.js
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */

    /*
    Name:
    Class AosBase
    Param:
    None
    Return:
    An instance of AosBase
    Functionality:
    AosBase is the Aos Base class.
    Notes:
    It seperates all aos classes from non aos classes.
    If the object is an AosBase its part of Aos.
    Class Hierarchy:
    SkySales -> AosBase
    */
    SKYSALES.Class.AosBase = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisAosBase = SKYSALES.Util.extendObject(parent);

        thisAosBase.addOptions = SKYSALES.Class.AosBase.prototype.addOptions;
        return thisAosBase;
    };

    SKYSALES.Class.AosBase.prototype.addOptions = function (dropDown, optionList) {
        var i = 0;
        if (dropDown && dropDown.options) {
            for (i = 0; i < optionList.length; i += 1) {
                dropDown.options[dropDown.options.length] = optionList[i];
            }
        }
    };

    /*
    Name:
    Class Page
    Param:
    None
    Return:
    An instance of Page
    Functionality:
    Provides paging for aos availability
    Notes:
    The aos paging uses a template from the XSLT file.
    This template does not use the SkySales standard of using [memberName] to
    represent a variable that needs to be swapped out in the template.
    It uses -memberName-.
    Class Hierarchy:
    SkySales -> AosBase -> Page
    */
    SKYSALES.Class.Page = function () {
        var parent = new SKYSALES.Class.AosBase(),
            thisPage = SKYSALES.Util.extendObject(parent),
            pageNumber = null,
            nameDel = "$";

        thisPage.pageNumber = 1;
        thisPage.pageSize = 10;
        thisPage.totalCount = 50;
        thisPage.pageContainerId = '';
        thisPage.pageContainer = null;
        thisPage.previous = 'Previous';
        thisPage.next = 'Next';
        thisPage.pageNodeId = '';
        thisPage.pageNode = null;
        thisPage.currentPageClass = 'buttonSelected';
        thisPage.pageNumberId = '';
        thisPage.pageInputClass = 'pageInput';
        thisPage.pageEventClass = 'pageEvent';
        thisPage.hoverClass = 'hover';
        thisPage.clientName = '';
        thisPage.buttonPrefix = '';
        thisPage.inputPrefix = '';
        thisPage.buttonSubmitName = "UpdatePage";

        thisPage.pageMin = function (totalPageCount) {
            var retVal = 1,
                lowerBoundMaximumVal = 1,
                lowerBoundFromOffset = 1;

            if (thisPage.pageNumber >= 5) {
                lowerBoundMaximumVal = totalPageCount - 9;
                lowerBoundFromOffset = thisPage.pageNumber - 4;
                if (lowerBoundMaximumVal > lowerBoundFromOffset) {
                    retVal = lowerBoundFromOffset;
                } else if (lowerBoundMaximumVal < 1) {
                    retVal = 1;
                } else {
                    retVal = lowerBoundMaximumVal;
                }
            }
            return retVal;
        };

        thisPage.pageMax = function (pageMinVal, totalPageCount) {
            var retVal = pageMinVal + 9;
            if (retVal > totalPageCount) {
                retVal = totalPageCount;
            }
            return retVal;
        };

        thisPage.drawPage = function () {
            var pageSize = this.pageSize || 1,
                pageNodeOrig = this.pageNode.html(),
                html = '',
                i = 0,
                pageNumberReplacement = /-pageNumber-/g,
                pageNumberValueReplacement = /-pageNumberValue-/g,
                totalPageCount = Math.ceil(this.totalCount / pageSize),
                pageNumHtml = '',
                pageMinVal = this.pageMin(totalPageCount),
                pageMaxVal = this.pageMax(pageMinVal, totalPageCount);

            if (totalPageCount > 1) {
                if (thisPage.pageNumber > 1) {
                    html = SKYSALES.Util.replace(pageNodeOrig, pageNumberReplacement, this.previous);
                    html = SKYSALES.Util.replace(html, pageNumberValueReplacement, this.pageNumber - 1);
                }

                for (i = pageMinVal; i <= pageMaxVal; i += 1) {
                    pageNumHtml = SKYSALES.Util.replace(pageNodeOrig, pageNumberReplacement, i);
                    if (thisPage.pageNumber === i) {
                        pageNumHtml = SKYSALES.Util.replace(pageNumHtml, /-activeClass-/g, this.currentPageClass);
                    } else {
                        pageNumHtml = SKYSALES.Util.replace(pageNumHtml, /-activeClass-/g, '');
                    }
                    pageNumHtml = SKYSALES.Util.replace(pageNumHtml, pageNumberValueReplacement, i);
                    html += pageNumHtml;
                }

                if (this.pageNumber < totalPageCount) {
                    html += SKYSALES.Util.replace(pageNodeOrig, pageNumberReplacement, this.next);
                    html = SKYSALES.Util.replace(html, pageNumberValueReplacement, this.pageNumber + 1);
                }

                this.pageContainer.html(html);
            }
        };

        thisPage.setVars = function () {
            parent.setVars.call(this);
            thisPage.pageContainer = this.getById(this.pageContainerId);
            thisPage.pageNode = this.getById(this.pageNodeId);
            pageNumber = this.getById(this.pageNumberId);
        };

        thisPage.update = function (obj) {
            var pageNumberId = SKYSALES.Util.replace(obj.id, this.buttonPrefix, this.inputPrefix),
                pageNumberObj = this.getById(pageNumberId),
                goToPage = pageNumberObj.val();
            pageNumber.val(goToPage);
            this.sendRequest();
        };

        thisPage.updateHandler = function () {
            thisPage.update(this);
        };

        thisPage.sendRequest = function () {
            var param = this.clientName + nameDel + this.buttonSubmitName;
            /*jslint nomen: true */
            window.__doPostBack(param);
            /*jslint nomen: false */
        };

        thisPage.addEvents = function () {
            var pageEvents = $('.' + this.pageEventClass, this.pageContainer);
            pageEvents.click(this.updateHandler);
        };

        thisPage.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.drawPage();
            this.addEvents();
        };
        return thisPage;
    };

    /*
    Name:
    Class AosSearch
    Param:
    None
    Return:
    An instance of AosSearch
    Functionality:
    Base class for an aos search
    Notes:
    Provides the basic functionality for searching for aos availability
    that all of the aos categories use.
    Class Hierarchy:
    SkySales -> AosBase -> AosSearch
    */
    SKYSALES.Class.AosSearch = function () {
        var parent = new SKYSALES.Class.AosBase(),
            thisAosSearch = SKYSALES.Util.extendObject(parent),
            resource = SKYSALES.Util.getResource();

        thisAosSearch.availabilityRequest = {};

        thisAosSearch.locationArray = [];
        thisAosSearch.locationHash = {};
        thisAosSearch.location = null;
        thisAosSearch.locationId = '';
        thisAosSearch.locationDropDownId = '';
        thisAosSearch.locationDropDown = null;

        thisAosSearch.subLocationId = '';
        thisAosSearch.subLocation = null;

        thisAosSearch.sourceCodeInfo = resource.sourceInfo;
        thisAosSearch.sourceCodeId = '';
        thisAosSearch.sourceCodeDropDownId = '';

        thisAosSearch.startDateId = '';
        thisAosSearch.startDate = '';

        thisAosSearch.startDayId = '';
        thisAosSearch.startDay = '';

        thisAosSearch.startMonthYearId = '';
        thisAosSearch.startMonthYear = null;
        thisAosSearch.startMonthCount = 1;

        thisAosSearch.endDateId = '';
        thisAosSearch.endDate = null;

        thisAosSearch.endDayId = '';
        thisAosSearch.endDay = null;

        thisAosSearch.endMonthYearId = '';
        thisAosSearch.endMonthYear = null;

        thisAosSearch.endMonthCount = 1;

        thisAosSearch.dateDelimiter = '-';

        thisAosSearch.sourceCodeArray = [];
        thisAosSearch.sourceCode = '';
        thisAosSearch.sourceCodeDropDown = '';

        thisAosSearch.sortBy = null;
        thisAosSearch.sortByDropDown = null;
        thisAosSearch.sortByDropDownId = '';
        thisAosSearch.sortById = '';

        thisAosSearch.addEvents = function () {
            this.startDay.change(this.setTextValuesHandler);
            this.startMonthYear.change(this.setTextValuesHandler);
            this.startDate.change(this.setDropDownValuesHandler);

            this.endDay.change(this.setTextValuesHandler);
            this.endMonthYear.change(this.setTextValuesHandler);
            this.endDate.change(this.setDropDownValuesHandler);

            this.locationDropDown.change(this.setTextValuesHandler);
            this.location.change(this.setDropDownValuesHandler);

            this.sourceCodeDropDown.change(this.setTextValuesHandler);
            this.sourceCode.change(this.setDropDownValuesHandler);

            this.sortBy.change(this.setDropDownValuesHandler);
            this.sortByDropDown.change(this.setTextValuesHandler);
            this.subLocation.change(this.setLocationHandler);
        };

        thisAosSearch.setLocationHandler = function () {
            thisAosSearch.setLocation();
        };

        thisAosSearch.setLocation = function () {
            var subLocation = this.subLocation.val();
            this.location.val(subLocation);
        };

        thisAosSearch.getSubLocationArray = function (locationCode) {
            var subLocationArray = [],
                locationArray = this.locationArray || [],
                location = null,
                i = 0,
                len = locationArray.length,
                parentLocation = '',
                locationHash = this.locationHash;

            if (locationCode) {
                location = locationHash[locationCode];
                if (location) {
                    parentLocation = location.parent || '';
                    if (parentLocation) {
                        location = locationHash[parentLocation];
                        subLocationArray.push(location);

                        for (i = 0; i < len; i += 1) {
                            location = locationArray[i];
                            if (parentLocation === location.parent) {
                                subLocationArray.push(location);
                            }
                        }
                    } else {
                        subLocationArray.push(location);
                        for (i = 0; i < len; i += 1) {
                            location = locationArray[i];
                            parentLocation = location.parent || '';
                            if (parentLocation === locationCode) {
                                subLocationArray.push(location);
                            }
                        }
                    }
                }
            }
            if (subLocationArray.length === 0) {
                subLocationArray = locationArray;
            }
            return subLocationArray;
        };

        thisAosSearch.populate = function () {
            var locationArray = this.locationArray || [],
                location = this.location || {},
                locationCode = location.val(),
                subLocationArray = this.getSubLocationArray(locationCode),
                locationValue = "",
                json,
                selectBoxHash,
                options,
                i = 0,
                text = '',
                value = '',
                objectArray = [];

            json = {
                "input": location,
                "objectArray": locationArray,
                "showCode": false
            };
            SKYSALES.Util.populate(json);

            json = {
                "input": this.subLocation,
                "objectArray": subLocationArray,
                "showCode": false
            };
            SKYSALES.Util.populate(json);
            locationValue = location.val();
            this.subLocation.val(locationValue);

            objectArray = [];
            for (i = 1; i < 32; i += 1) {
                text = i;
                value = i;
                if (value < 10) {
                    value = '0' + value;
                }
                objectArray[i] = {
                    "code": value,
                    "name": text
                };
            }
            json = {
                "input": this.startDay,
                "objectArray": objectArray
            };
            SKYSALES.Util.populate(json);

            json = {
                "input": this.endDay,
                "objectArray": objectArray
            };
            SKYSALES.Util.populate(json);

            options = this.getMonthYearOptions(this.startMonthCount);
            this.addOptions(this.startMonthYear[0], options);

            options = this.getMonthYearOptions(this.endMonthCount);
            this.addOptions(this.endMonthYear[0], options);

            selectBoxHash = {
                "sourceCode": this.sourceCodeDropDown,
                "sortBy": this.sortByDropDown
            };
            this.populateFromAvailabilityRequest(selectBoxHash);
        };

        thisAosSearch.populateFromAvailabilityRequest = function (selectBoxHash) {
            selectBoxHash = selectBoxHash || {};

            var availabilityRequest = this.availabilityRequest || {},
                json,
                obj,
                options,
                selectBox,
                prop,
                populate = SKYSALES.Util.populate;

            for (prop in selectBoxHash) {
                if (selectBoxHash.hasOwnProperty(prop)) {
                    selectBox = selectBoxHash[prop];
                    obj = availabilityRequest[prop] || {};
                    options = obj.options;
                    if (options) {
                        json = {
                            "input": selectBox,
                            "objectArray": options
                        };
                        populate(json);
                    }
                }
            }
        };
        thisAosSearch.getMonthYearOptions = function (monthCount) {
            monthCount = monthCount || 12;
            monthCount = parseInt(monthCount, 10);

            var monthYearOptions = [],
                curdate = new Date(),
                del = this.dateDelimiter,
                i = 0,
                value,
                text,
                year,
                month,
                monthValue,
                option,
                OptionNode = Option,
                monthNames = resource.dateCultureInfo.monthNames || [];

            curdate.setDate(1);

            for (i = 0; i < monthCount; i += 1) {
                year = curdate.getFullYear();
                month = curdate.getMonth();
                monthValue = month + 1;
                if (monthValue < 10) {
                    monthValue = '0' + monthValue;
                }
                value = year + del + monthValue;

                text = monthNames[month] + ' ' + year;
                option = new OptionNode(text, value);
                monthYearOptions.push(option);
                curdate.setMonth(month + 1);
            }
            return monthYearOptions;
        };
        thisAosSearch.setTextValuesHandler = function () {
            thisAosSearch.setTextValues();
        };
        thisAosSearch.setTextValues = function () {
            var startDate,
                endDate,
                monthYear,
                day,
                isoDate;

            monthYear = this.startMonthYear.val();
            day = this.startDay.val();
            isoDate = monthYear + this.dateDelimiter + day;
            startDate = SKYSALES.Util.parseIsoDate(isoDate);
            if (startDate) {
                startDate = SKYSALES.Util.dateToIsoString(startDate);
                this.startDate.val(startDate);
            }

            monthYear = this.endMonthYear.val();
            day = this.endDay.val();
            isoDate = monthYear + this.dateDelimiter + day;
            endDate = SKYSALES.Util.parseIsoDate(isoDate);
            if (endDate) {
                endDate = SKYSALES.Util.dateToIsoString(endDate);
                this.endDate.val(endDate);
            }

            this.location.val(this.locationDropDown.val());
            this.sourceCode.val(this.sourceCodeDropDown.val());
            this.sortBy.val(this.sortByDropDown.val());
        };
        thisAosSearch.setDropDownValuesHandler = function () {
            thisAosSearch.setDropDownValues();
        };
        thisAosSearch.setDropDownValues = function () {
            var startDate,
                endDate,
                day,
                dayValue,
                month,
                monthValue,
                year,
                isoDate,
                del = this.dateDelimiter;

            isoDate = this.startDate.val();
            startDate = SKYSALES.Util.parseIsoDate(isoDate);
            if (startDate) {
                day = startDate.getDate();
                dayValue = day;
                if (dayValue < 10) {
                    dayValue = '0' + dayValue;
                }
                month = startDate.getMonth();
                monthValue = month;
                monthValue += 1;
                if (monthValue < 10) {
                    monthValue = '0' + monthValue;
                }
                year = startDate.getFullYear();
                this.startDay.val(dayValue);
                this.startMonthYear.val(year + del + monthValue);
            }

            isoDate = this.endDate.val();
            endDate = SKYSALES.Util.parseIsoDate(isoDate);
            if (endDate) {
                day = endDate.getDate();
                dayValue = day;
                if (dayValue < 10) {
                    dayValue = '0' + dayValue;
                }
                month = endDate.getMonth();
                monthValue = month;
                monthValue += 1;
                if (monthValue < 10) {
                    monthValue = '0' + monthValue;
                }
                year = endDate.getFullYear();
                this.endDay.val(dayValue);
                this.endMonthYear.val(year + del + monthValue);
            }

            this.locationDropDown.val(this.location.val());
            this.sourceCodeDropDown.val(this.sourceCode.val());
            this.sortByDropDown.val(this.sortBy.val());
        };

        thisAosSearch.setVars = function () {
            thisAosSearch.location = this.getById(this.locationId);
            thisAosSearch.locationDropDown = this.getById(this.locationDropDownId);
            thisAosSearch.subLocation = this.getById(this.subLocationId);

            thisAosSearch.sourceCodeArray = this.sourceCodeInfo.SourceList || [];

            thisAosSearch.sourceCode = this.getById(this.sourceCodeId);
            thisAosSearch.sourceCodeDropDown = this.getById(this.sourceCodeDropDownId);

            thisAosSearch.startDate = this.getById(this.startDateId);
            thisAosSearch.startDay = this.getById(this.startDayId);
            thisAosSearch.startMonthYear = this.getById(this.startMonthYearId);

            thisAosSearch.endDate = this.getById(this.endDateId);
            thisAosSearch.endDay = this.getById(this.endDayId);
            thisAosSearch.endMonthYear = this.getById(this.endMonthYearId);

            thisAosSearch.sortBy = this.getById(this.sortById);
            thisAosSearch.sortByDropDown = this.getById(this.sortByDropDownId);
        };
        thisAosSearch.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.populate();
            this.addEvents();
            this.setDropDownValues();
        };
        return thisAosSearch;
    };

    /*
    Name:
    Class Aos
    Param:
    None
    Return:
    An instance of Aos
    Functionality:
    Base class for an aos availability
    Notes:
    Provides the basic functionality for aos availability results.
    Shows and hides the results you wish to see
    Class Hierarchy:
    SkySales -> AosBase -> Aos
    */
    SKYSALES.Class.Aos = function () {
        var parent = new SKYSALES.Class.AosBase(),
            thisAos = SKYSALES.Util.extendObject(parent),
            showHideDiv = null,
            showHideImgLink = '',
            showHideTextLink = '';

        thisAos.showText = '';
        thisAos.hideText = '';
        thisAos.showHideTextEventId = '';
        thisAos.showHideImgEventId = '';
        thisAos.showHideImgUp = '';
        thisAos.showHideImgDown = '';

        thisAos.aosKey = "";
        thisAos.itemArray = [];
        thisAos.aosAvailability = null;

        thisAos.showHandler = function () {
            thisAos.show();
        };
        thisAos.hideHandler = function () {
            thisAos.hide();
        };

        thisAos.show = function () {
            showHideDiv.show();
            showHideTextLink.html(this.hideText);
            showHideImgLink.attr('src', this.showHideImgUp);
        };
        thisAos.hide = function () {
            showHideDiv.hide();
            showHideTextLink.html(this.showText);
            showHideImgLink.attr('src', this.showHideImgDown);
        };
        thisAos.addEvents = function () {
            showHideImgLink.attr('src', this.showHideImgDown);
            showHideTextLink.html(this.showText);
            showHideDiv.hide();

            showHideTextLink.toggle(this.showHandler, this.hideHandler);
            showHideImgLink.toggle(this.showHandler, this.hideHandler);
        };
        thisAos.setVars = function () {
            parent.setVars.call(this);
            showHideDiv = this.getById(this.containerId);
            showHideImgLink = this.getById(this.showHideImgEventId);
            showHideTextLink = this.getById(this.showHideTextEventId);
        };
        thisAos.initItemArray = function () {
            var i, itemArray = this.itemArray || [],
                len = itemArray.length,
                item, itemParam, json;

            for (i = 0; i < len; i += 1) {
                itemParam = itemArray[i];
                json = {
                    "aosKey": this.aosKey,
                    "itemKeyId": itemParam.itemKeyId,
                    "inputId": itemParam.inputId,
                    "aos": this
                };
                item = new SKYSALES.Class.AosItem();
                item.init(json);
                itemArray[i] = item;
            }
        };
        thisAos.updateKeyValues = function (aosItem) {
            this.aosAvailability.updateKeyValues(aosItem);
        };
        thisAos.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initItemArray();
            this.addEvents();
        };
        return thisAos;
    };

    SKYSALES.Class.AosItem = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisAosItem = SKYSALES.Util.extendObject(parent);

        thisAosItem.aosKey = '';
        thisAosItem.aos = null;
        thisAosItem.inputId = '';
        thisAosItem.input = null;

        thisAosItem.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisAosItem.setVars = function () {
            thisAosItem.input = this.getById(this.inputId);
        };

        thisAosItem.addEvents = function () {
            this.input.change(this.updateKeyValuesHandler);
        };

        thisAosItem.updateKeyValuesHandler = function () {
            thisAosItem.updateKeyValues();
        };

        thisAosItem.updateKeyValues = function () {
            this.aos.updateKeyValues(this);
        };

        return thisAosItem;
    };

    /*
    Name:
    Class TermsAndConditionsBase
    Param:
    None
    Return:
    An instance of TermsAndConditionsBase
    Functionality:
    The base class for the terms and conditions
    Notes:
    Uses AJAX to retrieve the terms and conditions,
    and then injects them into the dom
    Class Hierarchy:
    SkySales -> AosBase -> TermsAndConditionsBase
    */
    SKYSALES.Class.TermsAndConditionsBase = function () {
        var termsBase = new SKYSALES.Class.AosBase(),
            thisTermsBase = SKYSALES.Util.extendObject(termsBase),
            termsInfo = {},
            nameDel = "$";

        thisTermsBase.showHideId = '';
        thisTermsBase.showHide = null;
        thisTermsBase.inputId = '';
        thisTermsBase.input = null;
        thisTermsBase.url = '';
        thisTermsBase.clientName = '';

        thisTermsBase.setVars = function () {
            termsBase.setVars.call(this);
            thisTermsBase.showHide = this.getById(thisTermsBase.showHideId);
            thisTermsBase.input = this.getById(thisTermsBase.inputId);
        };

        thisTermsBase.sendRequest = function () {
            //$.get did not work in IE7
            $.post(thisTermsBase.url, termsInfo, thisTermsBase.updateDom);
        };

        thisTermsBase.updateDom = function (data) {
            if (thisTermsBase.container) {
                thisTermsBase.container.html(data);
                thisTermsBase.show('slow');
            }
        };

        thisTermsBase.showTermsAndConditions = function () {
            var inputName = thisTermsBase.input.attr('name');
            inputName = thisTermsBase.clientName + nameDel + inputName;
            termsInfo[inputName] = 1;
            termsInfo[thisTermsBase.clientName + nameDel + "AjaxControlPrefix"] = thisTermsBase.clientName;
            /*jslint nomen: true */
            termsInfo.__EVENTTARGET = thisTermsBase.clientName + nameDel + 'OnTermsAndConditions';
            /*jslint nomen: false */
            thisTermsBase.sendRequest();
        };

        thisTermsBase.addEvents = function () {
            termsBase.addEvents.call(this);
            thisTermsBase.showHide.click(thisTermsBase.showTermsAndConditions);
        };

        thisTermsBase.init = function (paramObj) {
            termsBase.init.call(this, paramObj);
            thisTermsBase.addEvents();
        };
        return thisTermsBase;
    };

    /*
    Name:
    Class Cancel
    Param:
    None
    Return:
    An instance of Cancel
    Functionality:
    The base class for the aos cancellation
    Notes:
    Wires up the cancel button
    Class Hierarchy:
    SkySales -> AosBase -> Cancel
    */
    SKYSALES.Class.Cancel = function () {
        var parent = new SKYSALES.Class.AosBase(),
            thisCancel = SKYSALES.Util.extendObject(parent);

        thisCancel.cancelLinkId = '';
        thisCancel.cancelInputId = '';
        thisCancel.cancelButtonName = '';
        thisCancel.container = null;
        thisCancel.cancelLink = '';
        thisCancel.cancelInput = '';

        thisCancel.policiesToggleViewParams = null;
        thisCancel.policiesToggleView = null;

        thisCancel.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisCancel.setVars = function () {
            var cancelLink = this.getById(this.cancelLinkId),
                cancelInput = this.getById(this.cancelInputId),
                policiesToggleView = null;

            if (this.policiesToggleViewParams) {
                policiesToggleView = new SKYSALES.Class.ToggleView();
                policiesToggleView.init(this.policiesToggleViewParams);
                thisCancel.policiesToggleView = policiesToggleView;
            }

            if (cancelLink) {
                thisCancel.cancelLink = $(cancelLink);
            }
            if (cancelInput) {
                thisCancel.cancelInput = $(cancelInput);
            }
        };

        thisCancel.addEvents = function () {
            parent.addEvents.call(this);

            if (this.cancelLink) {
                this.cancelLink.click(this.cancelDataHandler);
            }
            if (this.cancelInput) {
                this.cancelInput.click(this.cancelDataHandler);
            }
        };

        thisCancel.cancelDataHandler = function () {
            thisCancel.cancel();
        };

        thisCancel.cancel = function () {
            this.cancelInput.val('1');
            /*jslint nomen: true */
            window.__doPostBack(this.cancelButtonName);
            /*jslint nomen: false */
        };

        return thisCancel;
    };

    /*
    Name:
    Class ActivitySearch
    Param:
    None
    Return:
    An instance of ActivitySearch
    Functionality:
    The object that initializes the ActivitySearch control
    Notes:
    A FlightSearchContainer object is created every time a div appears in the dom that has a class of activitySearchContainer
    <div class="activitySearchContainer" ></div>
    There should be one instance of this object for every ActivitySearch  control in the view.
    Class Hierarchy:
    SkySales -> AosBase -> AosSearch -> ActivitySearch
    */
    SKYSALES.Class.ActivitySearch = function () {
        var parent = new SKYSALES.Class.AosSearch(),
            thisActivitySearch = SKYSALES.Util.extendObject(parent);

        thisActivitySearch.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.populate();
            this.addEvents();
            this.setDropDownValues();
        };

        thisActivitySearch.setVars = function () {
            parent.setVars.call(this);

            var resource = SKYSALES.Util.getResource();
            thisActivitySearch.locationHash = resource.activityLocationHash || {};
            thisActivitySearch.locationArray = resource.activityLocationArray || [];
        };


        return thisActivitySearch;
    };

    /*
    Name:
    Class ActivityAvailability
    Param:
    None
    Return:
    An instance of ActivityAvailability
    Functionality:
    The object that initializes the Activity control
    Notes:
    There should be one instance of this object for every ActivityAvailability  control in the view.
    Class Hierarchy:
    SkySales -> AosAvailability -> ActivityAvailability
    */
    SKYSALES.Class.ActivityAvailability = function () {
        var parent = new SKYSALES.Class.AosAvailability(),
            thisActivityAvailability = SKYSALES.Util.extendObject(parent);

        thisActivityAvailability.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initActivityArray();
        };

        thisActivityAvailability.initActivityArray = function () {
            var i, activityArray = this.aosArray || [],
                len = activityArray.length,
                activity, activityParam, json;

            for (i = 0; i < len; i += 1) {
                activityParam = activityArray[i];
                json = {
                    "showText": this.showText,
                    "hideText": this.hideText,
                    "showHideImgUp": this.imgUp,
                    "showHideImgDown": this.imgDown,
                    "containerId": activityParam.aosId,
                    "showHideTextEventId": activityParam.textId,
                    "showHideImgEventId": activityParam.imgId,
                    "groupArray": activityParam.groupArray,
                    "aosAvailability": this
                };
                activity = new SKYSALES.Class.Activity();
                activity.init(json);
                activityArray[i] = activity;
            }
        };

        return thisActivityAvailability;
    };

    SKYSALES.Class.Activity = function () {
        var parent = new SKYSALES.Class.Aos(),
            thisActivity = SKYSALES.Util.extendObject(parent);

        thisActivity.groupArray = [];

        thisActivity.hideAllGroups = function () {
            var i = 0,
                group = null,
                groupArray = this.groupArray || [],
                len = groupArray.length;

            for (i = 0; i < len; i += 1) {
                group = groupArray[i];
                group.hide();
            }
        };
        thisActivity.initGroupArray = function () {
            var i, groupArray = this.groupArray || [],
                len = groupArray.length,
                group, groupParam, json;

            for (i = 0; i < len; i += 1) {
                groupParam = groupArray[i];
                json = {
                    "containerId": groupParam.containerId,
                    "inputId": groupParam.inputId,
                    "itemArray": groupParam.itemArray,
                    "aos": this
                };
                group = new SKYSALES.Class.AosGroup();
                group.init(json);
                groupArray[i] = group;
            }
        };
        thisActivity.showHandler = function () {
            thisActivity.show();
        };
        thisActivity.hideHandler = function () {
            thisActivity.hide();
        };
        thisActivity.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initGroupArray();
            this.hideAllGroups();
        };
        return thisActivity;
    };

    SKYSALES.Class.AosGroup = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisAosGroup = SKYSALES.Util.extendObject(parent);

        thisAosGroup.aos = null;
        thisAosGroup.itemArray = [];
        thisAosGroup.inputId = '';
        thisAosGroup.input = null;

        thisAosGroup.updateGroupHandler = function () {
            thisAosGroup.updateGroup();
        };
        thisAosGroup.updateGroup = function () {
            this.aos.hideAllGroups();
            var id = this.input.val();
            this.getById(id).show();
        };
        thisAosGroup.show = function () {
            var i, itemArray = this.itemArray || [],
                len = itemArray.length,
                item;

            for (i = 0; i < len; i += 1) {
                item = itemArray[i];
                item.input.val(0);
            }

            parent.show.call(this);
            this.updateGroup();
        };
        thisAosGroup.addEvents = function () {
            parent.addEvents.call(this);
            this.input.change(this.updateGroupHandler);
        };
        thisAosGroup.setVars = function () {
            parent.setVars.call(this);
            thisAosGroup.input = this.getById(this.inputId);
        };
        thisAosGroup.initItemArray = function () {
            var i, itemArray = this.itemArray || [],
                len = itemArray.length,
                item, itemParam, json;

            for (i = 0; i < len; i += 1) {
                itemParam = itemArray[i];
                json = {
                    "aosKey": this.aosKey,
                    "itemKeyId": itemParam.itemKeyId,
                    "inputId": itemParam.inputId,
                    "quantityId": itemParam.quantityId,
                    "quantityMax": itemParam.quantityMax,
                    "soldOutId": itemParam.soldOutId,
                    "group": this,
                    "aos": this.aos
                };
                item = new SKYSALES.Class.ActivityItem();
                item.init(json);
                itemArray[i] = item;
            }
        };
        thisAosGroup.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initItemArray();
        };
        return thisAosGroup;
    };

    SKYSALES.Class.ActivityItem = function () {
        var parent = new SKYSALES.Class.AosItem(),
            thisActivityItem = SKYSALES.Util.extendObject(parent);

        thisActivityItem.group = null;
        thisActivityItem.quantityMax = 5;
        thisActivityItem.quantityId = '';
        thisActivityItem.quantity = null;
        thisActivityItem.soldOutId = '';
        thisActivityItem.soldOut = null;

        thisActivityItem.getQuantityOptions = function () {
            var i = 0,
                quantityOption = null,
                quantityOptions = [],
                quantityMax = this.quantityMax;

            for (i = 1; i <= quantityMax; i += 1) {
                quantityOption = {
                    "name": i,
                    "code": i
                };
                quantityOptions.push(quantityOption);
            }
            return quantityOptions;
        };
        thisActivityItem.populateQuantity = function () {
            var options = this.getQuantityOptions(),
                json = {
                    "input": this.quantity,
                    "objectArray": options
                };
            SKYSALES.Util.populate(json);
        };
        thisActivityItem.setVars = function () {
            parent.setVars.call(this);
            thisActivityItem.quantity = this.getById(this.quantityId);
            thisActivityItem.soldOut = this.getById(this.soldOutId);
        };
        thisActivityItem.showSoldOut = function () {
            this.soldOut.hide();
            if (this.quantityMax === 0) {
                this.quantity.hide();
                this.soldOut.show();
            }
        };
        thisActivityItem.updateKeyValuesHandler = function () { };
        thisActivityItem.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.populateQuantity();
            this.showSoldOut();
        };
        return thisActivityItem;
    };

    /*
    class PaxTypeControl
    */
    SKYSALES.Class.PaxTypeControl = function () {
        var parent = new SKYSALES.Class.AosBase(),
            thisPaxTypeControl = SKYSALES.Util.extendObject(parent);

        thisPaxTypeControl.controlId = '';
        thisPaxTypeControl.control = null;
        thisPaxTypeControl.paxTypeDropDownControl = '';
        thisPaxTypeControl.dropDownControlId = '';
        thisPaxTypeControl.paxInfoMaxQuantity = '';
        thisPaxTypeControl.paxInfoQuantity = '';
        thisPaxTypeControl.childAgesContainerId = '';
        thisPaxTypeControl.childAgesContainer = null;
        thisPaxTypeControl.childAgesDropDownsContainerId = '';
        thisPaxTypeControl.childAgesDropDownsContainer = null;
        thisPaxTypeControl.childAgesDropDownTemplateId = '';
        thisPaxTypeControl.childAgesDropDownTemplate = null;
        thisPaxTypeControl.childLabelTemplateId = '';
        thisPaxTypeControl.childLabelTemplate = null;
        thisPaxTypeControl.childDropDownBaseId = '';
        thisPaxTypeControl.clientId = '';
        thisPaxTypeControl.selectedAges = '';
        thisPaxTypeControl.minChildAge = 1;
        thisPaxTypeControl.maxChildAge = 18;

        thisPaxTypeControl.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initializeDropDowns(0, this.paxInfoMaxQuantity, this.paxInfoQuantity, this.paxTypeDropDownControl);
            this.addEvents();
            this.setTextValues();
            if (this.dropDownControlId.indexOf('CHD') > -1) {
                this.initializeSelectedChildAgeDropDowns();
            }
        };

        thisPaxTypeControl.setVars = function () {
            parent.setVars.call(this);

            thisPaxTypeControl.control = this.getById(this.controlId);
            thisPaxTypeControl.paxTypeDropDownControl = this.getById(this.dropDownControlId);
            if (this.dropDownControlId.indexOf('CHD') > -1) {
                thisPaxTypeControl.childAgesContainer = this.getById(this.childAgesContainerId);
                thisPaxTypeControl.childAgesDropDownsContainer = this.getById(this.childAgesDropDownsContainerId);
                thisPaxTypeControl.childAgesDropDownTemplate = this.getById(this.childAgesDropDownTemplateId);
                thisPaxTypeControl.childLabelTemplate = this.getById(this.childLabelTemplateId);
            }
        };

        thisPaxTypeControl.initializeDropDowns = function (minValue, maxValue, selectedValue, dom) {
            var i = 0,
                dropDownJson = {},
                dropDownValues = [];

            if (maxValue < minValue || !dom) {
                return;
            }
            selectedValue += "";

            for (i = minValue; i <= maxValue; i += 1) {
                dropDownValues[i] = {
                    "code": i,
                    "name": i
                };
            }

            dropDownJson = {
                "input": dom,
                "objectArray": dropDownValues,
                "selectedItem": selectedValue
            };

            SKYSALES.Util.populate(dropDownJson);
        };

        thisPaxTypeControl.setTextValuesHandler = function () {
            thisPaxTypeControl.setTextValues();
        };

        thisPaxTypeControl.setTextValues = function () {
            this.control.val(this.paxTypeDropDownControl.val());
        };

        thisPaxTypeControl.setDropDownValuesHandler = function () {
            thisPaxTypeControl.setDropDownValues();
        };

        thisPaxTypeControl.setDropDownValues = function () {
            this.paxTypeDropDownControl.val(this.control.val());
        };

        thisPaxTypeControl.addEvents = function () {
            parent.addEvents.call(this);

            this.control.change(this.setDropDownValuesHandler);
            this.paxTypeDropDownControl.change(this.setTextValuesHandler);

            if (this.dropDownControlId.indexOf('CHD') > -1) {
                this.paxTypeDropDownControl.change(this.addChildDropDownListsHandler);
            }

        };

        thisPaxTypeControl.initializeSelectedChildAgeDropDowns = function () {
            var ages = this.selectedAges.split(',') || [],
                agesLength = ages.length,
                i = 0,
                html = this.childLabelTemplate.text(),
                childAgeDropDownList = null,
                childDropDownControlId = '';

            for (i = 0; i < agesLength; i += 1) {
                if (ages[i] > 0 && ages[i].toString().length > 0) {
                    html += this.getChildAgeHtml(i);
                }
            }

            if (agesLength && ages[0]) {
                this.childAgesDropDownsContainer.html(html);
            }

            for (i = 0; i < agesLength; i += 1) {
                childDropDownControlId = this.childDropDownBaseId + i;
                childAgeDropDownList = this.getById(childDropDownControlId);
                if (childAgeDropDownList) {
                    this.initializeDropDowns(this.minChildAge, this.maxChildAge, ages[i], childAgeDropDownList);
                    SKYSALES.Util.setRequiredAttribute(childAgeDropDownList);
                    this.addChildDropDownEvents(childAgeDropDownList);
                }
            }

            this.updateChildAges();
        };

        thisPaxTypeControl.addChildDropDownListsHandler = function () {
            var childCount = this.value;
            thisPaxTypeControl.addChildDropDownLists(childCount);
        };

        thisPaxTypeControl.addChildDropDownLists = function (childCount) {
            var i = 0,
                html = this.childLabelTemplate.text(),
                childDropDownControlId = '',
                childAgeDropDownList = {},
                selectedValue = '';

            childCount = childCount || 0;
            childCount = parseInt(childCount, 10);

            for (i = 0; i < childCount; i += 1) {
                html += this.getChildAgeHtml(i);
            }

            if (childCount) {
                this.childAgesDropDownsContainer.html(html);
            } else {
                this.childAgesDropDownsContainer.html("");
            }

            for (i = 0; i < childCount; i += 1) {
                childDropDownControlId = this.childDropDownBaseId + i;
                childAgeDropDownList = this.getById(childDropDownControlId) || {};

                selectedValue = childAgeDropDownList.val();

                if (!selectedValue) {
                    selectedValue = '';
                }

                this.initializeDropDowns(this.minChildAge, this.maxChildAge, selectedValue, childAgeDropDownList);
                SKYSALES.Util.setRequiredAttribute(childAgeDropDownList);
                this.addChildDropDownEvents(childAgeDropDownList);
            }
            this.childAgesContainer.val("");
        };

        thisPaxTypeControl.getChildAgeHtml = function (index) {
            var html = '';

            html = this.childAgesDropDownTemplate.text();

            html = SKYSALES.Util.replace(html, /\[childAgeDropDownLabel\]/, index);
            html = SKYSALES.Util.replace(html, /\[childAgedropDownId\]/g, index);
            html = SKYSALES.Util.replace(html, /\[childAgedropDownName\]/, index);
            html = SKYSALES.Util.replace(html, /\[childIndex\]/, index + 1);
            html = SKYSALES.Util.replace(html, /\[clientId\]/g, this.clientId);

            return html;
        };

        thisPaxTypeControl.addChildDropDownEvents = function (dropDownControl) {
            dropDownControl.change(this.updateChildAgesHandler);
        };

        thisPaxTypeControl.updateChildAgesHandler = function () {
            thisPaxTypeControl.updateChildAges();
        };

        thisPaxTypeControl.updateChildAges = function () {
            var i = 0,
                dropDownList = null,
                ageString = "",
                dropDownLists = [],
                dropDownListsCount = 0;

            dropDownLists = $("[id^='" + this.childDropDownBaseId + "'] option:selected");
            dropDownListsCount = dropDownLists.length;

            for (i = 0; i < dropDownListsCount; i += 1) {
                dropDownList = dropDownLists[i];
                if (i === dropDownListsCount - 1) {
                    ageString += dropDownList.text;
                } else {
                    ageString += dropDownList.text + ",";
                }
            }
            this.childAgesContainer.val(ageString);
        };
        return thisPaxTypeControl;
    };

    /*
    HotelSearch extends Aos
    */
    SKYSALES.Class.HotelSearch = function () {
        var parent = new SKYSALES.Class.AosSearch(),
            thisHotelSearch = SKYSALES.Util.extendObject(parent);

        thisHotelSearch.rooms = '';
        thisHotelSearch.roomsDropDown = '';
        thisHotelSearch.roomsDropDownId = '';
        thisHotelSearch.roomCount = 1;
        thisHotelSearch.roomsId = '';

        thisHotelSearch.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.populate();
            this.addEvents();
            this.setDropDownValues();
        };

        thisHotelSearch.populate = function () {
            parent.populate.call(this);

            var roomOptions = this.populateOptions(this.roomCount, 1);
            this.addOptions(this.roomsDropDown[0], roomOptions);
        };

        thisHotelSearch.setVars = function () {
            parent.setVars.call(this);

            var resource = SKYSALES.Util.getResource();
            thisHotelSearch.locationHash = resource.hotelLocationHash || {};
            thisHotelSearch.locationArray = resource.hotelLocationArray || [];

            thisHotelSearch.rooms = this.getById(this.roomsId);
            thisHotelSearch.roomsDropDown = this.getById(this.roomsDropDownId);
        };

        thisHotelSearch.populateOptions = function (max, min) {
            min = min || 0;
            max = max || 10;

            var options = [],
                i = min,
                option,
                OptionNode = Option;

            for (i = min; i <= max; i += 1) {
                option = new OptionNode(i, i);
                options.push(option);
            }

            return options;
        };

        thisHotelSearch.setTextValuesHandler = function () {
            thisHotelSearch.setTextValues();
        };

        thisHotelSearch.setTextValues = function () {
            parent.setTextValues.call(this);
            this.rooms.val(this.roomsDropDown.val());
        };

        thisHotelSearch.setDropDownValuesHandler = function () {
            thisHotelSearch.setDropDownValues();
        };

        thisHotelSearch.setDropDownValues = function () {
            parent.setDropDownValues.call(this);
            this.roomsDropDown.val(this.rooms.val());
        };

        thisHotelSearch.addEvents = function () {
            parent.addEvents.call(this);
            this.rooms.change(this.setDropDownValuesHandler);
            this.roomsDropDown.change(this.setTextValuesHandler);
        };
        return thisHotelSearch;
    };
    /*
    TermsAndConditions extends TermsAndConditionsBase
    */
    SKYSALES.Class.TermsAndConditions = function () {
        var termsAndConditionsBase = new SKYSALES.Class.TermsAndConditionsBase(),
            thisTerms = SKYSALES.Util.extendObject(termsAndConditionsBase);

        return thisTerms;
    };

    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    carSearch.js
    --------------------------------------------------------------------------------------------------------------------------------------------------
        
    */
    SKYSALES.Class.CarSearch = function () {
        var parent = new SKYSALES.Class.AosSearch(),
            thisCarSearch = SKYSALES.Util.extendObject(parent);

        thisCarSearch.categoryId = '';
        thisCarSearch.categoryDropDownId = '';
        thisCarSearch.category = null;
        thisCarSearch.categoryDropDown = null;

        thisCarSearch.doorId = '';
        thisCarSearch.doorDropDownId = '';
        thisCarSearch.door = null;
        thisCarSearch.doorDropDown = null;

        thisCarSearch.sizeId = '';
        thisCarSearch.sizeDropDownId = '';
        thisCarSearch.size = null;
        thisCarSearch.sizeDropDown = null;

        thisCarSearch.transmissionId = '';
        thisCarSearch.transmissionDropDownId = '';
        thisCarSearch.transmission = null;
        thisCarSearch.transmissionDropDown = null;

        thisCarSearch.vendorsId = '';
        thisCarSearch.vendorSelectId = '';
        thisCarSearch.vendors = null;
        thisCarSearch.vendorSelect = null;
        thisCarSearch.vendorEventTarget = '';

        thisCarSearch.locationDropOffId = '';
        thisCarSearch.locationDropOffDropDownId = '';
        thisCarSearch.subLocationDropOffId = '';
        thisCarSearch.locationDropOff = null;
        thisCarSearch.locationDropOffDropDown = null;
        thisCarSearch.subLocationDropOff = null;

        thisCarSearch.pickUpTimeId = '';
        thisCarSearch.pickUpTimeDropDownId = '';
        thisCarSearch.pickUpTime = null;
        thisCarSearch.pickUpTimeDropDown = null;

        thisCarSearch.dropOffTimeId = '';
        thisCarSearch.dropOffTimeDropDownId = '';
        thisCarSearch.dropOffTime = null;
        thisCarSearch.dropOffTimeDropDown = null;

        thisCarSearch.air = null;
        thisCarSearch.airDropDown = null;
        thisCarSearch.airDropDownId = '';
        thisCarSearch.airId = '';

        thisCarSearch.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.populate();
            this.addEvents();
            this.setDropDownValues();
        };

        thisCarSearch.populateVendors = function () {
            var resource = SKYSALES.Util.getResource() || {},
                carInfo = resource.carInfo || {},
                vendorArray = carInfo.vendors || [],
                cleanVendorArray = [],
                json = {},
                i = 0,
                len = vendorArray.length,
                vendor = null;

            for (i = 0; i < len; i += 1) {
                vendor = vendorArray[i];
                if (vendor.name) {
                    cleanVendorArray.push(vendor);
                }
            }

            json = {
                "objectArray": cleanVendorArray,
                "input": this.vendorSelect,
                "clearOptions": false
            };
            SKYSALES.Util.populate(json);

        };

        thisCarSearch.populate = function () {
            parent.populate.call(this);

            var locationArray = this.locationArray || [],
                json,
                selectBoxHash,
                locationDropOff = this.locationDropOff,
                locationDropOffCode = locationDropOff.val(),
                subLocationDropOff = this.subLocationDropOff,
                subLocationDropOffArray = this.getSubLocationArray(locationDropOffCode),
                locationDropOffValue = '';

            json = {
                "input": locationDropOff,
                "objectArray": locationArray,
                "showCode": false
            };
            SKYSALES.Util.populate(json);

            json = {
                "input": subLocationDropOff,
                "objectArray": subLocationDropOffArray,
                "showCode": false
            };
            SKYSALES.Util.populate(json);
            locationDropOffValue = locationDropOff.val();
            subLocationDropOff.val(locationDropOffValue);

            this.populateVendors();

            selectBoxHash = {
                "air": this.airDropDown,
                "door": this.doorDropDown,
                "category": this.categoryDropDown,
                "transmission": this.transmissionDropDown,
                "size": this.sizeDropDown,
                "pickUpTime": this.pickUpTimeDropDown,
                "dropOffTime": this.dropOffTimeDropDown
            };
            this.populateFromAvailabilityRequest(selectBoxHash);
        };

        thisCarSearch.setVars = function () {
            parent.setVars.call(this);

            var resource = SKYSALES.Util.getResource();
            thisCarSearch.locationHash = resource.carLocationHash || {};
            thisCarSearch.locationArray = resource.carLocationArray || [];

            thisCarSearch.locationDropOff = this.getById(this.locationDropOffId);
            thisCarSearch.locationDropOffDropDown = this.getById(this.locationDropOffDropDownId);
            thisCarSearch.subLocationDropOff = this.getById(this.subLocationDropOffId);

            thisCarSearch.category = this.getById(this.categoryId);
            thisCarSearch.categoryDropDown = this.getById(this.categoryDropDownId);

            thisCarSearch.door = this.getById(this.doorId);
            thisCarSearch.doorDropDown = this.getById(this.doorDropDownId);

            thisCarSearch.size = this.getById(this.sizeId);
            thisCarSearch.sizeDropDown = this.getById(this.sizeDropDownId);

            thisCarSearch.transmission = this.getById(this.transmissionId);
            thisCarSearch.transmissionDropDown = this.getById(this.transmissionDropDownId);

            thisCarSearch.vendors = this.getById(this.vendorsId);
            thisCarSearch.vendorSelect = this.getById(this.vendorSelectId);

            thisCarSearch.pickUpTime = this.getById(this.pickUpTimeId);
            thisCarSearch.pickUpTimeDropDown = this.getById(this.pickUpTimeDropDownId);

            thisCarSearch.dropOffTime = this.getById(this.dropOffTimeId);
            thisCarSearch.dropOffTimeDropDown = this.getById(this.dropOffTimeDropDownId);

            thisCarSearch.air = this.getById(this.airId);
            thisCarSearch.airDropDown = this.getById(this.airDropDownId);

        };

        thisCarSearch.setTextValuesHandler = function () {
            thisCarSearch.setTextValues();
        };

        thisCarSearch.setTextValues = function () {
            parent.setTextValues.call(this);

            this.locationDropOff.val(this.locationDropOffDropDown.val());
            this.category.val(this.categoryDropDown.val());
            this.door.val(this.doorDropDown.val());
            this.size.val(this.sizeDropDown.val());
            this.transmission.val(this.transmissionDropDown.val());
            this.vendors.val(this.vendorSelect.val());
            this.pickUpTime.val(this.pickUpTimeDropDown.val());
            this.dropOffTime.val(this.dropOffTimeDropDown.val());
            this.sourceCode.val(this.sourceCodeDropDown.val());
            this.air.val(this.airDropDown.val());
        };

        thisCarSearch.setDropDownValuesHandler = function () {
            thisCarSearch.setDropDownValues();
        };

        thisCarSearch.setDropDownValues = function () {
            parent.setDropDownValues.call(this);

            this.locationDropOffDropDown.val(this.locationDropOff.val());
            this.categoryDropDown.val(this.category.val());
            this.doorDropDown.val(this.door.val());
            this.sizeDropDown.val(this.size.val());
            this.transmissionDropDown.val(this.transmission.val());
            this.vendorSelect.val(this.vendors.val());
            this.pickUpTimeDropDown.val(this.pickUpTime.val());
            this.dropOffTimeDropDown.val(this.dropOffTime.val());
            this.sourceCodeDropDown.val(this.sourceCode.val());
            this.airDropDown.val(this.air.val());
            this.sortByDropDown.val(this.sortBy.val());
        };

        thisCarSearch.setVendorsHandler = function () {
            thisCarSearch.setVendors();
        };

        thisCarSearch.setVendors = function () {
            this.setTextValues();
            this.doPostBack();
        };

        thisCarSearch.addEvents = function () {
            parent.addEvents.call(this);

            this.locationDropOff.change(this.setDropDownValuesHandler);
            this.locationDropOffDropDown.change(this.setTextValuesHandler);
            this.subLocationDropOff.change(this.setLocationHandler);

            this.category.change(this.setDropDownValuesHandler);
            this.categoryDropDown.change(this.setTextValuesHandler);

            this.door.change(this.setDropDownValuesHandler);
            this.doorDropDown.change(this.setTextValuesHandler);

            this.size.change(this.setDropDownValuesHandler);
            this.sizeDropDown.change(this.setTextValuesHandler);

            this.transmission.change(this.setDropDownValuesHandler);
            this.transmissionDropDown.change(this.setTextValuesHandler);

            //update the location list for a particular vendor
            this.vendors.change(this.setDropDownValuesHandler);
            this.vendorSelect.change(this.setVendorsHandler);

            this.pickUpTime.change(this.setDropDownValuesHandler);
            this.pickUpTimeDropDown.change(this.setTextValuesHandler);

            this.dropOffTime.change(this.setDropDownValuesHandler);
            this.dropOffTimeDropDown.change(this.setTextValuesHandler);

            this.air.change(this.setDropDownValuesHandler);
            this.airDropDown.change(this.setTextValuesHandler);
            this.subLocationDropOff.change(this.setLocationDropOffHandler);
        };

        thisCarSearch.setLocationDropOffHandler = function () {
            thisCarSearch.setLocationDropOff();
        };

        thisCarSearch.setLocationDropOff = function () {
            var subLocationDropOffValue = this.subLocationDropOff.val();
            this.locationDropOff.val(subLocationDropOffValue);
        };

        thisCarSearch.doPostBack = function () {
            var eventTarget = this.vendorEventTarget;
            /*jslint nomen: true */
            window.__doPostBack(eventTarget, '');
            /*jslint nomen: false */
        };

        // Accepts an array of vendors and returns an array of vendor drop-down options
        thisCarSearch.getVendorOptions = function (vendorArray) {
            vendorArray = vendorArray || [];

            var options = [],
                option,
                OptionNode = Option,
                i,
                len = vendorArray.length,
                vendor;

            for (i = 0; i < len; i += 1) {
                vendor = vendorArray[i];
                option = new OptionNode(vendor.description, vendor.vendorCode);
                options.push(option);
            }
            return options;
        };

        return thisCarSearch;
    };

    SKYSALES.Class.AosAvailability = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisAosAvailability = SKYSALES.Util.extendObject(parent);

        thisAosAvailability.showText = "";
        thisAosAvailability.hideText = "";
        thisAosAvailability.imgUp = "";
        thisAosAvailability.imgDown = "";
        thisAosAvailability.aosKeyId = "";
        thisAosAvailability.aosKey = "";
        thisAosAvailability.aosItemId = "";
        thisAosAvailability.aosItem = "";
        thisAosAvailability.seperator = "";
        thisAosAvailability.aosArray = [];

        thisAosAvailability.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initAosArray();
        };

        thisAosAvailability.setVars = function () {
            thisAosAvailability.aosKey = this.getById(this.aosKeyId);
            thisAosAvailability.aosItem = this.getById(this.aosItemId);
        };

        thisAosAvailability.initAosArray = function () {
            var i, aosArray = this.aosArray || [],
                len = aosArray.length,
                aos, aosParam, json;

            for (i = 0; i < len; i += 1) {
                aosParam = aosArray[i];
                json = {
                    "showText": this.showText,
                    "hideText": this.hideText,
                    "showHideImgUp": this.imgUp,
                    "showHideImgDown": this.imgDown,
                    "containerId": aosParam.aosId,
                    "showHideTextEventId": aosParam.textId,
                    "showHideImgEventId": aosParam.imgId,
                    "itemArray": aosParam.itemArray,
                    "aosAvailability": this
                };
                aos = new SKYSALES.Class.Aos();
                aos.init(json);
                aosArray[i] = aos;
            }
        };

        thisAosAvailability.updateKeyValues = function (aosItem) {
            var keysString = aosItem.input.val() || '',
                keysArray = keysString.split(this.seperator) || [],
                len = keysArray.length;

            if (len > 0) {
                this.aosKey.val(keysArray[0]);
            }
            if (len > 1) {
                this.aosItem.val(keysArray[1]);
            }
        };
        return thisAosAvailability;
    };

    /*
    --------------------------------------------------------------------------------------------------------------------------------------------------
    BEGIN Trip Planner objects
    --------------------------------------------------------------------------------------------------------------------------------------------------
        
    */

    SKYSALES.Class.PassengerTypeDropDowns = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassengerTypeDropDowns = SKYSALES.Util.extendObject(parent),
            passengerTypeTemplate,
            passengerTypesContainer,
            passengerTypeArray;

        thisPassengerTypeDropDowns.passengerTypes = {};
        thisPassengerTypeDropDowns.maximumPassengersPerType = 7;
        thisPassengerTypeDropDowns.passengerTypeDropDownArray = [];
        thisPassengerTypeDropDowns.passengerTypesCountHash = {};

        thisPassengerTypeDropDowns.setVars = function () {
            passengerTypeTemplate = this.getById('tripPlannerPassengerTypeTemplateId');
            passengerTypesContainer = this.getById('tripPlannerPassengerTypesContainer');
        };

        thisPassengerTypeDropDowns.getHtml = function () {
            var passengerTypeTemplateHtml = passengerTypeTemplate.text(),
                passengerTypeReplacedTokensHtml = '',
                passengerDropDownsHtml = '',
                passengerTypes = this.passengerTypes,
                name = '',
                key = '',
                value = {};

            for (key in passengerTypes) {
                if (passengerTypes.hasOwnProperty(key)) {
                    value = passengerTypes[key];
                    name = value.name;
                    passengerTypeReplacedTokensHtml = SKYSALES.Util.replace(passengerTypeTemplateHtml, /\[key\]/g, key);
                    passengerTypeReplacedTokensHtml = SKYSALES.Util.replace(passengerTypeReplacedTokensHtml, /\[name\]/g, name);
                    passengerDropDownsHtml += passengerTypeReplacedTokensHtml;
                }
            }

            return passengerDropDownsHtml;
        };

        thisPassengerTypeDropDowns.getPassengerTypeArray = function () {
            var passengerTypeArray = [],
                i = 0,
                maximumPassengersPerType = this.maximumPassengersPerType;

            for (i = 0; i <= maximumPassengersPerType; i += 1) {
                passengerTypeArray[i] = {
                    "code": i,
                    "name": i
                };
            }

            return passengerTypeArray;
        };

        thisPassengerTypeDropDowns.populatePassengerTypeDropDown = function (key, selectedItem) {
            var passengerTypeDropDown = $('#paxTypeCountDictionary_' + key),
                selectJson = {
                    "input": passengerTypeDropDown,
                    "objectArray": passengerTypeArray,
                    "selectedItem": selectedItem
                };

            SKYSALES.Util.populate(selectJson);
            thisPassengerTypeDropDowns.passengerTypeDropDownArray.push(passengerTypeDropDown);
        };

        thisPassengerTypeDropDowns.populatePassengerTypeDropDowns = function () {
            var passengerTypes = this.passengerTypes,
                passengerTypesCountHash = this.passengerTypesCountHash,
                selectedItem = 0,
                key = '',
                value = {};

            passengerTypeArray = this.getPassengerTypeArray();
            for (key in passengerTypes) {
                if (passengerTypes.hasOwnProperty(key)) {
                    value = passengerTypes[key];
                    selectedItem = passengerTypesCountHash[key];
                    thisPassengerTypeDropDowns.populatePassengerTypeDropDown(key, selectedItem);
                }
            }
        };

        thisPassengerTypeDropDowns.draw = function () {
            var passengerDropDownsHtml = '';

            passengerDropDownsHtml = this.getHtml();
            passengerTypesContainer.html(passengerDropDownsHtml);
        };

        thisPassengerTypeDropDowns.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.draw();
            this.populatePassengerTypeDropDowns();
        };

        return thisPassengerTypeDropDowns;
    };

    /*
    Name: 
    Class TripPlannerSearchFlight
    Param:
    None
    Return: 
    An instance of TripPlannerSearchFlight
    Functionality:
    Represents a single flight on the Trip Planner Search view flight list
    Notes:
                
    Class Hierarchy:
    SkySales -> TripPlannerSearchFlight
    */
    SKYSALES.Class.TripPlannerSearchFlight = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerSearchFlight = SKYSALES.Util.extendObject(parent),
            containerId = 'tripFlight_0',
            tripIsUnavailableId = 'tripIsUnavailable_0',
            tripHasNoFaresId = 'tripHasNoFares_0',
            originId = '',
            destinationId = '',
            lowFareId = '',
            flightLabelId = '',
            closeButtonId = '';

        thisTripPlannerSearchFlight.index = 0;
        thisTripPlannerSearchFlight.tripFlightTemplateHtml = '';
        thisTripPlannerSearchFlight.tripPlannerSearchFlights = {};
        thisTripPlannerSearchFlight.market = {};
        thisTripPlannerSearchFlight.flightDate = new Date();
        thisTripPlannerSearchFlight.container = {};
        thisTripPlannerSearchFlight.fullDateFormatString = 'yy-mm-dd';
        thisTripPlannerSearchFlight.tripIsUnavailable = {};
        thisTripPlannerSearchFlight.tripHasNoFares = {};
        thisTripPlannerSearchFlight.datePickerManager = {};
        thisTripPlannerSearchFlight.lowFare = {};
        thisTripPlannerSearchFlight.lowFareDom = {};
        thisTripPlannerSearchFlight.origin = '';
        thisTripPlannerSearchFlight.originInput = {};
        thisTripPlannerSearchFlight.originInputDom = {};
        thisTripPlannerSearchFlight.destination = '';
        thisTripPlannerSearchFlight.destinationInput = {};
        thisTripPlannerSearchFlight.destinationInputDom = {};
        thisTripPlannerSearchFlight.dayInput = {};
        thisTripPlannerSearchFlight.yearMonthInput = {};
        thisTripPlannerSearchFlight.flightLabel = {};
        thisTripPlannerSearchFlight.closeButton = {};
        thisTripPlannerSearchFlight.selectedClass = 'tpSelectedFlight';
        thisTripPlannerSearchFlight.journeyFareSellKey = '';

        thisTripPlannerSearchFlight.setVars = function () {
            var tripPlannerSearch = this.tripPlannerSearchFlights.tripPlannerSearch,
                containerIdFormat = tripPlannerSearch.flightContainerIdFormat,
                tripIsUnavailableIdFormat = tripPlannerSearch.tripIsUnavailableIdFormat,
                tripHasNoFaresIdFormat = tripPlannerSearch.tripHasNoFaresIdFormat,

                lowFareIdFormat = tripPlannerSearch.lowFareIdFormat,
                originIdFormat = tripPlannerSearch.originStationIdFormat,
                destinationIdFormat = tripPlannerSearch.destinationStationIdFormat,
                flightLabelIdFormat = tripPlannerSearch.flightLabelIdFormat,
                closeFlightButtonIdFormat = tripPlannerSearch.closeFlightButtonIdFormat;

            containerId = SKYSALES.Util.replace(containerIdFormat, '[index]', this.index);
            tripIsUnavailableId = SKYSALES.Util.replace(tripIsUnavailableIdFormat, '[index]', this.index);
            tripHasNoFaresId = SKYSALES.Util.replace(tripHasNoFaresIdFormat, '[index]', this.index);
            lowFareId = SKYSALES.Util.replace(lowFareIdFormat, '[index]', this.index);
            originId = SKYSALES.Util.replace(originIdFormat, '[index]', this.index);
            destinationId = SKYSALES.Util.replace(destinationIdFormat, '[index]', this.index);
            flightLabelId = SKYSALES.Util.replace(flightLabelIdFormat, '[index]', this.index);
            closeButtonId = SKYSALES.Util.replace(closeFlightButtonIdFormat, '[index]', this.index);
        };

        thisTripPlannerSearchFlight.getHtml = function () {
            //this.tripFlightTemplateHtml here is already replaced with the correct controlGroupId value
            var html = SKYSALES.Util.replace(this.tripFlightTemplateHtml, /\[index\]/g, this.index),
                oneBasedIndex = this.index + 1;
            html = SKYSALES.Util.replace(html, /\[oneBasedIndex\]/g, oneBasedIndex);
            return html;
        };

        thisTripPlannerSearchFlight.draw = function () {
            var tripFlightsContainer = this.tripPlannerSearchFlights.tripFlightsContainer,
                html = this.getHtml();

            tripFlightsContainer.append(html);
        };

        thisTripPlannerSearchFlight.setVarsAfterDrawAndInitMarket = function () {
            thisTripPlannerSearchFlight.container = this.getById(containerId);
            thisTripPlannerSearchFlight.tripIsUnavailable = this.getById(tripIsUnavailableId);
            thisTripPlannerSearchFlight.tripHasNoFares = this.getById(tripHasNoFaresId);
            thisTripPlannerSearchFlight.lowFare = this.getById(lowFareId);
            thisTripPlannerSearchFlight.lowFareDom = this.lowFare[0];
            thisTripPlannerSearchFlight.originInput = this.getById(originId);			
            thisTripPlannerSearchFlight.originInputDom = this.originInput[0];
            thisTripPlannerSearchFlight.flightLabel = this.getById(flightLabelId);
            this.originInput.val(this.origin);
            thisTripPlannerSearchFlight.destinationInput = this.getById(destinationId);
            thisTripPlannerSearchFlight.destinationInputDom = this.destinationInput[0];
            this.destinationInput.val(this.destination);
            thisTripPlannerSearchFlight.closeButton = this.getById(closeButtonId);
        };

        thisTripPlannerSearchFlight.populateFromDom = function () {
            var flightDate = null,
                market = this.market || {},
                marketDateArray = market.marketDateArray || [],
                marketDate = null;

            thisTripPlannerSearchFlight.destination = this.destinationInput.val() || "";
            thisTripPlannerSearchFlight.origin = this.originInput.val() || "";

            if (marketDateArray.length) {
                marketDate = marketDateArray[0].marketDate || $([]);
                flightDate = marketDate.val() || "";
                flightDate = SKYSALES.Util.parseIsoDate(flightDate);
            }

            if (flightDate) {
                thisTripPlannerSearchFlight.flightDate = flightDate;
            }
        };

        thisTripPlannerSearchFlight.initMarket = function () {		
            var index = this.index,
                tripPlannerSearch = this.tripPlannerSearchFlights.tripPlannerSearch,
                flightSearch = tripPlannerSearch.flightSearch,
                marketDateIdFormat = tripPlannerSearch.marketDateIdFormat,
                marketDayIdFormat = tripPlannerSearch.marketDayIdFormat,
                marketMonthYearIdFormat = tripPlannerSearch.marketMonthYearIdFormat,
                marketDateId = SKYSALES.Util.replace(marketDateIdFormat, '[index]', index),
                marketDayId = SKYSALES.Util.replace(marketDayIdFormat, '[index]', index),
                marketMonthYearId = SKYSALES.Util.replace(marketMonthYearIdFormat, '[index]', index),
                datePickerManager = {},
                initJson = {
                    "marketInputIdArray": [{
                        "originId": originId,						
                        "destinationId": destinationId
                    }],
                    "stationInputIdArray": [originId, destinationId],
                    "lowFareAvailabilityArray": [{
                        "showId": lowFareId,
                        "tripPlannerSearchFlight": this,
                        "marketDateId": marketDateId,
                        "originId": originId,
                        "destinationId": destinationId
                    }],
                    "marketDateIdArray": [{
                        "marketDateId": marketDateId,
                        "marketDayId": marketDayId,
                        "marketMonthYearId": marketMonthYearId,
                        "useJQueryDatePicker": false,
                        "fullDateFormatString": this.fullDateFormatString
                    }]
                };

            thisTripPlannerSearchFlight.market = new SKYSALES.Class.FlightSearchMarket();
            thisTripPlannerSearchFlight.market.flightSearch = flightSearch;
            thisTripPlannerSearchFlight.market.index = index;
            this.market.init(initJson);
            datePickerManager = this.market.marketDateArray[0].datePickerManager;
            thisTripPlannerSearchFlight.datePickerManager = datePickerManager;
            datePickerManager.datePopulate(this.flightDate);
            thisTripPlannerSearchFlight.dayInput = datePickerManager.day;
            thisTripPlannerSearchFlight.yearMonthInput = datePickerManager.yearMonth;
        };

        thisTripPlannerSearchFlight.selectFlight = function () {
            this.container.addClass(this.selectedClass);
        };

        thisTripPlannerSearchFlight.unselectFlight = function () {
            this.container.removeClass(this.selectedClass);
        };

        thisTripPlannerSearchFlight.selectCurrentFlight = function () {
            this.tripPlannerSearchFlights.unselectAll();
            this.selectFlight();
        };

        thisTripPlannerSearchFlight.focusOrigin = function () {
            this.originInput.focus();
        };

        thisTripPlannerSearchFlight.selectCurrentFlightHandler = function () {
            thisTripPlannerSearchFlight.selectCurrentFlight();
        };

        thisTripPlannerSearchFlight.removeCurrentFlightHandler = function () {
            thisTripPlannerSearchFlight.removeCurrentFlight();
        };

        thisTripPlannerSearchFlight.reapplyDateBoundsHandler = function () {
            thisTripPlannerSearchFlight.tripPlannerSearchFlights.reapplyDateBounds();
        };

        thisTripPlannerSearchFlight.removeCurrentFlight = function () {
            var tripPlannerSearchFlights = this.tripPlannerSearchFlights,
                tripPlannerSearch = tripPlannerSearchFlights.tripPlannerSearch;

            if (tripPlannerSearchFlights) {
                tripPlannerSearchFlights.removeSelectedFlight(this);
                tripPlannerSearch.updateRetainedJourneyFareSellKeys();
            }
        };

        thisTripPlannerSearchFlight.requireOriginAndDestination = function () {
            var setRequiredAttribute = SKYSALES.Util.setRequiredAttribute;

            setRequiredAttribute(this.originInput);
            setRequiredAttribute(this.destinationInput);
        };

        thisTripPlannerSearchFlight.dontRequireOriginAndDestination = function () {
            var removeRequiredAttribute = SKYSALES.Util.removeRequiredAttribute;

            removeRequiredAttribute(this.originInput);
            removeRequiredAttribute(this.destinationInput);
        };

        thisTripPlannerSearchFlight.validate = function () {
            this.tripPlannerSearchFlights.dontRequireOriginAndDestinationOnFlights();
            this.requireOriginAndDestination();
            return SKYSALES.Util.validate(this.lowFareDom);
        };

        thisTripPlannerSearchFlight.validateHandler = function () {
            return thisTripPlannerSearchFlight.validate();
        };

        thisTripPlannerSearchFlight.setNextFlightDestinationToThisFlightOrigin = function () {
            this.tripPlannerSearchFlights.setNextFlightDestinationToThisFlightOrigin(this);
        };

        thisTripPlannerSearchFlight.setNextFlightDestinationToThisFlightOriginHandler = function () {
            thisTripPlannerSearchFlight.setNextFlightDestinationToThisFlightOrigin();
        };

        thisTripPlannerSearchFlight.addEvents = function () {
            this.container.click(this.selectCurrentFlightHandler);
            this.closeButton.click(this.removeCurrentFlightHandler);
            this.originInput.focus(this.selectCurrentFlightHandler);
            this.yearMonthInput.focus(this.selectCurrentFlightHandler);
            //this.lowFare.click(this.validateHandler);
            this.destinationInput.blur(this.setNextFlightDestinationToThisFlightOriginHandler);
        };

        thisTripPlannerSearchFlight.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.draw();
            this.initMarket();
            this.setVarsAfterDrawAndInitMarket();
            this.addEvents();
        };

        thisTripPlannerSearchFlight.reinitializeFlight = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initMarket();
            this.setVarsAfterDrawAndInitMarket();
            this.addEvents();
        };

        thisTripPlannerSearchFlight.showTripIsUnavailable = function () {
            this.tripIsUnavailable.show();
        };

        thisTripPlannerSearchFlight.hideTripIsUnavailable = function () {
            this.tripIsUnavailable.hide();
        };

        thisTripPlannerSearchFlight.showTripHasNoFares = function () {
            this.tripHasNoFares.show();
        };

        thisTripPlannerSearchFlight.hideTripHasNoFares = function () {
            this.tripHasNoFares.hide();
        };

        thisTripPlannerSearchFlight.show = function () {
            this.container.show();
        };

        thisTripPlannerSearchFlight.hide = function () {
            this.container.hide();
        };

        thisTripPlannerSearchFlight.setOrigin = function (originParam) {
            thisTripPlannerSearchFlight.origin = originParam;
            this.originInput.val(originParam);
        };

        thisTripPlannerSearchFlight.clearStationPair = function () {
            var destination = this.destinationInput.val(),
                origin = this.originInput.val();

            if (destination === '') {
                this.originInput.val('');
            }
            if (origin === '') {
                this.destinationInput.val('');
            }
        };

        return thisTripPlannerSearchFlight;
    };

    /*
    Name: 
    Class TripPlannerSearchFlights
    Param:
    None
    Return: 
    An instance of TripPlannerSearchFlights
    Functionality:
    Represents all the flights on the Trip Planner Search view
    Notes:
                
    Class Hierarchy:
    SkySales -> TripPlannerSearchFlights
    */
    SKYSALES.Class.TripPlannerSearchFlights = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerSearchFlights = SKYSALES.Util.extendObject(parent);

        thisTripPlannerSearchFlights.flightSearch = {};
        thisTripPlannerSearchFlights.tripFlightsContainer = {};
        thisTripPlannerSearchFlights.tripFlightTemplateHtml = '';
        thisTripPlannerSearchFlights.flights = [];
        thisTripPlannerSearchFlights.tripPlannerSearch = {};
        thisTripPlannerSearchFlights.numberOfDaysApart = 3;
        thisTripPlannerSearchFlights.firstDisplayedFlightIndex = 0;
        thisTripPlannerSearchFlights.addFlightId = 'addFlight';
        thisTripPlannerSearchFlights.removeFlightId = 'removeFlight';
        thisTripPlannerSearchFlights.scrollLeftArrowId = 'tpLeftMove';
        thisTripPlannerSearchFlights.scrollRightArrowId = 'tpRightMove';
        thisTripPlannerSearchFlights.addFlightLink = {};
        thisTripPlannerSearchFlights.removeFlightLink = {};

        thisTripPlannerSearchFlights.setVars = function () {
            thisTripPlannerSearchFlights.tripFlightsContainer = $('#tripFlightsContainer');
            thisTripPlannerSearchFlights.tripFlightTemplateHtml = $('#tripFlightTemplate').text();
            thisTripPlannerSearchFlights.addFlightLink = this.getById(this.addFlightId);
            thisTripPlannerSearchFlights.removeFlightLink = this.getById(this.removeFlightId);
            thisTripPlannerSearchFlights.scrollLeftArrow = this.getById(this.scrollLeftArrowId);
            thisTripPlannerSearchFlights.scrollRightArrow = this.getById(this.scrollRightArrowId);
        };

        thisTripPlannerSearchFlights.getPreviousFlightDate = function (index) {
            var previousFlightDate = new Date(),
                previousFlight = {};

            if (index > 0) {
                previousFlight = this.flights[index - 1];
                previousFlightDate = previousFlight.datePickerManager.getDate();
            }
            return previousFlightDate;
        };

        thisTripPlannerSearchFlights.setJsonOriginToPreviousFlightDestination = function (index, initJson) {
            var previousFlight, previousFlightDestination = '';

            if (index > 0) {
                previousFlight = this.flights[index - 1];
                previousFlightDestination = previousFlight.destinationInput.val();
                if (previousFlightDestination !== '') {
                    initJson.origin = previousFlightDestination;
                }
            }
            return initJson;
        };

        thisTripPlannerSearchFlights.setNextFlightDestinationToThisFlightOrigin = function (sourceFlight) {
            var sourceFlightIndex = sourceFlight.index,
                targetFlight = {};

            if (sourceFlightIndex < (this.flights.length - 1)) {
                targetFlight = this.flights[sourceFlightIndex + 1];
                targetFlight.setOrigin(sourceFlight.destinationInput.val());
            }
        };

        thisTripPlannerSearchFlights.addFlightWithIndex = function (index) {
            var tripFlight = new SKYSALES.Class.TripPlannerSearchFlight(),
                previousFlightDate = this.getPreviousFlightDate(index),
                flightDate = previousFlightDate,
                initJson = {},
                controlGroupId = this.tripPlannerSearch.controlGroupId || '';

            flightDate.setDate(previousFlightDate.getDate() + this.numberOfDaysApart);
            initJson = {
                "tripFlightTemplateHtml": SKYSALES.Util.replace(this.tripFlightTemplateHtml, /\[controlGroupId\]/g, controlGroupId),
                "tripPlannerSearchFlights": this,
                "index": index,
                "flightDate": flightDate
            };
            initJson = this.setJsonOriginToPreviousFlightDestination(index, initJson);
            tripFlight.init(initJson);
            thisTripPlannerSearchFlights.flights[index] = tripFlight;
        };

        thisTripPlannerSearchFlights.toggleAddRemoveLinks = function () {
            var flightsLength = this.flights.length;

            if (flightsLength === 1) {
                this.removeFlightLink.hide();
                this.addFlightLink.show();
            } else if (flightsLength === 12) {
                this.removeFlightLink.show();
                this.addFlightLink.hide();
            } else {
                this.removeFlightLink.show();
                this.addFlightLink.show();
            }
        };

        thisTripPlannerSearchFlights.addFlight = function () {
            var newIndex = this.flights.length;

            this.addFlightWithIndex(newIndex);
            this.showLast4Flights();
            this.toggleAddRemoveLinks();
            this.toggleRemoveFlightLabel();
            this.toggleScrollArrows();
        };

        thisTripPlannerSearchFlights.removeFlight = function () {
            var tripPlannerSearch = this.tripPlannerSearch,
                lastIndex = this.flights.length - 1,
                flight = this.flights[lastIndex];

            flight.container.remove();
            this.flights.splice(lastIndex, 1);
            if (tripPlannerSearch) {
                tripPlannerSearch.updateRetainedJourneyFareSellKeys();
            }
            this.showLast4Flights();

            this.toggleAddRemoveLinks();
            this.toggleRemoveFlightLabel();
            this.toggleScrollArrows();
        };

        thisTripPlannerSearchFlights.removeSelectedFlight = function (flight) {
            var tripPlannerSearchFlights = this.flights,
                flightsLength = 0,
                index = 0;

            if (flight) {
                index = flight.index;
                flight.container.remove();
                tripPlannerSearchFlights.splice(flight.index, 1);
                flightsLength = tripPlannerSearchFlights.length;

                this.tripFlightsContainer.hide();
                this.reinitializeAndRedrawFlights();
                if (flightsLength - index <= 4) {
                    this.showLast4Flights();
                } else if (index < 4) {
                    this.show4FlightsFromIndex(0);
                } else {
                    this.show4FlightsFromIndex(index);
                }
                this.tripFlightsContainer.show();
                this.toggleScrollArrows();
                this.toggleRemoveFlightLabel();
                this.toggleAddRemoveLinks();
                this.flights = tripPlannerSearchFlights;
            }
        };



        thisTripPlannerSearchFlights.reinitializeAndRedrawFlights = function () {
            var i = 0,
                tripPlannerSearchFlights = this.flights,
                flight = {},
                length = tripPlannerSearchFlights.length,
                initFlightJsonArray = [],
                initFlightJson = {},
                html = '',
                controlGroupId = this.tripPlannerSearch.controlGroupId || '';

            for (i = 0; i < length; i += 1) {
                flight = tripPlannerSearchFlights[i];
                flight.index = i;
                flight.populateFromDom();

                initFlightJson = {
                    "destination": flight.destination,
                    "flightDate": flight.flightDate,
                    "index": flight.index,
                    "origin": flight.origin,
                    "tripFlightTemplateHtml": SKYSALES.Util.replace(flight.tripFlightTemplateHtml, /\[controlGroupId\]/g, controlGroupId),
                    "tripPlannerSearchFlights": flight.tripPlannerSearchFlights,
                    "journeyFareSellKey": flight.journeyFareSellKey
                };
                initFlightJsonArray.push(initFlightJson);
                html = html + flight.getHtml();
            }

            this.tripFlightsContainer.html(html);

            for (i = 0; i < length; i += 1) {
                flight = tripPlannerSearchFlights[i];
                flight.reinitializeFlight(initFlightJsonArray[i]);
                tripPlannerSearchFlights[i] = flight;
            }
            this.flights = tripPlannerSearchFlights;
        };

        thisTripPlannerSearchFlights.toggleRemoveFlightLabel = function () {
            var flights = this.flights,
                length = flights.length,
                flight = {};

            if (length > 1) {
                flight = flights[0];
                flight.closeButton.show();
            }
            if (length === 1) {
                flight = flights[0];
                flight.closeButton.hide();
            }
        };

        thisTripPlannerSearchFlights.addFlightHandler = function () {
            thisTripPlannerSearchFlights.addFlight();
        };

        thisTripPlannerSearchFlights.removeFlightHandler = function () {
            thisTripPlannerSearchFlights.removeFlight();
        };

        thisTripPlannerSearchFlights.unselectAll = function () {
            var flightsArrayLength = this.flights.length,
                index = 0,
                flight = {};

            for (index = 0; index < flightsArrayLength; index += 1) {
                flight = this.flights[index];
                flight.unselectFlight();
            }
        };

        thisTripPlannerSearchFlights.parseDate = function (dateString) {
            var dateParts = dateString.split('-'),
                dateYear = dateParts[0],
                dateMonth = dateParts[1],
                dateDay = dateParts[2],
                dateObject = new Date(dateYear, dateMonth - 1, dateDay);

            return dateObject;
        };

        thisTripPlannerSearchFlights.addFlightFromViewModel = function (index, dateMarket) {
            var tripFlight = new SKYSALES.Class.TripPlannerSearchFlight(),
                controlGroupId = this.tripPlannerSearch.controlGroupId || '',
                dateString = dateMarket.departureDate,
                flightDate = this.parseDate(dateString),
                initJson = {
                    "tripFlightTemplateHtml": SKYSALES.Util.replace(this.tripFlightTemplateHtml, /\[controlGroupId\]/g, controlGroupId),
                    "tripPlannerSearchFlights": this,
                    "index": index,
                    "flightDate": flightDate,
                    "origin": dateMarket.originStation,
                    "destination": dateMarket.destinationStation,
                    "journeyFareSellKey": this.tripPlannerSearch.originalJourneyFareSellKeys[index] || ''
                };

            tripFlight.init(initJson);
            thisTripPlannerSearchFlights.flights[index] = tripFlight;
        };

        thisTripPlannerSearchFlights.selectFirstFlight = function () {
            var firstFlight = this.flights[0];

            firstFlight.selectCurrentFlight();
            firstFlight.focusOrigin();
        };

        thisTripPlannerSearchFlights.initFlights = function () {
            var i = 0,
                dateMarkets = this.tripPlannerSearch.dateMarkets,
                dateMarketsLength = dateMarkets.length,
                dateMarket = {};

            for (i = 0; i < dateMarketsLength; i += 1) {
                dateMarket = dateMarkets[i];
                this.addFlightFromViewModel(i, dateMarket);
            }
            this.show4FlightsFromIndex(0);
            this.toggleAddRemoveLinks();
            this.toggleScrollArrows();
            this.selectFirstFlight();
        };

        thisTripPlannerSearchFlights.toggleScrollArrows = function () {
            var flightsLength = this.flights.length,
                firstDisplayedFlightIndex = this.firstDisplayedFlightIndex;

            if (flightsLength <= 4) {
                this.scrollLeftArrow.hide();
                this.scrollRightArrow.hide();
            } else if (firstDisplayedFlightIndex === 0) {
                this.scrollLeftArrow.hide();
                this.scrollRightArrow.show();
            } else if (firstDisplayedFlightIndex === flightsLength - 4) {
                this.scrollLeftArrow.show();
                this.scrollRightArrow.hide();
            } else {
                this.scrollLeftArrow.show();
                this.scrollRightArrow.show();
            }
        };

        thisTripPlannerSearchFlights.scrollLeft = function () {
            this.show4FlightsFromIndex(this.firstDisplayedFlightIndex - 1);
            this.toggleScrollArrows();
        };

        thisTripPlannerSearchFlights.scrollRight = function () {
            var flightsLength = this.flights.length;

            this.show4FlightsFromIndex(this.firstDisplayedFlightIndex + 1, flightsLength);
            this.toggleScrollArrows();
        };

        thisTripPlannerSearchFlights.scrollLeftHandler = function () {
            thisTripPlannerSearchFlights.scrollLeft();
        };

        thisTripPlannerSearchFlights.scrollRightHandler = function () {
            thisTripPlannerSearchFlights.scrollRight();
        };

        thisTripPlannerSearchFlights.addEvents = function () {
            this.addFlightLink.click(this.addFlightHandler);
            this.removeFlightLink.click(this.removeFlightHandler);
            this.scrollLeftArrow.click(this.scrollLeftHandler);
            this.scrollRightArrow.click(this.scrollRightHandler);
        };

        thisTripPlannerSearchFlights.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initFlights();
            this.toggleRemoveFlightLabel();
            this.addEvents();
        };

        thisTripPlannerSearchFlights.show4FlightsFromIndex = function (beginIndex, flightsLengthParam) {
            var flightsLength = flightsLengthParam || this.flights.length,
                endIndex = beginIndex + 3,
                i = 0;

            for (i = 0; i < flightsLength; i += 1) {
                if ((i >= beginIndex) && (i <= endIndex)) {
                    this.flights[i].show();
                } else {
                    this.flights[i].hide();
                }
            }
            thisTripPlannerSearchFlights.firstDisplayedFlightIndex = beginIndex;
        };

        thisTripPlannerSearchFlights.showLast4Flights = function () {
            var flightsLength = this.flights.length,
                beginIndex = 0;

            if (flightsLength > 3) {
                beginIndex = flightsLength - 4;
                this.show4FlightsFromIndex(beginIndex, flightsLength);
            }
        };

        thisTripPlannerSearchFlights.validateDateBounds = function () {
            var i = 0,
                flights = this.flights,
                flightsLength = flights.length,
                lastFlightIndex = flightsLength - 1,
                currentFlight = {},
                today = new Date(),
                firstBeginDateBound = new Date(),
                lastEndDateBound = new Date(),
                beginDateBound = {},
                endDateBound = {},
                previousFlight = {},
                nextFlight = {},
                datePickerManager = {};

            firstBeginDateBound.setDate(today.getDate() - 1);
            lastEndDateBound.setYear(today.getFullYear() + 1);
            beginDateBound = firstBeginDateBound;

            for (i = 0; i < flightsLength; i += 1) {
                currentFlight = flights[i];
                if (i > 0) {
                    previousFlight = flights[i - 1];
                    beginDateBound = previousFlight.datePickerManager.getDate();
                }
                if (i === lastFlightIndex) {
                    endDateBound = lastEndDateBound;
                } else {
                    nextFlight = flights[i + 1];
                    endDateBound = nextFlight.datePickerManager.getDate();
                }
                datePickerManager = currentFlight.datePickerManager;
                datePickerManager.setBeginDateBound(beginDateBound);
                datePickerManager.setEndDateBound(endDateBound);
                datePickerManager.datePopulate();
            }
        };

        thisTripPlannerSearchFlights.dontRequireOriginAndDestinationOnFlights = function () {
            var flights = this.flights || [],
                flightsLength = flights.length,
                i = 0,
                flight = {};

            for (i = 1; i < flightsLength; i += 1) {
                flight = flights[i];
                flight.dontRequireOriginAndDestination();
            }
        };

        thisTripPlannerSearchFlights.firstFlightRequireOriginAndDestination = function () {
            var flights = this.flights,
                flight = flights[0];

            this.dontRequireOriginAndDestinationOnFlights();
            flight.requireOriginAndDestination();
        };

        thisTripPlannerSearchFlights.clearIncompleteFlights = function () {
            var flight = {},
                flights = this.flights,
                flightsLength = flights.length,
                i = 0;

            for (i = 0; i < flightsLength; i += 1) {
                flight = flights[i];
                flight.clearStationPair();
            }
        };

        return thisTripPlannerSearchFlights;
    };

    /*
    Name: 
    Class TripPlannerSearch
    Param:
    None
    Return: 
    An instance of TripPlannerSearch
    Functionality:
    Represents the top level container for all the Trip Planner Search view components and functionality
    Notes:
                
    Class Hierarchy:
    SkySales -> TripPlannerSearch
    */
    SKYSALES.Class.TripPlannerSearch = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerSearch = SKYSALES.Util.extendObject(parent);

        thisTripPlannerSearch.controlGroupId = '';
        thisTripPlannerSearch.flightSearchJson = {};
        thisTripPlannerSearch.flightSearch = {};
        thisTripPlannerSearch.tripPlannerSearchDataJson = {};
        thisTripPlannerSearch.preferredFareDropDownId = 'preferredFareDropDown';
        thisTripPlannerSearch.passengerDiscountDropDownId = 'passengerDiscountDropDown';
        thisTripPlannerSearch.flightContainerIdFormat = 'tripFlight_[index]';
        thisTripPlannerSearch.tripIsUnavailableIdFormat = 'tripIsUnavailable_[index]';
        thisTripPlannerSearch.tripHasNoFaresIdFormat = 'tripHasNoFares_[index]';
        thisTripPlannerSearch.originStationIdFormat = '';
        thisTripPlannerSearch.destinationStationIdFormat = '';
        thisTripPlannerSearch.lowFareIdFormat = '';
        thisTripPlannerSearch.submitButtonId = '';
        thisTripPlannerSearch.submitButton = {};
        thisTripPlannerSearch.marketDateIdFormat = 'marketDate_[index]';
        thisTripPlannerSearch.marketDayIdFormat = 'marketDay_[index]';
        thisTripPlannerSearch.marketMonthYearIdFormat = 'marketMonthYear_[index]';
        thisTripPlannerSearch.addFlightId = 'addFlight';
        thisTripPlannerSearch.removeFlightId = 'removeFlight';
        thisTripPlannerSearch.flightLabelIdFormat = 'flightNumber_[index]';
        thisTripPlannerSearch.closeFlightButtonIdFormat = 'closeFlightButton_[index]';
        thisTripPlannerSearch.tripFlights = {};
        thisTripPlannerSearch.numberOfDaysApart = 4;
        thisTripPlannerSearch.preferredFareDropDown = {};
        thisTripPlannerSearch.passengerDiscountDropDown = {};
        thisTripPlannerSearch.passengerTypes = {};
        thisTripPlannerSearch.passengerTypeDropDowns = {};
        thisTripPlannerSearch.fareTypes = {};
        thisTripPlannerSearch.tripPlannerHelp = null;
        thisTripPlannerSearch.maximumPassengersPerType = 0;
        thisTripPlannerSearch.passengerDiscounts = {};
        thisTripPlannerSearch.dateMarkets = [];
        thisTripPlannerSearch.passengerTypesCount = [];
        thisTripPlannerSearch.passengerTypesCountHash = {};
        thisTripPlannerSearch.discountCode = '';
        thisTripPlannerSearch.preferredFare = '';
        thisTripPlannerSearch.residentCountry = '';
        thisTripPlannerSearch.originalJourneyFareSellKeys = '';
        thisTripPlannerSearch.retainedJourneyFareSellKeysId = 'retainedJourneyFareSellKeys';
        thisTripPlannerSearch.retainedJourneyFareSellKeys = {};

        // Turns passengerTypesCount into a hash for quick lookups.
        // Keying into passengerTypesCountHash with the passengerType you will get back 
        // the passenger type count. 
        // passengerTypeCountHash[passengerType] = { "ADT": 1, "CHD": 0 };
        thisTripPlannerSearch.populatePassengerTypesCountHash = function () {
            var passengerTypesCountArray = this.passengerTypesCount,
                passengerTypesCountHash = this.passengerTypesCountHash,
                key = '',
                value = {};

            for (key in passengerTypesCountArray) {
                if (passengerTypesCountArray.hasOwnProperty(key)) {
                    value = passengerTypesCountArray[key];
                    passengerTypesCountHash[key] = value;
                }
            }
        };

        thisTripPlannerSearch.setVars = function () {
            this.preferredFareDropDown = this.getById(this.preferredFareDropDownId);
            this.passengerDiscountDropDown = this.getById(this.passengerDiscountDropDownId);
            this.submitButton = this.getById(this.submitButtonId);
            this.retainedJourneyFareSellKeys = this.getById(this.retainedJourneyFareSellKeysId);
            this.populatePassengerTypesCountHash();

            this.originalJourneyFareSellKeys = this.originalJourneyFareSellKeys.split(',');
        };

        thisTripPlannerSearch.initRetainedJourneyFareSellKeys = function () {
            var retainedJourneyFareSellKeys = this.originalJourneyFareSellKeys || [];
            this.retainedJourneyFareSellKeys.val(retainedJourneyFareSellKeys.join());
        };

        thisTripPlannerSearch.updateRetainedJourneyFareSellKeys = function () {
            var tripPlannerSearchFlights = this.tripFlights || {},
                currentSearchFlights = tripPlannerSearchFlights.flights || {},
                flight = {},
                length = currentSearchFlights.length || 0,
                i = 0,
                retainedJourneyFareSellKeys = '';

            for (i = 0; i < length; i += 1) {
                flight = currentSearchFlights[i];
                if (retainedJourneyFareSellKeys === '') {
                    retainedJourneyFareSellKeys = flight.journeyFareSellKey;
                } else {
                    retainedJourneyFareSellKeys = retainedJourneyFareSellKeys + ',' + flight.journeyFareSellKey;
                }
            }
            this.retainedJourneyFareSellKeys.val(retainedJourneyFareSellKeys);
        };

        thisTripPlannerSearch.createPreferredFareDropDownArray = function () {
            var preferredFareDropDownArray = [],
                fareTypes = this.fareTypes || {},
                key = '',
                value = {};

            for (key in fareTypes) {
                if (fareTypes.hasOwnProperty(key)) {
                    value = fareTypes[key];
                    preferredFareDropDownArray.push({
                        "code": key,
                        "name": value.name
                    });
                }
            }

            return preferredFareDropDownArray;
        };

        thisTripPlannerSearch.populatePreferredFareDropDown = function () {
            var preferredFareDropDownArray = this.createPreferredFareDropDownArray(),
                selectJson = {
                    "input": this.preferredFareDropDown,
                    "objectArray": preferredFareDropDownArray,
                    "selectedItem": this.preferredFare
                };

            SKYSALES.Util.populate(selectJson);
        };

        thisTripPlannerSearch.createPassengerDiscountDropDownArray = function () {
            var passengerDiscountDropDownArray = [],
                passengerDiscounts = this.passengerDiscounts || {},
                key = '',
                value = {};

            for (key in passengerDiscounts) {
                if (passengerDiscounts.hasOwnProperty(key)) {
                    value = passengerDiscounts[key];
                    passengerDiscountDropDownArray.push({
                        "code": key,
                        "name": value.name
                    });
                }
            }

            return passengerDiscountDropDownArray;
        };

        thisTripPlannerSearch.populateDiscountDropDown = function () {
            var passengerDiscountDropDownArray = this.createPassengerDiscountDropDownArray(),
                selectJson = {
                    "input": this.passengerDiscountDropDown,
                    "objectArray": passengerDiscountDropDownArray,
                    "selectedItem": this.discountCode
                };

            SKYSALES.Util.populate(selectJson);
        };

        thisTripPlannerSearch.initFlightSearch = function () {
            var residentCountryDropDown = {},
                setRequiredAttribute = SKYSALES.Util.setRequiredAttribute;

            thisTripPlannerSearch.flightSearchJson.countryInputIdArray[0].defaultCountry = this.residentCountry;
            thisTripPlannerSearch.flightSearch = new SKYSALES.Class.FlightSearch();
            this.flightSearch.init(this.flightSearchJson);
            residentCountryDropDown = this.flightSearch.countryInputArray[0].input;
            setRequiredAttribute(residentCountryDropDown);
        };

        thisTripPlannerSearch.createAndPopulateDropDowns = function () {
            var initJson = {
                "passengerTypes": this.passengerTypes,
                "maximumPassengersPerType": this.maximumPassengersPerType,
                "passengerTypesCountHash": this.passengerTypesCountHash
            };

            thisTripPlannerSearch.passengerTypeDropDowns = new SKYSALES.Class.PassengerTypeDropDowns();
            this.passengerTypeDropDowns.init(initJson);
            this.populatePreferredFareDropDown();
            this.populateDiscountDropDown();
        };

        thisTripPlannerSearch.initTripFlights = function () {
            var initJson = {};

            thisTripPlannerSearch.tripFlights = new SKYSALES.Class.TripPlannerSearchFlights();
            initJson = {
                "tripPlannerSearch": this,
                "numberOfDaysApart": this.numberOfDaysApart,
                "addFlightId": this.addFlightId,
                "removeFlightId": this.removeFlightId
            };
            this.tripFlights.init(initJson);
        };

        thisTripPlannerSearch.validateFirstFlight = function () {
            this.tripFlights.firstFlightRequireOriginAndDestination();
            return SKYSALES.Util.validate(this.submitButton[0]);
        };

        thisTripPlannerSearch.validate = function () {
            var returnValue = null;

            returnValue = this.validateFirstFlight();
            if (returnValue) {
                this.tripFlights.clearIncompleteFlights();
            }
            return returnValue;
        };

        thisTripPlannerSearch.validateHandler = function () {
            var returnValue = thisTripPlannerSearch.validate();
            return returnValue;
        };

        thisTripPlannerSearch.addEvents = function () {
            this.submitButton.click(this.validateHandler);
        };

        thisTripPlannerSearch.init = function (json) {
            this.setSettingsByObject(json);
            this.setSettingsByObject(this.tripPlannerSearchDataJson);
            this.setVars();
            this.createAndPopulateDropDowns();
            this.initRetainedJourneyFareSellKeys();
            this.initFlightSearch();
            this.initTripFlights();
            this.addEvents();
            this.tripPlannerHelp = new SKYSALES.Class.TripPlannerHelp();
            this.tripPlannerHelp.init();
        };

        return thisTripPlannerSearch;
    };

    /*
    Name: 
    Class TripPlannerSelect
    Param:
    None
    Return:
    An instance of TripPlannerSelect
    Functionality:
    Handles the TripPlannerSelect control and is a page level javascript object.
    Notes:
    This is a page level javascript object. Than means that this object is meant for the tripplanner select page.
    It, and the objects it contains, contains everything needed for the trip planner select page. There are three methods
    that are defined here that get assigned to ojbects that the TripPlannerSelect object contains.  These are:
    deactivateAllSchedules(), updateTripSellKeyArray(), updateItinerarySummary().  This class is responsible for setting
    the correct value to the hidden input sellKeysInput. This control and others depend on the correct trip sell keys
    being set.  This class handles the drawing of the trip summary, journeys for the selected journey, and through containment
    the itinerary summary.  When a user comes to the select page this control will select the lowest fare if no fare has been
    selected.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> TripPlannerSelect
    */
    SKYSALES.Class.TripPlannerSelect = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerSelect = SKYSALES.Util.extendObject(parent);

        thisTripPlannerSelect.tripContainerId = 'tripContainerId';
        thisTripPlannerSelect.tripContainer = null;
        thisTripPlannerSelect.tripFlightTemplateId = 'tripFlightTemplateId';
        thisTripPlannerSelect.tripFlightTemplate = null;
        thisTripPlannerSelect.journeyContainerId = 'tpSelect';
        thisTripPlannerSelect.journeyContainer = null;
        thisTripPlannerSelect.tripJourneyInfoTemplateId = 'journeyTableTemplateId';
        thisTripPlannerSelect.tripJourneyInfoTemplate = null;
        thisTripPlannerSelect.itinerarySummaryContainerId = 'tpItinSummary';
        thisTripPlannerSelect.itinerarySummaryContainer = null;
        thisTripPlannerSelect.itineraryTableTemplateId = 'itineraryTableTemplateId';
        thisTripPlannerSelect.itineraryTableTemplate = null;
        thisTripPlannerSelect.TripAvailabilityResponse = {};
        thisTripPlannerSelect.ErrorsOccurred = null;
        thisTripPlannerSelect.leftPageButtonId = 'tpLeftMove';
        thisTripPlannerSelect.leftPageButton = null;
        thisTripPlannerSelect.rightPageButtonId = 'tpRightMove';
        thisTripPlannerSelect.rightPageButton = null;
        thisTripPlannerSelect.tripSelectedClass = 'tpSelectedPanel';
        thisTripPlannerSelect.tripSelectClass = 'tpSelectPanel';
        thisTripPlannerSelect.radioButtonSelectedClass = 'checked';
        thisTripPlannerSelect.itineraryJourneyInfoTemplateId = 'itineraryJourneyInfoTemplate';
        thisTripPlannerSelect.itineraryJourneyInfoTemplate = null;
        thisTripPlannerSelect.itineraryJourneyInfoStripedTemplateId = 'itineraryJourneyInfoStripedTemplate';
        thisTripPlannerSelect.itineraryJourneyInfoStripedTemplate = null;
        thisTripPlannerSelect.selectViewPricesCurrencyInfoTemplateId = 'selectViewPricesCurrencyInfoTemplate';
        thisTripPlannerSelect.selectViewPricesCurrencyInfoTemplate = null;
        thisTripPlannerSelect.tripFlightHeaderInfoTemplateId = 'tripFlightHeaderInfoTemplateId';
        thisTripPlannerSelect.tripFlightHeaderInfoTemplate = null;
        thisTripPlannerSelect.tripFlightHeaderInfoContainerId = 'tripFlightHeaderInfo';
        thisTripPlannerSelect.tripFlightHeaderInfoContainer = null;
        thisTripPlannerSelect.tripPlannerHelp = null;
        thisTripPlannerSelect.sellKeysInputId = 'tripPlannerSellKeys';
        thisTripPlannerSelect.sellKeysInput = null;
        thisTripPlannerSelect.JourneyFareSellKeys = '';

        thisTripPlannerSelect.schedulesArray = [];
        thisTripPlannerSelect.tripSellKeyArray = [];
        thisTripPlannerSelect.itinerarySummary = null;

        thisTripPlannerSelect.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.itinerarySummary = new SKYSALES.Class.TripPlannerItinerarySummarySelect();
            this.itinerarySummary.init();
            this.itinerarySummary.drawSelectViewItinerarySummary = this.drawItinerarySummaryInfo;
            this.initSchedulesArray();
            this.draw();
            this.setVarsAfterDraw();
            this.addEvents();
            this.selectAndDrawInitialTrip();
            this.setVarsAfterDrawSchedulesJourneyInfo();
            this.updateSelectedRadioButtons();
            this.initSellKeyArray();
            this.updateItinerarySummary();
            this.drawItinerarySummaryInfo();
            this.tripPlannerHelp = new SKYSALES.Class.TripPlannerHelp();
            this.tripPlannerHelp.init();
        };

        thisTripPlannerSelect.setVars = function () {
            thisTripPlannerSelect.tripContainer = this.getById(this.tripContainerId);
            thisTripPlannerSelect.tripFlightTemplate = this.getById(this.tripFlightTemplateId);
            thisTripPlannerSelect.journeyContainer = this.getById(this.journeyContainerId);
            thisTripPlannerSelect.tripJourneyInfoTemplate = this.getById(this.tripJourneyInfoTemplateId);
            thisTripPlannerSelect.itinerarySummaryContainer = this.getById(this.itinerarySummaryContainerId);
            thisTripPlannerSelect.itineraryTableTemplate = this.getById(this.itineraryTableTemplateId);
            thisTripPlannerSelect.leftPageButton = this.getById(this.leftPageButtonId);
            thisTripPlannerSelect.rightPageButton = this.getById(this.rightPageButtonId);
            thisTripPlannerSelect.itineraryJourneyInfoStripedTemplate = this.getById(this.itineraryJourneyInfoStripedTemplateId);
            thisTripPlannerSelect.itineraryJourneyInfoTemplate = this.getById(this.itineraryJourneyInfoTemplateId);
            thisTripPlannerSelect.schedulesArray = this.TripAvailabilityResponse.Schedules || [];
            thisTripPlannerSelect.sellKeysInput = this.getById(this.sellKeysInputId);
            thisTripPlannerSelect.selectViewPricesCurrencyInfoTemplate = this.getById(this.selectViewPricesCurrencyInfoTemplateId);
            thisTripPlannerSelect.tripFlightHeaderInfoTemplate = this.getById(this.tripFlightHeaderInfoTemplateId);
            thisTripPlannerSelect.tripFlightHeaderInfoContainer = this.getById(this.tripFlightHeaderInfoContainerId);
        };

        thisTripPlannerSelect.initSchedulesArray = function () {
            this.JourneyFareSellKeys = this.JourneyFareSellKeys.split(',');

            var i = 0,
                schedulesArray = this.TripAvailabilityResponse.Schedules || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = new SKYSALES.Class.Schedule();
                schedule.index = i;
                schedule.deactivateAllSchedules = this.deactivateAllSchedules;
                schedule.updateTripSellKeyArray = this.updateTripSellKeyArray;
                schedule.updateItinerarySummary = this.updateItinerarySummary;
                if (this.JourneyFareSellKeys[i] !== undefined) {
                    schedule.journeyFareSellKey = this.JourneyFareSellKeys[i];
                }
                schedule.updateTrips = this.updateTripsHandler;
                if (i < 4) {
                    schedule.isShowing = true;
                }
                schedule.init(schedulesArray[i]);
                schedulesArray[i] = schedule;
            }
        };

        thisTripPlannerSelect.setVarsAfterDraw = function () {
            var i = 0,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                schedule.setVarsAfterDraw();
            }
        };

        thisTripPlannerSelect.setVarsAfterDrawSchedulesJourneyInfo = function () {
            var i = 0,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                if (schedule.selected === true) {
                    schedule.container.removeClass(this.tripSelectClass);
                    schedule.container.addClass(this.tripSelectedClass);
                }
            }
        };

        thisTripPlannerSelect.addEvents = function () {
            thisTripPlannerSelect.addTripContainerEvents();

            var i = 0,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                schedule.addEvents();
            }
        };

        thisTripPlannerSelect.addTripContainerEvents = function () {
            this.tripContainer.click(this.updateTripContainerHandler);
            this.leftPageButton.click(this.updateTripsLeftHandler);
            this.rightPageButton.click(this.updateTripsRightHandler);
        };

        thisTripPlannerSelect.updateTripsLeftHandler = function () {
            var i = 0,
                firstShowingTrip = -1,
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null,
                endingSchedule = -1,
                beginningSchedule = -1,
                previousSchedule = null;

            if (len > 4) {
                for (i = len - 1; i > -1; i -= 1) {
                    schedule = schedulesArray[i];
                    if (schedule.isShowing === true) {
                        firstShowingTrip = i;
                    }
                }

                i = 0;
                if (firstShowingTrip > 0) {
                    previousSchedule = schedulesArray[firstShowingTrip - 1];
                    if (previousSchedule !== undefined && previousSchedule !== null) {
                        beginningSchedule = firstShowingTrip - 1;
                        endingSchedule = firstShowingTrip + 3;

                        for (i = 0; i < len; i += 1) {
                            schedule = schedulesArray[i];
                            schedule.isShowing = false;
                            schedule.selected = false;
                        }

                        for (i = beginningSchedule; i < endingSchedule; i += 1) {
                            schedule = schedulesArray[i];
                            if (i === beginningSchedule) {
                                schedule.selected = true;
                            }
                            schedule.isShowing = true;
                        }

                        thisTripPlannerSelect.tripContainer.empty();
                        thisTripPlannerSelect.drawTripsInfo();
                        thisTripPlannerSelect.drawTripHeaderInfo();
                        thisTripPlannerSelect.setVarsAfterDraw();
                        thisTripPlannerSelect.addEvents();
                        thisTripPlannerSelect.drawScheduleJourneysInfo();
                        thisTripPlannerSelect.setVarsAfterDrawSchedulesJourneyInfo();
                        thisTripPlannerSelect.updateSelectedRadioButtons();
                    }
                }
            }
        };

        thisTripPlannerSelect.updateTripsRightHandler = function () {
            var i = 0,
                lastShowingTrip = -1,
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null,
                endingSchedule = -1,
                beginningSchedule = -1,
                nextSchedule = null;

            if (len > 4) {
                for (i = 0; i < len; i += 1) {
                    schedule = schedulesArray[i];
                    if (schedule.isShowing === true) {
                        lastShowingTrip = i;
                    }
                }

                i = 0;

                if (lastShowingTrip < 12) {
                    nextSchedule = schedulesArray[lastShowingTrip + 1];
                    if (nextSchedule !== undefined && nextSchedule !== null) {
                        endingSchedule = lastShowingTrip + 1;
                        beginningSchedule = endingSchedule - 3;

                        for (i = 0; i < len; i += 1) {
                            schedule = schedulesArray[i];
                            schedule.isShowing = false;
                            schedule.selected = false;
                        }

                        for (i = beginningSchedule; i <= endingSchedule; i += 1) {
                            schedule = schedulesArray[i];
                            if (i === endingSchedule) {
                                schedule.selected = true;
                            }
                            schedule.isShowing = true;
                        }
                        thisTripPlannerSelect.tripContainer.empty();
                        thisTripPlannerSelect.drawTripsInfo();
                        thisTripPlannerSelect.drawTripHeaderInfo();
                        thisTripPlannerSelect.setVarsAfterDraw();
                        thisTripPlannerSelect.addEvents();
                        thisTripPlannerSelect.drawScheduleJourneysInfo();
                        thisTripPlannerSelect.setVarsAfterDrawSchedulesJourneyInfo();
                        thisTripPlannerSelect.updateSelectedRadioButtons();
                    }
                }
            }
        };

        thisTripPlannerSelect.updateTripContainerHandler = function () {
            var i = 0,
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];

                schedule.container.removeClass(thisTripPlannerSelect.tripSelectedClass);
                schedule.container.addClass(thisTripPlannerSelect.tripSelectClass);

                if (schedule.selected === true) {
                    schedule.container.removeClass(thisTripPlannerSelect.tripSelectClass);
                    schedule.container.addClass(thisTripPlannerSelect.tripSelectedClass);
                    thisTripPlannerSelect.journeyContainer.empty();
                    thisTripPlannerSelect.drawScheduleJourneysInfo();
                    thisTripPlannerSelect.updateSelectedRadioButtons();
                }
            }
        };

        thisTripPlannerSelect.deactivateAllSchedules = function () {
            var i = 0,
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                schedule.selected = false;
            }
        };

        thisTripPlannerSelect.selectAndDrawInitialTrip = function () {
            var i = 0,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                if (i === 0) {
                    schedule.selected = true;
                }
            }

            thisTripPlannerSelect.drawScheduleJourneysInfo();
        };

        thisTripPlannerSelect.getTripsHeaderInfoHtml = function () {
            var html = '',
                i = 0,
                firstShowingSchedule = -1,
                lastShowingSchedule = -1,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;

            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                if (schedule.isShowing === true) {
                    if (firstShowingSchedule === -1) {
                        firstShowingSchedule = i + 1;
                    }

                    lastShowingSchedule = i + 1;
                }
            }

            html = this.tripFlightHeaderInfoTemplate.text();

            html = SKYSALES.Util.replace(html, /\[firstShowingFligt\]/g, firstShowingSchedule);
            html = SKYSALES.Util.replace(html, /\[lastShowingFlight\]/g, lastShowingSchedule);
            html = SKYSALES.Util.replace(html, /\[totalNumberOfFlights\]/g, len);

            return html;
        };

        thisTripPlannerSelect.getTripsHtml = function () {
            var html = '',
                tripHtml = '',
                i = 0,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;

            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                if (schedule.isShowing === true) {
                    html += this.tripFlightTemplate.text();
                    tripHtml = schedule.getTripsHtml();
                    html = SKYSALES.Util.replace(html, /\[tripFlightInfo\]/g, tripHtml);
                    html = SKYSALES.Util.replace(html, /\[index\]/g, i + 1);
                }
            }

            return html;
        };

        thisTripPlannerSelect.getJourneyHtml = function () {
            var html = '',
                journeyHtml = '',
                i = 0,
                tripId = '',
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;

            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                if (schedule.selected === true) {
                    html = this.tripJourneyInfoTemplate.text();
                    journeyHtml += schedule.getJourneyHtml();
                    tripId = 'trip' + i;

                    journeyHtml = SKYSALES.Util.replace(journeyHtml, /\[radioButtonIdTrip\]/g, tripId);
                    journeyHtml = SKYSALES.Util.replace(journeyHtml, /\[radioGroupName\]/g, tripId);
                    html = SKYSALES.Util.replace(html, /\[jouneyInfoAndFares\]/, journeyHtml);
                }
            }

            return html;
        };

        thisTripPlannerSelect.getItineraryHtml = function () {
            var html = this.itineraryTableTemplate.text(),
                grandTotalPrice = 0,
                itineraryHtml = this.itinerarySummary.getSelectViewItineraryJourneysHtml(),
                allPassengerFeesHtml = this.itinerarySummary.getSelectViewItineraryAllPassengerFeesHtml(),
                currencyPriceHtml = this.selectViewPricesCurrencyInfoTemplate.text();

            html = SKYSALES.Util.replace(html, /\[itinerarySummaryBody\]/, itineraryHtml);
            html = SKYSALES.Util.replace(html, /\[allPassengerFees\]/, allPassengerFeesHtml);
            if (this.itinerarySummary.Booking !== null && this.itinerarySummary.Booking.BookingPricing !== null) {
                grandTotalPrice = SKYSALES.Util.convertToLocaleCurrency(this.itinerarySummary.Booking.BookingPricing.TotalBookingPrice);
                currencyPriceHtml = SKYSALES.Util.replace(currencyPriceHtml, /\[totalPrice\]/, grandTotalPrice);
                //            currencyPriceHtml = SKYSALES.Util.replace(currencyPriceHtml, /\[currencySymbol\]/, this.itinerarySummary.Booking.BookingPricing.CurrencyCode);
                currencyPriceHtml = SKYSALES.Util.replace(currencyPriceHtml, /\[currencyName\]/, this.itinerarySummary.Booking.BookingPricing.CurrencyDescription);
            } else {
                currencyPriceHtml = SKYSALES.Util.replace(currencyPriceHtml, /\[totalPrice\]/, '');
            }
            html = SKYSALES.Util.replace(html, /\[pricesCurrencyInfo\]/, currencyPriceHtml);

            return html;
        };

        thisTripPlannerSelect.draw = function () {
            thisTripPlannerSelect.drawTripsInfo();
            thisTripPlannerSelect.drawTripHeaderInfo();
        };

        thisTripPlannerSelect.drawScheduleJourneysInfo = function () {
            var journeyHtml = thisTripPlannerSelect.getJourneyHtml(),
                i = 0,
                schedulesArray = this.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;

            thisTripPlannerSelect.journeyContainer.html(journeyHtml);

            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                schedule.setVarsAfterDraw('radioInput_' + 'trip' + i);
                schedule.addEventsAfterDraw();
            }

            if (SKYSALES.common) {
                SKYSALES.common.stripeTables();
            }
        };

        thisTripPlannerSelect.drawTripHeaderInfo = function () {
            var tripHeaderInfoHtml = this.getTripsHeaderInfoHtml();
            this.tripFlightHeaderInfoContainer.html(tripHeaderInfoHtml);
        };

        thisTripPlannerSelect.drawTripsInfo = function () {
            var tripsHtml = this.getTripsHtml();
            this.tripContainer.html(tripsHtml);
        };

        thisTripPlannerSelect.drawItinerarySummaryInfo = function () {
            var itineraryHtml = thisTripPlannerSelect.getItineraryHtml();
            thisTripPlannerSelect.itinerarySummaryContainer.html(itineraryHtml);
            if (SKYSALES.common) {
                SKYSALES.common.stripeTables();
            }
        };

        thisTripPlannerSelect.updateSelectedRadioButtons = function () {
            var i = 0,
                selectedRadioButtonId = '',
                selectedRadioButton = null,
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;

            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];

                if (schedule.selected === true) {
                    selectedRadioButtonId = 'radioInput_trip' + i + schedule.getSelectedTripJourneyFare();
                    break;
                }
            }

            selectedRadioButton = this.getById(selectedRadioButtonId);

            if (selectedRadioButton !== null) {
                selectedRadioButton.attr(this.radioButtonSelectedClass, this.radioButtonSelectedClass);
            }
        };

        thisTripPlannerSelect.initSellKeyArray = function () {
            var i = 0,
                sellKey = '',
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                sellKey = schedule.getSelectedJourneyFareSellKey();
                thisTripPlannerSelect.tripSellKeyArray[i] = sellKey;
            }

            thisTripPlannerSelect.sellKeysInput.value = this.tripSellKeyArray.toString();
            thisTripPlannerSelect.sellKeysInput.val(this.tripSellKeyArray.toString());
            this.itinerarySummary.sellKeys.val(this.tripSellKeyArray.toString());
        };

        thisTripPlannerSelect.updateItinerarySummary = function () {
            thisTripPlannerSelect.itinerarySummary.getPriceItineraryResponse(thisTripPlannerSelect.tripSellKeyArray.toString());
        };

        thisTripPlannerSelect.updateTripSellKeyArray = function (tripIndex, tripSellKey) {
            if (thisTripPlannerSelect.tripSellKeyArray[tripIndex] !== undefined) {
                thisTripPlannerSelect.tripSellKeyArray[tripIndex] = tripSellKey;
                thisTripPlannerSelect.sellKeysInput.value = '';
                thisTripPlannerSelect.sellKeysInput.value = thisTripPlannerSelect.tripSellKeyArray.toString();
                thisTripPlannerSelect.sellKeysInput.val(thisTripPlannerSelect.tripSellKeyArray.toString());
            }
        };

        thisTripPlannerSelect.updateTripsHandler = function () {
            thisTripPlannerSelect.updateTrips();
        };

        thisTripPlannerSelect.updateTrips = function () {
            this.drawTripsInfo();
            var i = 0,
                schedulesArray = thisTripPlannerSelect.schedulesArray || [],
                len = schedulesArray.length,
                schedule = null;
            for (i = 0; i < len; i += 1) {
                schedule = schedulesArray[i];
                schedule.setVarsAfterDraw();
                if (schedule.selected === true) {
                    schedule.container.removeClass(thisTripPlannerSelect.tripSelectClass);
                    schedule.container.addClass(thisTripPlannerSelect.tripSelectedClass);
                }
            }

            this.addEvents();
        };

        return thisTripPlannerSelect;
    };

    /*
    Name:
    Class Schedule
    Param:
    None
    Return:
    An instance of Schedule
    Functionality:
    Handles the Schedule object
    Notes:
    A schedule is an object that contains journey date markets.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> Schedule
    */
    SKYSALES.Class.Schedule = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisSchedule = SKYSALES.Util.extendObject(parent);

        // Important: the deceptively named JourneyDateMarketList is actually an array of objects of type JourneyDateMarketList
        thisSchedule.JourneyDateMarketList = null;

        thisSchedule.index = -1;
        thisSchedule.selected = false;
        thisSchedule.isShowing = false;
        thisSchedule.containerId = '';
        thisSchedule.container = null;
        thisSchedule.deactivateAllSchedules = null;
        thisSchedule.journeyItinerarySummaryInfoTemplateId = 'journeyItinerarySummaryInfoTemplate';
        thisSchedule.allPassengerFeesItinerarySummaryInfoTemplateId = 'allPassengerFeesItinerarySummaryInfoTemplate';
        thisSchedule.journeyItinerarySummaryInfoTemplate = null;
        thisSchedule.updateTripSellKeyArray = null;
        thisSchedule.updateItinerarySummary = null;
        thisSchedule.updateTrips = null;
        thisSchedule.journeyFareSellKey = '';
        thisSchedule.tripUnavailableTextId = 'tripUnavailableErrorText';
        thisSchedule.tripUnavailableText = '';
        thisSchedule.tripHasNoFaresTextId = 'tripHasNoFaresErrorText';
        thisSchedule.tripHasNoFaresText = '';


        thisSchedule.init = function (json) {
            this.setSettingsByObject(json);
            this.initJourneyDateMarketListArray();
            this.setVars();
        };

        thisSchedule.initJourneyDateMarketListArray = function () {
            var i = 0,
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = new SKYSALES.Class.JourneyDateMarketList();
                journeyDateMarketList.updateTripSellKeyArray = this.updateTripSellKeyArray;
                journeyDateMarketList.updateItinerarySummary = this.updateItinerarySummary;
                journeyDateMarketList.updateTrips = this.updateTrips;
                journeyDateMarketList.selectedJourneyFareSellKey = this.journeyFareSellKey;
                journeyDateMarketList.tripIndex = this.index;
                journeyDateMarketList.init(journeyDateMarketListArray[i]);
                journeyDateMarketListArray[i] = journeyDateMarketList;
            }
        };

        thisSchedule.setVars = function () {
            var tripUnavailableTextDiv = {},
                tripHasNoFaresTextDiv = {};

            thisSchedule.journeyItinerarySummaryInfoTemplate = this.getById(this.journeyItinerarySummaryInfoTemplateId);
            thisSchedule.allPassengerFeesItinerarySummaryInfoTemplate = this.getById(this.allPassengerFeesItinerarySummaryInfoTemplateId);

            tripUnavailableTextDiv = this.getById(this.tripUnavailableTextId);
            if (tripUnavailableTextDiv.length > 0) {
                thisSchedule.tripUnavailableText = tripUnavailableTextDiv.text();
            }

            tripHasNoFaresTextDiv = this.getById(this.tripHasNoFaresTextId);
            if (tripHasNoFaresTextDiv.length > 0) {
                thisSchedule.tripHasNoFaresText = tripHasNoFaresTextDiv.text();
            }
        };

        thisSchedule.setVarsAfterDraw = function (tripIndex) {
            var oneBasedIndex = this.index + 1,
                i = 0,
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null;

            thisSchedule.containerId = 'tripFlightContainer' + oneBasedIndex;
            thisSchedule.container = this.getById(this.containerId);

            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = journeyDateMarketListArray[i];
                journeyDateMarketList.setVarsAfterDraw(tripIndex);
            }
        };

        thisSchedule.addEvents = function () {
            this.container.click(this.updateScheduleSelectionHandler);
        };

        thisSchedule.addEventsAfterDraw = function () {
            var oneBasedIndex = this.index + 1,
                i = 0,
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null;

            thisSchedule.containerId = 'tripFlightContainer' + oneBasedIndex;
            thisSchedule.container = this.getById(this.containerId);

            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = journeyDateMarketListArray[i];
                journeyDateMarketList.addEventsAfterDraw();
            }
        };

        thisSchedule.updateScheduleSelectionHandler = function () {
            if (thisSchedule.deactivateAllSchedules !== null) {
                thisSchedule.deactivateAllSchedules();
            }
            thisSchedule.selected = true;
        };

        thisSchedule.getSelectedTripJourneyFare = function () {
            var i = 0,
                journeyFare = '',
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = journeyDateMarketListArray[i];
                journeyFare = journeyDateMarketList.getSelectedJourneyFare();
            }

            return journeyFare;
        };

        thisSchedule.getSelectedJourneyFareSellKey = function () {
            var i = 0,
                journeyFareSellKey = '',
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = journeyDateMarketListArray[i];
                journeyFareSellKey = journeyDateMarketList.getSelectedJourneyFareSellKey();
            }

            return journeyFareSellKey;
        };

        thisSchedule.getTripsHtml = function () {
            var result, journeyDateMarket = thisSchedule.JourneyDateMarketList[0];

            if (journeyDateMarket === undefined) {
                result = this.tripUnavailableText;
            } else if (journeyDateMarket.hasFares()) {
                result = journeyDateMarket.getTripsHtml();
            } else {
                result = this.tripHasNoFaresText;
            }

            return result;
        };

        thisSchedule.getJourneyHtml = function () {
            var i = 0,
                html = '',
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = journeyDateMarketListArray[i];
                html += journeyDateMarketList.getJourneyHtml();
                journeyDateMarketList.selectJourneys();
            }

            return html;
        };

        thisSchedule.getItineraryHtml = function () {
            var i = 0,
                html = '',
                itineraryHtml = '',
                journeyDateMarketListArray = this.JourneyDateMarketList || [],
                len = journeyDateMarketListArray.length,
                journeyDateMarketList = null,
                j = 0,
                journeyDateMarketArray = [],
                lenj = 0,
                journeyDateMarket = null;


            for (i = 0; i < len; i += 1) {
                journeyDateMarketList = journeyDateMarketListArray[i];

                //get the selected journey
                j = 0;
                journeyDateMarketArray = journeyDateMarketList.Journeys || [];
                lenj = journeyDateMarketArray.length;
                journeyDateMarket = null;
                for (j = 0; j < lenj; j += 1) {
                    journeyDateMarket = journeyDateMarketArray[j];
                    if (journeyDateMarket.selected === true) {
                        html = this.journeyItinerarySummaryInfoTemplate.text();

                        html = SKYSALES.Util.replace(html, /\[stationPair\]/, journeyDateMarket.DepartureStation + ' to ' + journeyDateMarket.ArrivalStation);
                        html = SKYSALES.Util.replace(html, /\[deptArriveTimes\]/, journeyDateMarket.DepartureDate.date.toTimeString() + ' to ' + journeyDateMarket.ArrivalDate.date.toTimeString());
                        html = SKYSALES.Util.replace(html, /\[flightDesignator\]/, journeyDateMarket.FlightDesignator);
                        html = SKYSALES.Util.replace(html, /\[journeyDate\]/, journeyDateMarket.DepartureDate.date.toDateString());

                        itineraryHtml = html;
                    }
                }
            }

            return itineraryHtml;
        };

        return thisSchedule;
    };

    /*
    Name:
    Class JourneyDateMarketList
    Param:
    None
    Return:
    An instance of JourneyDateMarketList
    Functionality:
    Handles the JourneyDateMarketList control
    Notes:
    A journey date Market list contains an array of journeys along with other important information that is common to
    all the journeys such as arrival and departure stations.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> JourneyDateMarketList
    */
    SKYSALES.Class.JourneyDateMarketList = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisJourneyDateMarketList = SKYSALES.Util.extendObject(parent);

        thisJourneyDateMarketList.ArrivalStation = '';
        thisJourneyDateMarketList.DepartureDate = '';
        thisJourneyDateMarketList.DepartureStation = '';
        thisJourneyDateMarketList.Journeys = [];
        thisJourneyDateMarketList.journeyTableInfoTemplateId = 'journeyTableInfoTemplateId';
        thisJourneyDateMarketList.journeyTableInfoTemplate = null;
        thisJourneyDateMarketList.journeyTableInfoStripedTemplateId = 'journeyTableInfoStripedTemplateId';
        thisJourneyDateMarketList.journeyTableInfoStripedTemplate = null;
        thisJourneyDateMarketList.updateTripSellKeyArray = null;
        thisJourneyDateMarketList.updateItinerarySummary = null;
        thisJourneyDateMarketList.updateTrips = null;
        thisJourneyDateMarketList.selectedJourneyFareSellKey = '';
        thisJourneyDateMarketList.selectedJourneyKey = '';
        thisJourneyDateMarketList.selectedFareKey = '';
        thisJourneyDateMarketList.tripIndex = 0;
        thisJourneyDateMarketList.tripFlightInfoTemplateId = 'tripFlightInfoTemplateId';
        thisJourneyDateMarketList.tripFlightInfoTemplate = {};

        thisJourneyDateMarketList.init = function (json) {
            thisJourneyDateMarketList.setSettingsByObject(json);
            thisJourneyDateMarketList.initSelectedSellKeys();
            thisJourneyDateMarketList.initJourneysArray();
            thisJourneyDateMarketList.setVars();
            thisJourneyDateMarketList.selectJourneys();
        };

        thisJourneyDateMarketList.initSelectedSellKeys = function () {
            if (this.selectedJourneyFareSellKey.length > 0) {
                this.selectedJourneyFareSellKey = this.selectedJourneyFareSellKey.split('|');
                if (this.selectedJourneyFareSellKey[1] !== undefined) {
                    this.selectedJourneyKey = this.selectedJourneyFareSellKey[1];
                }
                if (this.selectedJourneyFareSellKey[0] !== undefined) {
                    this.selectedFareKey = this.selectedJourneyFareSellKey[0];
                }
            }
        };

        thisJourneyDateMarketList.initJourneysArray = function () {
            var i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = new SKYSALES.Class.JourneyDateMarket();
                journeyDateMarket.updateTripSellKeyArray = this.updateTripSellKeyArray;
                journeyDateMarket.updateItinerarySummary = this.updateItinerarySummary;
                journeyDateMarket.updateTrips = this.updateTrips;
                journeyDateMarket.selectedFareKey = this.selectedFareKey;
                journeyDateMarket.updateSelectedJourney = this.updateSelectedJourneyHandler;
                journeyDateMarket.tripIndex = this.tripIndex;
                journeyDateMarket.journeyIndex = i;
                journeyDateMarket.init(journeyDateMarketArray[i]);
                journeyDateMarketArray[i] = journeyDateMarket;
            }
        };

        thisJourneyDateMarketList.setVars = function () {
            thisJourneyDateMarketList.tripFlightInfoTemplate = this.getById(this.tripFlightInfoTemplateId);
            thisJourneyDateMarketList.journeyTableInfoTemplate = this.getById(this.journeyTableInfoTemplateId);
            thisJourneyDateMarketList.journeyTableInfoStripedTemplate = this.getById(this.journeyTableInfoStripedTemplateId);
        };

        thisJourneyDateMarketList.setVarsAfterDraw = function (tripIndex) {
            var i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                journeyDateMarket.setVarsAfterDraw(tripIndex + 'journey' + i);
            }
        };

        thisJourneyDateMarketList.addEventsAfterDraw = function () {
            var i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                journeyDateMarket.addEventsAfterDraw();
            }
        };

        thisJourneyDateMarketList.getTripsHtml = function () {
            var journey = this.Journeys[0],
                i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null,
                segmentCount = -1,
                html = this.tripFlightInfoTemplate.text() || '',
                flightDesignatorText = '',
                legInstance = {},
                segmentInstance = {},
                flightDesignatorInstance = {};

            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                if (journeyDateMarket.selected === true) {
                    journey = journeyDateMarket;
                }
            }

            if (journey && journey.Segments) {
                segmentCount = journey.Segments.length;

                html = SKYSALES.Util.replace(html, /\[departureStation\]/g, journey.Segments[0].DepartureStation);
                html = SKYSALES.Util.replace(html, /\[departureTime\]/g, journey.Segments[0].Std.getTime());
                html = SKYSALES.Util.replace(html, /\[arrivalStation\]/g, journey.Segments[segmentCount - 1].ArrivalStation);
                html = SKYSALES.Util.replace(html, /\[arrivalTime\]/g, journey.Segments[segmentCount - 1].Sta.getTime());

                segmentInstance = journey.Segments[0] || {};
                flightDesignatorInstance = segmentInstance.FlightDesignator || {};
                legInstance = new SKYSALES.Class.Leg();
                legInstance.init(segmentInstance.Legs[0]);
                flightDesignatorText = flightDesignatorInstance.getFlightDesignator() + legInstance.getOperatingDisclosureTypeToolTip() + legInstance.getCodeShareTypeToolTip() + segmentInstance.getSubjToGovtApprovalSuperscript();

                html = SKYSALES.Util.replace(html, /\[departureDate\]/, $.datepicker.formatDate(segmentInstance.fullDateFormatString, segmentInstance.Std.date));

                for (i = 1; i < segmentCount; i += 1) {
                    segmentInstance = journey.Segments[i] || {};
                    flightDesignatorInstance = segmentInstance.FlightDesignator || {};
                    legInstance = new SKYSALES.Class.Leg();
                    legInstance.init(segmentInstance.Legs[0]);
                    flightDesignatorText = flightDesignatorText + '/' + flightDesignatorInstance.getFlightDesignator() + legInstance.getOperatingDisclosureTypeToolTip() + legInstance.getCodeShareTypeToolTip() + segmentInstance.getSubjToGovtApprovalSuperscript();
                }

                html = SKYSALES.Util.replace(html, /\[flightNumber\]/, flightDesignatorText);

                return html;
            }
        };

        thisJourneyDateMarketList.selectJourneys = function () {
            var i = 0,
                journeyIsSelected = false,
                lowestFare = -1,
                journeyWithLowestFareIndex = -1,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null,
                fareIsSelected = false;

            if (this.selectedJourneyKey.length > 0) {
                for (i = 0; i < len; i += 1) {
                    journeyDateMarket = journeyDateMarketArray[i];
                    if (journeyDateMarket.SellKey === this.selectedJourneyKey) {
                        journeyDateMarket.selected = true;
                        journeyDateMarket.selectedFareKey = this.selectedFareKey;
                        fareIsSelected = journeyDateMarket.selectPreselectedFare();
                        if (fareIsSelected === false) {
                            journeyDateMarket.getLowestFare();
                        }
                    }
                }
            }

            journeyIsSelected = this.journeyIsSelected();

            if (journeyIsSelected === false) {
                for (i = 0; i < len; i += 1) {
                    journeyDateMarket = journeyDateMarketArray[i];

                    if (journeyDateMarket.getLowestFare() < lowestFare && journeyDateMarket.getLowestFare() > -1) {
                        lowestFare = journeyDateMarket.getLowestFare();
                        journeyWithLowestFareIndex = i;
                    } else if (lowestFare === -1 && journeyDateMarket.getLowestFare() > -1) {
                        lowestFare = journeyDateMarket.getLowestFare();
                        journeyWithLowestFareIndex = i;
                    }
                    if (i === len - 1 && lowestFare > -1) {
                        journeyDateMarket = journeyDateMarketArray[journeyWithLowestFareIndex];
                        journeyDateMarket.selected = true;
                        journeyDateMarketArray[journeyWithLowestFareIndex] = journeyDateMarket;
                    }
                }
            }
        };

        thisJourneyDateMarketList.journeyIsSelected = function () {
            var i = 0,
                retVal = false,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                if (journeyDateMarket.selected === true) {
                    retVal = true;
                    break;
                }
            }

            return retVal;
        };

        // returns true iff there are any journeys with fares on thisJourneyDateMarketList
        thisJourneyDateMarketList.hasFares = function () {
            var result = false,
                journeys = this.Journeys || [],
                journeysLength = journeys.length || 0,
                journeyIndex;

            for (journeyIndex = 0; journeyIndex < journeysLength; journeyIndex += 1) {

                if (journeys[journeyIndex].hasFares()) {
                    result = true;
                    break;
                }
            }

            return result;
        };

        thisJourneyDateMarketList.getSelectedJourneyFare = function () {
            var i = 0,
                selectedFareIndex = -1,
                journeyIndex = -1,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                if (journeyDateMarket.selected === true) {
                    journeyIndex = i;
                    selectedFareIndex = journeyDateMarket.getSelectedPaxFaresIndex();
                    break;
                }
            }

            return 'journey' + journeyIndex + 'fare' + selectedFareIndex;
        };

        thisJourneyDateMarketList.getSelectedJourneyFareSellKey = function () {
            var i = 0,
                journeySellKey = '',
                fareSellKey = '',
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                if (journeyDateMarket.selected === true) {
                    journeySellKey = journeyDateMarket.SellKey;
                    fareSellKey = journeyDateMarket.getSelectedPaxFaresSellKey();
                    break;
                }
            }

            return fareSellKey + '|' + journeySellKey;
        };

        thisJourneyDateMarketList.updateSelectedJourneyHandler = function (selectedJourneyIndex) {
            thisJourneyDateMarketList.updateSelectedJourney(selectedJourneyIndex);
        };

        thisJourneyDateMarketList.updateSelectedJourney = function (selectedJourneyIndex) {
            this.deactivateAllJourneys();

            var i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;

            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                if (selectedJourneyIndex === i) {
                    journeyDateMarket.selected = true;
                    break;
                }
            }
        };

        thisJourneyDateMarketList.deactivateAllJourneys = function () {
            var i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                journeyDateMarket.selected = false;
            }
        };

        thisJourneyDateMarketList.getJourneyHtml = function () {
            var i = 0,
                html = '',
                journeyHtml = '',
                fareInfoHtml = '',
                journeyId = '',
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null,
                std = '',
                sta = '',
                segments = [],
                segmentCount = -1,
                journeyDetailsHtml = '',
                tripIndex = this.tripIndex;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];
                if (i % 2 !== 0) {
                    html = this.journeyTableInfoTemplate.text();
                } else {
                    html = this.journeyTableInfoStripedTemplate.text();
                }
                segments = journeyDateMarket.Segments;
                segmentCount = segments.length;

                if (segments && segmentCount > 0) {
                    std = journeyDateMarket.Segments[0].Std.getTime();
                    sta = journeyDateMarket.Segments[segmentCount - 1].Sta.getTime();
                }
                html = SKYSALES.Util.replace(html, /\[departureTime\]/, std);
                html = SKYSALES.Util.replace(html, /\[arrivalTime\]/, sta);
                html = SKYSALES.Util.replace(html, /\[flightDesignator\]/, journeyDateMarket.FlightDesignator);
                html = SKYSALES.Util.replace(html, /\[journeyType\]/, journeyDateMarket.JourneyType);

                journeyDetailsHtml = journeyDateMarket.getJourneyDetailsHtml();
                html = SKYSALES.Util.replace(html, /\[journeyDetails\]/, journeyDetailsHtml);

                fareInfoHtml = journeyDateMarket.getFareInfoHtml();
                html = SKYSALES.Util.replace(html, /\[fareInfo\]/, fareInfoHtml);
                html = SKYSALES.Util.replace(html, /\[journeySellKey\]/g, journeyDateMarket.SellKey);
                html = SKYSALES.Util.replace(html, /\[tripIndex\]/, tripIndex);
                html = SKYSALES.Util.replace(html, /\[journeyIndex\]/, i);
                journeyId = 'journey' + i;
                html = SKYSALES.Util.replace(html, /\[radioButtonIdJourney\]/g, journeyId);

                journeyHtml += html;
            }

            return journeyHtml;
        };

        return thisJourneyDateMarketList;
    };

    /*
    Name:
    Class JourneyDateMarket
    Param:
    None
    Return:
    An instance of JourneyDateMarket
    Functionality:
    Handles the JourneyDateMarket control
    Notes:
    A journey date market is often called a journey.  It contains the fares for this journey.  It contains the segments
    that make up this journey as well as the journey sellkey, arrival, and departure stations, and other info.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> JourneyDateMarket
    */
    SKYSALES.Class.JourneyDateMarket = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisJourneyDateMarket = SKYSALES.Util.extendObject(parent);

        thisJourneyDateMarket.JourneyFares = [];
        thisJourneyDateMarket.NotForGeneralUse = '';
        thisJourneyDateMarket.Segments = [];
        thisJourneyDateMarket.ArrivalStation = '';
        thisJourneyDateMarket.DepartureDate = '';
        thisJourneyDateMarket.ArrivalDate = '';
        thisJourneyDateMarket.DepartureStation = '';
        thisJourneyDateMarket.JourneyType = '';
        thisJourneyDateMarket.SalesDate = '';
        thisJourneyDateMarket.SellKey = '';
        thisJourneyDateMarket.FlightDesignator = '';
        thisJourneyDateMarket.selected = false;
        thisJourneyDateMarket.updateTripSellKeyArray = null;
        thisJourneyDateMarket.updateItinerarySummary = null;
        thisJourneyDateMarket.updateSelectedJourney = null;
        thisJourneyDateMarket.updateTrips = null;
        thisJourneyDateMarket.journeyDetailsTemplate = {};
        thisJourneyDateMarket.journeyDetailsTemplateId = 'journeyDetailsTemplate';
        thisJourneyDateMarket.selectedFareKey = '';
        thisJourneyDateMarket.journeyIndex = 0;
        thisJourneyDateMarket.tripIndex = 0;

        thisJourneyDateMarket.init = function (json) {
            this.setSettingsByObject(json);
            this.initSegmentsArray();
            this.initJourneyFares();
            //        this.selectPreselectedFare();
            this.addCodeShareIndicators();
            this.initDates();
            this.setVars();
        };


        thisJourneyDateMarket.initJourneyFares = function () {
            var i = 0,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = new SKYSALES.Class.JourneyPaxFares();
                journeyPaxFares.updateTripSellKeyArray = this.updateTripSellKeyArray;
                journeyPaxFares.updateItinerarySummary = this.updateItinerarySummary;
                journeyPaxFares.updateSelectedJourney = this.updateSelectedJourney;
                journeyPaxFares.updateSelectedFare = this.updateSelectedFareHandler;
                journeyPaxFares.updateTrips = this.updateTrips;
                journeyPaxFares.init(journeyFaresArray[i]);
                journeyFaresArray[i] = journeyPaxFares;
            }
        };

        thisJourneyDateMarket.initDates = function () {
            var std = SKYSALES.Class.STASTD(),
                sta = SKYSALES.Class.STASTD();

            std.init(this.DepartureDate);
            thisJourneyDateMarket.DepartureDate = std;

            sta.init(this.DepartureDate);
            thisJourneyDateMarket.ArrivalDate = sta;
        };

        thisJourneyDateMarket.initSegmentsArray = function () {
            var i = 0,
                segmentsArray = this.Segments || [],
                len = segmentsArray.length,
                segment = null;
            for (i = 0; i < len; i += 1) {
                segment = new SKYSALES.Class.Segment();
                segment.init(segmentsArray[i]);
                segmentsArray[i] = segment;
            }
        };

        thisJourneyDateMarket.setVarsAfterDraw = function (tripJourneyIndex) {
            var i = 0,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                journeyPaxFares.setVarsAfterDraw(tripJourneyIndex + 'fare' + i);
            }
        };

        thisJourneyDateMarket.journeyInfoJson = function () {
            var journeyIndex = this.journeyIndex,
                tripIndex = this.tripIndex,
                segments = [],
                firstSegment = {},
                legs = [],
                firstLeg = {},
                legInfo = {},
                json = {
                    "tripIndex": tripIndex,
                    "marketIndex": "0",
                    "dateMarketIndex": "0",
                    "journeyIndex": journeyIndex,
                    "key": tripIndex.toString() + "_0_0_" + journeyIndex.toString(),
                    "activateJourneyId": "activateJourney_" + tripIndex + "_" + journeyIndex,
                    "deactivateJourneyId": "deactivateJourney_" + tripIndex + "_" + journeyIndex,
                    "journeyContainerId": "journey_" + tripIndex + "_" + journeyIndex
                },
                i = 0,
                j = 0,
                currentSegment = null,
                currentLeg = null,
                currentLegInfo = null,
                legInfoArray = [],
                legIndex = 0;

            segments = this.Segments;
            for (i = 0; i < segments.length; i += 1) {
                currentSegment = segments[i];
                for (j = 0; j < currentSegment.Legs.length; j += 1) {
                    currentLeg = currentSegment.Legs[j];
                    currentLegInfo = currentLeg.LegInfo;
                    if (currentLegInfo) {
                        legInfoArray[legIndex] = {
                            "legIndex": legIndex,
                            "equipmentType": currentLegInfo.EquipmentType,
                            "equipmentTypeSuffix": currentLegInfo.EquipmentTypeSuffix,
                            "departureStation": currentSegment.DepartureStation,
                            "arrivalStation": currentSegment.ArrivalStation,
                            "carrierCode": currentLeg.FlightDesignator.CarrierCode,
                            "flightNumber": currentLeg.FlightDesignator.FlightNumber,
                            "opSuffix": currentLegInfo.OperatingOpSuffix,
                            "marketingCode": "",
                            "marketingOverride": false
                        };
                    }
                    legIndex += 1;

                }
            }
            json.legInfoArray = legInfoArray;
            return json;
        };

        thisJourneyDateMarket.addEventsAfterDraw = function () {
            var i = 0,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null,
                journeyInfo = new SKYSALES.Class.JourneyInfo(),
                journeyInfoJson = this.journeyInfoJson();
            journeyInfo.init(journeyInfoJson);
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                journeyPaxFares.addEventsAfterDraw();
            }
        };

        thisJourneyDateMarket.setVars = function () {
            this.journeyDetailsTemplate = this.getById(this.journeyDetailsTemplateId);
        };

        thisJourneyDateMarket.selectPreselectedFare = function () {
            var matchFound = false,
                i = 0,
                journeyFaresArray = [],
                len = 0,
                journeyPaxFares = null;
            if (this.selected === true && this.selectedFareKey.length > 0) {
                i = 0;
                journeyFaresArray = this.JourneyFares || [];
                len = journeyFaresArray.length;
                journeyPaxFares = null;
                for (i = 0; i < len; i += 1) {
                    journeyPaxFares = journeyFaresArray[i];
                    if (journeyPaxFares.SellKey === this.selectedFareKey) {
                        journeyPaxFares.selected = true;
                        matchFound = true;
                        break;
                    }
                }
            }
            return matchFound;
        };

        // returns true iff there are any journeys with fares on thisJourneyDateMarketList
        thisJourneyDateMarket.hasFares = function () {
            var journeyFares = this.JourneyFares,
                journeyFaresLength = journeyFares.length,
                journeyFareIndex,
                journeyPaxFares,
                result = false;

            for (journeyFareIndex = 0; journeyFareIndex < journeyFaresLength; journeyFareIndex += 1) {
                journeyPaxFares = journeyFares[journeyFareIndex].JourneyPaxFares || [];
                if (journeyPaxFares.length > 0) {
                    result = true;
                    break;
                }
            }

            return result;
        };


        thisJourneyDateMarket.getLowestFare = function () {
            var i = 0,
                lowestFare = -1,
                lowestFareIndex = -1,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                if (i === 0) {
                    lowestFare = journeyPaxFares.getLowestFare();
                    lowestFareIndex = i;
                } else if (journeyPaxFares.getLowestFare < lowestFare) {
                    lowestFare = journeyPaxFares.getLowestFare();
                    lowestFareIndex = i;
                }
                if (i === len - 1 && lowestFare > -1) {
                    journeyPaxFares = journeyFaresArray[lowestFareIndex];
                    journeyPaxFares.selected = true;
                }
            }

            return lowestFare;
        };

        thisJourneyDateMarket.getSelectedPaxFaresIndex = function () {
            var i = 0,
                selectedFareIndex = -1,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                if (journeyPaxFares.selected === true) {
                    selectedFareIndex = i;
                    break;
                }
            }

            return selectedFareIndex;
        };

        thisJourneyDateMarket.getSelectedPaxFaresSellKey = function () {
            var i = 0,
                lowestFareSellKey = -1,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                if (journeyPaxFares.selected === true) {
                    lowestFareSellKey = journeyPaxFares.SellKey;
                    break;
                }
            }

            return lowestFareSellKey;
        };

        thisJourneyDateMarket.updateSelectedFareHandler = function (fareIndex) {
            thisJourneyDateMarket.updateSelectedFare(fareIndex);
        };

        thisJourneyDateMarket.updateSelectedFare = function (fareIndex) {
            this.deactivateAllFares();

            var i = 0,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                if (i === fareIndex) {
                    journeyPaxFares.selected = true;
                    break;
                }
            }
        };

        thisJourneyDateMarket.deactivateAllFares = function () {
            var i = 0,
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                journeyPaxFares.selected = false;
            }
        };

        //inserts the code share indicators
        thisJourneyDateMarket.addCodeShareIndicators = function () {
            var allSegmentsDesignator = this.FlightDesignator || '',
                tokenizedFlightDesignators = allSegmentsDesignator.split('\/') || [],
                tokenizedArrayLength = tokenizedFlightDesignators.length,
                token = '',
                segmentsArray = this.Segments || [],
                segmentCount = segmentsArray.length,
                segment = {},
                segmentInstance = {},
                segIndex = 0,
                legsArray = [],
                legCount = legsArray.length,
                leg = {},
                legInstance = {},
                legFlightDesignator = {},
                resultingFlightDesignator = '';

            if (tokenizedArrayLength && tokenizedArrayLength === segmentCount) {
                for (segIndex = 0; segIndex < segmentCount; segIndex += 1) {
                    token = tokenizedFlightDesignators[segIndex] || ' ';
                    token = token.substring(0, token.length - 1);
                    segment = segmentsArray[segIndex] || {};
                    segmentInstance = new SKYSALES.Class.Segment();
                    segmentInstance.init(segment);
                    legsArray = segment.Legs || [];
                    legCount = legsArray.length;
                    leg = legsArray[0] || {};
                    legInstance = new SKYSALES.Class.Leg();
                    legInstance.init(leg);
                    legFlightDesignator = leg.FlightDesignator || {};

                    //either the entire designator matches the token or the flight numbers match
                    if (legFlightDesignator.CarrierCode + legFlightDesignator.FlightNumber === token || SKYSALES.Util.replace(legFlightDesignator.FlightNumber, / /g, "") === token) {
                        resultingFlightDesignator = resultingFlightDesignator + token + legInstance.getOperatingDisclosureTypeToolTip() + legInstance.getCodeShareTypeToolTip() + segmentInstance.getSubjToGovtApprovalSuperscript();
                        if (segmentCount > 1 && segmentCount - 1 !== segIndex) {
                            resultingFlightDesignator = resultingFlightDesignator + ' /';
                        }
                    }
                }
            }
            thisJourneyDateMarket.FlightDesignator = resultingFlightDesignator;
        };

        thisJourneyDateMarket.getJourneyDetailsHtml = function () {
            var legsHtml = '',
                journeyDetailsHtml = this.journeyDetailsTemplate.text(),
                segments = this.Segments,
                segment = {},
                segmentsLength = 0,
                legs = [],
                leg = {},
                legInstance = {},
                legsLength = 0,
                iSegments = 0,
                iLegs = 0;
            if (segments) {
                segmentsLength = segments.length;
                if (segmentsLength > 0) {
                    for (iSegments = 0; iSegments < segmentsLength; iSegments += 1) {
                        segment = segments[iSegments];
                        legs = segment.Legs;
                        if (legs) {
                            legsLength = legs.length;
                            if (legsLength > 0) {
                                for (iLegs = 0; iLegs < legsLength; iLegs += 1) {
                                    leg = legs[iLegs];
                                    legInstance = new SKYSALES.Class.Leg();
                                    legInstance.init(leg);
                                    legsHtml += legInstance.getLegHtml();
                                }
                            }
                        }
                    }
                }
            }
            journeyDetailsHtml = SKYSALES.Util.replace(journeyDetailsHtml, /\[segmentDetails\]/g, legsHtml);
            journeyDetailsHtml = SKYSALES.Util.replace(journeyDetailsHtml, /\[tripIndex\]/g, this.tripIndex);
            journeyDetailsHtml = SKYSALES.Util.replace(journeyDetailsHtml, /\[journeyIndex\]/g, this.journeyIndex);
            return journeyDetailsHtml;
        };

        thisJourneyDateMarket.getFareInfoHtml = function () {
            var i = 0,
                html = '',
                fareId = '',
                journeyFaresArray = this.JourneyFares || [],
                len = journeyFaresArray.length,
                journeyPaxFares = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFares = journeyFaresArray[i];
                html += journeyPaxFares.getFareInfoHtml();
                fareId = 'fare' + i;
                html = SKYSALES.Util.replace(html, /\[radioButtonIdFare\]/g, fareId);
            }

            return html;
        };

        return thisJourneyDateMarket;
    };

    /*
    Name:
    Class JourneyPaxFares
    Param:
    None
    Return:
    An instance of JourneyPaxFares
    Functionality:
    Handles the JourneyPaxFares control
    Notes:
    A journey pax fare describes fares for pax types such as an adult or child. this object contains
    a list of journeyPaxFares. This object contains the fare sell key which is required with the
    journey sell key to sell a journey.  This class also, through our templating pattern, output the
    radio buttons for fares that a user will click on.  These clicks fire of events that update the select
    page in the fareClickHandler() method.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> JourneyPaxFares
    */
    SKYSALES.Class.JourneyPaxFares = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisJourneyPaxFares = SKYSALES.Util.extendObject(parent);

        thisJourneyPaxFares.JourneyPaxFares = [];
        thisJourneyPaxFares.ClassOfService = '';
        thisJourneyPaxFares.Amount = '';
        thisJourneyPaxFares.SellKey = '';
        thisJourneyPaxFares.journeyFareInfoRadioButtonTemplateId = 'journeyFareInfoRadioButtonTemplateId';
        thisJourneyPaxFares.journeyFareInfoRadioButtonTemplate = null;
        thisJourneyPaxFares.containerId = '';
        thisJourneyPaxFares.container = null;
        thisJourneyPaxFares.selected = false;
        thisJourneyPaxFares.updateTripSellKeyArray = null;
        thisJourneyPaxFares.updateItinerarySummary = null;
        thisJourneyPaxFares.updateSelectedJourney = null;
        thisJourneyPaxFares.updateSelectedFare = null;
        thisJourneyPaxFares.updateTrips = null;

        thisJourneyPaxFares.init = function (json) {
            thisJourneyPaxFares.setSettingsByObject(json);
            thisJourneyPaxFares.initJourneyPaxFares();
            thisJourneyPaxFares.setVars();
        };

        thisJourneyPaxFares.initJourneyPaxFares = function () {
            var i = 0,
                journeyPaxFareArray = this.JourneyPaxFares || [],
                len = journeyPaxFareArray.length,
                journeyPaxFare = null;
            for (i = 0; i < len; i += 1) {
                journeyPaxFare = new SKYSALES.Class.JourneyPaxFare();
                journeyPaxFare.init(journeyPaxFareArray[i]);
                journeyPaxFareArray[i] = journeyPaxFare;
            }
        };

        thisJourneyPaxFares.setVars = function () {
            this.journeyFareInfoRadioButtonTemplate = this.getById(this.journeyFareInfoRadioButtonTemplateId);
        };

        thisJourneyPaxFares.setVarsAfterDraw = function (id) {
            this.container = this.getById(id);
        };

        thisJourneyPaxFares.addEventsAfterDraw = function () {
            this.container.click(this.fareClickHandler);
        };

        thisJourneyPaxFares.fareClickHandler = function (eventInfo) {
            var tripSellKey = eventInfo.target.value,
                tripIndex = -1,
                journeyIndex = -1,
                fareIndex = -1;

            tripIndex = eventInfo.target.id.match(/trip[0-9]*/);
            tripIndex = tripIndex[0].match(/\d+/);
            tripIndex = tripIndex[0];
            tripIndex = parseInt(tripIndex, 10);

            journeyIndex = eventInfo.target.id.match(/journey[0-9]*/);
            journeyIndex = journeyIndex[0].match(/\d+/);
            journeyIndex = journeyIndex[0];
            journeyIndex = parseInt(journeyIndex, 10);

            fareIndex = eventInfo.target.id.match(/fare[0-9]*/);
            fareIndex = fareIndex[0].match(/\d+/);
            fareIndex = fareIndex[0];
            fareIndex = parseInt(fareIndex, 10);

            thisJourneyPaxFares.updateTripSellKeyArray(tripIndex, tripSellKey);
            thisJourneyPaxFares.updateItinerarySummary();
            thisJourneyPaxFares.updateSelectedJourney(journeyIndex);
            thisJourneyPaxFares.updateSelectedFare(fareIndex);
            thisJourneyPaxFares.updateTrips();
        };

        thisJourneyPaxFares.getLowestFare = function () {
            var i = 0,
                lowestFare = -1,
                journeyPaxFareArray = this.JourneyPaxFares || [],
                len = journeyPaxFareArray.length,
                journeyPaxFare = null;

            if (len > 0) {
                for (i = 0; i < len; i += 1) {
                    journeyPaxFare = journeyPaxFareArray[i];
                    if (i === 0 && journeyPaxFare.TotalFareAmount > -1) {
                        lowestFare = journeyPaxFare.TotalFareAmount;
                    } else if (journeyPaxFare.TotalFareAmount < lowestFare) {
                        lowestFare = journeyPaxFare.TotalFareAmount;
                    }
                }
            }

            return lowestFare;
        };

        thisJourneyPaxFares.getFareInfoHtml = function () {
            var i = 0,
                farePrice = 0,
                html = '',
                journeyPaxFareHtml = '',
                journeyPaxFaresArray = this.JourneyPaxFares || [],
                len = journeyPaxFaresArray.length,
                journeyPaxFare = null;

            for (i = 0; i < len; i += 1) {
                journeyPaxFare = journeyPaxFaresArray[i];
                html = this.journeyFareInfoRadioButtonTemplate.text();
                farePrice = SKYSALES.Util.convertToLocaleCurrency(journeyPaxFare.TotalFareAmount);
                html = SKYSALES.Util.replace(html, /\[farePrice\]/, farePrice);
                //html = SKYSALES.Util.replace(html, /\[farePrice\]/, farePrice);
                html = SKYSALES.Util.replace(html, /\[fareSellKey\]/, this.SellKey);

                journeyPaxFareHtml += html;
                i = len;
            }

            return journeyPaxFareHtml;
        };

        return thisJourneyPaxFares;
    };

    /*
    Name:
    Class JourneyPaxFare
    Param:
    None
    Return:
    An instance of JourneyPaxFare
    Functionality:
    Handles the JourneyPaxFare control
    Notes:
    A journey pax fare describes fares for pax types such as an adult or child and the price of those fares.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> JourneyPaxFare
    */
    SKYSALES.Class.JourneyPaxFare = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisJourneyPaxFare = SKYSALES.Util.extendObject(parent);

        thisJourneyPaxFare.CurrencyCode = '';
        thisJourneyPaxFare.DiscountedFareAmount = '';
        thisJourneyPaxFare.Amount = '';
        thisJourneyPaxFare.PaxType = '';
        thisJourneyPaxFare.TotalFareAmount = '';
        thisJourneyPaxFare.PublishedFareAmount = '';
        thisJourneyPaxFare.PaxDiscountCode = '';

        thisJourneyPaxFare.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisJourneyPaxFare;
    };

    /*
    Name:
    Class Segment
    Param:
    None
    Return:
    An instance of Segment
    Functionality:
    Handles the Segment control
    Notes:
    A segment is part of a journey.  In this class you can specify the date format that will show the departure date
    and time of a segment in the fullDateFormatString variable.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> Segment
    */
    SKYSALES.Class.Segment = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisSegment = SKYSALES.Util.extendObject(parent);

        thisSegment.ArrivalStation = '';
        thisSegment.Sta = '';
        thisSegment.DepartureStation = '';
        thisSegment.Std = '';
        thisSegment.FlightDesignator = null;
        thisSegment.fullDateFormatString = 'D, M dd, yy';
        thisSegment.Legs = {};

        thisSegment.init = function (json) {
            this.setSettingsByObject(json);
            this.initSta();
            this.initStd();
            this.initFlightDesignator();
        };

        thisSegment.initFlightDesignator = function () {
            var flightDesignator = SKYSALES.Class.FlightDesignator();
            flightDesignator.init(this.FlightDesignator);
            thisSegment.FlightDesignator = flightDesignator;
        };

        thisSegment.initSta = function () {
            var sta = SKYSALES.Class.STASTD();
            sta.init(this.Sta);
            this.Sta = sta;
        };

        thisSegment.initStd = function () {
            var std = SKYSALES.Class.STASTD();
            std.init(this.Std);
            this.Std = std;
        };

        thisSegment.getSubjToGovtApprovalSuperscript = function () {
            var legArray = this.Legs || [],
                legCount = legArray.length,
                i = 0,
                legInfo = {},
                subToGovtApprovalTemplateId = 'subjToGovtApprovalToolTipTemplate',
                subjToGovtApprovalHtml = '';

            for (i = 0; i < legCount; i += 1) {
                legInfo = legArray[i].LegInfo || {};
                if (legInfo.SubjectToGovtApproval === 'True') {
                    subjToGovtApprovalHtml = this.getById(subToGovtApprovalTemplateId).text();
                    break;
                }
            }
            return subjToGovtApprovalHtml;
        };

        return thisSegment;
    };


    /*
    Name:
    Class Leg
    Param:
    None
    Return:
    An instance of Leg
    Functionality:
    Handles Legs
    Notes:
    A leg is part of a segment which is part of a journey.  In this class you can specify the date format that will show the departure date
    and time of a leg in the fullDateFormatString property.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> Leg
    */
    SKYSALES.Class.Leg = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisLeg = SKYSALES.Util.extendObject(parent);

        thisLeg.legTemplateId = 'legDetailsTemplate';
        thisLeg.legTemplate = null;
        thisLeg.layoverTimeTemplateId = 'layoverTimeTemplate';
        thisLeg.layoverTimeTemplate = null;
        thisLeg.optCarrierInfoTemplateId = 'optCarrierDisclosureTemplate';
        thisLeg.optCarrierInfoTemplate = null;

        thisLeg.ArrivalStation = '';
        thisLeg.DepartureStation = '';
        thisLeg.FlightDesignator = {};
        thisLeg.Sta = {};
        thisLeg.Std = {};
        thisLeg.OperationsInfo = {};
        thisLeg.LegInfo = {};
        thisLeg.TravelTime = {};
        thisLeg.LayoverTime = {};
        thisLeg.fullDateFormatString = 'D, M dd, yy';

        thisLeg.init = function (json) {
            this.setSettingsByObject(json);
            this.initSta();
            this.initStd();
            this.initFlightDesignator();
            this.setVars();
        };

        thisLeg.setVars = function () {
            this.legTemplate = this.getById(this.legTemplateId);
            this.layoverTimeTemplate = this.getById(this.layoverTimeTemplateId);
            this.optCarrierInfoTemplate = this.getById(this.optCarrierInfoTemplateId);
        };

        thisLeg.initFlightDesignator = function () {
            var flightDesignator = SKYSALES.Class.FlightDesignator();
            flightDesignator.init(this.FlightDesignator);
            thisLeg.FlightDesignator = flightDesignator;
        };

        thisLeg.initSta = function () {
            var sta = SKYSALES.Class.STASTD();
            sta.init(this.Sta);
            thisLeg.Sta = sta;
        };

        thisLeg.initStd = function () {
            var std = SKYSALES.Class.STASTD();
            std.init(this.Std);
            thisLeg.Std = std;
        };

        thisLeg.getLayoverTimeHtml = function () {
            var html = '',
                layoverTime = this.LayoverTime,
                hours = layoverTime.Hours,
                minutes = layoverTime.Minutes;
            if (hours > 0 || minutes > 0) {
                html = this.layoverTimeTemplate.text();
                html = SKYSALES.Util.replace(html, /\[layoverTimeHours\]/g, hours);
                html = SKYSALES.Util.replace(html, /\[layoverTimeMinutes\]/g, minutes);
            }
            return html;
        };

        thisLeg.getLegHtml = function () {
            var html = this.legTemplate.text(),
                flightDesignator = this.FlightDesignator,
                carrierCode = flightDesignator.CarrierCode,
                resource = SKYSALES.Resource || {},
                carrier = resource.carrierHash[carrierCode] || {},
                carrierName = carrier.name || '',
                stationHash = resource.stationHash,
                departureStationCode = this.DepartureStation,
                departureStationName = stationHash[departureStationCode].name,
                arrivalStationCode = this.ArrivalStation,
                arrivalStationName = stationHash[arrivalStationCode].name;
            html = SKYSALES.Util.replace(html, /\[carrierName\]/g, carrierName);
            html = SKYSALES.Util.replace(html, /\[flightNumber\]/g, flightDesignator.FlightNumber);
            html = SKYSALES.Util.replace(html, /\[departureDate\]/, $.datepicker.formatDate(this.fullDateFormatString, this.Std.date));
            html = SKYSALES.Util.replace(html, /\[departureStation\]/g, departureStationName);
            html = SKYSALES.Util.replace(html, /\[departureTime\]/g, this.Std.getTime());
            html = SKYSALES.Util.replace(html, /\[arrivalStation\]/g, arrivalStationName);
            html = SKYSALES.Util.replace(html, /\[arrivalTime\]/g, this.Sta.getTime());
            html = SKYSALES.Util.replace(html, /\[travelTimeHours\]/g, this.TravelTime.Hours);
            html = SKYSALES.Util.replace(html, /\[travelTimeMinutes\]/g, this.TravelTime.Minutes);
            html = SKYSALES.Util.replace(html, /\[layoverTime\]/g, this.getLayoverTimeHtml());
            html = SKYSALES.Util.replace(html, /\[optDisclosureSymbol\]/g, this.getOperatingInfoSymbol());
            html = SKYSALES.Util.replace(html, /\[optDisclosureType\]/g, this.getCodeShareSymbol());
            html = SKYSALES.Util.replace(html, /\[optCarrierDisclosure\]/g, this.getOptDisclosureText());
            return html;
        };

        thisLeg.getOptDisclosureText = function () {
            var optCarrierInfoTemplate = this.optCarrierInfoTemplate || '',
                legInfo = this.LegInfo || {},
                resource = SKYSALES.Resource || {},
                optCarrierCode = legInfo.OperatingCarrier || '',
                optCarrier = resource.carrierHash[optCarrierCode] || {},
                optCarrierName = optCarrier.name || optCarrierCode, //use carrier code when no carrier name is found
                optFlightNumber = legInfo.OperatingFlightNumber,
                optFlightNumberLength = optFlightNumber.length,
                optDisclosureText = '';

            if (optCarrierCode) {
                optDisclosureText = legInfo.OperatedByText;

                if (!optDisclosureText && optCarrierName) {
                    optDisclosureText = optCarrierInfoTemplate.text();
                    optDisclosureText = SKYSALES.Util.replace(optDisclosureText, /\[optCarrierName\]/g, optCarrierName);
                    optDisclosureText = SKYSALES.Util.replace(optDisclosureText, /\[optCarrierCode\]/g, optCarrierCode);
                    optDisclosureText = SKYSALES.Util.replace(optDisclosureText, /\[optFlightNumber\]/g, optFlightNumber);
                    if (!optFlightNumber || (optFlightNumberLength > 0 && optFlightNumber.charAt(optFlightNumberLength - 1) === ' ')) {
                        //if there's no operating flight number or the last character of the operating flight number is a space (likely "    ")
                        //remove [flight [optFlightNumber]] from the text
                        optDisclosureText = optDisclosureText.substring(0, optDisclosureText.indexOf('['));
                    } else {
                        optDisclosureText = SKYSALES.Util.replace(optDisclosureText, /\[/g, '');
                        optDisclosureText = SKYSALES.Util.replace(optDisclosureText, /\]/g, '');
                    }
                }
            }
            return optDisclosureText;
        };

        // returns an * symbol to designate the presense of the operating carrier disclosure
        thisLeg.getOperatingInfoSymbol = function () {
            var legInfo = this.LegInfo || {},
                optCarrierCode = legInfo.OperatingCarrier || '',
                flightDisclosureSymbol = '';

            if (optCarrierCode) {
                flightDisclosureSymbol = String.fromCharCode(42);
            }

            return flightDisclosureSymbol;
        };

        // returns the symbol for wet lease or code share flights
        thisLeg.getCodeShareSymbol = function () {
            var legInfo = this.LegInfo || {},
                codeShareType = legInfo.CodeShareIndicator || '',
                codeShareSymbol = '';

            if (codeShareType.toUpperCase() === 'L') {//code share
                codeShareSymbol = String.fromCharCode(8225);
            }

            if (codeShareType.toUpperCase() === 'S') {//wet lease
                codeShareSymbol = String.fromCharCode(8224);
            }

            return codeShareSymbol;
        };

        thisLeg.getCodeShareTypeToolTip = function () {
            var legInfo = this.LegInfo || {},
                codeShareType = legInfo.CodeShareIndicator || '',
                codeShareTypeHtml = '',
                codeShareTemplateId = 'codeShareToolTipTemplate',
                wetLeaseTemplateId = 'wetLeaseToolTipTemplate';

            if (codeShareType.toUpperCase() === 'L') {//code share
                codeShareTypeHtml = this.getById(codeShareTemplateId).text();
            }

            if (codeShareType.toUpperCase() === 'S') {//wet lease
                codeShareTypeHtml = this.getById(wetLeaseTemplateId).text();
            }

            return codeShareTypeHtml;
        };

        thisLeg.getOperatingDisclosureTypeToolTip = function () {
            var legInfo = this.LegInfo || {},
                optCarrierCode = legInfo.OperatingCarrier || '',
                disclosureText = this.getOptDisclosureText() || '',
                flightDisclosureTemplateId = 'diclosureTypeToolTipTemplate',
                flightDisclosureHtml = '';

            if (optCarrierCode && disclosureText) {
                flightDisclosureHtml = this.getById(flightDisclosureTemplateId).text();
                flightDisclosureHtml = SKYSALES.Util.replace(flightDisclosureHtml, /\[disclosureTitle\]/g, disclosureText);
            }

            return flightDisclosureHtml;
        };

        return thisLeg;
    };

    /*
    Name:
    Class FlightDesignator
    Param:
    None
    Return:
    An instance of FlightDesignator
    Functionality:
    Handles the FlightDesignator control
    Notes:
    This will show the flights designation including the carrier code and flight number.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> FlightDesignator
    */
    SKYSALES.Class.FlightDesignator = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisFlightDesignator = SKYSALES.Util.extendObject(parent);

        thisFlightDesignator.CarrierCode = '';
        thisFlightDesignator.FlightNumber = '';

        thisFlightDesignator.init = function (json) {
            this.setSettingsByObject(json);
        };

        thisFlightDesignator.getFlightDesignator = function () {
            return this.CarrierCode + ' ' + this.FlightNumber;
        };

        return thisFlightDesignator;
    };

    /*
    Name:
    Class STASTD
    Param:
    None
    Return:
    An instance of STASTD
    Functionality:
    Handles the STASTD control
    Notes:
    This is a class that captures the departure and arrival date and time information of a segment or journey.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> STASTD
    */
    SKYSALES.Class.STASTD = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisStaStd = SKYSALES.Util.extendObject(parent);

        thisStaStd.Day = '';
        thisStaStd.Month = '';
        thisStaStd.Hour = '';
        thisStaStd.Minute = '';
        thisStaStd.Second = '';
        thisStaStd.Year = '';
        thisStaStd.date = null;

        thisStaStd.init = function (json) {
            this.setSettingsByObject(json);
            this.initDateTime();
        };

        thisStaStd.initDateTime = function () {
            this.date = new Date();
            this.date.setHours(this.Hour, this.Minute, this.Second, 0);
            this.date.setFullYear(this.Year, this.Month - 1, this.Day);
        };

        thisStaStd.getTime = function () {
            var time = SKYSALES.Util.getTime(this.Hour, this.Minute);
            return time;
        };

        return thisStaStd;
    };

    /*
    Name:
    Class TripPlannerItinerarySummarySelect
    Param:
    None
    Return:
    An instance of TripPlannerItinerarySummarySelect
    Functionality:
    Handles the TripPlannerItinerarySummarySelect control
    Notes:
    This class handles the trip planner itinerary summary control on the select page. Methods are provided that
    will update the itinerary summary info when a user clicks on a fare.  It contains the Booking object which
    represents necessary booknig information related to the users booking.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> TripPlannerItinerarySummarySelect
    */
    SKYSALES.Class.TripPlannerItinerarySummarySelect = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerItinerarySummarySelect = SKYSALES.Util.extendObject(parent);

        thisTripPlannerItinerarySummarySelect.containerId = '';
        thisTripPlannerItinerarySummarySelect.container = null;
        thisTripPlannerItinerarySummarySelect.sellKeysId = 'summaryTripPlannerSellKeys';
        thisTripPlannerItinerarySummarySelect.sellKeys = null;

        thisTripPlannerItinerarySummarySelect.ErrorsOccurred = '';
        thisTripPlannerItinerarySummarySelect.Booking = null;
        thisTripPlannerItinerarySummarySelect.itineraryResponse = null;
        thisTripPlannerItinerarySummarySelect.drawSelectViewItinerarySummary = null;

        thisTripPlannerItinerarySummarySelect.url = 'TripPlannerItinerarySummaryAjax-resource.aspx';

        thisTripPlannerItinerarySummarySelect.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        thisTripPlannerItinerarySummarySelect.setVars = function () {
            thisTripPlannerItinerarySummarySelect.container = this.getById(this.containerId);
            thisTripPlannerItinerarySummarySelect.sellKeys = this.getById(this.sellKeysId);
        };

        thisTripPlannerItinerarySummarySelect.initBooking = function (jsonBooking, jsonBookingPricing, jsonAllPassengerFees) {
            thisTripPlannerItinerarySummarySelect.Booking = new SKYSALES.Class.Booking();
            this.Booking.init(jsonBooking);
            this.Booking.initBookingPricing(jsonBookingPricing);
            this.Booking.initAllPassengerFees(jsonAllPassengerFees);
            thisTripPlannerItinerarySummarySelect.Booking.AllPassengerFees = this.Booking.AllPassengerFees.AllPassengerFees;
        };

        thisTripPlannerItinerarySummarySelect.addEventsAfterItinerarySummaryDraw = function () {
            var toggleDivs = $("[id^='journeyPricingDetails_']"),
                i = 0,
                toggleObject = null,
                toggleElementsArray = toggleDivs || [],
                len = toggleElementsArray.length,
                toggleElement = null,
                toggleJson = {};

            for (i = 0; i < len; i += 1) {
                toggleElement = toggleElementsArray[i];

                toggleObject = new SKYSALES.Class.ToggleView();

                toggleJson = {
                    "elementId": "journeyPricingDetails_" + i,
                    "hideId": "journeyTotalPrice_" + i,
                    "showId": "journeyTotalPrice_" + i
                };

                toggleObject.init(toggleJson);
                toggleObject.updateHide();
            }
        };

        thisTripPlannerItinerarySummarySelect.updateItinerarySummaryInfoHandler = function (data) {
            thisTripPlannerItinerarySummarySelect.updateItinerarySummaryInfo(data);
        };

        thisTripPlannerItinerarySummarySelect.updateItinerarySummaryInfo = function (data) {
            var response = $(data),
                jsonStr = response.html(),
                json = SKYSALES.Json.parse(jsonStr);

            this.initBooking(json.Booking, json.BookingPricing, json.AllPassengerFees);
            if (json.ErrorsOccurred === 0) {
                if (this.drawSelectViewItinerarySummary !== null) {
                    this.drawSelectViewItinerarySummary();
                    this.addEventsAfterItinerarySummaryDraw();
                }
            }
        };

        thisTripPlannerItinerarySummarySelect.getPriceItineraryResponse = function (params) {
            this.sellKeys.val(params);

            $.post(this.url, {
                'ItinerarySummary.JourneyFareSellKeys': params
            }, this.updateItinerarySummaryInfoHandler);
        };

        thisTripPlannerItinerarySummarySelect.getSelectViewItineraryJourneysHtml = function () {
            if (this.Booking !== null) {
                return this.Booking.getSelectViewItineraryJourneysHtml();
            } else {
                return '';
            }
        };

        thisTripPlannerItinerarySummarySelect.getSelectViewItineraryAllPassengerFeesHtml = function () {
            if (this.Booking !== null) {
                return this.Booking.getSelectViewItineraryAllPassengerFeesHtml();
            } else {
                return '';
            }
        };

        return thisTripPlannerItinerarySummarySelect;
    };

    /*
    Name:
    Class TripPlannerItinerarySummaryConfirm
    Param:
    None
    Return:
    An instance of TripPlannerItinerarySummaryConfirm
    Functionality:
    Handles the TripPlannerItinerarySummaryConfirm control
    Notes:
    The trip planner itinerary summary object handles the itinerary summary control on the confirm page.
    It is similar to the tripPlannerItinerarySummarySelect page as it provides methods specific for updating
    the confirm itinerary summary control.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> TripPlannerItinerarySummaryConfirm
    */
    SKYSALES.Class.TripPlannerItinerarySummaryConfirm = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerItinerarySummaryConfirm = SKYSALES.Util.extendObject(parent);

        thisTripPlannerItinerarySummaryConfirm.containerId = 'itinerarySummaryInfoContainer';
        thisTripPlannerItinerarySummaryConfirm.container = null;

        thisTripPlannerItinerarySummaryConfirm.ErrorsOccurred = '';
        thisTripPlannerItinerarySummaryConfirm.Booking = null;

        thisTripPlannerItinerarySummaryConfirm.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initBooking(json);
            this.Booking.drawConfirmView();
        };

        thisTripPlannerItinerarySummaryConfirm.setVars = function () {
            thisTripPlannerItinerarySummaryConfirm.container = this.getById(this.containerId);
        };

        thisTripPlannerItinerarySummaryConfirm.initBooking = function (json) {
            this.Booking = new SKYSALES.Class.Booking();
            this.Booking.init(json.Booking);
            this.Booking.initBookingPricing(json.BookingPricing);
        };

        thisTripPlannerItinerarySummaryConfirm.updateItinerarySummaryInfo = function () {

        };

        return thisTripPlannerItinerarySummaryConfirm;
    };

    /*
    Name:
    Class Booking
    Param:
    None
    Return:
    An instance of Booking
    Functionality:
    Handles the Booking control
    Notes:
    A booking is an object that represents the booking that a user has made.  It contains objects such as journeys
    and pricing information.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> Booking
    */
    SKYSALES.Class.Booking = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisBooking = SKYSALES.Util.extendObject(parent);

        thisBooking.containerId = 'itinerarySummaryInfoContainer';
        thisBooking.container = null;
        thisBooking.itinerarySummaryLeftViewTableTemplateId = 'tripPlannerItinerarySummaryLeftViewTableTemplate';
        thisBooking.itinerarySummaryLeftViewTableTemplate = null;
        thisBooking.itinerarySummaryLeftViewFinalTableTemplateId = 'tripPlannerItinerarySummaryLeftViewFinalTableTemplate';
        thisBooking.itinerarySummaryLeftViewFinalTableTemplate = null;
        thisBooking.itineraryJourneyInfoTemplateId = 'itineraryJourneyInfoTemplate';
        thisBooking.itineraryJourneyInfoTemplate = null;
        thisBooking.itineraryJourneyInfoStripedTemplateId = 'itineraryJourneyInfoStripedTemplate';
        thisBooking.itineraryJourneyInfoStripedTemplate = null;
        thisBooking.journeyItinerarySummaryInfoTemplateId = 'journeyItinerarySummaryInfoTemplate';
        thisBooking.allPassengerFeesItinerarySummaryInfoTemplateId = 'allPassengerFeesItinerarySummaryInfoTemplate';
        thisBooking.journeyItinerarySummaryInfoTemplate = null;
        thisBooking.journeyPricingHtmlTemlateId = 'journeyPricingHtmlTemlate';
        thisBooking.journeyPricingHtmlTemlate = null;


        thisBooking.RecordLocators = [];
        thisBooking.TypeOfSale = null;
        thisBooking.ReceivedBy = null;
        thisBooking.Payments = null;
        thisBooking.Passengers = [];
        //    thisBooking.OtherServiceInfoList = [];
        thisBooking.BookingSum = null;
        //    thisBooking.BookingHold = null;
        //    thisBooking.BookingHistoryList = null;
        //    thisBooking.BookingChangeCode = '';
        //    thisBooking.BookingComments = [];
        //    thisBooking.BookingComponents = [];
        //    thisBooking.Contacts = [];
        //    thisBooking.BookingId = '';
        thisBooking.BookingInfo = null;
        //    thisBooking.ParentId = '';
        thisBooking.CurrencyCode = '';
        thisBooking.GroupName = '';
        thisBooking.Journeys = [];
        thisBooking.TotalPrice = 0;
        thisBooking.BookingPricing = null;
        thisBooking.fullDateFormatString = 'D, M dd, yy';


        thisBooking.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initJourneysArray();
            this.initPassengersArray();
        };

        thisBooking.setVars = function () {
            this.container = this.getById(this.containerId);
            this.itinerarySummaryLeftViewTableTemplate = this.getById(this.itinerarySummaryLeftViewTableTemplateId);
            this.itinerarySummaryLeftViewFinalTableTemplate = this.getById(this.itinerarySummaryLeftViewFinalTableTemplateId);
            this.itineraryJourneyInfoTemplate = this.getById(this.itineraryJourneyInfoTemplateId);
            this.itineraryJourneyInfoStripedTemplate = this.getById(this.itineraryJourneyInfoStripedTemplateId);
            this.journeyItinerarySummaryInfoTemplate = this.getById(this.journeyItinerarySummaryInfoTemplateId);
            this.allPassengerFeesItinerarySummaryInfoTemplate = this.getById(this.allPassengerFeesItinerarySummaryInfoTemplateId);
            this.journeyPricingHtmlTemlate = this.getById(this.journeyPricingHtmlTemlateId);
        };

        thisBooking.initJourneysArray = function () {
            var i = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = new SKYSALES.Class.JourneyDateMarket();
                journeyDateMarket.init(journeyDateMarketArray[i]);
                journeyDateMarketArray[i] = journeyDateMarket;
            }
        };

        thisBooking.initPassengersArray = function () {
            var i = 0,
                passengersArray = this.Passengers || [],
                len = passengersArray.length,
                passenger = null;
            for (i = 0; i < len; i += 1) {
                passenger = new SKYSALES.Class.Passenger();
                passenger.init(passengersArray[i]);
                passengersArray[i] = passenger;
            }
        };

        thisBooking.initBookingSum = function () {
            var bookingSumJson = this.BookingSum;
            this.BookingSum = new SKYSALES.Class.BookingSum();
            this.BookingSum.init(bookingSumJson);
        };

        thisBooking.initBookingPricing = function (json) {
            this.BookingPricing = new SKYSALES.Class.BookingPricing();
            this.BookingPricing.init(json);
        };

        thisBooking.initAllPassengerFees = function (json) {
            this.AllPassengerFees = new SKYSALES.Class.AllPassengerFees();
            this.AllPassengerFees.init(json);
        };

        thisBooking.getSelectViewItineraryJourneysHtml = function () {
            var i = 0,
                html = '',
                journeyHtml = '',
                journeyInfoHtml = '',
                journeyPricingHtml = '',
                journeyPassengerPricingHtml = '',
                deptDate = '',
                totalPrice = 0,
                taxAndFeePrice = 0,
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null,
                std = '',
                sta = '',
                segments = [],
                segmentCount = -1;

            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];

                if (i % 2 !== 0) {
                    journeyHtml = this.itineraryJourneyInfoTemplate.text();
                } else {
                    journeyHtml = this.itineraryJourneyInfoStripedTemplate.text();
                }
                journeyInfoHtml = this.journeyItinerarySummaryInfoTemplate.text();

                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[journeyNumber\]/, i + 1);
                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[journeyIndex\]/g, i);
                deptDate = $.datepicker.formatDate(thisBooking.fullDateFormatString, journeyDateMarket.DepartureDate.date);
                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[journeyDate\]/, deptDate);
                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[stationPair\]/, journeyDateMarket.DepartureStation + ' to ' + journeyDateMarket.ArrivalStation);
                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[flightDesignator\]/, journeyDateMarket.FlightDesignator);
                segments = journeyDateMarket.Segments;
                if (segments && segments.length && segments.length > 0) {
                    segmentCount = segments.length;

                    std = segments[0].Std.getTime();
                    sta = segments[segmentCount - 1].Sta.getTime();

                }
                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[deptArriveTimes\]/, std + ' to ' + sta);
                totalPrice = SKYSALES.Util.convertToLocaleCurrency(thisBooking.BookingPricing.JourneyPricingList[i].JourneyTotalPrice);
                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[journeyTotalPrice\]/, totalPrice);

                journeyPricingHtml = this.journeyPricingHtmlTemlate.text();
                journeyPassengerPricingHtml = thisBooking.BookingPricing.JourneyPricingList[i].getSelectViewPassengerPricingHtml();

                journeyPricingHtml = SKYSALES.Util.replace(journeyPricingHtml, /\[passengerPricingDetails\]/, journeyPassengerPricingHtml);

                taxAndFeePrice = SKYSALES.Util.convertToLocaleCurrency(thisBooking.BookingPricing.JourneyPricingList[i].TotalTaxAndFee);
                journeyPricingHtml = SKYSALES.Util.replace(journeyPricingHtml, /\[taxesAndFeesDetails\]/, taxAndFeePrice);

                journeyInfoHtml = SKYSALES.Util.replace(journeyInfoHtml, /\[pricingDetails\]/, journeyPricingHtml);


                journeyHtml = SKYSALES.Util.replace(journeyHtml, /\[journeyDetails\]/, journeyInfoHtml);

                html += journeyHtml;
            }

            return html;
        };

        thisBooking.getSelectViewItineraryAllPassengerFeesHtml = function () {
            var i = 0,
                html = '',
                passengerFeeHtml = '',
                passengerFeeInfoHtml = '',
                allPassengerFees = this.AllPassengerFees || [],
                len = allPassengerFees.length,
                passengerFee = {},
                feeType = '',
                total = '';

            for (i = 0; i < len; i += 1) {
                passengerFee = allPassengerFees[i];
                feeType = passengerFee.FeeType;
                total = passengerFee.Total;

                if (i % 2 !== 0) {
                    passengerFeeHtml = this.itineraryJourneyInfoTemplate.text();
                } else {
                    passengerFeeHtml = this.itineraryJourneyInfoStripedTemplate.text();
                }
                passengerFeeInfoHtml = this.allPassengerFeesItinerarySummaryInfoTemplate.text();

                total = SKYSALES.Util.convertToLocaleCurrency(total);
                passengerFeeInfoHtml = SKYSALES.Util.replace(passengerFeeInfoHtml, /\[feeType\]/, feeType);
                passengerFeeInfoHtml = SKYSALES.Util.replace(passengerFeeInfoHtml, /\[total\]/, total);

                passengerFeeHtml = SKYSALES.Util.replace(passengerFeeHtml, /\[journeyDetails\]/, passengerFeeInfoHtml);

                html += passengerFeeHtml;
            }

            return html;
        };

        thisBooking.drawConfirmView = function () {
            var i = 0,
                taxAndFeePrice = 0,
                totalPrice = 0,
                totalJourneyPrice = 0,
                segments = '',
                segmentsLength = 0,
                segmentStd = '',
                segmentSta = '',
                html = '',
                tableHtml = '',
                passengerPricingHtml = '',
                journeyDateMarketArray = this.Journeys || [],
                len = journeyDateMarketArray.length,
                journeyDateMarket = null;
            for (i = 0; i < len; i += 1) {
                journeyDateMarket = journeyDateMarketArray[i];


                if (i === len - 1) {
                    tableHtml = this.itinerarySummaryLeftViewFinalTableTemplate.text();
                } else {
                    tableHtml = this.itinerarySummaryLeftViewTableTemplate.text();
                }

                tableHtml = SKYSALES.Util.replace(tableHtml, /\[flightIndex\]/, i + 1);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[deptDate\]/, journeyDateMarket.DepartureDate.date.toDateString());
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[deptStation\]/, journeyDateMarket.DepartureStation);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[arriveStation\]/, journeyDateMarket.ArrivalStation);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[flightDesignator\]/, journeyDateMarket.FlightDesignator);
                if (journeyDateMarket.Segments && journeyDateMarket.Segments.length && journeyDateMarket.Segments[0].Std && journeyDateMarket.Segments[journeyDateMarket.Segments.length - 1].Sta) {
                    segments = journeyDateMarket.Segments;
                    segmentsLength = journeyDateMarket.Segments.length;
                    segmentStd = journeyDateMarket.Segments[0].Std;
                    segmentSta = journeyDateMarket.Segments[segmentsLength - 1].Sta;

                    tableHtml = SKYSALES.Util.replace(tableHtml, /\[departureTime\]/, segmentStd.getTime());
                    tableHtml = SKYSALES.Util.replace(tableHtml, /\[arrivalTime\]/, segmentSta.getTime());
                }


                tableHtml = SKYSALES.Util.replace(tableHtml, /\[classPricing\]/, journeyDateMarket.JourneyFares[0].ClassOfService);

                passengerPricingHtml = thisBooking.BookingPricing.JourneyPricingList[i].getConfirmViewPassengerPricingHtml();

                totalPrice = SKYSALES.Util.convertToLocaleCurrency(thisBooking.BookingPricing.TotalBookingPrice);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[bookingTotalPrice\]/, totalPrice);
                totalJourneyPrice = SKYSALES.Util.convertToLocaleCurrency(thisBooking.BookingPricing.JourneyPricingList[i].JourneyTotalPrice);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[totalJourneyPrice\]/, totalJourneyPrice);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[passengersPricing\]/, passengerPricingHtml);

                taxAndFeePrice = SKYSALES.Util.convertToLocaleCurrency(thisBooking.BookingPricing.JourneyPricingList[i].TotalTaxAndFee);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[totalTaxesAndFees\]/, taxAndFeePrice);

                //            tableHtml = SKYSALES.Util.replace(tableHtml, /\[currencySymbol\]/, thisBooking.BookingPricing.CurrencyCode);
                tableHtml = SKYSALES.Util.replace(tableHtml, /\[currencyName\]/, thisBooking.BookingPricing.CurrencyDescription);

                html += tableHtml;
            }

            this.container.html(html);
        };

        return thisBooking;
    };

    /*
    Name:
    Class BookingPricing
    Param:
    None
    Return:
    An instance of BookingPricing
    Functionality:
    Handles the BookingPricing control
    Notes:
    This object contains the total booking price of the pnr.  It contains the journey pricing info as well.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> BookingPricing
    */
    SKYSALES.Class.BookingPricing = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisBookingPricing = SKYSALES.Util.extendObject(parent);

        thisBookingPricing.TotalBookingPrice = 0;
        thisBookingPricing.JourneyPricingList = [];
        thisBookingPricing.CurrencyCode = '';
        thisBookingPricing.CurrencyDescription = '';
        thisBookingPricing.DisplayPrefix = '';
        thisBookingPricing.DisplaySuffix = '';

        thisBookingPricing.init = function (json) {
            this.setSettingsByObject(json);
            this.initJourneyPricingListArray();
        };

        thisBookingPricing.initJourneyPricingListArray = function () {
            var i = 0,
                journeyPricingListArray = this.JourneyPricingList || [],
                len = journeyPricingListArray.length,
                journeyPricingInfo = null;
            for (i = 0; i < len; i += 1) {
                journeyPricingInfo = new SKYSALES.Class.JourneyPricingInfo();
                journeyPricingInfo.init(journeyPricingListArray[i]);
                journeyPricingListArray[i] = journeyPricingInfo;
            }
        };

        return thisBookingPricing;
    };

    /*
    Name:
    Class JourneyPricingInfo
    Param:
    None
    Return:
    An instance of JourneyPricingInfo
    Functionality:
    Handles the JourneyPricingInfo control
    Notes:
    This object contains the pricing of a journey.  This includes passenger pricing info.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> JourneyPricingInfo
    */
    SKYSALES.Class.JourneyPricingInfo = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisJourneyPricingInfo = SKYSALES.Util.extendObject(parent);

        thisJourneyPricingInfo.JourneyTotalPrice = 0;
        thisJourneyPricingInfo.TotalTaxAndFee = 0;
        thisJourneyPricingInfo.JourneyPassengerPriceInfoList = [];
        thisJourneyPricingInfo.journeyPassengerPricingHtmlTemplateId = 'journeyPassengerPricingHtmlTemplate';
        thisJourneyPricingInfo.journeyPassengerPricingHtmlTemplate = null;
        thisJourneyPricingInfo.confirmViewPassengerPriceInfoTemplateId = 'confirmViewPassengerPriceInfoTemplate';
        thisJourneyPricingInfo.confirmViewPassengerPriceInfoTemplate = null;


        thisJourneyPricingInfo.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        thisJourneyPricingInfo.setVars = function () {
            this.journeyPassengerPricingHtmlTemplate = this.getById(this.journeyPassengerPricingHtmlTemplateId);
            this.confirmViewPassengerPriceInfoTemplate = this.getById(this.confirmViewPassengerPriceInfoTemplateId);
        };

        thisJourneyPricingInfo.initJourneyPassengerPriceInfoList = function () {
            var i = 0,
                journeyPassengerPriceInfoListArray = this.JourneyPassengerPriceInfoList || [],
                len = journeyPassengerPriceInfoListArray.length,
                journeyPassengerPriceInfo = null;
            for (i = 0; i < len; i += 1) {
                journeyPassengerPriceInfo = new SKYSALES.Class.JourneyPricingInfo();
                journeyPassengerPriceInfo.init(journeyPassengerPriceInfoListArray[i]);
                journeyPassengerPriceInfoListArray[i] = journeyPassengerPriceInfo;
            }
        };

        thisJourneyPricingInfo.getSelectViewPassengerPricingHtml = function () {
            var i = 0,
                html = '',
                paxHtml = '',
                passengerPricing = 0,
                journeyPassengerPriceInfoListArray = this.JourneyPassengerPriceInfoList || [],
                len = journeyPassengerPriceInfoListArray.length,
                journeyPassengerPriceInfo = null;
            for (i = 0; i < len; i += 1) {
                journeyPassengerPriceInfo = journeyPassengerPriceInfoListArray[i];
                html = this.journeyPassengerPricingHtmlTemplate.text();

                html = SKYSALES.Util.replace(html, /\[paxType\]/, journeyPassengerPriceInfo.PassengerType);
                passengerPricing = SKYSALES.Util.convertToLocaleCurrency(journeyPassengerPriceInfo.PassengerPrice);
                html = SKYSALES.Util.replace(html, /\[passengerPrice\]/g, passengerPricing);

                paxHtml += html;
            }

            return paxHtml;
        };

        thisJourneyPricingInfo.getConfirmViewPassengerPricingHtml = function () {
            var i = 0,
                html = '',
                paxHtml = '',
                passengerPricing = 0,
                journeyPassengerPriceInfoListArray = this.JourneyPassengerPriceInfoList || [],
                len = journeyPassengerPriceInfoListArray.length,
                journeyPassengerPriceInfo = null;

            for (i = 0; i < len; i += 1) {
                journeyPassengerPriceInfo = journeyPassengerPriceInfoListArray[i];
                html = this.confirmViewPassengerPriceInfoTemplate.text();

                //            html = SKYSALES.Util.replace(html, /\[paxIndex\]/, i + 1);
                html = SKYSALES.Util.replace(html, /\[paxType\]/, journeyPassengerPriceInfo.PassengerType);
                passengerPricing = SKYSALES.Util.convertToLocaleCurrency(journeyPassengerPriceInfo.PassengerPrice);
                html = SKYSALES.Util.replace(html, /\[passengerPrice\]/g, passengerPricing);

                paxHtml += html;
            }

            return paxHtml;
        };

        return thisJourneyPricingInfo;
    };

    /*
    Name:
    Class JourneyPassengerPriceInfo
    Param:
    None
    Return:
    An instance of JourneyPassengerPriceInfo
    Functionality:
    Handles the JourneyPassengerPriceInfo control
    Notes:
    this object tells the passenger type and passenger price.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> JourneyPassengerPriceInfo
    */
    SKYSALES.Class.JourneyPassengerPriceInfo = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisJourneyPassengerPriceInfo = SKYSALES.Util.extendObject(parent);

        thisJourneyPassengerPriceInfo.PassengerType = '';
        thisJourneyPassengerPriceInfo.PassengerPrice = 0;

        thisJourneyPassengerPriceInfo.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisJourneyPassengerPriceInfo;
    };

    /*
    Name:
    Class AllPassengerFees
    Param:
    None
    Return:
    An instance of AllPassengerFees
    Functionality:
    Notes:
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> AllPassengerFees
    */
    SKYSALES.Class.AllPassengerFees = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisAllPassengerFees = SKYSALES.Util.extendObject(parent);

        thisAllPassengerFees.AllPassengerFees = [];

        thisAllPassengerFees.init = function (json) {
            var i = 0,
                len = 0,
                passengerFee;

            thisAllPassengerFees.AllPassengerFees = json || [];
            len = this.AllPassengerFees.length;
            for (i = 0; i < len; i += 1) {
                passengerFee = new SKYSALES.Class.PassengerFee();
                passengerFee.init(this.AllPassengerFees[i]);
                this.AllPassengerFees[i] = passengerFee;
            }
        };

        return thisAllPassengerFees;
    };

    /*
    Name:
    Class PassengerFee
    Param:
    None
    Return:
    An instance of PassengerFee
    Functionality:
    Notes:
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> PassengerFee
    */
    SKYSALES.Class.PassengerFee = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassengerFee = SKYSALES.Util.extendObject(parent);

        thisPassengerFee.FeeType = '';
        thisPassengerFee.Total = 0;

        thisPassengerFee.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisPassengerFee;
    };

    /*
    Name:
    Class BookingSum
    Param:
    None
    Return:
    An instance of BookingSum
    Functionality:
    Handles the BookingSum control
    Notes:
    this Object tell the booking summary pricing info.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> BookingSum
    */
    SKYSALES.Class.BookingSum = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisBookingSum = SKYSALES.Util.extendObject(parent);

        thisBookingSum.BalanceDue = '';
        thisBookingSum.PassiveSegmentCount = 0;
        thisBookingSum.SegmentCount = 0;
        thisBookingSum.TotalCost = '';

        thisBookingSum.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisBookingSum;
    };

    /*
    Name:
    Class Passenger
    Param:
    None
    Return:
    An instance of Passenger
    Functionality:
    Handles the Passenger control
    Notes:
    this object has all relavant passenger info.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> Passenger
    */
    SKYSALES.Class.Passenger = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassenger = SKYSALES.Util.extendObject(parent);

        thisPassenger.CustomerNumer = -1;
        thisPassenger.FamilyNumber = -1;
        thisPassenger.Infant = null;
        thisPassenger.Name = null;
        thisPassenger.PassengerAddresses = [];
        thisPassenger.PassengerBags = [];
        thisPassenger.PassengerFees = [];
        thisPassenger.PassengerId = -1;
        thisPassenger.PassengerInfo = null;
        thisPassenger.PassengerNumber = -1;
        thisPassenger.PassengerProgram = null;
        thisPassenger.PassengerTravelDocuments = [];
        thisPassenger.PassengerTypeInfo = null;

        thisPassenger.init = function (json) {
            this.setSettingsByObject(json);
        };


        return thisPassenger;
    };

    /*
    Name:
    Class PassengerTypeInfo
    Param:
    None
    Return:
    An instance of PassengerTypeInfo
    Functionality:
    Handles the PassengerTypeInfo control
    Notes:
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> PassengerTypeInfo
    */
    SKYSALES.Class.PassengerTypeInfo = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassengerTypeInfo = SKYSALES.Util.extendObject(parent);

        thisPassengerTypeInfo.PaxType = '';
        thisPassengerTypeInfo.Dob = null;

        thisPassengerTypeInfo.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisPassengerTypeInfo;
    };

    /*
    Name:
    Class TripPlannerFareRules
    Param:
    None
    Return:
    An instance of TripPlannerFareRules
    Functionality:
    Handles the TripPlannerFareRules control
    Notes:
    The tripPlannerFareRules object is a page level obejct for the tripplannerConfirm page.  It is responsible
    for displaying the iterary summary and the fare rules of all the select journeys.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> TripPlannerFareRules
    */
    SKYSALES.Class.TripPlannerFareRules = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerFareRules = SKYSALES.Util.extendObject(parent);

        thisTripPlannerFareRules.containerId = 'tripPlannerFareRules';
        thisTripPlannerFareRules.container = null;
        thisTripPlannerFareRules.tripFareRuleTemplateId = 'tripPlannerFareRuleTemplate';
        thisTripPlannerFareRules.tripFareRuleTemplate = null;

        thisTripPlannerFareRules.fareRulesFormattedList = [];

        thisTripPlannerFareRules.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.draw();
        };

        thisTripPlannerFareRules.setVars = function () {
            thisTripPlannerFareRules.container = this.getById(this.containerId);
            thisTripPlannerFareRules.tripFareRuleTemplate = this.getById(this.tripFareRuleTemplateId);
        };

        thisTripPlannerFareRules.draw = function () {
            var i = 0,
                html = '',
                tripFareRuleHtml = '',
                fareRulesArray = this.fareRulesFormattedList || [],
                len = fareRulesArray.length,
                fareRule = null;

            for (i = 0; i < len; i += 1) {
                fareRule = fareRulesArray[i];
                tripFareRuleHtml = this.tripFareRuleTemplate.text();

                tripFareRuleHtml = SKYSALES.Util.replace(tripFareRuleHtml, /\[tripNumber\]/g, i + 1);
                tripFareRuleHtml = SKYSALES.Util.replace(tripFareRuleHtml, /\[fareRule\]/, SKYSALES.Util.decodeUriComponent(fareRule));

                html += tripFareRuleHtml;
            }

            this.container.html(html);
        };

        return thisTripPlannerFareRules;
    };

    /*
    Name:
    Class TripPlannerHelp
    Param:
    None
    Return:
    An instance of TripPlannerHelp
    Functionality:
    Handles the TripPlannerHelp control
    Notes:
    This object creates a toggle div for the help links on the tripplanner search and select pages.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> TripPlannerHelp
    */
    SKYSALES.Class.TripPlannerHelp = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisTripPlannerHelp = SKYSALES.Util.extendObject(parent);

        thisTripPlannerHelp.containerId = 'tripPlannerHelpLink';
        thisTripPlannerHelp.container = null;

        thisTripPlannerHelp.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisTripPlannerHelp.setVars = function () {
            this.container = this.getById(this.containerId);
        };

        thisTripPlannerHelp.addEvents = function () {
            this.addHelp();
        };

        thisTripPlannerHelp.addHelp = function () {
            var toggleObject = new SKYSALES.Class.ToggleView(),
                toggleJson = {
                    "elementId": "tripPlannerHelp",
                    "hideId": "tripPlannerHelpLink",
                    "showId": "tripPlannerHelpLink"
                };

            toggleObject.init(toggleJson);
            toggleObject.updateHide();
        };

        return thisTripPlannerHelp;
    };

    /*
    -----------------------------------------------------------------------------------------------
    END Trip Planner objects
    -----------------------------------------------------------------------------------------------
    */


    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    START Loyalty objects
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */


    /*
    Name:
    Class LoyaltyHistoryList
    Param:
    None
    Return:
    An instance of LoyaltyHistoryList
    Functionality:
    Handles the LoyaltyHistoryList control
    Notes:
    This object creates a container for the date filter search.
    All functionality is inherited from the SkySales Class
    Class Hierarchy:
    SkySales -> LoyaltyTransaction
    */
    SKYSALES.Class.LoyaltyHistoryList = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisLoyaltyHistoryList = SKYSALES.Util.extendObject(parent);

        thisLoyaltyHistoryList.loyaltyTransactionList = {};

        thisLoyaltyHistoryList.startDateId = '';
        thisLoyaltyHistoryList.startDateDayId = '';
        thisLoyaltyHistoryList.startDateMonthYearId = '';

        thisLoyaltyHistoryList.startDate = null;
        thisLoyaltyHistoryList.startDateDay = null;
        thisLoyaltyHistoryList.startDateMonthYear = null;

        thisLoyaltyHistoryList.endDateId = '';
        thisLoyaltyHistoryList.endDateDayId = '';
        thisLoyaltyHistoryList.endDateMonthYearId = '';

        thisLoyaltyHistoryList.endDate = '';
        thisLoyaltyHistoryList.endDateDay = '';
        thisLoyaltyHistoryList.endDateMonthYear = '';

        thisLoyaltyHistoryList.filterButtonId = '';
        thisLoyaltyHistoryList.filterButton = null;

        thisLoyaltyHistoryList.pageSizeId = '';
        thisLoyaltyHistoryList.pageSizeDom = null;
        thisLoyaltyHistoryList.currentPageId = '';
        thisLoyaltyHistoryList.currentPageDom = null;

        thisLoyaltyHistoryList.yearRange = '';



        thisLoyaltyHistoryList.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initFilterDates();
            this.addEvents();
        };

        thisLoyaltyHistoryList.setVars = function () {
            this.startDate = this.getById(this.startDateId);
            this.startDateDay = this.getById(this.startDateDayId);
            this.startDateMonthYear = this.getById(this.startDateMonthYearId);
            this.endDate = this.getById(this.endDateId);
            this.endDateDay = this.getById(this.endDateDayId);
            this.endDateMonthYear = this.getById(this.endDateMonthYearId);
            this.pageSizeDom = this.getById(this.pageSizeId);
            this.currentPageDom = this.getById(this.currentPageId);
            this.filterButton = this.getById(this.filterButtonId);
        };


        thisLoyaltyHistoryList.addEvents = function () {
            this.filterButton.click(this.updateFilterHandler);
            this.startDateDay.change(this.updateFilterHandler);
            this.startDateMonthYear.change(this.updateFilterHandler);
            this.endDateDay.change(this.updateFilterHandler);
            this.endDateMonthYear.change(this.updateFilterHandler);
        };

        thisLoyaltyHistoryList.initFilterDates = function () {
            var startDate = SKYSALES.Util.parseIsoDate(this.loyaltyTransactionList.startDate),
                endDate = SKYSALES.Util.parseIsoDate(this.loyaltyTransactionList.endDate);

            this.populateDay(this.startDateDay, startDate.getDate());
            this.populateDay(this.endDateDay, endDate.getDate());
            this.populateMonthYear(this.startDateMonthYear, startDate.getFullYear(), (startDate.getMonth() + 1));
            this.populateMonthYear(this.endDateMonthYear, endDate.getFullYear(), (endDate.getMonth() + 1));
            this.populateHiddenDateFields();
        };

        thisLoyaltyHistoryList.formatDateValue = function (value) {
            var stringValue = value.toString();
            if (stringValue.length === 1) {
                stringValue = '0' + stringValue;
            }
            return stringValue;
        };


        thisLoyaltyHistoryList.populateDay = function (dayDom, selectedDay) {
            var i = 0,
                dayValues = [],
                dayJson = {};

            for (i = 1; i <= 31; i += 1) {
                dayValues[i] = {
                    "code": this.formatDateValue(i),
                    "name": i
                };
            }

            dayJson = {
                "selectBox": dayDom,
                "objectArray": dayValues,
                "selectedItem": this.formatDateValue(selectedDay)
            };

            SKYSALES.Util.populateSelect(dayJson);
        };

        thisLoyaltyHistoryList.populateMonthYear = function (monthYearDom, selectedYear, selectedMonth) {
            var yearCtr = 0,
                monthCtr = 0,
                initialDate = new Date(),
                year = initialDate.getFullYear(),
                yearRange = 2,
                monthYearValues = [],
                monthYearJson = {},
                monthYearCtr = 0,
                monthText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


            year = year - yearRange;
            for (yearCtr = yearRange * -1; yearCtr <= yearRange; yearCtr += 1) {
                for (monthCtr = 1; monthCtr <= 12; monthCtr += 1) {
                    monthYearValues[monthYearCtr] = {
                        "code": year + "-" + this.formatDateValue(monthCtr),
                        "name": monthText[monthCtr - 1] + " " + year
                    };
                    monthYearCtr += 1;
                }
                year += 1;
            }

            monthYearJson = {
                "selectBox": monthYearDom,
                "objectArray": monthYearValues,
                "selectedItem": selectedYear + '-' + this.formatDateValue(selectedMonth)
            };

            SKYSALES.Util.populateSelect(monthYearJson);
        };

        thisLoyaltyHistoryList.updateFilterHandler = function () {
            thisLoyaltyHistoryList.populateHiddenDateFields();
        };

        thisLoyaltyHistoryList.populateHiddenDateFields = function () {
            var selectedStartDate = this.startDateMonthYear.val() + '-' + this.startDateDay.val(),
                selectedEndDate = this.endDateMonthYear.val() + '-' + this.endDateDay.val();

            this.startDate.val(selectedStartDate);
            this.endDate.val(selectedEndDate);
            this.pageSizeDom.val(this.loyaltyTransactionList.pageSize);
        };

        return thisLoyaltyHistoryList;
    };


    /*

    --------------------------------------------------------------------------------------------------------------------------------------------------
    END Loyalty objects
    --------------------------------------------------------------------------------------------------------------------------------------------------

    */

    /*
    Name:
    Class ParticipantMapping
    Param:
    None
    Return:
    An instance of ParticipantMapping
    Functionality:
    Handles the ParticipantMapping control
    Notes:
    This object creates a link between the passengers and the participants
    Class Hierarchy:
    SkySales -> ParticipantMapping
    */
    SKYSALES.Class.ParticipantMapping = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisParticipantMapping = SKYSALES.Util.extendObject(parent);

        thisParticipantMapping.containerId = '';
        thisParticipantMapping.container = null;
        thisParticipantMapping.participantInputHash = {};
        thisParticipantMapping.dropDownInputArray = [];
        thisParticipantMapping.yearStart = 1900;
        thisParticipantMapping.dayCount = 31;
        thisParticipantMapping.birthDateId = '';
        thisParticipantMapping.birthDate = null;
        thisParticipantMapping.birthDateYearId = '';
        thisParticipantMapping.birthDateYear = null;
        thisParticipantMapping.birthDateMonthId = '';
        thisParticipantMapping.birthDateMonth = null;
        thisParticipantMapping.birthDateDayId = '';
        thisParticipantMapping.birthDateDay = null;
        thisParticipantMapping.disableFields = false;

        thisParticipantMapping.copyContactArray = [];

        thisParticipantMapping.copyContactChecked = '';
        thisParticipantMapping.copyContactCheckedObject = null;

        thisParticipantMapping.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initDropDowns();
            if (this.disableFields) {
                this.disableFormFields();
            } else {
                this.addEvents();
            }
            this.updateBirthDateDropDown();
        };

        thisParticipantMapping.disableFormFields = function () {
            this.container.find(':input').attr('disabled', 'disabled');
        };

        thisParticipantMapping.setVars = function () {
            this.container = this.getById(this.containerId);
            this.birthDate = this.getById(this.birthDateId);
            this.birthDateYear = this.getById(this.birthDateYearId);
            this.birthDateMonth = this.getById(this.birthDateMonthId);
            this.birthDateDay = this.getById(this.birthDateDayId);
            this.copyContactCheckedObject = this.getById(this.copyContactChecked);

        };

        thisParticipantMapping.addEvents = function () {
            this.container.change(this.mapPassengerHandler);
            this.birthDate.change(this.updateBirthDateDropDownHandler);
            this.birthDateYear.change(this.updateBirthDateHandler);
            this.birthDateMonth.change(this.updateBirthDateHandler);
            this.birthDateDay.change(this.updateBirthDateHandler);
            this.copyContactCheckedObject.change(this.copyContactDetailsHandler);
        };

        thisParticipantMapping.getDataTypeHash = function () {
            var resource = SKYSALES.Util.getResource() || {},
                countryInfo = resource.countryInfo.CountryList || [],
                provinceStateInfo = resource.provinceStateInfo.ProvinceStateList || [],
                titleInfo = resource.titleInfo.TitleList || [],
                monthInfo = resource.dateCultureInfo.monthNamesShort || [],
                monthName = '',
                dataTypeHash = {},
                dateDayInfo = [],
                dateMonthInfo = [],
                dateYearInfo = [],
                len = 0,
                i = 0,
                dayCount = this.dayCount,
                yearStart = this.yearStart,
                currentDate = new Date(),
                currentYear = currentDate.getFullYear(),
                state = {};

            for (i = 1; i <= dayCount; i += 1) {
                dateDayInfo.push({
                    "name": i,
                    "code": i
                });
            }

            len = monthInfo.length;
            for (i = 0; i < len; i += 1) {
                monthName = monthInfo[i];
                if (monthName) {
                    dateMonthInfo.push({
                        "name": monthName,
                        "code": i
                    });
                }
            }

            for (i = currentYear; i >= yearStart; i -= 1) {
                dateYearInfo.push({
                    "name": i,
                    "code": i
                });
            }

            len = provinceStateInfo.length;
            for (i = 0; i < len; i += 1) {
                state = provinceStateInfo[i] || {};
                state.code = state.scode;
            }

            dataTypeHash = {
                "country": countryInfo,
                "provinceState": provinceStateInfo,
                "title": titleInfo,
                "dateDay": dateDayInfo,
                "dateMonth": dateMonthInfo,
                "dateYear": dateYearInfo
            };
            return dataTypeHash;
        };

        thisParticipantMapping.copyContactDetailsHandler = function () {
            if (thisParticipantMapping.copyContactCheckedObject.children()[0].checked) {
                thisParticipantMapping.mapContact();
            } else {
                thisParticipantMapping.clearParticipantContact();
            }
        };

        thisParticipantMapping.initDropDowns = function () {
            var i = 0,
                dropDownInputArray = this.dropDownInputArray || [],
                len = dropDownInputArray.length,
                dropDownInput = null,
                id = '',
                dataType = '',
                value = '',
                objectArray = [],
                dataTypeHash = this.getDataTypeHash() || {},
                selectBox = null,
                selectParamObj = {};

            for (i = 0; i < len; i += 1) {
                dropDownInput = dropDownInputArray[i];
                id = dropDownInput.id || '';
                dataType = dropDownInput.dataType || '';
                value = dropDownInput.value || '';

                selectBox = this.getById(id);
                if (selectBox.length && dataTypeHash[dataType]) {
                    objectArray = dataTypeHash[dataType];
                    selectParamObj = {
                        'objectArray': objectArray,
                        'input': selectBox,
                        'showCode': false,
                        'clearOptions': false,
                        'selectedItem': value
                    };

                    SKYSALES.Util.populate(selectParamObj);
                }
            }
        };

        thisParticipantMapping.mapPassengerHandler = function () {
            thisParticipantMapping.mapPassenger();
        };

        thisParticipantMapping.updateBirthDateHandler = function () {
            thisParticipantMapping.updateBirthDate();
        };

        thisParticipantMapping.updateBirthDate = function () {
            var value = '',
                birthDate = null,
                year = 0,
                month = 0,
                day = 0;

            year = this.birthDateYear.val();
            month = this.birthDateMonth.val();
            day = this.birthDateDay.val();

            if (year && month && day) {
                year = parseInt(year, 10);
                month = parseInt(month, 10);
                day = parseInt(day, 10);
                birthDate = new Date(year, month, day);
                value = SKYSALES.Util.dateToIsoString(birthDate);
            }

            this.birthDate.val(value);
        };

        thisParticipantMapping.updateBirthDateDropDownHandler = function () {
            thisParticipantMapping.updateBirthDateDropDown();
        };

        thisParticipantMapping.updateBirthDateDropDown = function () {
            var value = '',
                birthDate = null,
                year = 0,
                month = 0,
                day = 0;

            value = this.birthDate.val();
            birthDate = SKYSALES.Util.parseIsoDate(value);

            if (birthDate) {
                year = birthDate.getFullYear();
                month = birthDate.getMonth();
                day = birthDate.getDate();

                if (year !== 9999) {
                    this.birthDateYear.val(year);
                    this.birthDateMonth.val(month);
                    this.birthDateDay.val(day);
                }
            }

        };

        thisParticipantMapping.clearPreviousPassengerBirthDateDropDown = function () {
            var value = this.birthDate.val();

            if (value === "") {
                this.birthDateYear.val("");
                this.birthDateMonth.val("");
                this.birthDateDay.val("");
            }
        };

        thisParticipantMapping.getParticipantToPassengerMap = function (passenger, isInfantSelected) {
            var title = '',
                firstName = '',
                middleName = '',
                lastName = '',
                dob = '',
                address = {},
                doc = {},
                map = {};

            if (isInfantSelected) {
                passenger.Infant.Name = passenger.Infant.Name || {};
                title = passenger.Infant.Name.Title || '';
                firstName = passenger.Infant.Name.FirstName || '';
                middleName = passenger.Infant.Name.MiddleName || '';
                lastName = passenger.Infant.Name.LastName || '';
                dob = passenger.Infant.Dob || '';
            } else {
                passenger.Name = passenger.Name || {};
                title = passenger.Name.Title || '';
                firstName = passenger.Name.FirstName || '';
                middleName = passenger.Name.MiddleName || '';
                lastName = passenger.Name.LastName || '';
                dob = passenger.PassengerTypeInfo.Dob || '';
                address = passenger.PassengerAddresses[0] || {};
                doc = passenger.PassengerTravelDocuments[0] || {};
            }

            if (dob.Year) {
                dob = new Date(dob.Year, dob.Month - 1, dob.Day);
                dob = SKYSALES.Util.dateToIsoString(dob);
            }

            map = {
                "title": title,
                "firstName": firstName,
                "middleName": middleName,
                "lastName": lastName,
                "birthDate": dob,
                "address1": address.AddressLine1,
                "address2": address.AddressLine2,
                "city": address.City,
                "stateCode": address.ProvinceState,
                "zipCode": address.PostalCode,
                "countryCode": address.CountryCode,
                "county": "",
                "phoneHome": address.Phone,
                "phoneWork": "",
                "phoneFax": "",
                "emailAddress": "",
                "companyName": address.CompanyName,
                "busOrRes": "",
                "docIssuedBy": doc.IssuedByCode,
                "docNumber": doc.DocNumber,
                "docTypeCode": doc.DocTypeCode,
                "itemSequence": "",
                "participantTypeCode": ""
            };

            return map;
        };

        thisParticipantMapping.getParticipantToContactMap = function (contactArray, contactNumber) {
            var map = {},
                i = 0,
                value = [],
                element = null;

            for (i = 0; i < contactArray.length; i += 1) {
                if (contactArray[i] && contactArray[i].value) {
                    value[i] = contactArray[i].value;
                    map[contactArray[i].dataType] = value[i];
                }
            }

            return map;
        };

        thisParticipantMapping.mapPassenger = function () {
            var resource = SKYSALES.Util.getResource() || {},
                passengerHash = resource.passengerHash || {},
                passenger = {},
                map = {},
                prop = '',
                participantInputHash = this.participantInputHash || {},
                value = '',
                input = null,
                previousPassengerDropdownValue = '',
                passengerArray = [],
                passengerNumber = -1,
                passengerInfantNumber = -1,
                isInfantSelected = false;

            previousPassengerDropdownValue = this.container.val() || '';
            passengerArray = previousPassengerDropdownValue.split('_');
            passengerNumber = passengerArray[0] || -1;
            passengerInfantNumber = passengerArray[1] || -1;
            passengerNumber = parseInt(passengerNumber, 10);
            passengerInfantNumber = parseInt(passengerInfantNumber, 10);
            passenger = passengerHash[passengerNumber];

            if (passengerInfantNumber === 0) {
                isInfantSelected = true;
            }

            if (passenger) {
                map = this.getParticipantToPassengerMap(passenger, isInfantSelected);
                for (prop in participantInputHash) {
                    if (participantInputHash.hasOwnProperty(prop)) {
                        value = map[prop] || "";
                        input = this.getById(participantInputHash[prop]);
                        if (value !== "") {
                            input.val(value);
                        }
                    }
                }
            }
            else {
                for (prop in participantInputHash) {
                    input = this.getById(participantInputHash[prop]);
                    if (prop === "title" || prop === "firstName" || prop === "middleName" || prop === "lastName" || prop === "birthDate") {
                        input.val("");
                        if (prop === "birthDate") {
                            thisParticipantMapping.clearPreviousPassengerBirthDateDropDown();
                        }
                    }
                }
            }

            this.updateBirthDateDropDown();
        };

        thisParticipantMapping.mapContact = function () {
            var resource = SKYSALES.Util.getResource() || {},
                contact = this.copyContactArray || [],
                map = {},
                prop = '',
                participantInputHash = this.participantInputHash || {},
                value = '',
                input = null,
                previousPassengerDropdownValue = '',
                contactArray = this.copyContactChecked.split('_') || [],
                contactNumber = -1,
                propertyJson;

            contactNumber = contactArray[2] || -1;

            if (contact) {
                map = this.getParticipantToContactMap(contact, contactNumber);
                for (prop in participantInputHash) {
                    if (participantInputHash.hasOwnProperty(prop)) {
                        propertyJson = map[prop];
                        if (propertyJson) {
                            value = propertyJson;
                            input = this.getById(participantInputHash[prop]);
                            input.val(value);
                        }
                    }
                }
            }
            this.updateBirthDateDropDown();
        };

        thisParticipantMapping.clearParticipantContact = function () {
            var prop = '',
                participantInputHash = this.participantInputHash || {},
                input = null;

            for (prop in participantInputHash) {
                if (participantInputHash.hasOwnProperty(prop)) {
                    input = this.getById(participantInputHash[prop]);
                    if(prop !== "title" && prop !== "firstName" && prop !== "middleName" && prop !== "lastName") {
                        input.val("");
                    }
                }
            }
        };

        return thisParticipantMapping;
    };

    /*
    Name:
    Class PassThroughPayment
    Param:
    None
    Return:
    An instance of PassThroughPayment
    Functionality:
    This class represents the PassThroughPayment control
    Notes:
    This class holds everything that needs to be paid via Payment Pass Through
    Class Hierarchy:
    SkySales -> PassThroughPayment
    */
    SKYSALES.Class.PassThroughPayment = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassThroughPayment = SKYSALES.Util.extendObject(parent);

        thisPassThroughPayment.noOfOrderItems = 0;
        thisPassThroughPayment.noOfYearsFromPresent = 7;
        thisPassThroughPayment.orderItemsListJson = [];
        thisPassThroughPayment.orderItemsArray = [];
        thisPassThroughPayment.orderPaymentTypesHash = {};
        thisPassThroughPayment.vendorsHash = {};
        thisPassThroughPayment.passThroughPaymentJson = {};
        thisPassThroughPayment.paymentInputContentIds = {};
        thisPassThroughPayment.paymentInputContent = {};
        thisPassThroughPayment.passThroughPaymentFields = {};
        thisPassThroughPayment.passThroughPaymentContentArray = [];

        thisPassThroughPayment.init = function (json) {
            this.setSettingsByObject(json);
            this.initPropertiesFromData();
            this.initVendorsHash();
            this.initOrderItemsArray();
            this.initPaymentInputContentArray();
            this.initPassThroughPaymentContentArray();
        };

        thisPassThroughPayment.initPropertiesFromData = function () {
            var passThroughPaymentJson = this.passThroughPaymentJson || {};

            thisPassThroughPayment.noOfOrderItems = passThroughPaymentJson.noOfOrderItems || '';
            thisPassThroughPayment.noOfYearsFromPresent = passThroughPaymentJson.noOfYearsFromPresent || 7;
            thisPassThroughPayment.orderItemsListJson = passThroughPaymentJson.orderItemsListJson || [];
            thisPassThroughPayment.orderPaymentTypesHash = passThroughPaymentJson.orderPaymentTypesHash || [];
        };

        thisPassThroughPayment.initVendorsHash = function () {
            var i = 0,
                vendor = {},
                vendorInformation = this.orderPaymentTypesHash,
                vendorCount = vendorInformation.length;

            for (i = 0; i < vendorCount; i += 1) {
                vendor = new SKYSALES.Class.Vendor();
                vendor.init(vendorInformation[i]);
                thisPassThroughPayment.vendorsHash[vendor.vendorCode] = vendor;
            }
        };

        thisPassThroughPayment.initOrderItemsArray = function () {
            var i = 0,
                orderItem = {},
                orderItemsJson = this.orderItemsListJson || [],
                orderItemCount = this.noOfOrderItems;

            for (i = 0; i < orderItemCount; i += 1) {
                orderItem = new SKYSALES.Class.OrderItem();
                orderItem.init(orderItemsJson[i]);
                this.orderItemsArray.push(orderItem);
            }
        };

        thisPassThroughPayment.initPaymentInputContentArray = function () {
            var paymentInputContent = new SKYSALES.Class.PaymentInputBase(),
                paymentInputContentIds = this.paymentInputContentIds || {};

            paymentInputContent.init(paymentInputContentIds);
            thisPassThroughPayment.paymentInputContent = paymentInputContent;
            this.paymentInputContent = paymentInputContent;
        };

        thisPassThroughPayment.initPassThroughPaymentContentArray = function () {
            var i = 0,
                itemCount = this.noOfOrderItems,
                passThroughPaymentContent = {},
                passThroughPaymentContentJson = {},
                passThroughPaymentFields = this.passThroughPaymentFields || {},
                orderItemsArray = this.orderItemsArray || [];

            for (i = 0; i < itemCount; i += 1) {
                passThroughPaymentContent = new SKYSALES.Class.PaymentPassThroughContent();
                passThroughPaymentContentJson = {
                    "index": i,
                    "vendor": this.vendorsHash[orderItemsArray[i].vendorCode],
                    "passThroughPaymentFields": passThroughPaymentFields,
                    "paymentInput": this.paymentInputContent,
                    "noOfYearsToAdd": this.noOfYearsFromPresent
                };
                passThroughPaymentContent.init(passThroughPaymentContentJson);
                this.passThroughPaymentContentArray[i] = passThroughPaymentContent;
            }
        };

        return thisPassThroughPayment;
    };

    /*
    Name:
    Class PaymentPassThroughContent
    Param:
    None
    Return:
    An instance of PaymentPassThroughContent
    Functionality:
    This class represents a PaymentPassThroughContent
    Notes:
    This class handles each pass through payment
    Class Hierarchy:
    SkySales -> PaymentPassThroughContent
    */

    SKYSALES.Class.PaymentPassThroughContent = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisPassThroughContent = SKYSALES.Util.extendObject(parent);

        thisPassThroughContent.noOfYearsToAdd = 7;
        thisPassThroughContent.index = {};
        thisPassThroughContent.vendor = {};
        thisPassThroughContent.passThroughPaymentFields = {};
        thisPassThroughContent.paymentInput = {};

        thisPassThroughContent.useSameCardCheckId = '';
        thisPassThroughContent.useSameCardCheck = {};
        thisPassThroughContent.ccTypeId = '';
        thisPassThroughContent.ccType = {};
        thisPassThroughContent.ccNumberId = '';
        thisPassThroughContent.ccNumber = {};
        thisPassThroughContent.ccExpirationMonthId = '';
        thisPassThroughContent.ccExpirationMonth = {};
        thisPassThroughContent.ccExpirationYearId = '';
        thisPassThroughContent.ccExpirationYear = {};
        thisPassThroughContent.ccExpirationDateId = '';
        thisPassThroughContent.ccExpirationDate = {};
        thisPassThroughContent.ccHolderNameId = '';
        thisPassThroughContent.ccHolderName = {};
        thisPassThroughContent.ccCvvId = '';
        thisPassThroughContent.ccCvv = {};
        thisPassThroughContent.ccIssueNumberId = '';
        thisPassThroughContent.ccIssueNumber = {};
        thisPassThroughContent.requiredNameErrorText = '';
        thisPassThroughContent.requiredCvvErrorText = '';
        thisPassThroughContent.requiredExpMonthErrorText = '';
        thisPassThroughContent.requiredExpYearErrorText = '';
        thisPassThroughContent.requiredCCNumErrorText = '';

        thisPassThroughContent.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.populateCreditCardTypes();
            this.populateExpirationMonthYear();
            //keep this call at init, in case there are no empty options in front of the select boxes
            //in that case, we want to set the required fields immediately
            this.setPaymentPassThroughValidationFields();
            this.updateIssueNumberVisibility();
            this.addEvents();
        };

        thisPassThroughContent.setVars = function () {
            var index = this.index,
                passThroughPaymentFields = this.passThroughPaymentFields || {};

            thisPassThroughContent.ccCvvId = SKYSALES.Util.replace(passThroughPaymentFields.ccCvvId, /\[index\]/g, index);
            thisPassThroughContent.ccExpirationDateId = SKYSALES.Util.replace(passThroughPaymentFields.ccExpirationDateId, /\[index\]/g, index);
            thisPassThroughContent.ccExpirationMonthId = SKYSALES.Util.replace(passThroughPaymentFields.ccExpirationMonthId, /\[index\]/g, index);
            thisPassThroughContent.ccExpirationYearId = SKYSALES.Util.replace(passThroughPaymentFields.ccExpirationYearId, /\[index\]/g, index);
            thisPassThroughContent.ccHolderNameId = SKYSALES.Util.replace(passThroughPaymentFields.ccHolderNameId, /\[index\]/g, index);
            thisPassThroughContent.ccNumberId = SKYSALES.Util.replace(passThroughPaymentFields.ccNumberId, /\[index\]/g, index);
            thisPassThroughContent.ccTypeId = SKYSALES.Util.replace(passThroughPaymentFields.ccTypeId, /\[index\]/g, index);
            thisPassThroughContent.ccIssueNumberId = SKYSALES.Util.replace(passThroughPaymentFields.ccIssueNumberId, /\[index\]/g, index);
            thisPassThroughContent.useSameCardCheckId = SKYSALES.Util.replace(passThroughPaymentFields.useSameCardCheckId, /\[index\]/g, index);
            thisPassThroughContent.requiredCvvErrorText = passThroughPaymentFields.requiredCvvErrorText;
            thisPassThroughContent.requiredNameErrorText = passThroughPaymentFields.requiredNameErrorText;
            thisPassThroughContent.requiredExpMonthErrorText = passThroughPaymentFields.requiredExpMonthErrorText;
            thisPassThroughContent.requiredExpYearErrorText = passThroughPaymentFields.requiredExpYearErrorText;
            thisPassThroughContent.requiredCCNumErrorText = passThroughPaymentFields.requiredCCNumErrorText;

            thisPassThroughContent.ccCvv = this.getById(this.ccCvvId);
            thisPassThroughContent.ccExpirationDate = this.getById(this.ccExpirationDateId);
            thisPassThroughContent.ccExpirationMonth = this.getById(this.ccExpirationMonthId);
            thisPassThroughContent.ccExpirationYear = this.getById(this.ccExpirationYearId);
            thisPassThroughContent.ccHolderName = this.getById(this.ccHolderNameId);
            thisPassThroughContent.ccNumber = this.getById(this.ccNumberId);
            thisPassThroughContent.ccType = this.getById(this.ccTypeId);
            thisPassThroughContent.ccIssueNumber = this.getById(this.ccIssueNumberId);
            thisPassThroughContent.useSameCardCheck = this.getById(this.useSameCardCheckId);

            this.updateUseSameCardVisibility();
        };

        // makes the useSameCardCheck check box visible or not, depending on the credit card details in paymentInput
        thisPassThroughContent.updateUseSameCardVisibility = function () {
            var cardType = this.getTrimmedPaymentInputCardType(),
                vendor = this.vendor || {},
                acceptedPaymentTypesHash = vendor.acceptedPaymentTypesHash || {},
                useSameCardCheck = this.useSameCardCheck || {},
                useSameCardCheckId = this.useSameCardCheckId || '',
                useSameCardLabel = $('label[for="' + useSameCardCheckId + '"]');

            if (acceptedPaymentTypesHash[cardType]) {
                useSameCardCheck.show();
                useSameCardLabel.show();
            } else {
                useSameCardCheck.hide();
                useSameCardLabel.hide();
            }
        };

        thisPassThroughContent.populateCreditCardTypes = function () {
            var vendor = this.vendor || {},
                selectJson = {
                    "input": this.ccType,
                    "objectArray": vendor.acceptedPaymentTypes
                };

            SKYSALES.Util.populate(selectJson);
        };

        thisPassThroughContent.populateExpirationMonthYear = function () {
            var i = 0,
                initialDate = new Date(),
                year = initialDate.getFullYear(),
                initialMonth = 1,
                expYearRange = this.noOfYearsToAdd || 7,
                expYearJson = {},
                expYearValues = [],
                expMonthJson = {},
                expMonthValues = [];

            for (i = 0; i <= expYearRange; i += 1) {
                expYearValues[i] = {
                    "code": year,
                    "name": year
                };
                year += 1;
            }

            expYearJson = {
                "input": this.ccExpirationYear,
                "objectArray": expYearValues
            };

            SKYSALES.Util.populate(expYearJson);

            for (i = 0; i < 9; i += 1) {
                expMonthValues[i] = {
                    "code": "0" + initialMonth,
                    "name": "0" + initialMonth
                };
                initialMonth += 1;
            }

            for (i = initialMonth - 1; i < 12; i += 1) {
                expMonthValues[i] = {
                    "code": initialMonth,
                    "name": initialMonth
                };
                initialMonth += 1;
            }

            expMonthJson = {
                "input": this.ccExpirationMonth,
                "objectArray": expMonthValues
            };

            SKYSALES.Util.populate(expMonthJson);
        };

        thisPassThroughContent.updatePaymentPassThroughExpirationDateHandler = function () {
            thisPassThroughContent.updatePaymentPassThroughExpirationDate();
        };

        thisPassThroughContent.updatePaymentPassThroughExpirationDate = function () {
            var expMonth = '',
                expYear = '';

            expMonth = this.ccExpirationMonth.val();
            expYear = this.ccExpirationYear.val();

            if (expMonth && expYear) {
                this.ccExpirationDate.val(expMonth + '/' + expYear);
            }
        };

        thisPassThroughContent.autoPopulateFieldsFromPaymentInputHandler = function () {
            if (this.checked) {
                thisPassThroughContent.populateFieldsFromPaymentInput();
            }

            thisPassThroughContent.updatePaymentPassThroughExpirationDate();
            thisPassThroughContent.setPaymentPassThroughValidationFields();
            thisPassThroughContent.updateIssueNumberVisibility();
        };

        // gets the credit card type from the paymentInput control, suitable for copying to this control
        thisPassThroughContent.getTrimmedPaymentInputCardType = function () {
            var cardTypeLong = this.paymentInput.paymentInputCreditCardType.val() || '',
                cardType = SKYSALES.Util.replace(cardTypeLong, /ExternalAccount:/, '');

            return cardType;
        };

        thisPassThroughContent.populateFieldsFromPaymentInput = function () {
            var cardType = this.getTrimmedPaymentInputCardType(),
                paymentInput = this.paymentInput || {},
                vendor = this.vendor || {},
                vendorAcceptedPaymentTypes = vendor.acceptedPaymentTypesHash || {},
                vendorPaymentType = vendorAcceptedPaymentTypes[cardType] || {};

            if (cardType) {
                this.ccType.val(cardType);
                this.ccNumber.val(paymentInput.paymentInputCreditCardNumber.val());
                this.ccExpirationYear.val(paymentInput.paymentInputCreditCardExpirationYear.val());
                this.ccExpirationMonth.val(paymentInput.paymentInputCreditCardExpirationMonth.val());
                this.ccHolderName.val(paymentInput.paymentInputCreditCardHolderName.val());
                this.ccCvv.val(paymentInput.paymentInputCreditCardCvv.val());

                if (vendorPaymentType.supportsIssueNumber) {
                    this.ccIssueNumber.val(paymentInput.paymentInputCreditCardIssueNumber.val());
                } else {
                    this.ccIssueNumber.val('');
                }
            }
        };

        thisPassThroughContent.setPaymentPassThroughValidationFieldsHandler = function () {
            thisPassThroughContent.setPaymentPassThroughValidationFields();
        };

        thisPassThroughContent.setPaymentPassThroughValidationFields = function () {
            var creditCardType = this.ccType,
                creditCTypeValue = creditCardType.val() || '',
                creditCardNumber = this.ccNumber,
                creditCardHolderName = this.ccHolderName,
                creditCardCvv = this.ccCvv,
                creditCardExpirationYear = this.ccExpirationYear,
                creditCardExpirationMonth = this.ccExpirationMonth,
                vendor = this.vendor || {},
                acceptedPaymentTypes = vendor.acceptedPaymentTypesHash || {},
                paymentType = acceptedPaymentTypes[creditCTypeValue] || {
                    "requiresCCType": true
                },
                setRequiredAttribute = SKYSALES.Util.setRequiredAttribute,
                removeRequiredAttribute = SKYSALES.Util.removeRequiredAttribute,
                requiredError = '';

            removeRequiredAttribute(creditCardType);
            if (paymentType.requiresCCType) {
                requiredError = this.requiredCCTypeErrorText;
                setRequiredAttribute(creditCardType, requiredError);
            }

            removeRequiredAttribute(creditCardNumber);
            if (paymentType.requiresCCNum) {
                requiredError = this.requiredCCNumErrorText;
                setRequiredAttribute(creditCardNumber, requiredError);
            }

            removeRequiredAttribute(creditCardHolderName);
            if (paymentType.requiresCcName) {
                requiredError = this.requiredNameErrorText;
                setRequiredAttribute(creditCardHolderName, requiredError);
            }

            removeRequiredAttribute(creditCardCvv);
            if (paymentType.requiresCvv) {
                requiredError = this.requiredCvvErrorText;
                setRequiredAttribute(creditCardCvv, requiredError);
            }

            removeRequiredAttribute(creditCardExpirationMonth);
            if (paymentType.requiresDate) {
                requiredError = this.requiredExpMonthErrorText;
                setRequiredAttribute(creditCardExpirationMonth, requiredError);
            }

            removeRequiredAttribute(creditCardExpirationYear);
            if (paymentType.requiresDate) {
                requiredError = this.requiredExpYearErrorText;
                setRequiredAttribute(creditCardExpirationYear, requiredError);
            }
        };

        thisPassThroughContent.updateIssueNumberVisibilityHandler = function () {
            thisPassThroughContent.updateIssueNumberVisibility();
        };

        thisPassThroughContent.updateIssueNumberVisibility = function () {
            var creditCardTypeCode = this.ccType.val() || '',
                vendor = this.vendor || {},
                acceptedPaymentTypesHash = vendor.acceptedPaymentTypesHash || {},
                creditCardType = acceptedPaymentTypesHash[creditCardTypeCode] || {},
                creditCardIssueNumber = this.ccIssueNumber || {},
                creditCardIssueNumberId = this.ccIssueNumberId || '',
                creditCardIssueNumberLabel = $('label[for="' + creditCardIssueNumberId + '"]');

            if (creditCardType.supportsIssueNumber) {
                creditCardIssueNumberLabel.show();
                creditCardIssueNumber.show();
            } else {
                creditCardIssueNumber.hide();
                creditCardIssueNumberLabel.hide();
                creditCardIssueNumber.val('');
            }
        };

        thisPassThroughContent.addEvents = function () {
            this.ccExpirationMonth.change(this.updatePaymentPassThroughExpirationDateHandler);
            this.ccExpirationYear.change(this.updatePaymentPassThroughExpirationDateHandler);
            this.ccType.change(this.setPaymentPassThroughValidationFieldsHandler);
            this.ccType.change(this.updateIssueNumberVisibilityHandler);
            this.useSameCardCheck.click(this.autoPopulateFieldsFromPaymentInputHandler);
        };

        return thisPassThroughContent;
    };

    /*
    Name:
    Class OrderItem
    Param:
    None
    Return:
    An instance of OrderItem
    Functionality:
    This class represents an Order Item in Travel Commerce
    Notes:
    This class holds the vendor information of an order item
    Class Hierarchy:
    SkySales -> OrderItem
    */

    SKYSALES.Class.OrderItem = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisOrderItem = SKYSALES.Util.extendObject(parent);

        thisOrderItem.vendorCode = '';

        thisOrderItem.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisOrderItem;
    };

    /*
    Name:
    Class Vendor
    Param:
    None
    Return:
    An instance of Vendor
    Functionality:
    This class represents a Vendor in Travel Commerce
    Notes:
    This class holds the accepted payment types of a vendor
    Class Hierarchy:
    SkySales -> Vendor
    */
    SKYSALES.Class.Vendor = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisVendor = SKYSALES.Util.extendObject(parent);

        thisVendor.vendorCode = '';
        thisVendor.acceptedPaymentTypes = [];
        //this hash is for easier retrieval of payment configuration settings
        thisVendor.acceptedPaymentTypesHash = {};

        thisVendor.init = function (json) {
            this.setSettingsByObject(json);
            this.initAcceptedPaymentTypesHash();
        };

        thisVendor.initAcceptedPaymentTypesHash = function () {
            var i = 0,
                acceptedPaymentTypes = this.acceptedPaymentTypes || [],
                paymentTypesCount = acceptedPaymentTypes.length,
                paymentType = {};

            for (i = 0; i < paymentTypesCount; i += 1) {
                paymentType = new SKYSALES.Class.VendorPaymentType();
                paymentType.init(acceptedPaymentTypes[i]);
                thisVendor.acceptedPaymentTypesHash[paymentType.code] = paymentType;
            }
        };

        return thisVendor;
    };

    /*
    Name:
    Class VendorPaymentType
    Param:
    None
    Return:
    An instance of VendorPaymentType
    Functionality:
    This class represents a VendorPaymentType
    Notes:
    This class handles the vendor payment type information and the required fields in it
    Class Hierarchy:
    SkySales -> VendorPaymentType
    */
    SKYSALES.Class.VendorPaymentType = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisVendorPaymentType = SKYSALES.Util.extendObject(parent);

        thisVendorPaymentType.code = '';
        thisVendorPaymentType.name = '';
        thisVendorPaymentType.requiresCvv = false;
        thisVendorPaymentType.requiresDate = false;
        thisVendorPaymentType.requiresCcName = false;
        thisVendorPaymentType.requiresCCNum = true;
        thisVendorPaymentType.supportsIssueNumber = false;

        thisVendorPaymentType.init = function (json) {
            this.setSettingsByObject(json);
        };

        return thisVendorPaymentType;
    };

    /*
    Name:
    Class Property
    Param:
    None
    Return:
    An instance of Property
    Functionality:
    Handles a Property
    Notes:
    This object creates validation fields that will be validation for the client
    Class Hierarchy:
    SkySales -> Property
    */
    SKYSALES.Class.Property = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisProperty = SKYSALES.Util.extendObject(parent);

        thisProperty.propertyFieldHash = {};

        thisProperty.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
        };

        thisProperty.setVars = function () {
            var propertyHash = SKYSALES.Class.Property.validationHash || {},
                id = '',
                input = null,
                propertyFieldHash = this.propertyFieldHash,
                propertyFieldKey = '',
                propertyField = null,
                propertyArray = [],
                i = 0,
                len = 0,
                field = null,
                prop = '',
                propName = '',
                propertyValue = {},
                propertyFieldInput = {},
                validationDataName = '';

            for (propertyFieldKey in propertyFieldHash) {
                if (propertyFieldHash.hasOwnProperty(propertyFieldKey)) {
                    propertyArray = propertyFieldHash[propertyFieldKey] || [];
                    len = propertyArray.length;
                    for (i = 0; i < len; i += 1) {
                        propertyField = {};
                        field = propertyArray[i];
                        id = field.id || '';
                        propertyField.id = id;
                        input = propertyField.input;
                        input = this.getById(id);
                        input = input[0];
                        propertyField.propertyHash = {};
                        propertyHash = field.propertyHash || {};
                        if (input) {
                            for (prop in propertyHash) {
                                if (propertyHash.hasOwnProperty(prop)) {
                                    propName = prop.toLowerCase();
                                    propertyValue = propertyHash[prop];
                                    // use jQuery data store to avoid memory leak in IE
                                    propertyFieldInput = $(input);
                                    validationDataName = propName + '.validation';
                                    propertyFieldInput.data(validationDataName, propertyValue);
                                    if (propName === 'required') {
                                        SKYSALES.Util.formatInputLabel(propertyFieldInput);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        return thisProperty;
    };
    SKYSALES.Class.Property.validationHash = {};

    SKYSALES.Class.InsuranceTermsBase = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisInsuranceTermsBase = SKYSALES.Util.extendObject(parent);

        thisInsuranceTermsBase.containerId = '';
        thisInsuranceTermsBase.container = null;
        thisInsuranceTermsBase.parentContainerId = '';
        thisInsuranceTermsBase.parentContainer = null;
        thisInsuranceTermsBase.url = "InsuranceTermsViewAjax-resource.aspx";
        thisInsuranceTermsBase.termsInfo = '';
        thisInsuranceTermsBase.participantBaseId = '';
        thisInsuranceTermsBase.participant = '';
        thisInsuranceTermsBase.keyId = '';
        thisInsuranceTermsBase.key = '';

        thisInsuranceTermsBase.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisInsuranceTermsBase.setVars = function () {
            var key = {};
            thisInsuranceTermsBase.container = this.getById(this.containerId);
            thisInsuranceTermsBase.participant = this.getById(this.participantBaseId);

            key = this.getById(this.keyId);

            thisInsuranceTermsBase.key = key;

            if (this.parentContainerId !== "") {
                thisInsuranceTermsBase.parentContainer = this.getById(this.parentContainerId);
            }
        };

        thisInsuranceTermsBase.addEvents = function () {
            if (this.parentContainer !== null) {
                this.parentContainer.click(this.parentContainerClickHandler);
            }
        };

        thisInsuranceTermsBase.parentContainerClickHandler = function () {
            thisInsuranceTermsBase.parentContainerClick();
        };

        thisInsuranceTermsBase.parentContainerClick = function () {
            var key = this.key.val();
            this.ajax(key);
        };

        thisInsuranceTermsBase.updateTermsHandler = function (data) {
            thisInsuranceTermsBase.updateTerms(data);
        };

        thisInsuranceTermsBase.updateTerms = function (data) {
            this.container.html(data);
        };

        thisInsuranceTermsBase.ajax = function (key) {
            if (key !== undefined && key !== '') {
                thisInsuranceTermsBase.termsInfo = '?key=' + key;
                $.post(this.url + this.termsInfo, this.updateTermsHandler);
            }
        };

        return thisInsuranceTermsBase;
    };

    SKYSALES.Class.SingleInsuranceTerms = function () {
        var parent = new SKYSALES.Class.InsuranceTermsBase(),
            thisSingleInsuranceTerms = SKYSALES.Util.extendObject(parent);

        thisSingleInsuranceTerms.establishmentIds = [];
        thisSingleInsuranceTerms.establishments = [];

        thisSingleInsuranceTerms.setVars = function () {
            var i = 0,
                establishmentIds = this.establishmentIds,
                length = establishmentIds.length,
                establishmentId = '',
                establishment = {};
            parent.setVars.call(this);
            for (i = 0; i < length; i += 1) {
                establishmentId = establishmentIds[i];
                establishment = this.getById(establishmentId);
                thisSingleInsuranceTerms.establishments[i] = establishment;
            }
        };

        thisSingleInsuranceTerms.parentContainerClickHandler = function () {
            thisSingleInsuranceTerms.parentContainerClick();
        };

        thisSingleInsuranceTerms.parentContainerClick = function () {
            var key = this.key.val(),
                establishments = this.establishments,
                establishment = {},
                length = establishments.length,
                i = 0;

            for (i = 0; i < length; i += 1) {
                establishment = establishments[i];
                key = establishment.val();
                if (key) {
                    break;
                }
            }
            parent.ajax(key);
        };

        thisSingleInsuranceTerms.addEvents = function () {
            if (this.parentContainer !== null) {
                this.parentContainer.click(this.parentContainerClickHandler);
            }
        };

        thisSingleInsuranceTerms.init = function (json) {
            parent.setSettingsByObject.call(this, json);
            this.setVars();
            this.addEvents();
        };

        return thisSingleInsuranceTerms;
    };

    SKYSALES.Class.InsuranceTerms = function () {
        var parent = new SKYSALES.Class.SkySales(),
            thisInsuranceTerms = SKYSALES.Util.extendObject(parent);

        thisInsuranceTerms.singleTermsInsuranceBaseId = '';
        thisInsuranceTerms.singleTermsInsuranceArray = [];
        thisInsuranceTerms.groupTermsInsuranceBaseId = '';
        thisInsuranceTerms.groupTermsInsuranceArray = [];
        thisInsuranceTerms.parentSingleBaseId = '';
        thisInsuranceTerms.parentGroupBaseId = '';
        thisInsuranceTerms.participantSingleBaseId = '';
        thisInsuranceTerms.participantGroupBaseId = '';
        thisInsuranceTerms.singleCoverageKey = '';
        thisInsuranceTerms.groupCoverageKey = '';
        thisInsuranceTerms.establishmentIdsByProduct = [];

        thisInsuranceTerms.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.initSingleTermsInsuranceArray();
            this.initGroupTermsInsuranceArray();
        };

        thisInsuranceTerms.setVars = function () {
            this.singleTermsInsuranceArray = $("[id^='" + this.singleTermsInsuranceBaseId + "']");
            this.groupTermsInsuranceArray = $("[id^='" + this.groupTermsInsuranceBaseId + "']");
        };

        thisInsuranceTerms.initSingleTermsInsuranceArray = function () {
            var i = 0,
                singleArray = this.singleTermsInsuranceArray || [],
                len = singleArray.length,
                single = null,
                singleEstablishment = {};
            for (i = 0; i < len; i += 1) {
                singleEstablishment = this.getById(singleArray[i].id);
                //single = new SKYSALES.Class.InsuranceTermsBase();
                single = new SKYSALES.Class.SingleInsuranceTerms();
                single.containerId = this.singleTermsInsuranceBaseId + i;
                single.parentContainerId = this.parentSingleBaseId + i;
                single.participantBaseId = this.participantSingleBaseId + i;
                //single.keyId = this.singleCoverageKey + i;
                single.establishmentIds = this.establishmentIdsByProduct[i];
                single.init(singleEstablishment);
                singleArray[i] = single;
            }
        };

        thisInsuranceTerms.initGroupTermsInsuranceArray = function () {
            var i = 0,
                groupArray = this.groupTermsInsuranceArray || [],
                len = groupArray.length,
                group = null,
                json = {};

            for (i = 0; i < len; i += 1) {
                json = {};
                group = new SKYSALES.Class.InsuranceTermsBase();
                json.containerId = this.groupTermsInsuranceBaseId + i;
                json.parentContainerId = this.parentGroupBaseId + i;
                json.participantBaseId = this.participantGroupBaseId + i;
                json.keyId = this.groupCoverageKey + i;
                group.init(json);
                groupArray[i] = group;
            }
        };

        return thisInsuranceTerms;
    };

    /*
    Name:
    Class MCCInput
    Param:
    None
    Return:
    An instance of MCCInput
    Functionality:
    This class represents a MCCInput
    Notes:
    Class Hierarchy:
    SkySales -> MCCInput
    */
    SKYSALES.Class.MCCInput = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisMCCInput = SKYSALES.Util.extendObject(parent),
            resource = SKYSALES.Util.getResource();

        thisMCCInput.bookingCurrencyCode = '';
        thisMCCInput.externalRateId = '';
        thisMCCInput.defaultCurrencyValue = '';
        thisMCCInput.dropDownListCurrencyId = '';
        thisMCCInput.dropDownListCurrency = null;
        thisMCCInput.externalRateInfo = resource.externalRateInfo;
        thisMCCInput.currencyHash = resource.currencyHash;

        thisMCCInput.setVars = function () {
            thisMCCInput.dropDownListCurrency = this.getById(this.dropDownListCurrencyId);
        };

        thisMCCInput.populateCurrency = function () {
            var externalRateList = this.externalRateInfo.ExternalRateList,
                key = '',
                externalRateArray = [],
                externalRate = null,
                currency = null,
                defaultItem = {},
                description = '',
                paramObject = {};

            if (this.bookingCurrencyCode && this.dropDownListCurrency) {
                for (key in externalRateList) {
                    if (externalRateList.hasOwnProperty(key)) {
                        externalRate = externalRateList[key];

                        if (externalRate.quotedCurrency === this.bookingCurrencyCode) {
                            currency = this.currencyHash[externalRate.collectedCurrency];

                            if (currency) {
                                externalRate.name = currency.name;
                            } else {
                                externalRate.name = externalRate.collectedCurrency;
                            }

                            externalRateArray[externalRateArray.length] = externalRate;
                        }
                    }
                }

                currency = this.currencyHash[this.bookingCurrencyCode];

                if (currency) {
                    description = currency.name;
                } else {
                    description = this.bookingCurrencyCode;
                }

                defaultItem = {
                    "code": this.defaultCurrencyValue,
                    "name": description
                };

                externalRateArray[externalRateArray.length] = defaultItem;

                paramObject = {
                    "objectArray": externalRateArray,
                    "selectBox": this.dropDownListCurrency,
                    "selectedItem": this.externalRateId,
                    "showCode": false
                };

                SKYSALES.Util.populateSelect(paramObject);
            }
        };

        thisMCCInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();

            this.populateCurrency();
        };

        return thisMCCInput;
    };

    /*
    Name:
    Class SFPDPassengerInput
    Param:
    None
    Return:
    An instance of SFPDPassengerInput
    Functionality:
    This class represents a SFPDPassengerInput
    Notes:
    This object is used during the check-in flow with secure flight
    Class Hierarchy:
    SkySales -> SFPDPassengerInput
    */
    SKYSALES.Class.SFPDPassengerInput = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisSFPDPassengerInput = SKYSALES.Util.extendObject(parent);

        thisSFPDPassengerInput.passengerGenderIdArray = [];
        thisSFPDPassengerInput.infantGenderIdArray = [];

        thisSFPDPassengerInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setGenderFieldsToEmpty(this.passengerGenderIdArray);
            this.setGenderFieldsToEmpty(this.infantGenderIdArray);
        };

        thisSFPDPassengerInput.setGenderFieldsToEmpty = function (keyIdArray) {
            keyIdArray = keyIdArray || [];
            var keyId = '',
                genderControl = null,
                i = 0,
                len = keyIdArray.length;

            for (i = 0; i < len; i += 1) {
                keyId = keyIdArray[i];
                genderControl = this.getById(keyId);
                genderControl.val("");
            }
        };
        return thisSFPDPassengerInput;
    };

    /*
    Name:
    Class StoredPayment
    Param:
    None
    Return:
    An instance of StoredPayment
    Functionality:
    This class represents a StoredPayment
    Notes:
    This object is used during inserting and updating stored payments
    Class Hierarchy:
    SkySales -> StoredPayment
    */
    SKYSALES.Class.StoredPayment = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisStoredPayment = SKYSALES.Util.extendObject(parent);

        thisStoredPayment.url = '';
        thisStoredPayment.key = '';
        thisStoredPayment.deleteButtonId = '';
        thisStoredPayment.deleteButton = null;
        thisStoredPayment.deleteInputId = '';
        thisStoredPayment.deleteInput = null;
        thisStoredPayment.defaultInputId = '';
        thisStoredPayment.defaultInput = null;
        thisStoredPayment.submitName = '';
        thisStoredPayment.message = '';

        thisStoredPayment.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisStoredPayment.setVars = function () {
            this.deleteButton = this.getById(this.deleteButtonId);
            this.deleteInput = this.getById(this.deleteInputId);
            this.defaultInput = this.getById(this.defaultInputId);
        };

        thisStoredPayment.addEvents = function () {
            this.deleteButton.click(this.updateDeleteInputHandler);
            this.defaultInput.click(this.updateDefaultInputHandler);
        };

        thisStoredPayment.updateDeleteInputHandler = function (e) {
            var retVal = thisStoredPayment.updateDeleteInput();
            if (!retVal) {
                e.preventDefault();
            }
            return retVal;
        };

        thisStoredPayment.updateDeleteInput = function () {
            var message = this.message,
                retVal = window.confirm(message);
            if (retVal) {
                this.deleteInput.val(this.key);
            }
            return retVal;
        };

        thisStoredPayment.updateDefaultInputHandler = function () {
            thisStoredPayment.updateDefaultInput();
        };

        thisStoredPayment.updateDefaultInput = function () {
            var submitName = this.submitName,
                defaultInput = this.defaultInput,
                defaultInputName = defaultInput.attr('name'),
                defaultInputValue = defaultInput.val(),
                postHash = {},
                eventTargetName = '__EVENTTARGET';

            postHash[defaultInputName] = defaultInputValue;
            postHash[eventTargetName] = '';
            postHash[submitName] = "SetDefault";
            $.post(this.url, postHash, this.updatePrimaryHandler);
        };

        thisStoredPayment.updatePrimaryHandler = function () {
        };

        return thisStoredPayment;
    };

    SKYSALES.Class.StoredPayment.validate = function (expirationId) {
        expirationId = expirationId || '';
        var retVal = false,
            today = new Date(),
            valueDate = null,
            yearValue,
            monthValue,
            currentYear,
            currentMonth,
            value = '';

        value = $('#' + expirationId).val();
        value = value || '';

        if (value) {
            valueDate = SKYSALES.Util.parseIsoDate(value);
            yearValue = valueDate.getFullYear();
            monthValue = valueDate.getMonth();
            currentYear = today.getFullYear();
            currentMonth = today.getMonth();

            if (yearValue > currentYear || (yearValue === currentYear && monthValue >= currentMonth)) {
                retVal = true;
            }
        }
        return retVal;
    };

    /*
    Name:
    Class TimeInput
    Param:
    None
    Return:
    An instance of TimeInput
    Functionality:
    Accepts values from three select boxes (hours, minutes and suffix)
    and populates a text box with the corresponding ISO 8601 time format
    Class Hierarchy:
    SkySales -> TimeInput
    */
    SKYSALES.Class.TimeInput = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisTimeInput = SKYSALES.Util.extendObject(parent);

        thisTimeInput.timeId = '';
        thisTimeInput.time = null;
        thisTimeInput.timeHourId = '';
        thisTimeInput.timeHour = null;
        thisTimeInput.timeMinuteId = '';
        thisTimeInput.timeMinute = {};
        thisTimeInput.timeSuffixId = '';
        thisTimeInput.timeSuffix = null;
        thisTimeInput.timeHourValue = null;
        thisTimeInput.timeMinuteValue = null;
        thisTimeInput.timeSuffixValue = null;
        thisTimeInput.timeSuffixList = [];


        thisTimeInput.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initTimeInfo();
            this.initDropDownValues();
        };

        thisTimeInput.setVars = function () {
            thisTimeInput.time = this.getById(this.timeId);
            thisTimeInput.timeHour = this.getById(this.timeHourId);
            thisTimeInput.timeMinute = this.getById(this.timeMinuteId);
            thisTimeInput.timeSuffix = this.getById(this.timeSuffixId);
        };

        thisTimeInput.formatTimeToIso = function () {
            var hour = Number(this.timeHour.val()),
                minute = Number(this.timeMinute.val()),
                suffix = Number(this.timeSuffix.val());

            if (suffix === 1 && hour < 12) {
                hour = hour + 12;
            }

            if (suffix === 0 && hour === 12) {
                hour = 0;
            }

            if (hour.toString().length === 1) {
                hour = '0' + hour;
            }

            if (minute.toString().length === 1) {
                minute = '0' + minute;
            }

            return hour + ':' + minute + ':00';
        };

        thisTimeInput.updateTimeInput = function () {
            if (this.timeHour.val().length > 0 && this.timeMinute.val().length > 0 && this.timeSuffix.val().length > 0) {
                thisTimeInput.time.val(thisTimeInput.formatTimeToIso());
            } else {
                thisTimeInput.time.val('');
            }
        };

        thisTimeInput.updateTimeInputHandler = function () {
            thisTimeInput.updateTimeInput();
        };

        thisTimeInput.addEvents = function () {
            this.timeHour.change(this.updateTimeInputHandler);
            this.timeMinute.change(this.updateTimeInputHandler);
            this.timeSuffix.change(this.updateTimeInputHandler);
        };

        thisTimeInput.initDropDown = function (objectArray, selectBox) {
            var selectParamObj = {};

            selectParamObj = {
                'objectArray': objectArray,
                'input': selectBox,
                'showCode': false,
                'clearOptions': false,
                'selectedItem': ''
            };

            SKYSALES.Util.populate(selectParamObj);
        };

        thisTimeInput.initDropDownValues = function () {
            var hourValue = this.timeHourValue;

            if (hourValue !== null && this.timeMinuteValue !== null && this.timeSuffixValue !== null) {
                if (hourValue === 0) {
                    hourValue = 12;
                }
                thisTimeInput.timeHour.val(hourValue);
                thisTimeInput.timeMinute.val(this.timeMinuteValue);
                thisTimeInput.timeSuffix.val(this.timeSuffixValue);
                thisTimeInput.updateTimeInput();
            }
        };

        thisTimeInput.initTimeInfo = function () {
            //populate the hour minute and Suffix dropdowns
            var timeHourInfo = [],
                timeMinuteInfo = [],
                suffixInfo = this.timeSuffixList,
                hourCount = 12,
                minuteCount = 59,
                i = 0,
                minuteString = '0';

            for (i = 1; i <= hourCount; i += 1) {
                timeHourInfo.push({
                    "name": i,
                    "code": i
                });
            }

            for (i = 0; i <= minuteCount; i += 1) {
                minuteString = i;
                if (i < 10) {
                    minuteString = '0' + i;
                }

                timeMinuteInfo.push({
                    "name": minuteString,
                    "code": minuteString
                });
            }

            thisTimeInput.initDropDown(timeHourInfo, this.timeHour);
            thisTimeInput.initDropDown(timeMinuteInfo, this.timeMinute);
            thisTimeInput.initDropDown(suffixInfo, this.timeSuffix);

        };

        return thisTimeInput;
    };

    /*
    Name:
    Class PassiveJourney
    Param:
    None
    Return:
    An instance of PassiveJourney
    Functionality:
    Sets the default values of the date and time objects of the passive journey page
    Class Hierarchy:
    SkySales -> PassiveJourney
    */
    SKYSALES.Class.PassiveJourney = function () {
        var parent = SKYSALES.Class.SkySales(),
            thisPassiveJourney = SKYSALES.Util.extendObject(parent);

        thisPassiveJourney.departureDateObj = null;
        thisPassiveJourney.departureTimeObj = null;
        thisPassiveJourney.arrivalDateObj = null;
        thisPassiveJourney.arrivalTimeObj = null;
        thisPassiveJourney.dateYearsInAdvance = 5;

        thisPassiveJourney.init = function (json) {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
            this.initDateAndTime();
        };

        thisPassiveJourney.setSettingsByObject = function (json) {
            parent.setSettingsByObject.call(this, json);
            var departureDate = new SKYSALES.Class.DateInput(),
                departureTime = new SKYSALES.Class.TimeInput(),
                arrivalDate = new SKYSALES.Class.DateInput(),
                arrivalTime = new SKYSALES.Class.TimeInput(),
                currentDate = new Date(),
                yearEnd = currentDate.getFullYear(),
                yearStart = yearEnd + this.dateYearsInAdvance;


            //set default year
            departureDate.yearStart = yearStart;
            departureDate.yearEnd = yearEnd;
            arrivalDate.yearStart = yearStart;
            arrivalDate.yearEnd = yearEnd;


            departureDate.init(this.departureDateObj);
            thisPassiveJourney.departureDateObj = departureDate;
            departureTime.init(this.departureTimeObj);
            thisPassiveJourney.departureTimeObj = departureTime;

            arrivalDate.init(this.arrivalDateObj);
            thisPassiveJourney.arrivalDateObj = arrivalDate;
            arrivalTime.init(this.arrivalTimeObj);
            thisPassiveJourney.arrivalTimeObj = arrivalTime;
        };

        thisPassiveJourney.initDefaultDate = function (date) {
            var currentDate = new Date(),
                dateStr = date.date.val();

            if (dateStr.length > 0) {
                currentDate = SKYSALES.Util.parseIsoDate(dateStr);
            }
            date.dateYearValue = currentDate.getFullYear();
            date.dateDayValue = currentDate.getDate();
            date.dateMonthValue = currentDate.getMonth() + 1;
            date.initDropDownValues();
        };

        thisPassiveJourney.initDefaultTime = function (time) {
            var currentDate = new Date(),
                currentHour = 1,
                currentMinutes = 0,
                currentSuffix = 0;

            if (time.time.val().length > 0) {
                currentDate = SKYSALES.Util.parseIsoTime(time.time.val());
            }
            currentHour = Number(currentDate.getHours());
            currentMinutes = Number(currentDate.getMinutes());

            if (currentHour === 12) {
                currentSuffix = 1;
            }

            if (currentHour > 12) {
                currentHour = currentHour - 12;
                currentSuffix = 1;
            }

            if (currentMinutes.toString().length === 1) {
                currentMinutes = '0' + currentMinutes;
            }


            time.timeHourValue = currentHour;
            time.timeMinuteValue = currentMinutes;
            time.timeSuffixValue = currentSuffix;
            time.initDropDownValues();
        };

        thisPassiveJourney.initDateAndTime = function () {
            //hide the input boxes of date and time
            thisPassiveJourney.departureDateObj.date.hide();
            thisPassiveJourney.arrivalDateObj.date.hide();
            thisPassiveJourney.departureTimeObj.time.hide();
            thisPassiveJourney.arrivalTimeObj.time.hide();

            //set default values
            thisPassiveJourney.initDefaultDate(this.departureDateObj);
            thisPassiveJourney.initDefaultDate(this.arrivalDateObj);
            thisPassiveJourney.initDefaultTime(this.departureTimeObj);
            thisPassiveJourney.initDefaultTime(this.arrivalTimeObj);
        };

        return thisPassiveJourney;
    };

    $(document).ready(SKYSALES.Util.ready);
    $(window).on("load", SKYSALES.Util.load);
} ());


jQuery(document).ready(function($) {
	setTimeout(function(){
		$('#Promotion30Off select[id*="originStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MEX' || $(this).val()=='HAV' || $(this).val()=='GUA' || $(this).val()=='MIA' || $(this).val()=='BOG' || $(this).val()=='SJO' || $(this).val()=='IAH' || $(this).val()=='MTY')){
				$(this).remove();
			}
		})

	if($('#Promotion30Off select[id*="originStation1"]').val()=='MEX'){
		$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='HAV' || $(this).val()=='GUA' || $(this).val()=='MIA' || $(this).val()=='BOG' || $(this).val()=='SJO')){
				$(this).remove();
			}
		})
	}else if($('#Promotion30Off select[id*="originStation1"]').val()=='MTY'){
				$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='IAH')){
				$(this).remove();
			}
	})}else if($('#Promotion30Off select[id*="originStation1"]').val()=='IAH'){
				$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MTY')){
				$(this).remove();
			}
	})}else{
		$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MEX')){
				$(this).remove();
			}
		})
	}

	},200)
$('#Promotion30Off select[id*="originStation1"]').click(function(){
	if($(this).val()=='MEX'){
		$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MEX' || $(this).val()=='HAV' || $(this).val()=='GUA' || $(this).val()=='MIA' || $(this).val()=='BOG' || $(this).val()=='SJO')){
				$(this).remove();
			}
		})
	}else if($(this).val()=='MTY'){
				$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='IAH')){
				$(this).remove();
			}
	})}else if($(this).val()=='IAH'){
				$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MTY')){
				$(this).remove();
			}
	})}else{
		$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MEX')){
				$(this).remove();
			}
		})
	}
})

$('#Promotion30Off select[id*="originStation1"]').click(function(){
	if($(this).val()=='MEX'){
		$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MEX' || $(this).val()=='HAV' || $(this).val()=='GUA' || $(this).val()=='MIA' || $(this).val()=='BOG' || $(this).val()=='SJO' || $(this).val()=='IAH')){
				$(this).remove();
			}
		})
	}else if($(this).val()=='MTY'){
				$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='IAH')){
				$(this).remove();
			}
	})}else if($(this).val()=='IAH'){
				$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MTY')){
				$(this).remove();
			}
	})}else{
		$('#Promotion30Off select[id*="destinationStation1"] option').each(function(index){
			if(!($(this).val()=='' || $(this).val()=='MEX')){
				$(this).remove();
			}
		})
	}
})


window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};



$('#MemberLoginAnonymous').click(function(){
	var iFrameUrl = '';
	iFrameUrl = document.location.protocol+'//'+document.location.host+'/loginIFrame.aspx';
	$("#LoginIFrame").attr("src", 'loginIFrame.aspx');
})
  var dp1, dp2, elMenu, leftCSS, topCSS, rightCSS;
  elMenu = $('div.dropdown-menu-custom');
  // elMenu.show();
  $('a.dropdown-toggle').on('mouseenter', function() {
    if(window.screen.availWidth>767)
        return elMenu.show();
  });
  $('a.dropdown-toggle').on('click', function() {
    if(window.screen.availWidth>767)
        return elMenu.show();
  });
  $('a.dropdown-toggle').on('mouseleave', function() {
    return elMenu.hide();
  });
  elMenu.on('mouseenter', function() {
    return elMenu.show();
  });
  elMenu.on('mouseleave', function() {
    return elMenu.hide();
  });
  $('#origen').keydown(function(event) {
    if (event.keyCode === 13) {
      return $('.datepicker-1').datepicker('show');
    }
  });
  $('#destino').keydown(function(event) {
    if (event.keyCode === 13) {
      return $('.datepicker-2').datepicker('show');
    }
  });
  topCSS = 236;
  leftCSS = 0;
  rightCSS = 290;
});

	$('.left-section-detail .section-title').click(function(){

		$(this).next().toggle('fast');
		if($(this).find('span').hasClass("closed")){
			$(this).find('span').removeClass("closed");
			$(this).find('span').addClass("expand");
		}else{
			$(this).find('span').removeClass("expand");
			$(this).find('span').addClass("closed");
		}
	})

	$('h4.icon-expand').click(function(){
		$(this).next().toggle('fast');
		if($(this).find('span').hasClass("closed")){
			$(this).find('span').removeClass("closed");
			$(this).find('span').addClass("expand");
		}else{
			$(this).find('span').removeClass("expand");
			$(this).find('span').addClass("closed");
		}
	})


	var test = document.createElement('input');
if (!('placeholder' in test)) {
    $('input').each(function () {
        if ($(this).attr('placeholder') != "" && this.value == "") {
            $(this).val($(this).attr('placeholder'))
                   .css('color', 'grey')
                   .on({
                       focus: function () {
                         if (this.value == $(this).attr('placeholder')) {
                           $(this).val("").css('color', '#000');
                         }
                       },
                       blur: function () {
                         if (this.value == "") {
                           $(this).val($(this).attr('placeholder'))
                                  .css('color', 'grey');
                         }
                       }
                   });
        }
    });
}

jQuery(document).ready(function($) {
    //Glyphicon para el LefMenu Colapsable
        $(".list-unstyled > a").on('click',function(){
        if ($(this).hasClass('glyphicon-chevron-down')){
                    $(this).removeClass("glyphicon-chevron-down");
                    $(this).addClass("glyphicon-chevron-up");
            }else{
                if ($(this).hasClass('glyphicon-chevron-up')){
                        $(this).removeClass("glyphicon-chevron-up");
                        $(this).addClass("glyphicon-chevron-down");
                    }
            }
        });

    // Deteccion de ventana para menu izquierdo en dispositivos moviles
        if($(window).width() < 768){
                $(".arrowDownToggle").css( "display","block");
                //$("#menuleft > div > ul > li > ul").addClass("collapse");
                $(".list-unstyled > li > ul").addClass("collapse");
        }
        
    });

(function ( $ ) {
    $.fn.validateFreePax = function( options ) {
		if($("select[id *= '_DropDownListPassengerType_FREE']").length > 0){
			this.change(function(){
				var TotalPax = 0;
				$("select[id *= 'DropDownListPassengerType_ADT'], select[id *= 'DropDownListPassengerType_CHD']").each(function(index){
					TotalPax += Number($(this).val());
				})
				TotalPaxFree= $("select[id *= 'DropDownListPassengerType_FREE']").val()
				$(".AlertPassengers").remove();
				if(TotalPaxFree > TotalPax){
					$("select[id *= 'DropDownListPassengerType_FREE']").val(0)
					$("#flightSearchContainer").append('<div class="AlertPassengers bg-blue padd-all-10 text-white marg-top-10">'+$('#ValidateMessage').val()+'</div>')
				}
			})
		}
    };
}( jQuery ));
