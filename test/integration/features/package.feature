Feature: Package

  Scenario: Manifest
    When the project is scaffolded
    Then the manifest file is generated
