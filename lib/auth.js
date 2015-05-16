var fs = require('fs'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    GitlabStrategy = require('passport-gitlab').Strategy;

function Gitlab(options, core) {
    this.options = options;
    this.core = core;
    this.key = 'gitlab';

    this.setup = this.setup.bind(this);
    this.getGitlabStrategy = this.getGitlabStrategy.bind(this);
}

Gitlab.defaults = {
    gitlabURL: 'https://gitlab.com'
};

Gitlab.key = 'gitlab';

Gitlab.prototype.setup = function() {
    passport.use(this.getGitlabStrategy());
};

Gitlab.prototype.authenticate = function(req, cb) {
    passport.authenticate('gitlab', cb)(req);
};

Gitlab.prototype.getGitlabStrategy = function() {
    return new GitlabStrategy(
        {
            clientID: this.options.clientID,
            clientSecret: this.options.clientSecret,
            gitlabURL: this.options.gitlabURL,
            callbackURL: this.options.callbackURL,
        },
        function (user, done) {
            return Gitlab.findOrCreate(this.core, user, done);
        }.bind(this)
    );
};

Gitlab.findOrCreate = function(core, gitlabUser, callback) {
    var User = mongoose.model('User');

    // TODO Construct unique uid instead of username because
    //      Gitlab username can be changed by the user
    //      Ex. uid = base64(md5(gitlabURL + gitlabUser.id))
    //          base64 because current uid is limited to length <= 24
    User.findOne({ username: gitlabUser.username }, function (err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            Gitlab.createUser(core, gitlabUser, callback);
        } else {
            return callback(null, user);
        }
    });
};

Gitlab.createUser = function(core, gitlabUser, callback) {
    var User = mongoose.model('User');
    var gitlabEmail = gitlabEntry[field_mappings.email];
    var email = gitlabUser.emails[0].value;

    var data = {
        username: gitlabUser.username,
        email: gitlabUser.emails[0].value,
        firstName: '',
        lastName: '',
        displayName: gitlabUser.name
    };

    if (!data.displayName) {
        data.displayName = data.firstName + ' ' + data.lastName;
    }

    core.account.create('gitlab',
                        data,
                        function (err, user) {
        if (err) {
            console.error(err);
            return callback(err);
        }
        return callback(null, user);
    });
};


module.exports = Gitlab;
