provider "google" {
  credentials = file("../../credential.json")
  project     = "remember-me-my-bills"
  region      = "us-east4"
}

variable "DB_URL" {
  type        = string
  description = "The database url"
}

resource "google_pubsub_topic" "start_pipeline" {
  name = "start_pipeline"
}

resource "google_pubsub_subscription" "main_subscription" {
  name                 = "main-subscription"
  topic                = google_pubsub_topic.start_pipeline.name
  ack_deadline_seconds = 600


  push_config {
    push_endpoint = "${google_cloud_run_service.spawner.status[0].url}/spawn-jobs"
  }
}

resource "google_pubsub_topic" "logs" {
  name = "logs"
}

resource "google_pubsub_subscription" "logs_main_subscription" {
  name                 = "logs_main-subscription"
  topic                = google_pubsub_topic.logs.name
  ack_deadline_seconds = 600
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "api_noauth" {
  location    = google_cloud_run_service.api.location
  project     = google_cloud_run_service.api.project
  service     = google_cloud_run_service.api.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_service" "api" {
  name     = "api"
  location = "us-central1"

  template {
    spec {
      container_concurrency = 10
      
      containers {
        ports {
          container_port = 3000
        }

        image = "us-east4-docker.pkg.dev/remember-me-my-bills/poc-pipeline/api:latest"

        env {
          name  = "DB_URL"
          value = var.DB_URL
        }

        env {
          name  = "PUB_SUB_FILENAME"
          value = "credential.json"
        }

        env {
          name  = "PUB_SUB_TOPIC_START_PIPELINE"
          value = google_pubsub_topic.start_pipeline.name
        }

      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_policy" "spawner_noauth" {
  location    = google_cloud_run_service.spawner.location
  project     = google_cloud_run_service.spawner.project
  service     = google_cloud_run_service.spawner.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_service" "spawner" {
  name     = "spawner"
  location = "us-central1"

  template {
    spec {
      container_concurrency = 1
      
      containers {
        ports {
          container_port = 6000
        }

        image = "us-east4-docker.pkg.dev/remember-me-my-bills/poc-pipeline/spawner:latest"

        env {
          name  = "PROJECT_ID"
          value = "remember-me-my-bills"
        }

        env {
          name  = "REGION"
          value = "us-central1"
        }

        env {
          name  = "PUB_SUB_FILENAME"
          value = "credential.json"
        }

        env {
          name  = "PUB_SUB_TOPIC_LOG"
          value = google_pubsub_topic.logs.name
        }

      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}



