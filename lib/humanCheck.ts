// Shared by the server check (lib/turnstile.ts) and the form components, so a
// form can tell a failed human check apart from other errors.
export const HUMAN_CHECK_FAILED_MESSAGE =
  'We could not confirm you are human. Please complete the security check above the submit button and try again.';
