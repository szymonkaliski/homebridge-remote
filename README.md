# homebridge-remote

Simple remote control for homebridge, requires `aid` and `iid` which can be found using:

```bash
curl -X PUT $HOMEBRIDGE_HOST/accessories --header "Content-Type:Application/json" --header "authorization:$HOMEBRIDGE_CODE" -s
```

Homberidge should be run in insecure mode (using `-I` command line switch).

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
  homebridge-remote get [aid] [iid]          get status for provided aid and iid
  homebridge-remote set [aid] [iid] [value]  set value for provided aid and iid
  homebridge-remote toggle [aid] [iid]       toggle value for provided aid and iid

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

