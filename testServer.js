import http from 'k6/http';
import {sleep, check} from 'k6';
import { Counter } from 'k6/metrics';
export const requests = new Counter('http_reqs');
export const options = {
  vus:100,
  duration: '120s',
}

const baseUrl = 'http://localhost:3000/reviews/meta/';
export default function() {
  const url = baseUrl + Math.floor(Math.random() * 10000);
  const res = http.get(url);
}