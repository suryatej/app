# User Story: 17 - Sign In with Social Media

**As a** registered user,
**I want** to sign in using my social media accounts (Google, Apple, Facebook),
**so that** I can quickly access my wellness data without remembering another password.

## Acceptance Criteria

* Social media sign-in options are displayed on login screen
* Selecting a provider initiates OAuth authentication flow
* Successful authentication grants access to user's existing account
* If social account was used for registration, it works seamlessly for subsequent logins
* User can link multiple social accounts to one Healthify account

## Notes

* Provides convenient authentication for users who registered via social media
* Reduces password fatigue for users
* Must handle account linking scenarios appropriately