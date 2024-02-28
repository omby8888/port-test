import K8sService from './k8sUtils';
import express from 'express';
import {Express} from 'express';
import * as jq from 'node-jq';
import axios from 'axios';
import {run} from 'node-jq';
import {sendActionLog, updateActionStatus} from '@src/portUtils';
import {ActionProperties} from '@src/actionProperties';

const app: Express = express();
const port: number = 8000;

app.use(express.json());

app.post("/namespace", async (request, response) => {
  let reqStatus: string = 'FAILURE';
  const runId: string = request.body['context']['runId'];
  try {
    await sendActionLog(runId, 'Starting to create your namespace!!!');
    const res: ActionProperties = await jq.run('.payload.properties', request.body, {
      input: 'json',
      output: 'json'
    }) as ActionProperties;
    await sendActionLog(runId,
      `Almost finished creating your namespace ${ res.name } with labels: ${ JSON.stringify(res.surpriseLabels) }`);
    await K8sService.createNamespace(res.name, res.surpriseLabels);
    await sendActionLog(runId, 'Done. Enjoy your namespace :)');
    reqStatus = 'SUCCESS';
  } catch (err) {
    console.log('Encountered with error:', err);
    await sendActionLog(runId, `Encountered with error:\n${ err }`);
  } finally {
    updateActionStatus(runId, reqStatus);
    if (reqStatus === 'SUCCESS') {
      response.send("Success!");
    } else {
      response.status(400).send('Failed to create namespace');
    }
  }
});

app.post('/terminate-runs', async (req, res) => {
  axios.get('https://api.getport.io/v1/actions/runs', {
    headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6Im9yZ19nTVExVHdTMUNmNENXZUVOIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2V0cG9ydC5pbyIsImlzTWFjaGluZSI6dHJ1ZSwic3ViIjoiY08wMno1MHNvZ2NGcU5FWlV5c0pGRVpCSHQyeGNDR1UiLCJqdGkiOiI1ZWQ1YWMyNi04ZjZiLTRkMDktODRiNi1mNWNjMWMwZmUwNjAiLCJpYXQiOjE3MDg5NTE2NzcsImV4cCI6MTcwODk2MjQ3N30.I21hQObbpMo2eVtAoHHzbakcYBl3bY72tg2ID87aY2U' }
  })
    .then(runsResponse => {
      console.log(runsResponse);
  jq.run('.runs.[] | select(.status == "ACTIVE") | .id', runsResponse.data, {
    input: 'json',
    output: 'json'
  })
    .then((runIds: string[]) => {
      // runIds.forEach(runId =>
      //   axios.patch('https://api.getport.io/v1/actions/runs', {statues: 'SUCCESS'}, {
      //   headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6Im9yZ19nTVExVHdTMUNmNENXZUVOIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2V0cG9ydC5pbyIsImlzTWFjaGluZSI6dHJ1ZSwic3ViIjoiY08wMno1MHNvZ2NGcU5FWlV5c0pGRVpCSHQyeGNDR1UiLCJqdGkiOiI1ZWQ1YWMyNi04ZjZiLTRkMDktODRiNi1mNWNjMWMwZmUwNjAiLCJpYXQiOjE3MDg5NTE2NzcsImV4cCI6MTcwODk2MjQ3N30.I21hQObbpMo2eVtAoHHzbakcYBl3bY72tg2ID87aY2U' }
      //   })
      //     .then(() => console.log('The run', runId, 'has been marked as success'))
      //     .catch(() => console.log('Failed to terminate run', runId))
      // );
      res.send(runIds);
    });
    })
  .catch(() => console.log('Total harbana'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});