Feature: Integration testing

  Scenario: Will be integration tested
    Given the scaffolded project will be integration tested
    When the project is scaffolded
    Then cucumber will be enabled

  Scenario: Will not be integration tested
    Given the scaffolded project will not be integration tested
    When the project is scaffolded
    Then cucumber will not be enabled
