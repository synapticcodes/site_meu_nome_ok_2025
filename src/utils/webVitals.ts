import { onCLS, onLCP, onINP, onTTFB, onFCP, type Metric } from 'web-vitals';

const sendToEndpoint = (metric: Metric) => {
  const endpoint = import.meta.env.PUBLIC_ANALYTICS_ENDPOINT;
  if (endpoint && navigator.sendBeacon) {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      timestamp: Date.now()
    });
    navigator.sendBeacon(endpoint, body);
  } else {
    console.info('[web-vitals]', metric.name, Math.round(metric.value));
  }
};

export const registerWebVitals = () => {
  if (typeof window === 'undefined') return;
  onCLS(sendToEndpoint);
  onFCP(sendToEndpoint);
  onLCP(sendToEndpoint);
  onINP(sendToEndpoint);
  onTTFB(sendToEndpoint);
};
