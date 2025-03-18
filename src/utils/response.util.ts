/**
 * 
 * @param success boolean
 * @param code number
 * @param message string
 * @param data any
 * @param error object { details: string }
 * @returns 
 */
export function createResponse(
  success: boolean,
  code: number,
  message: string,
  data: any = null,
  error: { details: string } | null = null
) {
  return {
    success,
    code,
    message,
    data,
    error
  };
}
