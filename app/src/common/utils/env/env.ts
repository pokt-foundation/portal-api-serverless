/**
 * getString tries to obtain an environment variable and if not, returns
 * a default value
 * @param variable key of environment variable
 * @param defaultValue placeholder if not present
 * @returns environment variable result or default value
 */
export const getString = (variable: string | undefined, defaultValue: string): string => {
  if (!variable) {
    return defaultValue
  }

  const value = process.env[variable]
  if (value) {
    return value
  }

  return defaultValue
}
