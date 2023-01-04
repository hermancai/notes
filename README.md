# Note and Image Storage

Site: https://note-storage.onrender.com/

Language: Typescript

Frontend: React, Redux, Material UI

Backend: Node, Express, Sequelize

Database: AWS RDS (Postgres)

Storage: AWS S3 & Lambda

&nbsp;

### Local Development

---

Create a .env file in the root and server directories with these variables:

```
# ----- Server -----
PORT=

# ----- Access/Refresh Token -----
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# ----- Postgres -----
DB_URI=

# ----- S3 -----
BUCKET_NAME=
BUCKET_REGION=

# ----- Auto-detected by AWS SDK -----
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

&nbsp;

### AWS S3 & Lambda

Main bucket for storing user images.

Secondary bucket for storing image thumbnails, controlled by Lambda functions
that create/delete thumbnails, triggered by POST/DELETE operations on main bucket.

&nbsp;

### Postgres

If using AWS, configure a security group to accept inbound traffic from server IP.

&nbsp;

### Run locally

`npm run dev` from both client and server directories OR

`npm run build && npm run start` from root directory to run transpiled code.

&nbsp;

![notes screenshot 1](https://github.com/hermancai/notes/blob/master/screenshots/notes1.png?raw=true)

&nbsp;

![notes screenshot 2](https://github.com/hermancai/notes/blob/master/screenshots/notes2.png?raw=true)
