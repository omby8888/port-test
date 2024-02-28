import * as k8s from '@kubernetes/client-node';
import {V1Namespace} from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

async function createNamespace(name: string, labels: { [key: string]: string }) {
  const namespace: V1Namespace = new V1Namespace();
  namespace.metadata = {
    name: name,
    labels: labels,
  };
  await k8sApi.createNamespace(namespace);
}

export default { createNamespace } as const;