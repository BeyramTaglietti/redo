# Redo - repetitive tasks manager

<img src="/assets/images/adaptive-icon.png" alt="App icon" width="200" height="200"/>

Redo is a small mobile app that allows people to create recurring tasks.

It is built using React Native with Expo and is currently only available on iOS through the [App Store](https://apps.apple.com/us/app/redo-repetitive-tasks/id6504712333)

Google [restrictive policies](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) towards personal developer accounts make it too much of a hassle to make the app available on the Play Store.

## Table of contents

- [Redo - repetitive tasks manager](#redo---repetitive-tasks-manager)
  - [Table of contents](#table-of-contents)
  - [Roadmap](#roadmap)
  - [Project configuration](#project-configuration)
  - [Env file configuration](#env-file-configuration)
  - [Installation](#installation)
  - [License](#license)
  - [Privacy Policy](#privacy-policy)

## Roadmap

- [x] Tasks re-ordering
- [x] Multiple colors
- [x] Onboarding page
- [x] Analytics

## Project configuration

- **Expo SDK version:** 51
- **React Version**: 18
- **Analytics Service**: Posthog
- **Package Manager**: Pnpm
- **Testing Framework**: Jest
- **Commit hooks**: Husky

## Env file configuration

```env
EXPO_PUBLIC_POSTHOG_APIKEY=...
```

## Installation

```bash
npm install -g pnpm # install pnpm globally on your machine or run using npx pnpm

pnpm install # install project dependencies

pnpm ios # to run on iOS
pnpm android # to run on Android
```

## License

[MIT](./LICENSE)

## Privacy Policy

[Privacy Policy](https://sites.google.com/view/redo-privacy-policy/home-page)
