# AWS Infrastructure Sizing Plan for VPBank Collateral Website

## 1. Traffic & Load Analysis

### Year 1 Baseline
- **Total Users**: 20,000
- **Concurrent Users**: 20,000 (peak scenario)
- **Daily Active Users** (estimated): ~2,000-3,000 (10-15% of total)
- **Peak Hour Traffic**: ~800-1,000 concurrent users (realistic peak)

### Year 2 Growth (+30%)
- **Total Users**: 26,000
- **Concurrent Users**: 26,000 (peak scenario)
- **Daily Active Users**: ~2,600-3,900
- **Peak Hour Traffic**: ~1,040-1,300 concurrent users

### Request Pattern Estimation
- **Page Views per Session**: 5-8 pages
- **API Calls per Page**: 3-5 requests
- **Average Session Duration**: 5-10 minutes
- **Peak Requests per Second (RPS)**: ~100-150 RPS

## 2. AWS ECS Sizing (Frontend & Backend)

### Frontend Container (React App)
**Development/Staging Environment:**
- **Task Definition**: 0.5 vCPU, 1 GB RAM
- **Desired Tasks**: 1
- **Service Type**: Fargate

**Production Environment:**
- **Task Definition**: 1 vCPU, 2 GB RAM
- **Minimum Tasks**: 2 (for HA)
- **Maximum Tasks**: 4 (auto-scaling)
- **Target CPU Utilization**: 70%
- **Service Type**: Fargate

### Backend Container (Node.js/Express API)
**Development/Staging Environment:**
- **Task Definition**: 0.5 vCPU, 1 GB RAM
- **Desired Tasks**: 1
- **Service Type**: Fargate

**Production Environment:**
- **Task Definition**: 2 vCPU, 4 GB RAM
- **Minimum Tasks**: 2 (for HA)
- **Maximum Tasks**: 4 (auto-scaling)
- **Target CPU Utilization**: 60%
- **Service Type**: Fargate
- **Connection Pool**: 50-100 connections per instance

### Application Load Balancer (ALB)
- **Type**: Application Load Balancer
- **Availability Zones**: 2 (for HA)
- **Target Groups**: 2 (Frontend, Backend)
- **Health Check Interval**: 30 seconds
- **SSL/TLS**: AWS Certificate Manager

## 3. AWS RDS PostgreSQL Sizing

### Development/Staging Environment
- **Instance Class**: db.t3.micro (1 vCPU, 1 GB RAM)
- **Storage**: 20 GB GP3
- **IOPS**: 3000 (baseline)
- **Multi-AZ**: No
- **Backup Retention**: 7 days

### Production Environment
- **Instance Class**: db.t3.medium (2 vCPU, 4 GB RAM)
- **Storage**: 50 GB GP3 (with auto-scaling up to 100 GB)
- **IOPS**: 3000 (baseline)
- **Multi-AZ**: Yes (for HA)
- **Read Replicas**: No (can add later if needed)
- **Backup Retention**: 30 days
- **Automated Backups**: Daily
- **Performance Insights**: Enabled

### Database Specifications
- **Max Connections**: 100
- **Shared Buffers**: 1 GB (25% of RAM)
- **Effective Cache Size**: 3 GB (75% of RAM)
- **Work Memory**: 16 MB

## 4. AWS S3 Storage Sizing

### Initial Storage Requirements
- **Asset Images**: 6.9 GB (1,150 assets × 6 images × 1MB)
- **Thumbnails** (generated): ~1.5 GB (multiple sizes)
- **Total Initial**: ~8.5 GB

### Growth Projection
- **Year 1**: 15-20 GB (with new assets and versions)
- **Year 2**: 25-30 GB
- **Year 3**: 35-40 GB

### S3 Configuration
- **Bucket Structure**:
  ```
  vpbank-collateral-assets/
    ├── vehicles/
    │   ├── images/
    │   └── thumbnails/
    ├── real-estate/
    │   ├── images/
    │   └── thumbnails/
    └── documents/
  ```
- **Storage Class**: S3 Standard for frequently accessed images
- **Lifecycle Policy**: 
  - Move to S3-IA after 90 days for archived assets
  - Delete incomplete multipart uploads after 7 days
- **Versioning**: Enabled for asset protection
- **CloudFront CDN**: For image delivery optimization

## 5. Network & Data Transfer

### Monthly Data Transfer Estimation
- **Inbound**: ~50 GB (uploads, API requests)
- **Outbound**: 
  - Images served: ~500 GB/month (cached via CloudFront)
  - API responses: ~100 GB/month
  - Total: ~600 GB/month

### CloudFront CDN
- **Distribution Type**: Web Distribution
- **Origins**: S3 bucket, ALB
- **Cache Behaviors**:
  - Images: Cache 30 days
  - API: No cache
  - Static assets: Cache 7 days
- **Edge Locations**: Asia Pacific focus
- **Compression**: Enabled

## 6. Supporting Services

### AWS CloudWatch
- **Metrics**: Standard + Custom metrics
- **Log Groups**: 
  - /ecs/frontend
  - /ecs/backend
  - /aws/rds/postgresql
- **Alarms**: CPU, Memory, Error rates, Response times
- **Dashboard**: Custom dashboard for monitoring

### AWS WAF (Web Application Firewall)
- **Web ACLs**: Rate limiting, SQL injection protection
- **Rules**: IP reputation lists, geographic restrictions
- **Request sampling**: Enabled

## 7. High Availability & Disaster Recovery

### Architecture
- **Multi-AZ Deployment**: All production resources
- **Auto-scaling**: ECS services, RDS storage
- **Health Checks**: ALB, Route 53
- **Failover**: Automatic via ALB and RDS Multi-AZ

### Backup Strategy
- **RDS**: Automated daily backups, 30-day retention
- **S3**: Cross-region replication for critical assets
- **ECS**: Container images in ECR with versioning

## 8. Performance Optimization

### Caching Strategy
- **CloudFront**: Edge caching for static assets
- **Application Level**: In-memory caching for frequently accessed data

### Database Optimization
- **Indexes**: On frequently queried columns
- **Connection Pooling**: PgBouncer or application-level pooling
- **Query Optimization**: Regular EXPLAIN ANALYZE reviews

## 9. Cost Estimation (Monthly - USD)

### Production Environment
| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| ECS Fargate (Frontend) | 2-4 tasks × 1 vCPU, 2GB | $100-150 |
| ECS Fargate (Backend) | 2-4 tasks × 2 vCPU, 4GB | $200-300 |
| ALB | 1 ALB, 2 AZ | $25 |
| RDS PostgreSQL | db.t3.medium, Multi-AZ | $120 |
| S3 Storage | 30 GB + requests | $15 |
| CloudFront | 600 GB transfer | $50 |
| Data Transfer | 600 GB outbound | $50 |
| CloudWatch | Logs, metrics, alarms | $30 |
| **Total Estimated** | | **$590-740** |

### Development Environment
| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| ECS Fargate | 2 tasks × 0.5 vCPU, 1GB | $20 |
| RDS PostgreSQL | db.t3.micro | $15 |
| S3 Storage | 10 GB | $5 |
| Other Services | Minimal usage | $10 |
| **Total Estimated** | | **$50** |

## 10. Scaling Recommendations

### Year 1 → Year 2 (+30% growth)
1. **ECS**: Auto-scaling handles increased load automatically
2. **RDS**: Monitor metrics, consider upgrading to db.t3.large if needed
3. **S3**: No changes needed (scales automatically)
4. **CloudFront**: Review cache hit ratios, optimize cache policies

### Performance Monitoring KPIs
- **Page Load Time**: < 2.5s (list), < 2s (detail)
- **API Response Time**: < 1s (search), < 3s (advanced filter)
- **Database Query Time**: < 100ms for 95th percentile
- **Uptime**: > 99.7% annually

### Cost Optimization Opportunities
1. **Reserved Instances**: 1-year term for RDS (save ~30%)
2. **Savings Plans**: For consistent ECS Fargate usage (save ~20%)
3. **S3 Intelligent-Tiering**: For automatic cost optimization
4. **Spot Instances**: For non-critical batch processing tasks

## 11. Implementation Timeline

### Phase 1: Foundation (Week 1-2)
- VPC setup with subnets
- RDS instance provisioning
- S3 buckets creation
- IAM roles and policies

### Phase 2: Application Deployment (Week 3-4)
- ECS cluster setup
- Container deployment
- ALB configuration
- CloudFront distribution

### Phase 3: Optimization (Week 5-6)
- Auto-scaling policies
- CloudWatch monitoring
- Performance testing
- Cache optimization (CloudFront)

### Phase 4: Production Readiness (Week 7-8)
- Security hardening
- Backup verification
- Disaster recovery testing
- Documentation completion