Feature: Bet into the game

  @bet
  Scenario: Player selects some chips and place them on the table by clicking/tapping on some slots
    Given I am on the game
    When I wait for the place state
      And I select a chip value "5"
      And I click on the slot "120"
      And I select a chip value "1"
      And I click on the slot "40"
      And I click on the slot "7"
      And I click on the slot "7"
    Then I should see a chip with value "5" on the slot "120"
      And I should see a chip with value "1" on the slot "40"
      And I should see a chip with value "2" on the slot "7"