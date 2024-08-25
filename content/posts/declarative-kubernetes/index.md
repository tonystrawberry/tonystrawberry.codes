---
title: "Declarative Kubernetes"
description: "Declarative Kubernetes with YAML files"
date: 2024-04-15
draft: true
slug: declarative-kubernetes
tags:
  - Kubernetes
---

## `kubectl apply`

- Create or update resources in a file

```bash
(base) 🐉 >kubectl apply -f filename.yml
```

- Create or update a whole directory of YAML

```bash
(base) 🐉 >kubectl apply -f directory/
```

- Create or update from a URL

```bash
(base) 🐉 >kubectl apply -f https://example.com/filename.yaml
```

## Kubenetes Configuration YAML

- one manifest for a pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

- one manifest for a deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.17.3
        ports:
        - containerPort: 80
```

- 2 manifests in one file

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-nginx-service
spec:
  type: NodePort
  ports:
  - port: 80
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-nginx
  template:
    metadata:
      labels:
        app: app-nginx
    spec:
      containers:
      - name: app-nginx
        image: nginx:1.17.3
        ports:
        - containerPort: 80
  ...
```
