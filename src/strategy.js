// @ts-check

import OAuth2Strategy, { InternalOAuthError } from "passport-oauth2";

/**
 * @typedef {import("passport-oauth2").StrategyOptions & {
 *   authorizationURL?: string;
 *   tokenURL?: string;
 *   userProfileURL?: string;
 * }} Pr0grammStrategyOptions
 */

/**
 * @typedef {{
 *   provider: "pr0gramm";
 *   name: string;
 *   id: string;
 *   registered: number;
 *   mark: number;
 *   score: number;
 *   _raw: string;
 *   _json: unknown;
 * }} Pr0grammProfile
 */

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
export default class Strategy extends OAuth2Strategy {
	name = "pr0gramm";

	/**
	 * @type {string}
	 */
	_userProfileURL;

	/**
	 * @param {Pr0grammStrategyOptions} options
	 * @param {(accessToken: string, refreshToken: string | null, profile: Pr0grammProfile, done: Function) => void} verify
	 */
	constructor(options, verify) {
		if (!options) {
			throw new Error("Pr0grammStrategy requires options");
		}

		const opts = structuredClone(options);
		opts.scope = Strategy.ensureScope(options.scope, "user.me");
		opts.authorizationURL ??= "https://pr0gramm.com/oauth/authorize";
		opts.tokenURL ??= "https://pr0gramm.com/api/oauth/createAccessToken";

		super(opts, verify);

		this._userProfileURL = opts.userProfileURL ?? "https://pr0gramm.com/api/user/me";

		// Needed because the fetching of the user profile is done via GET
		// @ts-ignore
		this._oauth2._useAuthorizationHeaderForGET = true;
	}

	/**
	 * @param {string | string[] | undefined} scope
	 * @param {string} required
	 * @returns {string}
	 */
	static ensureScope(scope, required) {
		if (!scope) {
			return required;
		}

		if (Array.isArray(scope)) {
			return [...scope, required].join(",");
		}

		return scope
			.split(",")
			.reduce(
				(previousValue, currentValue) => {
					if (currentValue !== "") previousValue.push(currentValue);
					return previousValue;
				},
				[required],
			)
			.join(",");
	}

	/**
	 * Retrieves user profile from pr0gramm.
	 * @param {string} accessToken
	 * @param {(err?: Error | null, profile?: any) => void} done
	 */
	userProfile(accessToken, done) {
		this._oauth2.get(this._userProfileURL, accessToken, (err, body) => {
			if (err) {
				return done(new InternalOAuthError("Failed to fetch user profile.", err));
			}

			if (body === undefined) {
				return done(new InternalOAuthError("Failed to fetch user profile.", null));
			}

			const bodyStr = body instanceof Buffer ? body.toString("utf8") : body;

			let json;
			try {
				json = JSON.parse(bodyStr);
			} catch (e) {
				return done(e);
			}

			done(null, {
				provider: "pr0gramm",
				name: json.name,
				id: json.identifier,
				registered: json.registered,
				mark: json.mark,
				score: json.score,
				_raw: bodyStr,
				_json: json,
			});
		});
	}
}
