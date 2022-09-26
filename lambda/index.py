import base64
import json
import gzip
import os
import boto3

sns = boto3.client('sns')

def handler(event, context):
    data = gzip.decompress(base64.b64decode(event['awslogs']['data']))
    data_json = json.loads(data)

    for log in data_json['logEvents']:
        sns_request_data = {
            "TopicArn": os.environ['NOTIFICATION_SNS_TOPIC_ARN'],
            "Subject": 'AWS_SUBSCRIPTION_FILTER_NOTIFICATION',
            "Message": log['message']
        }
        print(sns_request_data)
        sns.publish(**sns_request_data)
