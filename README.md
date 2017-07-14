# P-Seeder engine

Webtorrent-based bittorent daemon that can be controlled through HTTP requests.

[![Build Status](https://travis-ci.org/p-project/p-seeder-engine.svg?branch=master)](https://travis-ci.org/p-project/p-seeder-engine)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

## Install

As for any P-Project application, all dependencies, installation and run scripts are listed in the
[.p-properties.yml](https://github.com/p-project/p-seeder-engine/blob/master/.p-properties.yml) file.

## Usage

Commands are listed in the `run` section of the
[.p-properties.yml](https://github.com/p-project/p-api/blob/master/.p-properties.yml) file.

You can also use `npm link` once built to add a `pseederd` command to your `PATH`.

## Tests

```
npm run test
```

## API Docs

```
npm run start
```

Then you can access to the api documentation via `http://localhost:2342/docs/static/`

