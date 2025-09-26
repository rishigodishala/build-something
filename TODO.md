# TODO: Fix Frontend Deployment Issue - Data Not Displaying from Backend/Database

## Overview
The frontend loads the webpage but shows no data (empty tables for stations/bookings) due to failed API fetches caused by:
- Hardcoded URLs in App.js leading to incorrect paths (e.g., double "/stations", POST to /bookings instead of /book).
- Unused/misconfigured environment variables (REACT_APP_* not referenced in code; k8s env vars lack paths).
- Local .env has REACT_APP_USER_API set to /bookings, but ingress routes /user/* to user-service, so it should be /user.

Backend (station/user services) and DB integration are fine. Fixes focus on frontend code, local env, and k8s deployment config. No backend/ingress changes needed.

## Steps

1. **Update ev-frontend/.env**  
   - Change REACT_APP_USER_API to "http://ev.local/user" (matches ingress /user/* routing for /user/bookings and /user/book).  
   - REACT_APP_STATION_API remains "http://ev.local/stations" (correct).  
   - This ensures local dev (`npm start`) uses proper bases.

2. **Update ev-frontend/src/App.js**  
   - Replace hardcoded `stationApi` and `userApi` with `process.env.REACT_APP_STATION_API` and `process.env.REACT_APP_USER_API`.  
   - For stations: Use base directly for GET/POST (e.g., `${process.env.REACT_APP_STATION_API}` since it includes /stations).  
   - For bookings GET: `${process.env.REACT_APP_USER_API}/bookings`.  
   - For booking POST: Change to `${process.env.REACT_APP_USER_API}/book` (matches user-service endpoint).  
   - Add better error handling: Log/alert on fetch failures to debug (e.g., check console for 404s).  
   - Ensure `bookSlot` uses correct user_id (from name state) and refreshes data on success.  
   - No other changes (UI, states, etc., are fine).

3. **Update k8s/frontend.yaml**  
   - Set env vars: REACT_APP_STATION_API: "http://ev.local/stations"  
   - REACT_APP_USER_API: "http://ev.local/user"  
   - This propagates correct bases to the deployed pods, aligning with ingress.

4. **Followup: Redeploy and Test**  
   - Rebuild frontend image if needed: `cd ev-frontend && docker build -t rishi0404/ev-frontend:2.2 .` (increment tag).  
   - Apply k8s: `kubectl apply -f k8s/frontend.yaml` (assumes cluster like Minikube with ev.local in /etc/hosts: 127.0.0.1 ev.local).  
   - Verify pods: `kubectl get pods -l app=ev-frontend` (should be running).  
   - Test: Access http://ev.local in browser; check console for no fetch errors; data should load.  
   - Local test: `cd ev-frontend && npm start` (run backend via `docker-compose up` if needed).  
   - If issues: Check logs `kubectl logs -l app=ev-frontend`; ensure services reachable (curl http://ev.local/stations from pod).  
   - Mark complete once data displays correctly.

## Progress Tracking
- [x] Step 1: .env updated  
- [x] Step 2: App.js updated  
- [x] Step 3: frontend.yaml updated  
- [ ] Step 4: Redeployed and tested successfully

Update this file as steps complete.
