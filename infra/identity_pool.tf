terraform {
  required_version = ">= 1.11.0"
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_cognito_identity_pool" "identity_pool_with_guest_access" {
  identity_pool_name               = "IdentityPoolWithGuestAccess"
  allow_unauthenticated_identities = true
}

# Create an IAM role for unauthenticated users
resource "aws_iam_role" "unauthenticated" {
  name = "Cognito_MyIdentityPoolUnauth_Role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool_with_guest_access.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })
}

# Create an IAM policy for AWS Transcribe access
resource "aws_iam_policy" "transcribe_access" {
  name        = "TranscribeAccessPolicy"
  description = "Policy for accessing AWS Transcribe service"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "transcribe:StartStreamTranscription",
          "transcribe:StartStreamTranscriptionWebSocket"
        ]
        Resource = "*"
      }
    ]
  })
}

# Attach the Transcribe policy to the unauthenticated role
resource "aws_iam_role_policy_attachment" "transcribe_policy_attachment" {
  role       = aws_iam_role.unauthenticated.name
  policy_arn = aws_iam_policy.transcribe_access.arn
}

# Attach the unauthenticated IAM role to the Cognito Identity Pool
resource "aws_cognito_identity_pool_roles_attachment" "role_attachment" {
  identity_pool_id = aws_cognito_identity_pool.identity_pool_with_guest_access.id

  roles = {
    "unauthenticated" = aws_iam_role.unauthenticated.arn
  }
}
