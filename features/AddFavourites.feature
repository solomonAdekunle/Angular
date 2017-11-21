Feature: I want to add Bets to Favourites
  I place some bets on the table  and i will click on add Favourites bet tab
  Bet should be able to be added to favourites and pattern table

  @favourites
  Scenario: I want to add Bets to Favourites Table
    Given I am on the game
    When I wait for the place state
      And I select a chip value "1"
      And I click on the slot "0"
      And I click on the slot "3"
      And I click on the slot "16"
      And I click on the Add Favourites Button
      And I click on the Favourites & Pattern Tab
    Then I should see last saved favourite bet with value "£3"
    When I click on the InfoSwitch Button
    Then I should see "0,3,16" saved as Favourites Bets
