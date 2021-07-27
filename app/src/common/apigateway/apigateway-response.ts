import HttpStatusCode from "../utils/http-status-code";
export interface ApiGatewayResponse {
  statusCode: number;
  body?: string;
}

/**
 * Creates a new JSON response given a serializable value
 * @param statusCode http status code
 * @param value json-serializable object
 * @returns ApiGatewayResponse
 */
export const newJSONResponse = (
  statusCode: HttpStatusCode,
  value: object
): ApiGatewayResponse => {
  return {
    statusCode,
    body: JSON.stringify(value),
  };
};

/**
 * Provides a convenient wrapper to send error messages
 * @param statusCode http status code
 * @param message error message to display
 * @returns ApiGatewayResponse
 */
export const newErrorResponse = (
  statusCode: HttpStatusCode,
  message: string
): ApiGatewayResponse => {
  return newJSONResponse(statusCode, {message});
};
