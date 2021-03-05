# homebridge-remote

Simple remote control for Homebridge.
Homebridge should be run in insecure mode (using `-I` command line switch).

## Warning

This was tested briefly on the very specific setup that I have, I'm probably not going to help you set this up for something I don't use myself.

Feel free to fork and change as needed.

## Installation

```bash
npm i -g homebridge-remote
```

## Setup

Create `~/.homebridge-remote.json` file containing:

```json
{
  "auth": "YOUR_HOMEBRIDGE_AUTH_CODE",
  "url": "YOUR_HOMEBRIDGE_URL"
}
```

## Usage

```
Usage: homebridge-remote

Commands:
  homebridge-remote get [aid]          get status for provided aid
  homebridge-remote set [aid] [value]  set value for provided aid
  homebridge-remote toggle [aid]       toggle value for provided aid
  homebridge-remote list               list available devices

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

