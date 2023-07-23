import type OAuth2Strategy from "passport-oauth2";
import type { StrategyOptions } from "passport-oauth2";

export interface Pr0grammStrategyOptions extends StrategyOptions {
	authorizationURL?: string;
	tokenURL?: string;
	userProfileURL?: string;
}

export interface Pr0grammProfile {
	provider: "pr0gramm";
	name: string;
	id: string;
	registered: number;
	mark: number;
	score: number;
	_raw: string;
	_json: unknown;
}

/**
 * `Strategy` constructor.
 *
 * The pr0gramm authentication strategy authenticates requests by delegating to
 * pr0gramm using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `clientID`      your pr0gramm application's client id
 *   - `clientSecret`  your pr0gramm application's client secret
 *   - `callbackURL`   URL to which pr0gramm will redirect the user after granting authorization
 *
 * Example:
 * ```js
 * passport.use(new Pr0grammStrategy({
 *     clientID: '123-456-789',
 *     clientSecret: 'shhh-its-a-secret',
 *     callbackURL: 'https://www.example.net/auth/pr0gramm/callback'
 *   },
 *   function(accessToken, refreshToken, profile, done) {
 *     User.findOrCreate(..., function (err, user) {
 *       done(err, user);
 *     });
 *   },
 * ));
 * ```
 */
declare class Strategy extends OAuth2Strategy {
	constructor(
		options: Pr0grammStrategyOptions,
		verify: (
			accessToken: string,
			refreshToken: string | null,
			profile: Pr0grammProfile,
			done: Function,
		) => void,
	);
}

export default Strategy;
