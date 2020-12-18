aws cloudformation delete-stack --stack-name $STACK_NAME --profile $PROFILE --region $REGION
aws s3 rb --force s3://$DEPLOY_BUCKET
