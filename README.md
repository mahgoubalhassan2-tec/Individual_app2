My name is Mahgoub Adil Ahmed Alhassn.

Registration number: 25/28013

App name: MAAAPortfolio

Verification code: MOB-A2-8013

Android package: rw.ac.ines.ug2528013.maaaportfolio

## Purpose

MAAAPortfolio is an offline Android portfolio for a recruiter. It introduces Mahgoub Adil Ahmed Alhassn, a Software Engineering student at INES-Ruhengeri, and shows work in automation, Python, and cloud engineering.

## Features

- Home screen with the required introduction, profile image, headline, biography, and verification code
- Skills list and an education timeline
- Two projects, each with a detail screen for the problem, contribution, and technology
- Profile editor with validation, field messages, and a blocked invalid save
- Camera or gallery selection, preview, replace, and remove for a profile image and a verification card
- Local save and reset with AsyncStorage, restored after the app restarts
- About screen with the app name, student name, registration number, verification code, version, and data-use statement
- Core screens work in Airplane Mode

## Setup and run

```bash
npm install
npx expo start
```

Android development build:

```bash
npx expo run:android
```

Web preview:

```bash
npx expo start --web
```

## EAS build

The preview profile in `eas.json` produces an installable Android APK on an Expo account.

```bash
npx eas-cli login
npx eas-cli build -p android --profile preview
```

Install that APK on a phone and open it without Expo Go.

The local release APK for this student is `MOB_A2_2528013.apk`.

## Tested device

Physical-device results, including Airplane Mode, belong in `evidence/MOB_A2_2528013_TEST_LOG.pdf` after the APK is installed. Fill in the phone model and Android version there before submission.

## Release record

- Repository name: `MOB_A2_2528013`
- APK file: `MOB_A2_2528013.apk`
- The release APK is a standalone build. It includes the JavaScript bundle and opens without Expo Go.
- Demonstration video: `MOB_A2_2528013_DEMO.mp4` is recorded on a phone and attached to the release. It is not stored in this repository.

## Known limitations

- Project descriptions are the student's automation and cloud work. Replace them in `src/data/portfolio.ts` if the final titles differ.
- Email, LinkedIn, and WhatsApp from the previous profile were removed. Add new contact links in `src/data/portfolio.ts` when those details are available.
- The demonstration video has to be recorded on a physical phone. It must be continuous, unedited, and no longer than two minutes.

## Repository evidence

- `docs/MOB_A2_2528013_UIUX.pdf`
- `evidence/MOB_A2_2528013_TEST_LOG.pdf`
- `evidence/MOB_A2_2528013_DECLARATION.pdf`
- `evidence/AI_USE.md`
