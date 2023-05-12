# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run cdk -- deploy -c notification_email="<your-mail-address>" -c log_group_name="<your-log-group>"` deploy this stack to your default AWS account/region
- `npm run cdk -- diff -c notification_email="<your-mail-address>" -c log_group_name="<your-log-group>"` compare deployed stack with current state
- `npm run cdk -- synth -c notification_email="<your-mail-address>" -c log_group_name="<your-log-group>"` emits the synthesized CloudFormation template
