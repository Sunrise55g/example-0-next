## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.




## Deploing

#### Create PostgreSQL dump:
- docker exec -i example-0-nest-postgres pg_dump nextjs-dashboard > ./dumps/nextjs-dashboard.sql


#### Restore PostgreSQL dump for existing container:
- docker exec -i example-0-nest-postgres dropdb nextjs-dashboard
- docker exec -i example-0-nest-postgres createdb nextjs-dashboard
- docker exec -i example-0-nest-postgres psql nextjs-dashboard < ./dumps/nextjs-dashboard.sql

#### Restore PostgreSQL dump for error:
- docker exec -i example-0-nest-postgres createdb nextjs-dashboard
- docker exec -i example-0-nest-postgres psql nextjs-dashboard < ./dumps/nextjs-dashboard.sql