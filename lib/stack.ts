import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UsingCodeDeploy } from "./recreation-native-stack";
import { UsingIntrinsicValidator } from "./recreation-validator-stack";

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Toggle between the two
     */
    new UsingIntrinsicValidator(this, "ValidatorStack");
    // new UsingCodeDeploy(this, "CodeDeployStack");
  }
}
