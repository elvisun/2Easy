'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Survey = mongoose.model('Survey'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, survey;

/**
 * Survey routes tests
 */
describe('Survey CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Survey
    user.save(function () {
      survey = {
        name: 'Survey name'
      };

      done();
    });
  });

  it('should be able to save a Survey if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Survey
        agent.post('/api/surveys')
          .send(survey)
          .expect(200)
          .end(function (surveySaveErr, surveySaveRes) {
            // Handle Survey save error
            if (surveySaveErr) {
              return done(surveySaveErr);
            }

            // Get a list of Surveys
            agent.get('/api/surveys')
              .end(function (surveysGetErr, surveysGetRes) {
                // Handle Survey save error
                if (surveysGetErr) {
                  return done(surveysGetErr);
                }

                // Get Surveys list
                var surveys = surveysGetRes.body;

                // Set assertions
                (surveys[0].user._id).should.equal(userId);
                (surveys[0].name).should.match('Survey name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Survey if not logged in', function (done) {
    agent.post('/api/surveys')
      .send(survey)
      .expect(403)
      .end(function (surveySaveErr, surveySaveRes) {
        // Call the assertion callback
        done(surveySaveErr);
      });
  });

  it('should not be able to save an Survey if no name is provided', function (done) {
    // Invalidate name field
    survey.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Survey
        agent.post('/api/surveys')
          .send(survey)
          .expect(400)
          .end(function (surveySaveErr, surveySaveRes) {
            // Set message assertion
            (surveySaveRes.body.message).should.match('Please fill Survey name');

            // Handle Survey save error
            done(surveySaveErr);
          });
      });
  });

  it('should be able to update an Survey if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Survey
        agent.post('/api/surveys')
          .send(survey)
          .expect(200)
          .end(function (surveySaveErr, surveySaveRes) {
            // Handle Survey save error
            if (surveySaveErr) {
              return done(surveySaveErr);
            }

            // Update Survey name
            survey.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Survey
            agent.put('/api/surveys/' + surveySaveRes.body._id)
              .send(survey)
              .expect(200)
              .end(function (surveyUpdateErr, surveyUpdateRes) {
                // Handle Survey update error
                if (surveyUpdateErr) {
                  return done(surveyUpdateErr);
                }

                // Set assertions
                (surveyUpdateRes.body._id).should.equal(surveySaveRes.body._id);
                (surveyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Surveys if not signed in', function (done) {
    // Create new Survey model instance
    var surveyObj = new Survey(survey);

    // Save the survey
    surveyObj.save(function () {
      // Request Surveys
      request(app).get('/api/surveys')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Survey if not signed in', function (done) {
    // Create new Survey model instance
    var surveyObj = new Survey(survey);

    // Save the Survey
    surveyObj.save(function () {
      request(app).get('/api/surveys/' + surveyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', survey.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Survey with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/surveys/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Survey is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Survey which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Survey
    request(app).get('/api/surveys/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Survey with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Survey if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Survey
        agent.post('/api/surveys')
          .send(survey)
          .expect(200)
          .end(function (surveySaveErr, surveySaveRes) {
            // Handle Survey save error
            if (surveySaveErr) {
              return done(surveySaveErr);
            }

            // Delete an existing Survey
            agent.delete('/api/surveys/' + surveySaveRes.body._id)
              .send(survey)
              .expect(200)
              .end(function (surveyDeleteErr, surveyDeleteRes) {
                // Handle survey error error
                if (surveyDeleteErr) {
                  return done(surveyDeleteErr);
                }

                // Set assertions
                (surveyDeleteRes.body._id).should.equal(surveySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Survey if not signed in', function (done) {
    // Set Survey user
    survey.user = user;

    // Create new Survey model instance
    var surveyObj = new Survey(survey);

    // Save the Survey
    surveyObj.save(function () {
      // Try deleting Survey
      request(app).delete('/api/surveys/' + surveyObj._id)
        .expect(403)
        .end(function (surveyDeleteErr, surveyDeleteRes) {
          // Set message assertion
          (surveyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Survey error error
          done(surveyDeleteErr);
        });

    });
  });

  it('should be able to get a single Survey that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Survey
          agent.post('/api/surveys')
            .send(survey)
            .expect(200)
            .end(function (surveySaveErr, surveySaveRes) {
              // Handle Survey save error
              if (surveySaveErr) {
                return done(surveySaveErr);
              }

              // Set assertions on new Survey
              (surveySaveRes.body.name).should.equal(survey.name);
              should.exist(surveySaveRes.body.user);
              should.equal(surveySaveRes.body.user._id, orphanId);

              // force the Survey to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Survey
                    agent.get('/api/surveys/' + surveySaveRes.body._id)
                      .expect(200)
                      .end(function (surveyInfoErr, surveyInfoRes) {
                        // Handle Survey error
                        if (surveyInfoErr) {
                          return done(surveyInfoErr);
                        }

                        // Set assertions
                        (surveyInfoRes.body._id).should.equal(surveySaveRes.body._id);
                        (surveyInfoRes.body.name).should.equal(survey.name);
                        should.equal(surveyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Survey.remove().exec(done);
    });
  });
});
