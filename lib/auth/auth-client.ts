import { createAuthClient } from "better-auth/react";
import { organizationClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`,
  fetchOptions: {
    credentials: 'include'
  },
  plugins: [
    inferAdditionalFields({
      user: {
        roles: {
          type: "string[]",
        }
      }
    }),
    organizationClient()
  ]
});


export const {
  useSession,
  signIn,
  signUp,
  signOut,
  resetPassword,
  requestPasswordReset,
  organization,
  useListOrganizations,
  useActiveOrganization
} = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;