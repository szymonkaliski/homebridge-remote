# `homebridge-remote`

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
  homebridge-remote get [aid] [iid]         get status for provided aid
  homebridge-remote set [aid] [iid]         set value for provided aid
  [value]
  homebridge-remote toggle [aid] [iid]      toggle value for provided aid
  homebridge-remote list                    list available devices

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

Example:

```bash
$ homebridge-remote list
...
Studio Lights   true    [aid: 13, iid: 10]
$ homebridge-remote get 13 10
1
$ homebridge-remote set 13 10 0
$ homebridge-remote toggle 13 10
$ homebridge-remote get 13 10
1
```

