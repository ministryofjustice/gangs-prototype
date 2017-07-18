#!/bin/bash

function usage() {
  echo <<ENDOFUSAGE
$0

Popuates a collection in Amazon Rekognition with all the mugshots

Requires:

env vars:
  AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
  AWS_REGION
  S3_SOURCE_BUCKET_NAME
  REKOGNITION_COLLECTION_ID

ENDOFUSAGE
}

function consolidate_dirs {
  dir_name=$1
  echo "dir_name=${dir_name}"
  mkdir -p "/tmp/mugshots/${dir_name}"
  echo "cp  ./app/assets/images/mugshots/${dir_name}/* /tmp/mugshots/${dir_name}"
  cp  ./app/assets/images/mugshots/${dir_name}/* /tmp/mugshots/${dir_name}/

  for FILENAME in `ls /tmp/mugshots/${dir_name}/`; 
  do
    echo "FILENAME=${FILENAME}" 
    mv "/tmp/mugshots/${dir_name}/$FILENAME" "/tmp/mugshots/${dir_name}-$FILENAME"
  done 
  rmdir /tmp/mugshots/${dir_name}
}

mkdir -p /tmp/mugshots
consolidate_dirs 'male'
consolidate_dirs 'female'

aws s3 sync /tmp/mugshots "s3://${S3_SOURCE_BUCKET_NAME}/mugshots" --region=${AWS_REGION}


MUGSHOTS=`ls /tmp/mugshots`

# upload to S3
#echo "syncing `pwd` to s3://${S3_SOURCE_BUCKET_NAME} in ${AWS_REGION}"
#aws s3 sync . "s3://${S3_SOURCE_BUCKET_NAME}/mugshots" --region=${AWS_REGION}

for IMAGE_FILE in $MUGSHOTS;
do
  echo "indexing file ${IMAGE_FILE} in bucket ${S3_SOURCE_BUCKET_NAME}, region ${AWS_REGION}"
  # index the S3 object
  IMAGE_JSON="{\"S3Object\":{\"Bucket\":\"${S3_SOURCE_BUCKET_NAME}\",\"Name\":\"mugshots/${IMAGE_FILE}\"}}"
  aws rekognition index-faces \
    --image "${IMAGE_JSON}" \
    --collection-id="${REKOGNITION_COLLECTION_ID}" \
    --region="${AWS_REGION}" \
    --external-image-id="${IMAGE_FILE//\//:}"
done



