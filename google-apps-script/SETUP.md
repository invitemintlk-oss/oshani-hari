## Saving RSVPs to Google Sheets

Sheet: https://docs.google.com/spreadsheets/d/1x0P_8m5KvLib1j-0aIdCSKp95gdWfPCwOW4r8V9leko/edit

1. Open the sheet > Extensions > Apps Script.
2. Delete everything in Code.gs and paste the full contents of google-apps-script/code.gs. Save.
3. Deploy > New deployment > gear icon > Web app.
   - Execute as: Me
   - Who has access: Anyone
4. Click Deploy, approve the permissions (Advanced > Go to project > Allow).
5. Copy the Web app URL (ends with /exec).
6. Paste it into src/config.ts in place of PASTE_YOUR_WEB_APP_URL_HERE.
7. Commit and push; Vercel redeploys.

The RSVP tab and its headers are created automatically on the first response.

If you change code.gs later: Deploy > Manage deployments > Edit > Version: New version > Deploy
(the URL stays the same).
