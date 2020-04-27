FROM node:alpine AS builder

RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python