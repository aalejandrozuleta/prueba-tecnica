/**
 * Idiomas soportados por el frontend.
 */
export type Language = 'es' | 'en';

/**
 * Diccionario de traducciones.
 *
 * IMPORTANTE:
 * - Las keys de `errors` deben coincidir con:
 *   - mensajes de Zod
 *   - mensajes del backend (nestjs-i18n)
 * - NO deben ser textos libres
 */
export const translations = {
  es: {
    register: {
      title: 'Crear cuenta',
      subtitle: 'Regístrate para comenzar',
      name: 'Nombre completo',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      submit: 'Registrarse',
      loading: 'Creando cuenta...',
      loginLink: '¿Ya tienes cuenta? Inicia sesión',
    },

    errors: {
      /** Campos requeridos */
      required: 'Este campo es obligatorio',

      /** Email */
      invalid_email: 'Correo electrónico inválido',

      /** Password */
      passwordInvalid:
        'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial',
      passwordMatch: 'Las contraseñas no coinciden',

      /** Name */
      nameMin: 'El nombre debe tener al menos 2 caracteres',
      nameMax: 'El nombre no puede superar los 50 caracteres',

      /** Fallback */
      unknown: 'Ocurrió un error inesperado',
    },
    auth: {
      title: 'Iniciar sesión',
      subtitle: 'Accede a tu cuenta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      submit: 'Ingresar',
      loading: 'Ingresando...',
      registerLink: '¿No tienes cuenta? Regístrate',
    },

    config: {
      title: 'Configuración inicial',
      subtitle: 'Personaliza tu experiencia',
      language: 'Idioma',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      save: 'Guardar configuración',
    },
    debts: {
      title: 'Deudas',
      amount: 'Monto',
      status: 'Estado',
      description: 'Descripción',
      createdAt: 'Creada',
      paid: 'Pagada',
      pending: 'Pendiente',
      empty: 'Sin descripción',

      actions: {
        view: 'Ver',
        edit: 'Editar',
        pay: 'Pagar',
        delete: 'Eliminar',
      },
    },

  },

  en: {
    register: {
      title: 'Create account',
      subtitle: 'Sign up to get started',
      name: 'Full name',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      submit: 'Register',
      loading: 'Creating account...',
      loginLink: 'Already have an account? Sign in',
    },

    errors: {
      /** Required fields */
      required: 'This field is required',

      /** Email */
      invalid_email: 'Invalid email address',

      /** Password */
      passwordInvalid:
        'Password must be 8 - 50 characters and include uppercase, lowercase, number and special character',
      passwordMatch: 'Passwords do not match',

      /** Name */
      nameMin: 'Name must be at least 2 characters',
      nameMax: 'Name must not exceed 50 characters',

      /** Fallback */
      unknown: 'An unexpected error occurred',
    },

    auth: {
      title: 'Sign in',
      subtitle: 'Access your account',
      email: 'Email address',
      password: 'Password',
      submit: 'Sign in',
      loading: 'Signing in...',
      registerLink: 'Don’t have an account? Sign up',
    },

    config: {
      title: 'Initial setup',
      subtitle: 'Customize your experience',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      save: 'Save settings',
    },
    debts: {
      title: 'Debts',
      amount: 'Amount',
      status: 'Status',
      description: 'Description',
      createdAt: 'Created',
      paid: 'Paid',
      pending: 'Pending',
      empty: 'No description',

      actions: {
        view: 'View',
        edit: 'Edit',
        pay: 'Pay',
        delete: 'Delete',
      },
    },

  },
} as const;

/* -------------------------------------------------------------------------- */
/*                               Helper functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Textos del dominio Register.
 */
export function getRegisterTexts(lang: Language) {
  return translations[lang].register;
}

/**
 * Textos de errores de validación.
 */
export function getErrorTexts(lang: Language) {
  return translations[lang].errors;
}

/**
 * Textos de autenticación.
 */
export function getAuthTexts(lang: Language) {
  return translations[lang].auth;
}


/**
 * Textos de configuración.
 */

export function getConfigTexts(lang: Language) {
  return translations[lang].config;
}


/**
 *  Textos de deudas.
 */

export function getDebtsTexts(lang: Language) {
  return translations[lang].debts;
}
