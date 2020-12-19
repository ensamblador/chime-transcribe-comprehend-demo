export DEPLOY_BUCKET=chime-transcribe-translate-comprehen-deployment-2
export PROFILE=<your aws local profile>
export STACK_NAME=chime-intelligent-meeting-backend
export REGION=us-west-2

aws s3 mb s3://$DEPLOY_BUCKET --region $REGION --profile $PROFILE
sam deploy --stack-name $STACK_NAME --s3-bucket $DEPLOY_BUCKET --capabilities CAPABILITY_IAM --region $REGION --profile $PROFILE
aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`ApiURL`].OutputValue' --output text --profile $PROFILE | read APIURL
echo "export const CHIME_BACKEND='$APIURL'" > ./src/chime-api-url.js
cat ./src/chime-api-url.js