# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

Tasks :
- [ ] Authentication & User Management (OMG see https://github.com/denoland/fresh/blob/main/docs/latest/examples/authentication-with-supabase.md)
  - [ ] Password Login
  - [ ] One-page Magic Link Login
  - [ ] Magic Link email
  - [ ] Notifications on new user
    - [x] Find a notification service
    - [ ] Notify admin on new request
    - [x] Add notification badge on admin UI
  - [ ] Roles
    - [ ] Role based access control
    - [ ] RLS
    - [ ] Role management
  - [ ] Error management
    - [x] 429 too many request
    - [ ] 403 token expired after too much time on app, and it does not renew itself (it should tho)
    - [ ] ? AuthRetryableFetchError if no internet connection, it returns to the login page
  - [ ] Middleware on api ??? 
- [ ] Collection
  - [x] Supabase init
  - [x] List collection
    - [ ] Pagination
  - [x] UI
  - [ ] Add media extension name on misc collection
  - [x] Get media detail
    - [x] UI
    - [x] API
      - [x] Optimize the query
      - [ ] Add default values from user settings
  - [x] Add media
    - [x] UI
    - [x] API
    - [x] Specify all media attributes based off type (cta, etc)
    - [ ] Fix bug on media upload delete button -- what ?
  - [x] Edit media
    - [x] UI
    - [x] API
    - [x] Advanced settings (individualy override global parameters like autoplay, etc)
      - [x] Set some fields as read only (maybe set attribute as writable | read only | hidden)
      - [x] Set special fiels, like checkbox or boolean if exists
      - [x] Fetch the available cta, etc, from the database and display them in a dropdown
  - [x] Delete media
    - [x] UI
    - [x] API
  - [x] Media
    - [x] Extend the base Media interface to specify more clearly the attribute of each medias
- [ ] Stats
- [ ] Settings
  - [ ] Refacto settings following the same pattern as collections
- [ ] UI
  - [ ] Info icon with tooltip on hover
    - [ ] tell that bricks names are unique
  - [ ] Cursor
  - [ ] Navbar
    - [ ] Smooth animation on expand
    - [ ] Set the position as fixed, to have the navbar always displayed same on page scroll
  - [ ] Global form
    - [ ] Client-side validation
    - [ ] Error handling
  - [ ] Global components
    - [ ] Button (primary, secondary, danger, success, etc...)
      - [ ] Trashcan
        - [ ] Animation
        - [ ] Confirm popup
    - [ ] inputs (text, email, password, etc...)
      - [ ] Read only input
      - [ ] Better multi option dropdown UI
        - [ ] Make dropdown zone better
        - [ ] In bricks, make the dropdown display the items choosen (ex in tracklist, show the label "tracklist", at the right a dropdown to select the tracklist, and below the selected tracklist)
    - [ ] Alerts
      - [ ] Modals
        - [ ] Globale confirmation modal
      - [ ] Toasts (https://www.npmjs.com/package/react-toastify)
        - [ ] Themes (error, success, info, warning)
    - [ ] Misc
      - [ ] Loader
      - [ ] InpagePopup
        - [ ] If you quit one popup showed on top of another, only the last one should be closed
      - [ ] The 3 little dots as reusable component
  - [ ] Animations...
  - [ ] Misc
- [ ] Bricks/Nodes
  - [x] on preview click it disable the sidebar
  - [x] Research on how to implement
  - [x] UI
  - [ ] Implement tiles bricks
  - [ ] Manage saved bricks
  - [ ] Error management
      - [ ] Brick with this name already exists
  - [ ] Texte
    - [ ] Markdown support
  - [ ] Better way to show the sizes list (using navigation menu viewport)
- [ ] Misc
  - [ ] Learn & refacto whole effects states management with preact
  - [ ] Add localstorage saving
  - [ ] Request service object instead of js native `fetch()` (reast query with preact compat ?)
    - [ ] Make an optionnal parameter to show (or not) the result of the fetch
  - [ ] Add a global error handler
    - [x] Error handler on side (what response on supa {data, error}) -- started in `utils/api.ts`
  - [ ] Set partial content displayed on page load, instead of click (because for now it is only on subnav items, and specifically on the content page. It should be global, for each "page")
  - [ ] Set every database id as uuid
  - [ ] Why is database fetching empty when first connexion ?
  - [ ] Fix email notifications
  - [ ] Make a bootstrap function to init the database and all misc settings of the supabase instance, to make it possible to run it from an empty project