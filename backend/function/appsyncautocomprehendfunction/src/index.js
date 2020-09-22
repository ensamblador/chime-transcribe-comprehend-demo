/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiTranscribeviewerGraphQLAPIIdOutput = process.env.API_TRANSCRIBEVIEWER_GRAPHQLAPIIDOUTPUT
var apiTranscribeviewerGraphQLAPIEndpointOutput = process.env.API_TRANSCRIBEVIEWER_GRAPHQLAPIENDPOINTOUTPUT
var hostingS3AndCloudFrontHostingBucketName = process.env.HOSTING_S3ANDCLOUDFRONT_HOSTINGBUCKETNAME

Amplify Params - DO NOT EDIT */

/* import fetch from 'node-fetch'
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports' */
const https = require("https")
const AWS = require('aws-sdk')
const urlParse = require("url").URL

const appsyncUrl = process.env.API_TRANSCRIBEVIEWER_GRAPHQLAPIENDPOINTOUTPUT
const api_key = process.env.API_TRANSCRIBEVIEWER_GRAPHQLAPIKEYOUTPUT
const region = process.env.REGION

const endpoint = new urlParse(appsyncUrl).hostname.toString()



const { UpdateComment, ListMeetings } = require("./gql.js");
var comprehend = new AWS.Comprehend({ region: region });

const req = new AWS.HttpRequest(appsyncUrl, region);


exports.handler = (event) => {
    const insertedRecords = event.Records.filter(record => record.eventName === "INSERT")

    if (insertedRecords.length === 0) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'No documentos nuevos insertados.'
            })
        }
    }
    // Aca hay nuevos registros de insert

    const resultados = [];
    if (insertedRecords.length) {
        // TODO: foreach
        insertedRecords.forEach(async element => {
            // console.log(element.dynamodb.NewImage)

            var params = {
                LanguageCode: 'es',
                Text: element.dynamodb.NewImage.content.S
            };
            
            var keyphrases = await new Promise((resolve, reject) => {
                comprehend.detectKeyPhrases(params).promise().then(data => resolve(data)).catch(err => console.log(err))
            })

            var sentiment = await new Promise((resolve, reject) => {
                comprehend.detectSentiment(params).promise().then(data => resolve(data)).catch(err => console.log(err))
            })

            var entities = await new Promise((resolve, reject) => {
                comprehend.detectEntities(params).promise().then(data => resolve(data)).catch(err => console.log(err))
            })

            console.log('comprehend:', keyphrases, sentiment, entities)


            req.method = "POST"
            req.headers.host = endpoint
            req.headers['x-api-key'] = api_key
            req.headers["Content-Type"] = "application/json"


            let signer2 = new AWS.Signers.V4(req, "appsync", true);
            signer2.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())

            req.body = JSON.stringify({
                query: UpdateComment,
                operationName: "UpdateComment",
                variables: {
                    input: {
                        id: element.dynamodb.Keys.id.S,
                        entities: JSON.stringify(entities.Entities),
                        keyPhrases: JSON.stringify(keyphrases.KeyPhrases),
                        sentiment: sentiment.Sentiment
                    },
                },
            })
                
            console.log({
                        id: element.dynamodb.Keys.id.S,
                        entities: JSON.stringify(entities.Entities),
                        keyPhrases: JSON.stringify(keyphrases.KeyPhrases),
                        sentiment: sentiment.Sentiment
                    })
                
            const dataUpdatedComment = await new Promise((resolve, reject) => {
                const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
                    result.on("data", (data) => {
                        resolve(JSON.parse(data.toString()));
                    });
                });

                httpRequest.write(req.body);
                httpRequest.end();
            });

            console.log(JSON.stringify(dataUpdatedComment, null, 2));

        })

    }



    const response = {
        statusCode: 200,
        body: JSON.stringify('mensajes procesados'),
    }
    return response
}
