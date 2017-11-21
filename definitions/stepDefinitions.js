'use strict';

const fs = require('fs');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const casino = require('../casino');
const homeObject = require('../objectModels/HomepageObjectModel');
const coreObject = require('../objectModels/CoreObjectModel');
const fpObject = require('../objectModels/FavouritesPatternObjectModel');


module.exports = function () {

    //change the default timeout to prevent issues
    this.setDefaultTimeout(500 * 1000);

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////  EVENT HANDLERS
    // see https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/event_handlers.md

    /**
     * @param {Array} features Array of features
     */
    this.registerHandler('BeforeFeatures', function (features) {
        return homeObject.get()
            .then(function() {
                return homeObject.login(casino.config.credentials.username, casino.config.credentials.password);
            })
            .then(function() {
                return homeObject.clickGame(casino.config.gameName, casino.config.gameMode);
            });
    });

    this.registerHandler('BeforeFeature', function (event, callback) {
        callback()
    });

    this.registerHandler('AfterScenario', function (event, callback) {
        // clear localStorage
        browser.executeScript('window.localStorage.clear();');
        callback();
    });

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////  HOOK
    // see https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md

    /**
     * @param {string} Scenario- is the each testcase wanting to executeScript
     * Before each Scenario switch back to the main window.
     */
    this.Before(function (Scenario, callback) {
        callback();
    });

    /**
     * @param {string} Scenario- is the each testcase wanting to executeScript
     */
    this.After(function (Scenario, callback) {
        callback();
    });
    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////  GIVEN METHODS

    this.Given(/^I am on the game$/, function () {
        browser.ignoreSynchronization = false;
        return browser.refresh();
    });

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////  WHEN METHODS
    /**
     * Waitfor the game to start in other to place bet
     * @returns {Promise} 
     */
    this.When(/I wait for the place state/, function () {
        return coreObject.waitPlaceState();

    });

    /**
     * Login from the homepage of the site
     * @param {string} username- is the username used for login
     * @param {string} password- is the password used for login
     *
     */
    this.When(/^I login with username as "([^"]*)" and password as "([^"]*)", if I am not logged in$/, function (username, password) {
        return homeObject.login(username, password);
    });

    /**
     * @param {string} game- is Roulette express premium
     * click the game and switching to the game window.
     */
    this.When(/^I click on the game "([^"]*)" For "([^"]*)"$/, function (gameName, mode) {
        return homeObject.clickGame(gameName, mode);
    });
    /**
     * Selecting a chip 
     *  @param {string} chipValue - without and currency sign -0.25,1,5,10,25,50 and 100
     * @returns {Promise} 
     */
    this.When(/^I select a chip value "([^"]*)"$/, function (chipValue) {
        return coreObject.selectChip(chipValue);
    });
    /**
     * Placing the chip on the slot
     * see coreObject.selectSlot
     * @returns {Promise} 
     */
    this.When(/^I click on the slot "([^"]*)"$/, function (slotId) {
        return coreObject.selectSlot(slotId);
    });
    /**
     * Clicking the AddFavourite tab after placing a bet
     * @returns {Promise} 
     */
    this.When(/^I click on the Add Favourites Button$/, function () {
        return coreObject.clickaddFavouritesTab();
    });
    /**
     * Click on the favourites&Pattern tab to navigate to Favourite and Pattern table
     * @returns {Promise} 
     */
    this.When(/^I click on the Favourites & Pattern Tab$/, function () {
        return coreObject.clickfavPatternTab();
    });

    /**
     *  Click on the info switch button on the favourite table
     * to check the numbers saved as favourites bets
     */
    this.When(/^I click on the InfoSwitch Button$/, function (callback) {
        fpObject.clickinfoSwitch();
        callback();
    });
    /**
     * click on the AutoBet icon
     */
    this.When(/^I click on the AutoBet$/, function (callback) {
        coreObject.clickAutoBetButton();
        callback();
    });

    /**
     * Then after the first round of the autobet, wait for another round to check if bets are 
     * placed automatimatically
     * @returns {Promise} 
     */
    this.When(/^the next round$/, function () {
        coreObject.waitNoMoreState().then(function () {
            return coreObject.waitPlaceState();
        });

    });

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////  THEN METHODS
    /**
     * Checking if chips selected are on the right slot click.
     * @param{string} value - is the text displayed as the total amount in money term of bets saved in
     * Favourites table
     * @param {string} slotId- the each slot on the roulette table which is 0-150
     * @returns {Promise}
     */
    this.Then(/^I should see a chip with value "([^"]*)" on the slot "([^"]*)"$/, function (value, slotId) {
        return coreObject.isChipOnSlot(value, slotId).then(function (isChipOnSlot) {
            expect(isChipOnSlot).to.equal(true);
        });
    });

    /**
     * Check the amount in value of bet stored within the Favourites bet table
     * @param{string} value- is the amount of bet saved
     */
    this.Then(/^I should see last saved favourite bet with value "([^"]*)"$/, function (value, callback) {
        var amountStoredBetsShown = fpObject.storedbetValueText();
        amountStoredBetsShown.getText().then(function (text) {
            expect(text).to.equal("£3");
            callback();
        });
    });
    
    /**
     * Check if slot number saved in favourites$ Pattern table is the save as Expected.
     * @param {string} value- is the bets number saved in the Favourite table.
     * @param {string} text - is to get the text of the saved favourite bets.
     */
    this.Then(/^I should see "([^"]*)" saved as Favourites Bets$/, function (value, callback) {
        var favouriteNumber = fpObject.getFavouriteInfoText();
        favouriteNumber.getText().then(function (text) {
            var formattedText = text.join('').replace(/ /g, '');
            expect(formattedText).to.equal(value);
            callback();
        });
    });
};