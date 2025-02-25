FROM oven/bun:latest

WORKDIR /app

EXPOSE 3000

COPY ./app /app
COPY ./start.sh /start.sh
RUN chmod +x /start.sh

