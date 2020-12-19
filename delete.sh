aws cloudformation delete-stack --stack-name $STACK_NAME --profile $PROFILE --region $REGION
aws s3 rb --force --profile $PROFILE s3://$DEPLOY_BUCKET 
aws s3 ls --profile $PROFILE --region $REGION | grep transcribeviewer 
