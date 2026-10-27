# Booking calendar: setup for Mohamed (about 10 minutes)

## Key points
- Free Cal.com account under Mohesam84@gmail.com, connected to his Google Calendar.
- One meeting type with "Requires confirmation" on, so every request waits for his approval.
- He sends Islam the meeting link (for example `mohamed-elsaid/30min`). Islam puts it in the site, one line.

## Steps (send these to Mohamed)
1. Go to **cal.com** and choose **Sign up**. Use **Continue with Google** and pick Mohesam84@gmail.com.
2. Username: `mohamed-elsaid` (or close to it). Time zone: **Europe/Berlin** (Munich), not a fixed UTC offset. Cal.com moves the clocks for summer time by itself.
3. Connect **Google Calendar** when it asks. Busy times in his calendar are then hidden from visitors, and approved meetings land in it.
4. Set **Availability**: the days and hours he accepts calls, in Munich time.
5. Open **Event Types**, then the 30 minute meeting (or create one, "Introductory call", 30 min). Under **Advanced**, turn on **Requires confirmation**. Save.
6. Copy the event link, e.g. `cal.com/mohamed-elsaid/30min`, and send it to Islam.

## What happens after
- A visitor picks a time on the site. The calendar shows times in the visitor's own zone, found by their browser.
- Mohamed gets an email with the request, in Munich time, with **Confirm** and **Reject** buttons.
- When he confirms, the visitor gets a confirmation email with a calendar invitation, and the meeting goes into Mohamed's calendar. Whether it lands in the visitor's calendar by itself depends on their calendar app.

## For Islam: switching it on
In `src/index.html`, find `data-cal-link=""` and put the link inside, without `cal.com/`:
`data-cal-link="mohamed-elsaid/30min"`. Build and deploy. Until then the site shows "Request a time by email".
Preview any public link before that with `?cal=username/event` at the end of a preview address (it is ignored on the live site).

Before going live, test with two of your own accounts: a booking from a Cairo time zone, confirm, reject, cancel, and a clash with a busy slot.

Note: the free plan shows a small "Cal.com" mark under the calendar. Removing it needs a paid plan.
