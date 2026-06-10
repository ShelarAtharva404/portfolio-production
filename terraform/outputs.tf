output "vpc_id" {
  description = "The ID of the custom VPC"
  value       = aws_vpc.eks_vpc.id
}

output "eks_cluster_name" {
  description = "The name of the EKS Cluster"
  value       = aws_eks_cluster.eks_cluster.name
}

output "eks_cluster_endpoint" {
  description = "The endpoint URL for the EKS Cluster API server"
  value       = aws_eks_cluster.eks_cluster.endpoint
}

output "ecr_repository_frontend_url" {
  description = "The repository URL of the frontend ECR registry"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_repository_backend_url" {
  description = "The repository URL of the backend ECR registry"
  value       = aws_ecr_repository.backend.repository_url
}
