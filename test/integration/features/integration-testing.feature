Feature: Integration testing

  Scenario: Will be integration tested
    Given the scaffolded project will be integration tested
    And the project dialect is "babel"
    When the project is scaffolded
    Then cucumber will be enabled
    And the step definitions use a "mjs" extension

  Scenario: Will not be integration tested
    Given the scaffolded project will not be integration tested
    When the project is scaffolded
    Then cucumber will not be enabled

  @wip
  Scenario: ESM project
    Given the scaffolded project will be integration tested
    And the project dialect is "esm"
    When the project is scaffolded
    Then cucumber will be enabled
    And the step definitions use a "js" extension
