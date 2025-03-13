## Terraform POC

To set environment variables, run the following command:

```bash
source set_environment.sh
```

Useful Terraform commands:

```bash
terraform init # to install providers
terraform plan # to see changes
terraform validate # to validate the file
terraform fmt # to format the file
terraform apply -auto-approve # to apply changes
terraform destroy -auto-aprove # to destroy changes
terraform state list # to list the resources
terraform show # to show the state
terraform output # to show the outputs
```
