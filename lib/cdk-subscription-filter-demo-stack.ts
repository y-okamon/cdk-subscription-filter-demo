import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, SubscriptionFilter, FilterPattern } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as path from "path";

export class CdkSubscriptionFilterDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // SNS topic and subscription
    const notificationTopicSNS = new Topic(this, 'notification-topic');
    notificationTopicSNS.addSubscription(new EmailSubscription(this.node.tryGetContext('notification_email')));

    // Lambda function
    const logProcessingFunction = new Function(this, 'LogProcessingLambda', {
      code: Code.fromAsset(path.join(__dirname, '../lambda')),
      runtime: Runtime.PYTHON_3_9,
      handler: 'index.handler',
      memorySize: 128,
      timeout: Duration.seconds(3),
      environment: {
        NOTIFICATION_SNS_TOPIC_ARN: notificationTopicSNS.topicArn
      }
    });
    logProcessingFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['sns:Publish'],
        resources: [notificationTopicSNS.topicArn]
      })
    );

    // LogGroup
    const logGroup = LogGroup.fromLogGroupName(this, 'SubscriptionFilterLogGroup', this.node.tryGetContext('log_group_name'));

    // SubscriptionFilter
    new SubscriptionFilter(this, 'LogSubscriptionFilter', {
      logGroup,
      destination: new LambdaDestination(logProcessingFunction),
      filterPattern: FilterPattern.anyTerm('Start', 'START', 'start')
    });
   }
}
