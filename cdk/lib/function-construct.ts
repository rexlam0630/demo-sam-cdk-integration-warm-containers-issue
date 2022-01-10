import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class FunctionConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.createDemoFunction();
  }

  createDemoFunction() {
    const fn = new Function(this, 'ApiGetCountries', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('../src'),
      memorySize: 128,
      timeout: Duration.seconds(10),
      functionName: 'DemoFunction',
      handler: 'index.handler',
    });

    const api = new HttpApi(this, 'DemoHttpApi', {
      apiName: 'DemoHttpApi'
    });

    new HttpRoute(this, 'DemoFunction', {
      httpApi: api,
      routeKey: HttpRouteKey.with('/demo', HttpMethod.GET),
      integration: new HttpLambdaIntegration('DemoFunctionIntegration', fn),
    });
  }
}
