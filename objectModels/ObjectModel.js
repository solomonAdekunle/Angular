/**
 * Provides all common actions of all ObjectModels
 */
var ObjectModel = function () {

    this._ec = protractor.ExpectedConditions;

    this.takeScreenshot = function () {

    };

    /**
     * Creating method for wait function to wait for the Visibility of the Element
     */
    this.waitElementToBeVisible = function (selector) {
        return browser.wait(this._ec.visibilityOf($(selector)), 60000);
    };

    /**
     * Creating for the Wait function to wait for the Element to be clickable
     */
    this.waitElementToBeClickable = function (selector) {
        return browser.wait(this._ec.clickable($(selector)), 60000);
    };

    /**
     * Returns the amount with the currency
     * If nothing is found, return undefined
     * @param amount Value with or without currency
     * @return the amount as a float
     */
    this.getAmountToNumber = function (amount) {
        var result = undefined;
        if (amount) {
            result = parseFloat(amount.match(/([\.0-9]+)/));
        }
        return result;
    };
};
module.exports = ObjectModel;