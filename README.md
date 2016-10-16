# Chataway

Continuing my efforts to build up a portfolio of programming projects, I decided
to create Chataway, an effortlessly simple way to chat. Chat rooms are created
on-the-fly by going to the root URL and are completely disposable. 

There are some problems with my implementation (as it's only a simple demo), such
as generated room IDs are not guaranteed to be unique, however there is such a low
chance of collision that it's not an issue for this simple project. I've only begun 
to explore this idea, and there's lots of work that needs to be done if somebody 
wants to turn this into a real product.

### Some further ideas for development

- [ ] Ensure uniqueness in room IDs.
- [ ] Run this onto a production environment (AWS, Azure, Google Cloud).
- [ ] Package this as an NPM module.
- [ ] Refactor the client with proper MVP.
- [ ] Use WebWorkers for background notifications.
- [ ] Settings menu (with Cookies or WebStorage for persistence).
- [ ] Name change notifications.
- [ ] REST API for chatbots to operate in.