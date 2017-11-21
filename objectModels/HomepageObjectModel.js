const util = require('util');
const ObjectModel = require('../objectModels/ObjectModel');
const Config = require('../../protractor.conf');



var HomepageObjectModel = function () {

    HomepageObjectModel.super_.call(this);

    /**
     * Navigates to the page
     * @TODO set the environment to specify the correct address here
     */
    this.get = function () {
        return browser.driver.get(Config.config.baseUrl);
    };

    /**
     * Logins the user to the platfrom with credientals as parameter.
     * First of all, the method checks if the user is not logged in, otherwiser it returns an accepted Promise.
     *
     * @param {string} username- is the username used for login
     * @param {string} password- is the password used for login
     * @returns {Promise}
     */
    this.login = function (username, password) {

        var self = this;
        return this.isUserLoggedIn().then( function(isUserLoggedIn) {
            if (isUserLoggedIn) {
                var defer = protractor.promise.defer();
                defer.fulfill(true);
                return defer.promise;
            }else{
                var userNameInput = browser.driver.findElement(by.css('div.region-header input#username'));
                userNameInput.sendKeys(username);

                var passWordInput = browser.driver.findElement(by.css('div.region-header input#password'));
                passWordInput.sendKeys(password);

                var signInButtonInput = browser.driver.findElement(by.css('div.region-header button.sign-in'));
                signInButtonInput.click();

                return self.waitUserToBeLoggedIn();
            }
        });
    };

    /**
     * Checks if the user is already loggedin.
     * To do so, check if the deposit button is present on the page.
     * @returns {Promise}
     */
    this.isUserLoggedIn = function() {
        return browser.driver.isElementPresent(by.css('div#authcache-block-account-FLEX_account_block .deposit'));
    };

    /**
     * @param {string} elem- is the Deposit button displayed on the home page
     * browser is waiting for user to login
     * @returns {Promise}
     */
    this.waitUserToBeLoggedIn = function () {
        var defer = protractor.promise.defer();
        var self = this;
        browser.driver.wait(function () {
            return self.isUserLoggedIn().then(function (elem) {
                defer.fulfill(elem !== null);
                return true;
            });
        }, 5000);
        return defer.promise;
    };

    /**
     * Clicks on the game to launch it
     * @todo manage the smarphone/tablet behavior
     * @param {string} gameName- is the netplaytv games, but now is clicking on RouletteExpPremiun
     */
    this.clickGame = function (gameName) {
        var defer = protractor.promise.defer();
        var game = this.getGame(gameName);
        game.click();

        //Wait until the game window appears (handles.length == 2)
        var allWindows = [];
        browser.driver
            .wait(function () {
                return browser.driver.getAllWindowHandles().then(function (handles) {
                    allWindows = handles;
                    return handles.length == 2;
                });
            }, 10000)
            .then(function () {
                //get the game window
                parentHandle = allWindows[0];
                popUpHandle = allWindows[1];
                //switch to the game window
                var handle = browser.switchTo().window(popUpHandle);
                handle = browser.getWindowHandle();
                browser.driver.executeScript('window.focus();');
                defer.fulfill(true);
            });
        return defer.promise;
    };

    /**
     * Returns the deposit Button
     * @returns {Promise}
     */
    this.getDeposit = function () {
        return browser.driver.findElement(by.css('div#authcache-block-account-FLEX_account_block .deposit'));
    };

    /**
     * @param {string} gameName The name of the game launched (eg Roulette Express Premium)
     * @returns {Promise}
     */
    this.getGame = function (gameName) {
        return browser.driver.findElement(by.xpath('//div[contains(@class, "game_wrapper")][descendant::div[text() ="' + gameName + '" ]]'));
    };

    /**
     * Signout for the from the home page
     * @returns {Promise}
     */
    this.logout = function () {
        return browser.driver.findElement(by.css('ul.account_menu')).then(function (accountMenu) {
            browser.driver.actions().mouseMove(accountMenu).perform();
            var signout = browser.driver.findElement(by.css('a.logout'));
            return signout.click();
        });
    };
};
util.inherits(HomepageObjectModel, ObjectModel);
module.exports = new HomepageObjectModel();
