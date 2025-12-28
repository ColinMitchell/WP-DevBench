# PLUGIN_NAME

Put Your Description Here

[![Built With Plugin Machine (v2)](https://img.shields.io/badge/Built%20With-Plugin%20Machine-lightgrey)](https://pluginmachine.com)

## Troubleshooting
- I had self-signed certificate issues when doing npm update. This fixed it running from plugin folder. `npm config set cafile "../../../../config/ssl/cert.pem"`

## Developopment
```aiignore
{
"repositories": [
{
"type": "vcs",
"url": "https://github.com/ColinMitchell/wp-devbench"
}
],
"require": {
"colinmitchell/wp-devbench": "^1.0"
}
}
```


- Clone
	- git@github.com:GITHUB_ORG/GITHUB_REPO.git
- Install
	- `npm i`
	- Installs with npm and composer
- Start environment
	- `npm env start`
	- Uses [@wordpres/env](https://www.npmjs.com/package/@wordpress/env)
	- [Requires Docker](https://www.docker.com/products/docker-desktop/)
- Test PHP
	- `npm run test:php`
- PHP Stan
  - `composer run phpstan`
- Format JS, CSS and PHP
	- `npm run format`
- Run linter, without fixing code
	- `npm run lint`
- Build JS/CSS
	- `npm run build`
- Create zip
	- `npm run zip`
	- Installs with composer optimized
	- Builds CSS/JS/Blocks
	- Makes a new zip
