import type { auth } from "./auth";

export type MyEnv = {
    Bindings: Cloudflare.Env,
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}