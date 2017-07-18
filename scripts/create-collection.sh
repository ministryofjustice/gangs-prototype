#!/bin/bash

function usage() {
  echo <<ENDOFUSAGE
$0

Creates a collection in Amazon Rekognition to index all the mugshots

Requires:

env vars:
  AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
  AWS_REGION
  REKOGNITION_COLLECTION_ID

ENDOFUSAGE
}

# delete any existing collection
echo "deleting any existing collection called ${REKOGNITION_COLLECTION_ID}"
aws rekognition delete-collection \
  --collection-id="${REKOGNITION_COLLECTION_ID}" \
  --region="${AWS_REGION}"

echo "creating a new collection called ${REKOGNITION_COLLECTION_ID}"
COLLECTION_ARN=`aws rekognition create-collection \
                                --collection-id="${REKOGNITION_COLLECTION_ID}" \
                                --region="${AWS_REGION}" \
                    | jq '.CollectionArn'`

echo "COLLECTION_ARN=${COLLECTION_ARN}"
