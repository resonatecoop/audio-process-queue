# Audio processing

Convert audio files to streamable m4a using fluent-ffmpeg.

## Install

```sh
npm install
```

## Install ffmpeg with libfdk\_aac

```sh
brew tap homebrew-ffmpeg/ffmpeg
brew install homebrew-ffmpeg/ffmpeg/ffmpeg --with-fdk-aac
```

## Install redis

```sh
brew install redis
```

Update your redis config to use a password.

## Build (babel)

```sh
npm run build
```

## Env

```sh
cp .env.example .env
```

## Usage

```sh
node ./lib/index.js run --name my-queue-name
```

## Test

```sh
npm test
```

## See also

- [bull](https://github.com/OptimalBits/bull) Queue system
- [taskforce-connector](https://github.com/taskforcesh/taskforce-connector)

## LICENSE

MIT
