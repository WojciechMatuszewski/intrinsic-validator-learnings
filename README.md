# Learning about CDK Intrinsic Validator

## Usage

1. `npm run bootstrap`

2. Go to `stack.ts` and uncomment the construct you want

3. `npm run deploy`

4. Populate the APIGW URL inside the `script.ts`

5. Change something in the function

6. `npm run deploy`

7. While the deployment is running `npm run request`

## Learnings / thoughts

- Seems to be a concatenation of different techniques to validate your deployments?

- Runs on the step machine?

  - There is a custom resource which uses `onCompleteHandler` to check if the SFN finished. If the SFN failed, the `onCompleteHandler` returns an error

        - An alternative to creating a custom resource with a randomized (per deploy) `resourceId` would be to use the [triggers package](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.triggers-readme.html).

        - Looking at GH, it does not seem like the package is ready for prime time(?). There are couple of TODOs in the source code.

    - The SFN runs multiple "checks" in parallel. If one of those check fail, the deployment will not succeed.

- The "validation" could be pretty much anything, raging from invoking a lambda function or watching an alarm.

- How does this compares with the AWS Lambda deployment group traffic shifting?

  - I guess this one is more versatile? Since you can work with containers, other alarms and such.

  - You can use the CodeDeploy service to create canary deployments of Lambda Functions, ECS tasks and EC2 deployments.

  - It **would be neat if CodeDeploy would allow you change the bake-period in a fine-grained way**. There are presets, but you might find them a bit constrained.

    - The ability to have a **fine-grained control** over the bake period is definitely and **advantage of the _intrinsic validator_**.

- The CodeDeploy deployment group will not do a blue/green on initial deploy as it has no alias to fall back to.

  - It is quite nice that one can use CodeDeploy without any other CodeXX services. When you think about it, CodeDeploy makes quite complex thing rather easy.

- The drawback of adding any kind of validator to your deployment step is additional time it takes for the validation to finish. Your API might deploy in minutes instead of seconds.

  - It takes some time for CW to populate the error metrics, but if you set the period to `1 minute` it seems to be fine.
    Keep in mind that you are paying for the existence of an alarm.

- It is nice that the CDK automatically bumps the AWS Lambda versions for you.

- The _intrinsic validator_ deploys a lot of resources. That is the price you pay for the ability to run validations on virtually any resource.

- One **key difference between the CodeDeploy and the intrinsic validator** is the fact that **in the case of CodeDeploy, the check happens AFTER the stack is deployed**. This is neat because you get all the outputs from the CFN.

  - The **intrinsic validator is a DEPLOYMENT-time check**. This should save you a little bit of time during rollback, but you will not be able to see CFN outputs for resources during the validation (unless you did not create a new resource).
