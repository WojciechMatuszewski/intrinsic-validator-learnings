import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";

export class UsingCodeDeploy extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new cdk.aws_lambda_nodejs.NodejsFunction(this, "handler", {
      entry: join(__dirname, "./handler.ts"),
      handler: "handler"
    });
    const fnAlias = new cdk.aws_lambda.Alias(this, "handlerAlias", {
      aliasName: "stage",
      version: fn.currentVersion
    });

    const api = new cdk.aws_apigateway.RestApi(this, "api");
    api.root.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(fn));

    const alarm = new cdk.aws_cloudwatch.Alarm(this, "alarm", {
      alarmDescription: "The latest deployment errors > 0",
      metric: new cdk.aws_cloudwatch.Metric({
        metricName: "Errors",
        namespace: "AWS/Lambda",
        statistic: "sum",
        period: cdk.Duration.minutes(1),
        dimensionsMap: {
          FunctionName: fn.functionName
        }
      }),
      threshold: 1,
      evaluationPeriods: 1
    });

    new cdk.aws_codedeploy.LambdaDeploymentGroup(this, "canaryDeployment", {
      alarms: [alarm],
      alias: fnAlias,
      deploymentConfig:
        cdk.aws_codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE
    });

    new cdk.CfnOutput(this, "apiURL", {
      value: api.url
    });
  }
}
