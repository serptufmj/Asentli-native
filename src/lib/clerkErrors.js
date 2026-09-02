// Turns a Clerk error into a single Spanish message for the UI.
const MESSAGES = {
  form_identifier_exists: 'Ya existe una cuenta con este correo.',
  form_password_incorrect: 'Correo o contraseña incorrectos.',
  form_identifier_not_found: 'No encontramos una cuenta con este correo.',
  form_password_pwned:
    'Esta contraseña apareció en filtraciones de datos. Elegí otra.',
  form_password_length_too_short: 'La contraseña es demasiado corta.',
  form_param_format_invalid: 'Revisá el formato de los datos ingresados.',
  form_code_incorrect: 'El código no es correcto. Revisalo e intentá de nuevo.',
  verification_failed: 'No pudimos verificar el código. Pedí uno nuevo.',
  session_exists: 'Ya hay una sesión activa.',
  too_many_requests: 'Demasiados intentos. Esperá un momento e intentá de nuevo.',
};

export function clerkErrorMessage(err, fallback = 'Algo salió mal. Intentá de nuevo.') {
  const first = err?.errors?.[0];
  if (!first) return err?.message || fallback;
  return MESSAGES[first.code] || first.longMessage || first.message || fallback;
}
