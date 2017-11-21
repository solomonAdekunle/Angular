/**
 * The Core Object Model includes all the possible actions in the game, except all panels.
 * Interactivities done in panels have to be done in other ObjectModel ( ex: favouritesPatternObjectModel, AutoplayObjectModel )
 *
 * The job of the objectModel is to provide methods to access to specific elements or perform some actions.
 * Most of the methods returns a Promise which may be handled directly in the stepDefinitions.
 * So, no 'expects' can exist here.
 *
 * CoreObjectModel inherits from ObjectModel.
 * That means that any generic methods have to be created in ObjectModel.
 * An exemple would be taking a screenshot.
 * An other solution would be to create a Util object.
 *
 */
const util = require('util');
const ObjectModel = require('../objectModels/ObjectModel');
const homeObject = require('../objectModels/HomepageObjectModel');

//Protractor promise does not support parallel operations.
const promise = require('selenium-webdriver').promise;

var CoreObjectModel = function () {

    CoreObjectModel.super_.call(this);

    /**
     * Navigates to the page
     * @TODO set the environment to specify the correct address here
     */
    this.get = function () {
        return browser.get('/launch/roulette/#/sc/rep/cash/desktop/GBP/54/2');
    };

    /**
     * Selects a chip from the chipSelector
     */
    this.selectChip = function (chipValue) {
        var chip = element(by.css('.npChipSelector .chip[data-chip-value = "' + chipValue + '"]'));
        return chip.click();
    };

    /**
     * Selects a slot on the bettingTable
     * @param {string} slotId - is each slot number on the roulette table which is 0-150 slots (see project documentation)
     */
    this.selectSlot = function (slotId) {
        var slot = element(by.css('div[data-type="slot"][data-slot = "' + slotId + '"]'));
        return slot.click();
    };

    /**
     * Checks if the chip is on the slot in term of geometry.
     * Checks if the amount of the chip is correct.
     *
     * @param chipAmount Chip Amount Without the curreny
     * @param slotId
     * @returns {Promise<T>}
     */
    this.isChipOnSlot = function (chipAmount, slotId) {
        var defer = protractor.promise.defer();
        var slot = element(by.css('div[data-type="slot"][data-slot = "' + slotId + '"]'));
        var chipOnSlot = element(by.css('np-chip[data-slot-id = "' + slotId + '"]'));
        var chipAmountSpan = element(by.css('np-chip[data-slot-id = "' + slotId + '"] .valueContainer .text'));

        var self = this;

        promise.all([
            slot.getLocation(),
            slot.getSize(),
            chipOnSlot.getLocation(),
            chipOnSlot.getSize(),
            chipAmountSpan.getText()
        ]).then(function (results) {

            //get results
            var slotLocation = results[0];
            var slotSize = results[1];
            var chipLocation = results[2];
            var chipSize = results[3];
            var chipAmountText = results[4];

            //is chip on the slot
            var isChipCenteredAxisX = Math.abs(slotLocation.x + slotSize.width / 2 - (chipLocation.x + chipSize.width / 2)) <= 1;
            var isChipCenteredAxisY = Math.abs(slotLocation.y + slotSize.height / 2 - (chipLocation.y + chipSize.height / 2)) <= 1;
            var isChipOnSlot = isChipCenteredAxisX && isChipCenteredAxisY;

            //Check the amount
            var isAmountCorrect = (chipAmount == self.getAmountToNumber(chipAmountText));

            defer.fulfill(isChipOnSlot && isAmountCorrect);
        });
        return defer.promise;
    };

    /**
     * clicking on the AddFavourite tab within the client
     */
    this.clickaddFavouritesTab = function () {
        var addfav = element(by.css('div.button-text-container'));
        return addfav.click();
    };

    /**
     * clicking on the Favouritetab within the client
    */
    this.clickfavPatternTab = function () {
        var favouritesPattern = element(by.css('div.favouritesPatterns li.headingFavourites'));
        return favouritesPattern.click();
    };

    /**
      * Checking if AutoBet Start buttton change to Stop button
      */
    this.waitPlaceState = function () {
        return this.waitElementToBeVisible('div.placeBG');
    };

    /**
     * @param {string} Handles-is the windows 
     * switch from a game window to the main window
      */
    this.switchToParentWindow = function () {
        return browser.getAllWindowHandles().then(function (handles) {
            parentHandle = handles[0];
            browser.driver.executeScript('window.focus();');
            return browser.driver.switchTo().window(parentHandle);
        });
    };
};

util.inherits(CoreObjectModel, ObjectModel);
module.exports = new CoreObjectModel();