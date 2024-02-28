import axios from 'axios';

const PORT_API: string = 'https://api.getport.io/v1';
const token: string = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6Im9yZ19nTVExVHdTMUNmNENXZUVOIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2V0cG9ydC5pbyIsImlzTWFjaGluZSI6dHJ1ZSwic3ViIjoiY08wMno1MHNvZ2NGcU5FWlV5c0pGRVpCSHQyeGNDR1UiLCJqdGkiOiI2NmU1ZGUwZi00MTYwLTQ3OGUtYmIxOS1jZjVlMjQ5MGY5YjUiLCJpYXQiOjE3MDkxMDg5MjAsImV4cCI6MTcwOTExOTcyMH0.u8C6FJvozChcSgT7o2PLaP9lliSnoQixBMwH4q4Bnzo';

const getAuthToken = (): string => {
  return token
};

export const sendActionLog = (runId: string, message: string): Promise<void> => {
  return axios.post(`${PORT_API}/actions/runs/${ runId }/logs`,
    { message: message },
    { headers: { "Authorization": getAuthToken() }});
};

export const updateActionStatus = (runId: string, status: string): Promise<void> => {
  return axios.patch(`${PORT_API}/actions/runs/${ runId }`,
    { status: status },
    { headers: { "Authorization": getAuthToken() }});
};