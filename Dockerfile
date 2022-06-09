FROM alpine:latest


COPY yarn.lock /test/yarn.lock
VOLUME /test