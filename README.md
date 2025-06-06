# Mocap

An open-source interactive showcase for music artists powered by [Fresh](https://fresh.deno.dev) and [Supabase](https://supabase.com), featuring dynamic bricks and a comprehensive admin panel for managing content, users, and (soon) statistics.

Check it [mocap.deno.dev](https://mocap.deno.dev) !

## Core features 🚀

Mocap is based on bricks, dynamic content blocks displayed on the main Mocap homepage, and that can be managed by the admin panel.
Each brick has a different purpose, like showcasing a single, an album, video, and more.

### Admin panel
The admin panel is the core of Mocap, where you can manage all the content displayed on the main page.
![Mocap admin panel](./docs/mocap_admin_bricks.png)

The bricks and medias are fully customizable.

Mocap also features a user management system, where you can invite users, manage roles, and more.

## How to run the project 🏃‍♂

### Locally

1. Clone the repository
```Bash
git clone git@github.com:MoscouCapitale/Mocap.git
cd Mocap
```

2. Start the Supabase local development server
```Bash
# Note: this command will try to start the Supabase server using the `supabase` command. If not
# found, it will use the `npx supabase` command instead, making npm a requirement.
deno task start supa-start
```

3. Copy the `.env.basic` file to `.env.local`
```Bash
cp .env.basic .env.local
```

4. Start the Fresh server
```Bash
deno task start
```

**Mocap is now running on [`localhost:8000`](http://localhost:8000) !**

____
The admin panel is accessible at [`localhost:8000/admin`](http://localhost:8000/admin), with the default credentials `admin@mocap.fr` / `TdJg$Zf5vD5MGn*9npg`.

The Supabase expose the following services:
- [Supabase Studio @ `localhost:54323`](http://localhost:54323): the Supabase dashboard to manage the project.
  > 💡 Note that any config changes should be done in the `/supabase/config.toml` file.
- [Supabase Inbucket @ `localhost:54324`](http://localhost:54324): the Supabase email inbox to manage the emails sent by the project. Used in local developement because the smtp server is not configured here.
- [Supabase API @ `localhost:54321`](http://localhost:54321): the Supabase API to interact with the database. Should probably not be used directly, but by the Fresh server instead.
- [Supabase DB @ `postgresql://postgres:postgres@localhost:54322/postgres`](postgresql://postgres:postgres@localhost:54322/postgres): the Supabase database to interact with the data.

### Additionnal configuration

- To configure the Supabase instance, check the `/supabase/config.toml` file. It contains the configuration for the Supabase instance, like the database name, the port, and more.
- The database schema is based off the `/supabase/migrations` folder. The migrations are at Supabase start, and can be used to create the database schema.
- Supabase allows seeding the database with the `/supabase/seeds` folder. The seeds are run at the start of the Supabase instance, and can be used to populate the database with default data. Keep in mind that the default seeding file populate de base configuration for Mocap (some enums, storage buckets, etc).
- To apply migrations and/or seeds, you can use the `supabase db reset` command. It will fully reset the database, apply the migrations, and seed the database. For more infos, check the [Supabase docs](https://supabase.com/docs/reference/cli/start) about it.

#### Remote db management
```Bash
# Before doing any local work on the db, pull the remote db
supabase db pull
# After changing the local db, push the local db to the remote
supabase db diff --file <changes>.sql
supabase db push

# To update the database.ts model (from local db)
supabase gen types typescript --local > models/database.ts
# Note: Add the following line at the end, to get the tables types:
# export type TableNames = keyof PublicSchema["Tables"] | keyof PublicSchema["Views"]
```


## Connect to a Supabase instance

## Self-hosting

<img src="./docs/wallace_hammering.gif" style='width: 200px'>

_Sections still in progress, please check back later._



## Roadmap 🗺️

<div>
  <div style="display: flex; align-items: center; font-size: 0.875rem; font-weight: 600; line-height: 1.5; color: #007BFF;">
    <svg viewBox="0 0 4 4" style="margin-right: 1rem; height: 0.25rem; width: 0.25rem; flex: none;" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></svg>
    <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #007BFF; white-space: nowrap;">
      🚧 Alpha release
    </p>
    <div style="margin: 0 2rem; height: 2px; width: 100vw; background-color: #007BFF;"></div>
  </div>
    <p style="margin-top: 0.5rem; font-size: 1rem; line-height: 1.5">
      First release of Mocap, with all the main core features, mainly used to hunt the last critical bugs.
    </p>
</div>

<div>
  <div style="display: flex; align-items: center; font-size: 0.875rem; font-weight: 600; line-height: 1.5; color: #007BFF;">
    <svg viewBox="0 0 4 4" style="margin-right: 1rem; height: 0.25rem; width: 0.25rem; flex: none;" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></svg>
    <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #007BFF; white-space: nowrap;">
      🧹 Last features
    </p>
    <div style="margin: 0 2rem; height: 2px; width: 100vw; background-color: #007BFF;"></div>
  </div>
    <p style="margin-top: 0.5rem; font-size: 1rem; line-height: 1.5">
      Implement the key features and cleanup codebase before release.
    </p>
</div>

<div>
  <div style="display: flex; align-items: center; font-size: 0.875rem; font-weight: 600; line-height: 1.5; color: #007BFF;">
    <svg viewBox="0 0 4 4" style="margin-right: 1rem; height: 0.25rem; width: 0.25rem; flex: none;" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></svg>
    <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #007BFF; white-space: nowrap;">
      🎉 Release
    </p>
    <div style="margin: 0 2rem; height: 2px; width: 100vw; background-color: #007BFF;"></div>
  </div>
    <p style="margin-top: 0.5rem; font-size: 1rem; line-height: 1.5">
      Release of Mocap.
    </p>
</div>


<div>
  <div style="display: flex; align-items: center; font-size: 0.875rem; font-weight: 600; line-height: 1.5; color: #007BFF;">
    <svg viewBox="0 0 4 4" style="margin-right: 1rem; height: 0.25rem; width: 0.25rem; flex: none;" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></svg>
    <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #007BFF; white-space: nowrap;">
      ☁️ Self-hosted migration
    </p>
    <div style="margin: 0 2rem; height: 2px; width: 100vw; background-color: #007BFF;"></div>
  </div>
    <p style="margin-top: 0.5rem; font-size: 1rem; line-height: 1.5">
      Work on the move from Supabase cloud to a locally self-hosted Supabase instance.
    </p>
</div>

<div>
  <div style="display: flex; align-items: center; font-size: 0.875rem; font-weight: 600; line-height: 1.5; color: #007BFF;">
    <svg viewBox="0 0 4 4" style="margin-right: 1rem; height: 0.25rem; width: 0.25rem; flex: none;" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></svg>
    <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #007BFF; white-space: nowrap;">
      🤝 Create the open-source self-hosted setup
    </p>
    <div style="margin: 0 2rem; height: 2px; width: 100vw; background-color: #007BFF;"></div>
  </div>
    <p style="margin-top: 0.5rem; font-size: 1rem; line-height: 1.5">
      Create the whole setup to make the app fully open-source and "runable" by anyone.
    </p>
</div>

<div>
  <div style="display: flex; align-items: center; font-size: 0.875rem; font-weight: 600; line-height: 1.5; color: #007BFF;">
    <svg viewBox="0 0 4 4" style="margin-right: 1rem; height: 0.25rem; width: 0.25rem; flex: none;" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></svg>
    <p style="margin: 0; font-size: 1.125rem; font-weight: 600; color: #007BFF; white-space: nowrap;">
      🪄 Stats and API support
    </p>
    <div style="margin: 0 2rem; height: 2px; width: 100vw; background-color: #007BFF;"></div>
  </div>
    <p style="margin-top: 0.5rem; font-size: 1rem; line-height: 1.5">
      Add API support for multiple Music hosting platforms, and statistics panel.
    </p>
</div>

### TODOS 📝
Check the [TODOS.md](TODOS.md) file for the current tasks and features to implement.