const util = require('util');
const ObjectModel = require('../objectModels/ObjectModel');


var FavouritesPatternObjectModel = function () {

    FavouritesPatternObjectModel.super_.call(this);

    /**
     * Get the text of the amount value of the bets stored in the favouritetable
     */
    this.storedbetValueText = function () {
        var valueStoreAmountbets = element.all(by.css('div.favourite-value'));
        var amount = valueStoreAmountbets.last();
        return amount;
    };

    /**
     * clicking the switchIcon in the favouritetable
     */
    this.clickinfoSwitch = function () {
        var switchButtonInfo = element(by.css('div.icon-circle'));
        return switchButtonInfo.click();
    };

    /**
     *  get the Text texts in or the numbers stored in the favourite table.
     */
    this.getFavouriteInfoText = function () {
        var boxes = element.all(by.css('div.favourite-item'));
        var lastBox = boxes.last();
        var spanNgRepeat = lastBox.all(by.css('div.favourite-details > span'));
        return spanNgRepeat;
    };
};

util.inherits(FavouritesPatternObjectModel, ObjectModel);
module.exports = new FavouritesPatternObjectModel();