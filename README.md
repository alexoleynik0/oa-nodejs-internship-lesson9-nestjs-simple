# oa-nodejs-internship-lesson9-nestjs-simple

[NestJS](https://github.com/nestjs/nest) based simple REST API application.

## Quick start

Install dependencies with package manager of your taste.

```bash
npm install
```

Copy `.env.example` to `.env` and change values accordingly to your setup.

```bash
cp .env.example .env
```

Run the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

Open [http://localhost:3000/api/v1/](http://localhost:3000/api/v1/) in Postman or CURL it as you wish. For example:

```bash
curl -X POST http://localhost:3000/api/v1/users -H "Content-Type: application/json" -d '{"email":"test@test.com", "firstName":"Test"}'
```
