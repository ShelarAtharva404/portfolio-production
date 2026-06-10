resource "aws_ecr_repository" "frontend" {
  name                 = "portfolio-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_ecr_repository" "backend" {
  name                 = "portfolio-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = {
    Environment = var.environment
  }
}
