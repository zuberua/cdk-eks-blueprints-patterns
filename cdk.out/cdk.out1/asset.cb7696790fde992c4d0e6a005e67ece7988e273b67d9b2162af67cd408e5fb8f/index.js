"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isComplete=exports.onEvent=void 0;const aws=require("aws-sdk"),cluster_1=require("./cluster"),consts=require("./consts"),fargate_1=require("./fargate"),ProxyAgent=require("proxy-agent");aws.config.logger=console,aws.config.update({httpOptions:{agent:new ProxyAgent}});let eks;const defaultEksClient={createCluster:req=>getEksClient().createCluster(req).promise(),deleteCluster:req=>getEksClient().deleteCluster(req).promise(),describeCluster:req=>getEksClient().describeCluster(req).promise(),describeUpdate:req=>getEksClient().describeUpdate(req).promise(),updateClusterConfig:req=>getEksClient().updateClusterConfig(req).promise(),updateClusterVersion:req=>getEksClient().updateClusterVersion(req).promise(),createFargateProfile:req=>getEksClient().createFargateProfile(req).promise(),deleteFargateProfile:req=>getEksClient().deleteFargateProfile(req).promise(),describeFargateProfile:req=>getEksClient().describeFargateProfile(req).promise(),configureAssumeRole:req=>{console.log(JSON.stringify({assumeRole:req},void 0,2));const creds=new aws.ChainableTemporaryCredentials({params:req,stsConfig:{stsRegionalEndpoints:"regional"}});eks=new aws.EKS({credentials:creds})}};function getEksClient(){if(!eks)throw new Error('EKS client not initialized (call "configureAssumeRole")');return eks}async function onEvent(event){return createResourceHandler(event).onEvent()}exports.onEvent=onEvent;async function isComplete(event){return createResourceHandler(event).isComplete()}exports.isComplete=isComplete;function createResourceHandler(event){switch(event.ResourceType){case consts.CLUSTER_RESOURCE_TYPE:return new cluster_1.ClusterResourceHandler(defaultEksClient,event);case consts.FARGATE_PROFILE_RESOURCE_TYPE:return new fargate_1.FargateProfileResourceHandler(defaultEksClient,event);default:throw new Error(`Unsupported resource type "${event.ResourceType}`)}}