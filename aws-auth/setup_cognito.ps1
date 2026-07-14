$ErrorActionPreference = "Stop"

# Optional helper only. The active CopilotKit UI should use this bearer-token
# path only when the AgentCore AG-UI runtime is configured for OAuth/Cognito.

$Region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$Username = if ($env:COGNITO_TEST_USERNAME) { $env:COGNITO_TEST_USERNAME } else { "testuser" }
$Password = if ($env:COGNITO_TEST_PASSWORD) { $env:COGNITO_TEST_PASSWORD } else { "Password123!" }
$PoolName = if ($env:COGNITO_POOL_NAME) { $env:COGNITO_POOL_NAME } else { "MyUserPool" }
$ClientName = if ($env:COGNITO_CLIENT_NAME) { $env:COGNITO_CLIENT_NAME } else { "MyClient" }
$PoliciesFile = Join-Path $env:TEMP "cognito-password-policy.json"

@"
{"PasswordPolicy":{"MinimumLength":8}}
"@ | Set-Content -LiteralPath $PoliciesFile -NoNewline -Encoding ascii

$PoolId = aws cognito-idp create-user-pool `
  --pool-name $PoolName `
  --policies "file://$PoliciesFile" `
  --region $Region `
  --query 'UserPool.Id' `
  --output text

if (-not $PoolId -or $PoolId -eq "None") {
  throw "Failed to create Cognito user pool."
}

$ClientId = aws cognito-idp create-user-pool-client `
  --user-pool-id $PoolId `
  --client-name $ClientName `
  --no-generate-secret `
  --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" `
  --region $Region `
  --query 'UserPoolClient.ClientId' `
  --output text

if (-not $ClientId -or $ClientId -eq "None") {
  throw "Failed to create Cognito app client."
}

aws cognito-idp admin-create-user `
  --user-pool-id $PoolId `
  --username $Username `
  --temporary-password $Password `
  --region $Region `
  --message-action SUPPRESS | Out-Null

aws cognito-idp admin-set-user-password `
  --user-pool-id $PoolId `
  --username $Username `
  --password $Password `
  --region $Region `
  --permanent | Out-Null

$BearerToken = aws cognito-idp initiate-auth `
  --client-id $ClientId `
  --auth-flow USER_PASSWORD_AUTH `
  --auth-parameters "USERNAME=$Username,PASSWORD=$Password" `
  --region $Region `
  --query 'AuthenticationResult.AccessToken' `
  --output text

if (-not $BearerToken -or $BearerToken -eq "None") {
  throw "Failed to authenticate Cognito test user."
}

$DiscoveryUrl = "https://cognito-idp.$Region.amazonaws.com/$PoolId/.well-known/openid-configuration"

Write-Host "Pool id: $PoolId"
Write-Host "Discovery URL: $DiscoveryUrl"
Write-Host "Client ID: $ClientId"
Write-Host "Bearer Token: $BearerToken"
Write-Host ""
Write-Host "For copilotkit-ui/.env.local:"
Write-Host "AGENTCORE_BEARER_TOKEN=$BearerToken"
