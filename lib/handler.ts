import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async event => {
  const shouldFailParam = event.queryStringParameters?.["fail"];
  if (shouldFailParam === "true") {
    throw new Error("Boom");
  }

  return {
    statusCode: 200,
    body: "It works"
  };
};
