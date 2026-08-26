'use strict';

var constructs = require('constructs');
var apigw = require('aws-cdk-lib/aws-apigatewayv2');
var iam = require('aws-cdk-lib/aws-iam');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var apigw__namespace = /*#__PURE__*/_interopNamespaceDefault(apigw);
var iam__namespace = /*#__PURE__*/_interopNamespaceDefault(iam);

class LambdaRouteConnection extends constructs.Construct {
    constructor(scope, id, props) {
        super(scope, id);

        const { lambdaFunction, region, apiId, routeKey,      authorizationType,
            authorizerId, } = props;

        const integrationRole = new iam__namespace.Role(this, `${id}-integration-role`, {
            assumedBy: new iam__namespace.ServicePrincipal('apigateway.amazonaws.com'),
        });

        lambdaFunction.grantInvoke(integrationRole);

        const integrationUri = `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaFunction.functionArn}/invocations`;

        const integration = new apigw__namespace.CfnIntegration(this, `${id}-integration`, {
            integrationType: 'AWS_PROXY',
            integrationUri,
            credentialsArn: integrationRole.roleArn,
            apiId,
            payloadFormatVersion: '2.0',
            connectionType: 'INTERNET',
            integrationMethod: 'POST',
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
        });

        const route = new apigw__namespace.CfnRoute(this, `${id}-route`, {
            apiId,
            routeKey,
            target: `integrations/${integration.ref}`,
            authorizationType,
            ...(authorizerId ? { authorizerId } : {}),
        });

        route.addResourceDependency(integration);
    }
}

// import {hey} from 'something'

// export const you = hey
const LambdaRouteConnector = LambdaRouteConnection;

exports.LambdaRouteConnector = LambdaRouteConnector;
