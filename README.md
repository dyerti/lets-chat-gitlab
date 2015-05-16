# Let's Chat - Gitlab Plugin

Add Gitlab SSO support to [Let's Chat](http://sdelements.github.io/lets-chat/).

### Install

```
npm install lets-chat-gitlab
```

### Configure

###### Example

```yml
auth:
  providers: [gitlab]

  gitlab:
    clientID: '<Generate this from Gitlab>'
    clientSecret: '<Generate this from Gitlab>'
    gitlabURL: 'https://gitlab.com'
    callbackURL: 'https://chat.domain.example'
```
