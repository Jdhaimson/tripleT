// @author: Juan Diego Castrillon
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Get a single User by ID.
 * @route GET /users/:userId
 * @param {String} req.profile.id = :userId
 * @return {JSON} success -> User Object
 * 				  failure -> {message: 'Couldn't get user with ID: id' }
 */
var one = function(req, res) {
	var _id = req.profile._id;
	User.findOne({ _id : _id}, function(err, user) {
		if (!user) {
			return res.status(500).send({
				'message' : 'Couldn\'t get user with ID: ' + _id
			});
		}
		res.jsonp(user);
	});
};

/**
 * Respond with currently loged-in User JSON
 * @route GET /users/me
 * @return {JSON} success -> User Object
 * 				  failure -> null
 */
var me = function(req, res) {
   if (req.user) {
      res.jsonp(req.user);
   } else {
      res.status(500).send("no user detected");
   }
};

/**
 * Delete a User
 * @route DELETE /users/:userId
 * @param {String} req.profile.id = :userId
 * @return {JSON} success -> {message: 'Success'
 * 				  failure -> {message: error-msg}
 */
var removeOne = function(req, res) {
	User.findOne({_id : req.profile._id}).remove(function(err) {
		if (err) {
			return res.status(500).send(err);
		}

		res.jsonp({'message' : 'Success'});
	});
};

/**
 * User Middleware asserting that signed-in User is the same as the requested User
 * @param  {String} req.user.id -> Signed-in User ID
 * @param  {String} req.profile._id -> Requests User ID
 * @param  {Function} next -> call next function. 
 * @return {Object} if failure -> {message: error-msg}
 */
var hasAuthorization = function(req, res, next) {
  if (req.user.id != (req.profile._id)) {
    return res.status(403).send({
      message: 'Only the signed in User can make this change to this User'
    });
  }
  next();
}

module.exports.one = one;
module.exports.me = me;
module.exports.removeOne = removeOne;
module.exports.hasAuthorization = hasAuthorization;