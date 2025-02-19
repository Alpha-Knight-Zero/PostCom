const passport = require('passport');
require('dotenv').config();

const clienID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const mongoose = require('mongoose');

const User = mongoose.model('users');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: clienID,
			clientSecret: clientSecret,
			callbackURL: '/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			const newUser = {
				googleID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				image: profile.photos[0].value,
			};

			try {
				let user = await User.findOne({ googleID: profile.id });
				if (user) {
					// User Exists
					console.log('Exist', user);
					done(null, user);
				} else {
					// Sign up for the first time
					user = await User.create(newUser);
					console.log('New', user);
					done(null, user);
				}
			} catch (error) {
				console.log(error);
				done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
