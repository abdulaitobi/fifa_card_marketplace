# FIFA Card MarketPlace

Browse and search the inventory, add a player card, edit its name, nationality or price, and delete cards and trade with your friends. Changes are saved in PostgreSQL.

1. Start PostgreSQL. For a fresh local setup, create the database with `createdb fifa-cards`.
2. Run `npm install`. Copy `.env.example` to `.env` if you don't already have one. Set `DATABASE_URL` or the `PG*` variables for your PostgreSQL connection as needed.
3. Run `npm run db:setup` to create the `players` table if it doesn't exist. This leaves an existing table and its cards intact.
4. Run `npm start` and open [the inventory](http://localhost:3000).

The app has no login or role checks. Anyone who can reach it can change the inventory; keep it local or on a trusted network.
