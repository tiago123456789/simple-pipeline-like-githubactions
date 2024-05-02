provider "google" {
  credentials = file("../credential.json")
  project     = "remember-me-my-bills"
  region      = "us-east4"
}

variable "job_name" {
  type        = string
  description = "The job name"
}

variable "params_data" {
  type        = string
  description = "The params data set for job"
}

variable "pub_sub_topic_log" {
  type = string
  description = "The name of topic where will send output logs"
}

resource "google_cloud_run_v2_job" "template_create_cloud_run_job" {
  name     = var.job_name
  location = "us-central1"

  template {
    task_count  = 1
    parallelism = 1

    template {
      max_retries = 0
      timeout     = "300s"

      containers {
        image = "us-east4-docker.pkg.dev/remember-me-my-bills/poc-pipeline/runner:latest"

        resources {
          limits = {
            cpu    = "1"
            memory = "2048Mi"
          }
        }

        env {
          name  = "PARAMS_DATA"
          value = var.params_data
        }

        env {
          name  = "PUB_SUB_FILENAME"
          value = "credential.json"
        }

        env {
          name  = "PUB_SUB_TOPIC_LOG"
          value = var.pub_sub_topic_log
        }

      }
    }
  }

}





