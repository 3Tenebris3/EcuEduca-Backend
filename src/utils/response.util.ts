/**
 * Función para crear una respuesta estandarizada para la API.
 * La estructura devuelta es:
 * {
 *   "success": boolean,
 *   "code": number,
 *   "message": string,
 *   "data": any,
 *   "error": { "details": string }
 * }
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
