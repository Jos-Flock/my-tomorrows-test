# MyTomorrowsTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

- Run `npm install` to install al needed dependencies.
- Run `npm run prepare` to install [Husky](https://typicode.github.io/husky/).
- Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## GitHub Pages

You can find this app also online at it's own [gh-page](https://jos-flock.github.io/my-tomorrows-test/).
For the deploy to GitHub Pages I followed the [Deploy to GitHub Pages](https://angular.io/guide/deployment#deploy-to-github-pages) from the Angular.io docs.
The configuration can be found at [gh-pages.yaml](.github/workflows/gh-pages.yaml).

## Scripts

### `npm run format`

This will kick off a series of linters. This you can use during development because this makes use of the `--fix` and `--write` flags.

### `npm run lint`

This will also kick off a series of linters. This can be used during deployment. This does not use `--fix` and `--write` flags.
Instead, this only checks stuff.

### `npm run test`

This runs `jest --verbose`. And basically runs al unit tests and shows the coverage.
Currently the coverage is around the 95% on `All files`.

## How does the app work?

### General workings

The app has a couple of components which are used to display the UI. The [StudyListComponent](src/components/study-list) is the component
which gets the `Studies` from his _own_ `StudyService` and makes use of the [StudyCardComponent](src/components/study-card) to show
the individual studies. It also has a button which can be used to toggle the polling timer. In the
`StudyCardComponent` I make use of semantic HTML and the `StatusComponent` to convert the status to a readable text. I also make use
of a [MarkdownPipe](src/directives/markdown.pipe.ts) to format the `study.briefSummary`.

### StudyListComponent

The `StudyListComponent` has its own `StudyService`. This way it is possible to have multiple `StudyListComponents` that
have their own `settings` (limit of studies to show, interval of the timer).

### Services

There are two major services. The [StudyClient](src/clients/study.client.ts) and the [StudyService](src/services/study.service.ts).

#### StudyClient

Is the service that is responsible to handle the communication with the API. This wil also convert the
API model into the internal model. This abstraction makes the App loosely coupled.

#### StudyService

Is the service that is responsible to handle the business logic. It is responsible to keep the number of `Studies` to a given count.
It also has the polling timer. The `StudyService` reports about its status via two BehaviorSubject.

#### PollingService

Not implemented yet -> can be an improvement to move this code out of the `StudyService`.

## Explanation of decisions taken

### Testing

I removed the default testing suite Karma and replaced it with [Jest](https://jestjs.io/).
I have chosen for Jest because I am used to working with Jest. Working with mocks is way easier.
Jest is a lot faster than Karma. And Karma can be a b\*\*\*\* ;).

### Linters

I made use of different linters in this project. `prettier` is used to format the code itself.
`stylelint`, `stylelint-config-standard-scss`, `stylelint-order` are responsible to format all written scss.
For example, it orders all css properties alphabetical. `commitlint` is added to make sure all the commit messages are written properly.
You can override this by starting your commit message with a `!`. All these linters are tied together by
`eslint` and `lint-staged`.

### Git Hooks

I made use of `husky` which is a tool that makes the use of git hooks easy.
It makes sure that `pre-commit` `lint-staged` is run. It also makes sure `commitlint` is run on the commit message itself.

### Generated API models

With `openapi-generator-cli` I generated the [API Models](src/models/external-api). I have chosen to only use the models and copy them all
into the project. So at every update of the API spec only the models needed to be copied again. An alternative is to remove the generated models
from the repository and let them generate at deployment.

## Improvements

- Place the timer button into the `NavBarComponent`. This implies some extra work and you loose the
  ability to reuse the `StudyListComponent` with different settings.
- Extract the pollingTimer code from the `StudyService` into its own service (`PollingService`). This way it can be reused in the
  future for polling another API endpoint. It also takes out a responsibility from the `StudyService`.
- Generated classes not in the repo.
