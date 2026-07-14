#!/bin/bash
set -euo pipefail

# Optional helper only. The active CopilotKit UI currently uses IAM/SigV4
# because Cognito setup was not reliable in this workspace. Do not set
# AGENTCORE_BEARER_TOKEN unless the AgentCore runtime is configured for
# OAuth/Cognito auth.

REGION="${AWS_REGION:-us-east-1}"
USERNAME="${COGNITO_TEST_USERNAME:-testuser}"
PASSWORD="${COGNITO_TEST_PASSWORD:-Password123!}"

# Create User Pool and capture Pool ID directly
export POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "MyUserPool" \
  --policies '{"PasswordPolicy":{"MinimumLength":8}}' \
  --region "$REGION" \
  --query 'UserPool.Id' \
  --output text)

# Create App Client and capture Client ID directly
export CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id $POOL_ID \
  --client-name "MyClient" \
  --no-generate-secret \
  --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" \
  --region "$REGION" \
  --query 'UserPoolClient.ClientId' \
  --output text)

# Create User
aws cognito-idp admin-create-user \
  --user-pool-id $POOL_ID \
  --username "$USERNAME" \
  --temporary-password "$PASSWORD" \
  --region "$REGION" \
  --message-action SUPPRESS > /dev/null

# Set Permanent Password
aws cognito-idp admin-set-user-password \
  --user-pool-id $POOL_ID \
  --username "$USERNAME" \
  --password "$PASSWORD" \
  --region "$REGION" \
  --permanent > /dev/null

# Authenticate User and capture Access Token
export BEARER_TOKEN=$(aws cognito-idp initiate-auth \
  --client-id "$CLIENT_ID" \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME="$USERNAME",PASSWORD="$PASSWORD" \
  --region "$REGION" \
  --query 'AuthenticationResult.AccessToken' \
  --output text)

# Output the required values
echo "Pool id: $POOL_ID"
echo "Discovery URL: https://cognito-idp.$REGION.amazonaws.com/$POOL_ID/.well-known/openid-configuration"
echo "Client ID: $CLIENT_ID"
echo "Bearer Token: $BEARER_TOKEN"
