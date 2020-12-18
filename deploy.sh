export DEPLOY_BUCKET = 'chime-transcribe-comprehend-deployment'
export PROFILE = ''
export STACK_NAME = 'chime-intelligent-meeting-backend'
export REGION = 'us-east-1'

aws s3 mb s3://chime-bucket-enrique --profile $PROFILE
sam deploy --stack-name $STACK_NAME --s3-bucket $DEPLOY_BUCKET --capabilities CAPABILITY_IAM --region $REGION --profile $PROFILE
#aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`ApiURL`].OutputValue' --output text --profile $PROFILE | read APIURL