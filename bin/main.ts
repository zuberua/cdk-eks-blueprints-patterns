#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

import NginxIngressConstruct from '../lib/nginx-ingress-construct';
new NginxIngressConstruct().buildAsync(app, 'nginx').catch(() => {
    console.log("NGINX Ingress pattern is not setup due to missing secrets for ArgoCD admin pwd.");
});
//-------------------------------------------
// Starter Cluster with barebone infrastructure.
//-------------------------------------------

import StarterConstruct from '../lib/starter-construct';
new StarterConstruct().build(app, 'starter');


//-------------------------------------------
// Single Cluster with multiple teams.
//-------------------------------------------

import MultiTeamConstruct from '../lib/multi-team-construct';
new MultiTeamConstruct(app, 'multi-team');


//-------------------------------------------
// Multiple clusters, multiple regions.
//-------------------------------------------

import MultiRegionConstruct from '../lib/multi-region-construct';
new MultiRegionConstruct().buildAsync(app, 'multi-region').catch((error) => {
    console.log("Multi region pattern is not setup due to missing secrets: " + error);
});


//-------------------------------------------
// Single Fargate cluster.
//-------------------------------------------

import FargateConstruct from '../lib/fargate-construct';
new FargateConstruct(app, 'fargate');


//-------------------------------------------
// Multiple clusters with deployment pipeline.
//-------------------------------------------
import PipelineConstruct from '../lib/pipeline-stack';
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };

if(account) {
    new PipelineConstruct().buildAsync(app, { env }).catch(() => {
        console.log("Pipeline pattern is not setup due to missing secrets for GitHub access.");
    });
}
else {
    console.log("Valid AWS credentials are required to synthesize pipeline stack. Please run 'aws configure'");
}

//-------------------------------------------
// Single cluster with Bottlerocket nodes.
//-------------------------------------------

import BottleRocketConstruct from '../lib/bottlerocket-construct';
new BottleRocketConstruct().build(app, 'bottlerocket');


//-------------------------------------------
// Single cluster with custom configuration.
//-------------------------------------------

import GenericClusterConstruct from '../lib/generic-cluster-construct';
new GenericClusterConstruct().build(app, 'generic-cluster');

import KubecostConstruct from '../lib/kubecost-construct';
new KubecostConstruct(app, 'kubecost')

import KeptnControlPlaneConstruct from '../lib/keptn-construct';
new KeptnControlPlaneConstruct(app, 'keptn')
