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
    - [ ] 422 (Signups not allowed for otp) AuthApiError otp_disabled
  - [ ] Middleware on api ??? 
- [ ] Collection
  - [ ] Bugs
    - [ ] You cannot upload any file
    - [ ] When creating a new media, the form re-renders on each interaction
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
  - [ ] Support api keys (support, hash, etc...)
  - [ ] Regroup some code that are very similar between pages (and also all the StylesSettingsDBObject). Ex on pages the logic is *almost* the same, only the UI is different
  - [x] Maybe store some settings in context, or in server launch (https://fresh.deno.dev/docs/examples/init-the-server), to avoid fetching them every time, for each client, on each page (very heavy)
  - [ ] Check formfields objects, for better placeholder, validation, etc...
- [ ] UI
  - [ ] Info icon with tooltip on hover
    - [ ] tell that bricks names are unique
  - [ ] Cursor
    - [ ] Hover card state
  - [ ] Navbar
    - [ ] Smooth animation on expand
    - [x] Set the position as fixed, to have the navbar always displayed same on page scroll
  - [ ] Global form
    - [ ] Client-side validation
    - [ ] Error handling
    - [ ] Fields
      - [ ] File input
      - [ ] Date input
      - [ ] Color input
      - [ ] Checkboxes
      - [ ] Select and multi select
  - [ ] Global components
    - [ ] Button (primary, secondary, danger, success, etc...)
      - [ ] Trashcan
        - [ ] Animation
        - [ ] Confirm popup
    - [ ] inputs (text, email, password, etc...)
      - [ ] Read only input
      - [ ] Support custom types:
        - [ ] File input
        - [ ] Color input 
        - [ ] Select/Multi select
          - [ ] Make dropdown zone better
          - [ ] In bricks, make the dropdown display the items choosen (ex in tracklist, show the label "tracklist", at the right a dropdown to select the tracklist, and below the selected tracklist)
          - [ ] FInish all todos of Select component
    - [ ] Hint popover (as an '?' icon)
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
- [ ] Bricks/Nodes
  - [ ] Canva
    - [ ] Add dotted background
  - [x] on preview click it disable the sidebar
  - [x] Research on how to implement
  - [x] UI
  - [ ] Implement tiles bricks
  - [x] Manage saved bricks (in canva page)
  - [ ] Error management
      - [ ] Brick with this name already exists
  - [ ] Texte
    - [ ] Markdown support
  - [ ] Better way to show the sizes list (using navigation menu viewport)
  - [ ] When deleting a brick, maybe add an "intelligent" way of deleting related unused content ?
  - [ ] Content
    - [ ] Do all animations
    - [ ] BUG - no content on click
  - [ ] Mettre les tailles de certaines briques (link, texte) en "libre" (snap à 100px)
  - [ ] After-canva feature fixes
      - [ ] Add toasts
      - [ ] Add supa error management
  - [ ] Bugs
    - [ ] Herosection - when you hover the title with disablePauseOnHover, it stops the video (maybe we can tie the mouseEnter on a specific element)
- [ ] Misc
  - [ ] Fix lodash bad types
  - [ ] Learn & refacto whole effects states management with preact
  - [ ] Add localstorage saving
  - [ ] Request service object instead of js native `fetch()` (reast query with preact compat ?)
    - [ ] Make an optionnal parameter to show (or not) the result of the fetch
  - [ ] Add a global error handler
    - [x] Error handler on side (what response on supa {data, error}) -- started in `utils/api.ts`
  - [ ] Make partials WORK
    - [ ] Set partial content displayed on page load, instead of click (because for now it is only on subnav items, and specifically on the content page. It should be global, for each "page")
  - [ ] Set every database id as uuid
  - [ ] Why is database fetching empty when first connexion ?
  - [ ] Fix email notifications
  - [ ] Make a bootstrap function to init the database and all misc settings of the supabase instance, to make it possible to run it from an empty project
  - [ ] Fix media-chrome ts errors on web components