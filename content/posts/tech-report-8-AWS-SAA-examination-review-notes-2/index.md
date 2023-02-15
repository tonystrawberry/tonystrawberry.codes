---
title: "Tech report #7 🔖 AWS Solutions Artchitect - Review notes for my upcoming examination"
description: Just some review notes that will help me pass the AWS SAA certification
date: 2023-01-22
draft: false
slug: tech-report-7-aws-solutions-architect-review-notes-ec2-ebs-db
tags:
  - AWS
  - EC2
  - RDS
  - DynamoDB
  - Database
  - EBS
  - Certification
---

I will pass my second AWS certification (Solutions Architect Associate) very soon and compiled some important notes for the EC2, EBS and database services.

# 3 - EC2

EC2 is like a VM, hosted in AWS instead of your own data center.

## Pricing options

- On-Demand: pay by the hour or the second.
- Spot: purchase unused capacity at a discount of up to 90%.
- Reserved: reserve capacity for 1 or 3 years.
- Dedicated: get a physical EC2 server dedicated for your use.

## Using roles

- Roles are preferred from a security perspective.
- Avoid hard coding your credentials. Use roles instead.
- Policies control a role’s permission. Attach policies to roles.
- Roles can be attached and detached from EC2 without having to stop or terminate the instances.

## Security groups

- Changes to SG take effect immediately.
- You can have any number of EC2 instances within a SG.
- You can have multiple SG attached to EC2 instances (maximum 5 per network interface by default).
- Inbound traffic is blocked and outbound is allowed by default.

## Networking devices with EC2

- ENI
    - For basic networking. Separate several networks by using multiple ENIs for each network.
- EFA
    - For High Performance Computing (HPC) and machine learning applications.
- Enhanced Networking
    - Speed between 10 Gbps and 100 Gbps. When you need reliable and high throughput.

## Placement groups

- Cluster placement groups
    - Low network latency, high network throughput.
- Spread placement groups
    - Individual critical EC2 instances.
- Partition placement groups
    - Multiple EC2 Instances. HDFS, HBase and Cassandra.

## Good to remember

- Bootstrap scripts are scripts that run when the instances first run. Can be used to install applications (like web servers and databases) as well as do updates and more.
- User data is simply the bootstrap script.
- Metadata is data about your instance.
- A cluster placement group cannot span multiple AZ, whereas spread placement groups and partition placement groups can.
- You cannnot merge placement groups.
- You can move an existing instance into a placement group. EC2 must be in stopped state.
- You can deploy vCenter on the AWS Cloud using VMware.
- Extend AWS to your data center using AWS Outposts (rack for large deployments, servers for smaller deployments).

# 4 - EBS

## SSD Volumes

- gp2: general purpose.
- gp3: general purpose and next generation.
- io1: faster.
- io2: most expensive and next generation.

## HDD Voluments

- st1: throughput optimized HDD. Cannot be a boot volume.
- sc1: cold HDD. Lowest cost. Cannot be a boot volume. Less frequently accessed data.

## EBS Volumes and Snapshots

- Volumes exist on EBS and snapshots exist on S3.
- Snapshots are point-in-time photographs of volumes and are incremental in nature.
- First snapshot will take some time to create.
- Snapshots are shareable between AWS accounts, between regions. But necessary to copy that snapshot to the target region.
- EBS Volumes resizable on the fly.

## AMIs: EBS vs. Instance Store

- Instance store volumes are ephemeral.
- Instance store volumes cannot be stopped. It the host fails, data is lost. EBS volumes can.
- You can reboot on both EBS and instance store volumes and data won’t be lost.
- By default, volumes are deleted on termination. However, with EBS volumes only, you can keep the root device volumne.

## Encrypted volumes

- Data at rest is encrypted.
- Data in flight also encrypted.
- All snapshots encrypted.
- All volumes created from the snapshot are encrypted.
- To encrypt volumes:
    - Create snapshot.
    - Create a copy of the snapshot and select the encrypt option.
    - Create an AMI from the encrypted snapshot.
    - Use that AMI to launch new encrypted instances.


## EBS hibernation

- Preserved the in-memory RAM on persistent storage (EBS).
- Fast to boot up.
- Instance RAM must be less than 150 GB.
- Supported instance families: C, M and R.
- Available for Windows, Amazon Linus 2 AMI and Ubuntu.
- Hibernation limit: 60 days.
- Available for On-Demand and Reserved instances.

## EFS

- NFSv4 protocol.
- Support thousands of concurrent NFS connections.
- Only pay for the storage.
- Data is stored across multiple AZs.
- Can scale up to PB.
- Read-after-write consistency.

## EFS or FSx for Windows or FSx for Lustre

- EFS: Linux. Distributed and highly resilient storage for Linux.
- FSx for Windows: Windows.
- FSx for Lustre: High-speed and high capacity distributed storage. High Performance Computing (HPC), financial modeling… Can store data on S3 directly.

## AWS Backup

- Consolidation: Use it to back up AWS services such as EC2, EBS, EFS…
- Use it with AWS Organizations to back up across multiple accounts.
- Centralized control and let you automate your backups and define lifecycle policies. Better compliance with backup policies enforcement, encryption check and audit.

# 5 - RDS

## Good to remember

- Database types
    - SQL Server
    - Oracle
    - MySQL
    - PostgreSQL
    - MariaDB
    - Aurora
- Good for processing lots of small transactions.
- For analyzing big amounts of data, reporting and OLAP tasks, use Redshift instead.

## Read replicas

- Same AZ to cross-region.
- For scaling and not disaster recovery.
- Automatic backups must be enabled in order to deploy a read replica.
- Up to 5 read replicas.

## Multi-AZ

- Copy in another AZ.
- For disaster recovery.
- In the case of a failure, automatic failover to standby instance.

## Aurora

- Very redundant. 2 copies are contained in each AZ with a minimum of 3 AZ.
- Snapshots shareable with other AWS accounts.
- Aurora replicas, MySQL replicas, PostgreSQL replicas. Automated failover is available for Aurora replicas only.
- Automated backups on by default.

## Aurora Serverless

- Simple.
- Cost-effective.
- Infrequence, intermittent or unpredictable workloads.

## DynamoDB

- SSD storage.
- Spread across 3 data centers.
- Event consistent reads by default but strongly consistent reads.
- Transactions:
    - Multiple “all-or-nothing” operations (financial transactions, orders…).
    - 3 options for read: eventual consistency, strong consistency and transactional.
    - 2 options for writes: standard and transactional.
    - Up to 25 items or 4 MB of data.
    - ACID transactions.

## DynamoDB On-Demand Backup and restore

- Full backups at any time.
- Zero impact on table performance or availability.
- Consistent within seconds and retained until deleted.
- Operates within same region as the source table.
- Point-in-Time recovery to any point in the last 35 days. Not enabled by default.

## DynamoDB streams

- Time-ordered sequence of item-level changes in a table.
- Inserts, updates and deletes
- Stored for 24 hours.
- Combine with Lambda functions for functionality like stored procedures.
- Managed Multi-Master, Multi-Region Replication for global distributed applications and higher availability.

## DocumentDB

- For MongoDB. Document based database.

## Keyspaces

- For Cassandra. NoSQL distributed database.

## Neptune

- For graph databases.

## Quantum Ledger Database

- For immutable databases (similar to the cryptocurrency way of storing data and transactions).

## Timestream

- For time-series data for analysis.
