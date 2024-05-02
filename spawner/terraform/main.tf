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
      timeout     = "60s"

      containers {
        image = "us-east4-docker.pkg.dev/remember-me-my-bills/poc-pipeline/runner:latest"

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

# variable "push_endpoint" {
#   type        = string
#   description = "The url to send event of pub/sub"
# }

# resource "google_pubsub_topic" "start_pipeline" {
#   name = "start_pipeline"
# }

# resource "google_pubsub_subscription" "main_subscription" {
#   name  = "main-subscription"
#   topic = google_pubsub_topic.start_pipeline.name

#   push_config {
#     push_endpoint = "${var.push_endpoint}/execute"
#   }
# }




