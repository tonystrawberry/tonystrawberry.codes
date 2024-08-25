---
title: "Exposing Kubernetes Ports"
description: "Exposing Kubernetes ports to the outside world"
date: 2024-04-15
draft: true
slug: exposing-kubernetes-ports
tags:
  - Kubernetes
---

## Exposing containers

- `kubectl expose` creates a service for existing pods
- A **service** is a stable endpoint to access a set of pods
- If we want to connect to a pod, we need to create a service
- **CoreDNS** allows us to connect to a service by its name

## Basic service types
- **ClusterIP**:
 - Single, internal virtual IP allocated by Kubernetes
  - Only reachable from within the cluster
  - Pods can reach the service on apps port number
- **NodePort**:
  - High port allocated on each node
  - Port is open on every node's IP
  - Anyone can connect
- **LoadBalancer**:
  - External load balancer
  - NodePort and ClusterIP services are created automatically
  - Only works in cloud providers that support external load balancers (AWS ELB etc.)
- **ExternalName**:
  - Adds CNAME DNS record to CoreDNS only
  - Not used for pods but for giving pods a DNS to use for something outside Kubernetes

## Creating a ClusterIP service

```bash
(base) 🐉 >kubectl create deployment httpenv --image=bretfisher/httpenv
deployment.apps/httpenv created

(base) 🐉 >kubectl scale deployment/httpenv --replicas 5
deployment.apps/httpenv scaled

(base) 🐉 >kubectl expose deployment/httpenv --port 8888
service/httpenv exposed

(base) 🐉 >kubectl get service
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes   ClusterIP   10.43.0.1       <none>        443/TCP    165d
httpenv      ClusterIP   10.43.122.130   <none>        8888/TCP   28s

(base) 🐉 >kubectl run tmp-shell --rm -it --image bretfisher/netshoot -- bash
tmp-shell:~# curl httpenv:8888
{"HOME":"/root","HOSTNAME":"httpenv-8576b5547f-cctr7","KUBERNETES_PORT":"tcp://10.43.0.1:443","KUBERNETES_PORT_443_TCP":"tcp://10.43.0.1:443","KUBERNETES_PORT_443_TCP_ADDR":"10.43.0.1","KUBERNETES_PORT_443_TCP_PORT":"443","KUBERNETES_PORT_443_TCP_PROTO":"tcp","KUBERNETES_SERVICE_HOST":"10.43.0.1","KUBERNETES_SERVICE_PORT":"443","KUBERNETES_SERVICE_PORT_HTTPS":"443","PATH":"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"}tmp-shell:~#
```

## Creating a NodePort and LoadBalancer service

```bash
(base) 🐉 >kubectl expose deployment/httpenv --port 8888 --name httpenv-np --type NodePort
service/httpenv-np exposed

(base) 🐉 >kubectl get services
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.43.0.1       <none>        443/TCP          165d
httpenv      ClusterIP   10.43.122.130   <none>        8888/TCP         7m38s
httpenv-np   NodePort    10.43.201.185   <none>        8888:31457/TCP   49s

(base) 🐉 >curl localhost:31457
{"HOME":"/root","HOSTNAME":"httpenv-8576b5547f-69vcp","KUBERNETES_PORT":"tcp://10.43.0.1:443","KUBERNETES_PORT_443_TCP":"tcp://10.43.0.1:443","KUBERNETES_PORT_443_TCP_ADDR":"10.43.0.1","KUBERNETES_PORT_443_TCP_PORT":"443","KUBERNETES_PORT_443_TCP_PROTO":"tcp","KUBERNETES_SERVICE_HOST":"10.43.0.1","KUBERNETES_SERVICE_PORT":"443","KUBERNETES_SERVICE_PORT_HTTPS":"443","PATH":"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"}

(base) 🐉 >kubectl expose deployment/httpenv --port 8888 --name httpenv-lb --type LoadBalancer
service/httpenv-lb exposed

(base) 🐉 >kubectl get services
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)          AGE
kubernetes   ClusterIP      10.43.0.1       <none>         443/TCP          165d
httpenv      ClusterIP      10.43.122.130   <none>         8888/TCP         12m
httpenv-np   NodePort       10.43.201.185   <none>         8888:31457/TCP   5m21s
httpenv-lb   LoadBalancer   10.43.17.31     192.168.5.15   8888:30870/TCP   9s

(base) 🐉 >curl localhost:8888
{"HOME":"/root","HOSTNAME":"httpenv-8576b5547f-c2lth","KUBERNETES_PORT":"tcp://10.43.0.1:443","KUBERNETES_PORT_443_TCP":"tcp://10.43.0.1:443","KUBERNETES_PORT_443_TCP_ADDR":"10.43.0.1","KUBERNETES_PORT_443_TCP_PORT":"443","KUBERNETES_PORT_443_TCP_PROTO":"tcp","KUBERNETES_SERVICE_HOST":"10.43.0.1","KUBERNETES_SERVICE_PORT":"443","KUBERNETES_SERVICE_PORT_HTTPS":"443","PATH":"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"}
```
