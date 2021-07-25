
/**
 * getString tries to obtain an environment variable and if not, returns
 * a default value
 * @param variable key of environment variable 
 * @param defaultValue placeholder if not present
 * @returns environment variable result or default value
 */
// @ts-ignore
export const getString = (variable?: string, defaultValue: string) : string => process.env[variable] !== undefined ? process.env[variable] : defaultValue