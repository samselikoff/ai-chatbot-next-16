# Next.js 16 AI Chatbot

## TODO

- [ ] Use Variants for logged-in/logged-out states
- [ ] Autogenerate chat title name
- [ ] Mobile designs
- [ ] Use Seb's StreamReader (https://vercel.slack.com/archives/C07CJPHL49E/p1763676431200339?thread_ts=1763582669.158219&cid=C07CJPHL49E)
- [ ] Optimistic chats on creation
- [ ] Message composer resets after creating a new chat (due to redirect from homepage)
- [x] Delete chats
- [x] Remove runtime prefetching for now
- [x] New chats don't appear on sidebar until first message completes
- [x] In-progress indicator on sidebar
- [x] Message composer: disable while streaming.
- [x] Message composer resets after action completes
- [x] Sign up page: Show error for duplicate email
- [x] Sign up page: Show error for short password
- [x] Sign up page: Show error for bad email
- [x] Focus input field after a navigation
- [x] Look at initial paint bc of sidebar thing
- [x] Login page: Show error for bad login info
- [x] Create account page
- [x] Login page
- [x] Error when loading a chat/[id] page

## Blocked

- [ ] Add back in runtime prefetch

## Bugs + papercuts

- [x] (Doesnt happen anymore.) Diagnose why creating a chat sometimes shows Suspense boundary. (E.g., Load app, create chat, press back button, create new chat.)

## Questions

- [x] (Doesnt happen anymore.) Got error on /chat/[id] page because runtime prefetch. Ask about await connection in getCurrentUser.

## Future

- [ ] Try Redis stream?
