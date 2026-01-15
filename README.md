# Next.js 16 AI Chatbot

## TODO

- [ ] Mobile designs
- [ ] Use Seb's StreamReader (https://vercel.slack.com/archives/C07CJPHL49E/p1763676431200339?thread_ts=1763582669.158219&cid=C07CJPHL49E)
- [ ] Message composer resets after creating a new chat (due to redirect from homepage)
- [ ] RefreshOnFocus?
- [ ] Race condition: if you slow down chat creation, the streaming messages could finish before the messages exist in the db. Can we enqueue the final save once streaming is done somehow?
- [ ] Animate new chats in sidebar on enter
- [ ] Animate initial load of sidebar chats
- [x] Use Variants for logged-in/logged-out states
- [x] Optimistic streaming indicator chats in sidebar on new messages
- [x] Optimistic chats in sidebar on creation
- [x] Autogenerate chat title name
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

- [ ] How to update the chat title out of band? No way to kick off an action after createChat action finishes.
- [x] (Doesnt happen anymore.) Got error on /chat/[id] page because runtime prefetch. Ask about await connection in getCurrentUser.

## Future

- [ ] Try Redis stream?

## Cool things

- Deleting a chat conditionally redirects - and if it does it returns the UI for the home page in the same roundtrip as the action.
- PPR: Can start typing a new chat instantly - the message composer is in the PPR shell.
