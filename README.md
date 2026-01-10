# Next.js 16 AI Chatbot

## TODO

- [ ] Polish autocomplete for email/password on sign-in/sign-up
- [ ] Sign up page: Show error for bad info
- [ ] Message composer resets after action completes
- [ ] Use Seb's StreamReader
- [ ] Mobile designs
- [ ] In-progress indicator on sidebar?
- [ ] Autogenerate chat title name
- [ ] Delete chats
- [ ] Try Redis stream?
- [x] Focus input field after a navigation
- [x] Look at initial paint bc of sidebar thing
- [x] Login page: Show error for bad login info
- [x] Create account page
- [x] Login page
- [x] Error when loading a chat/[id] page

## Blocked

- [ ] Add back in runtime prefetche

## Bugs + papercuts

- [ ] Load app, create chat, press back button, create new chat. See Suspense boundary.

## Questions

- [ ] Got error on /chat/[id] page because runtime prefetch. Ask about await connection in getCurrentUser.
