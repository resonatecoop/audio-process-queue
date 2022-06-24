FROM node:18-alpine:latest AS builder

WORKDIR /var/www/api

RUN apk --no-cache add git

COPY . .

RUN npm install
RUN npm run build

FROM jrottenberg/ffmpeg:5.0-alpine as ffmpeg
FROM node:18-alpine:latest

RUN apk --no-cache add git

WORKDIR /var/www/api

COPY .env ./
COPY .env.example ./
COPY ./package* ./
COPY ./index.js ./

# copy ffmpeg bins
COPY --from=ffmpeg / /

COPY --from=builder /var/www/api/node_modules ./node_modules
COPY --from=builder /var/www/api/lib ./lib

CMD ["npm", "start"]
