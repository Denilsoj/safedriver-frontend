
FROM oven/bun:latest

WORKDIR /app

COPY ./app /app

ENV PATH="/root/.bun/bin:$PATH"

RUN bun install

EXPOSE 3000

CMD ["bun", "dev"]
