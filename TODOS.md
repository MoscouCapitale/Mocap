# Features
## Authentification
https://github.com/denoland/fresh/blob/main/docs/latest/examples/authentication-with-supabase.md
- [x] Password Login
- [x] One-page Magic Link Login
- [ ] Magic Link email
- [ ] Notifications on new user
  - [x] Find a notification service
  - [ ] Notify admin on new request (using realtime subscription, and sended email)
  - [x] Add notification badge on admin UI
- [x] Roles
  - [x] Role based access control
  - [x] RLS
  - [x] Role management
- [x] Error management
  - [x] 429 too many request
  - [x] 403 token expired after too much time on app, and it does not renew itself (it should tho)
  - [x] 422 (Signups not allowed for otp) AuthApiError otp_disabled
- [x] Middleware on api ??? 
___
- Bugs:
## Bricks
  - [x] Canva
    - [x] Add dotted background
  - [x] on preview click it disable the sidebar
  - [x] Research on how to implement
  - [x] UI
  - [ ] Implement bricks
    - [ ] Tiles
    - [x] Simple video/image with text/cta (maybe re-use the Single ?)
    - [x] Youtube embed
    - [x] Audio (soundcloud, spotify, etc...) embed
  - [x] Manage saved bricks (in canva page)
  - [ ] Error management
      - [ ] Brick with this name already exists
  - [x] Texte
    - [x] Markdown support
    - [x] Better scrollbar
    - [x] Better fade in/out
  - [x] Better way to show the sizes list (using navigation menu viewport)
  - [ ] When deleting a brick, maybe add an "intelligent" way of deleting related unused content ?
  - [x] Mettre les tailles de certaines briques (link, texte) en "libre" (snap à 100px)
  - [ ] After-canva feature fixes
      - [ ] Add toasts
      - [ ] Add supa error management

___
- Bugs:
  - [ ] Herosection - when you hover the title with disablePauseOnHover, it stops the video (maybe we can tie the mouseEnter on a specific element)
  - [x] If you delete a brick, it is still present in the bricks list
  - [x] When you click on a brick on the select on the bricksidebar, the hover effect is not removed
  - [x] When you update a brick, the preview is not updated. YOu have to reload the page to see the changes
  - [x] When you update a brick, the bricksidebar is reseted, but the select is still on the previous brick
  - [x] When you move a node, the new position is not saved
  - [ ] Embeds do not have a placeholder on the canva

## Collection
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
  - [ ] Better file handling
  - [ ] Better audio support

___
- Bugs:
## Stats
- [ ] Stats

## Settings
- [x] Refacto settings following the same pattern as collections
- [ ] Support api keys (support, hash, etc...)
- [ ] Regroup some code that are very similar between pages (and also all the StylesSettingsDBObject). Ex on pages the logic is *almost* the same, only the UI is different
- [x] Maybe store some settings in context, or in server launch (https://fresh.deno.dev/docs/examples/init-the-server), to avoid fetching them every time, for each client, on each page (very heavy)
- [x] Check formfields objects, for better placeholder, validation, etc...
# UI
- [x] Info icon with tooltip on hover
  - [x] tell that bricks names are unique
- [ ] Cursor
  - [ ] Hover card state
- [ ] Navbar
  - [ ] Smooth animation on expand
  - [x] Set the position as fixed, to have the navbar always displayed same on page scroll
- [ ] Global form
  - [x] Client-side validation
  - [ ] Error handling
  - [x] Fields
    - [x] File input
    - [x] Checkboxes
    - [x] Select and multi select
- [ ] Global components
  - [ ] Button (primary, secondary, danger, success, etc...)
    - [ ] Trashcan
      - [ ] Animation
      - [ ] Confirm popup
  - [ ] Alerts
    - [ ] Modals
      - [ ] Globale confirmation modal
    - [ ] Toasts (https://www.npmjs.com/package/react-toastify)
      - [ ] Themes (error, success, info, warning)
  - [ ] Video player
    - [ ] Fix slider thumb
    - [ ] Set the clickable icons in a wrapper, to make the area of click larger than the icon, which will improve the ux
    - [x] Add a "loading" state
    - [x] Add a "no video" state
  - [ ] Misc
    - [x] Loader
    - [ ] InpagePopup
      - [ ] If you quit one popup showed on top of another, only the last one should be closed
    - [x] The 3 little dots as reusable component
- [ ] Animations...
- [ ] Misc

___
- Bugs:
# Code
- [ ] Learn & refacto whole effects states management with preact
- [x] Add localstorage saving
- [ ] Request service object instead of js native `fetch()` (reast query with preact compat ?)
  - [ ] Make an optionnal parameter to show (or not) the result of the fetch
- [ ] Add a global error handler
  - [x] Error handler on side (what response on supa {data, error}) -- started in `utils/api.ts`
- [ ] Set every database id as uuid
- [ ] Make a bootstrap function to init the database and all misc settings of the supabase instance, to make it possible to run it from an empty project
- [ ] Create a debug flag for local/dev mode, to enable/disable some features

___
- Bugs:
  - [x] Fix lodash bad types
  - [ ] Make partials WORK
    - [ ] Set partial content displayed on page load, instead of click (because for now it is only on subnav items, and specifically on the content page. It should be global, for each "page")
  - [ ] Why is database fetching empty when first connexion ? - Sometime you cannot retrieve any content from supabase, and need to login again to see it, or even restart the app ?

# Dev & self-hosting
- [ ] Find a way to fix API keys for local developement
- [ ] Re-implement RLS (not working on local, and is needed on to have migration files similar to prod)