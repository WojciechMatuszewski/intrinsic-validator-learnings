import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import {
  IntrinsicValidator,
  Validation
} from "@wheatstalk/cdk-intrinsic-validator";

export class UsingIntrinsicValidator extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new cdk.aws_lambda_nodejs.NodejsFunction(this, "handler", {
      entry: join(__dirname, "./handler.ts"),
      handler: "handler"
    });

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

    new IntrinsicValidator(this, "Validator", {
      validations: [
        Validation.monitorAlarm({
          alarm,
          duration: cdk.Duration.minutes(2)
        })
      ]
    });

    const api = new cdk.aws_apigateway.RestApi(this, "api");
    api.root.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(fn));

    new cdk.CfnOutput(this, "apiURL", {
      value: api.url
    });
  }
}
