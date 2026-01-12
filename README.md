# Next.js 16 AI Chatbot

## TODO

- [ ] Use Seb's StreamReader
- [ ] Mobile designs
- [ ] In-progress indicator on sidebar?
- [ ] Autogenerate chat title name
- [ ] Delete chats
- [ ] Message composer resets after creating a new chat (due to redirect from homepage)
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

- [ ] Load app, create chat, press back button, create new chat. See Suspense boundary.

## Questions

- [ ] Got error on /chat/[id] page because runtime prefetch. Ask about await connection in getCurrentUser.

## Future

- [ ] Try Redis stream?
