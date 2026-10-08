# Session 1: Broken Access Control & Injection

Duration: 90 minutes. Branch: `session-1/vulnerable`.

## Story

Lab Store just shipped a quick round of features: a self-service order history
page and a smarter product search box. Support has started getting strange
tickets — a customer mentions seeing order totals that "don't look like
mine", and a vendor partner asks why their product catalog search sometimes
returns results that look nothing like products. Nothing is confirmed yet.
Your team has been asked to quietly verify whether either report points to a
real problem before anyone tells customers anything.

You are split into two groups. Each group owns one part of the app. By the
end of the session, each group must be able to explain their finding to the
other group as if the other group had never seen the code.

## Group A mission: order history

Investigate the order endpoints. Customers can view their own past orders
from the web app. Your job is to determine whether a user can ever see an
order that does not belong to them, and if so, prove it with concrete
requests (not just reading code).

Starting point: the web app's order detail page, and the API routes behind
it.

## Group B mission: product search

Investigate the product catalog search. Customers can filter and search
products from the storefront. Your job is to determine whether the search
input is handled safely by the backend, and if not, prove what an attacker
could extract through it.

Starting point: the storefront's product listing page, and the API route
behind the search box.

## Goals (both groups)

1. **Find** the weak spot: narrow it down to a specific endpoint and input.
2. **Exploit** it: get concrete proof (a request/response pair) that the
   behavior is wrong, not just a hunch.
3. **Fix** it: change the code so the behavior is correct again, without
   breaking normal use of the feature.
4. **Prove the fix**: repeat your exploit against your fixed code and show it
   no longer works. Confirm normal use still works too.
5. **Prepare to teach**: get ready to walk the other group through your
   finding using the cross-teach template below. Assume they have not looked
   at your code at all.

## Rules of engagement

- Lab only. Everything happens against the local Docker stack on your own
  machine (`localhost:3000` web, `localhost:3001` API). Never point any tool
  at a system you do not own or operate, in this workshop or afterwards.
- Use the seeded accounts only (ask the facilitator if you do not have the
  credentials). Do not create your own users to work around the scenario.
- No automated scanners against shared infrastructure. Manual requests
  (curl, browser dev tools, Postman/Insomnia) are enough for both tracks.
- If you believe you found something, confirm it with a teammate before
  moving to the fix step — two sets of eyes, same as a real triage.
- Stay on your assigned track until both groups are ready to cross-teach.
  You are welcome to peek at the other app's UI, but dig into the other
  group's backend code only after the cross-teach starts.

## Cross-teach template

When it is your group's turn, present using this structure (five minutes per
group, keep it tight):

1. **Where it is** — endpoint, file, and the exact line(s) of behavior.
2. **How to exploit it** — the minimal request(s) that demonstrate it,
   step by step, so the other group could reproduce it live.
3. **Impact** — what an attacker actually gains, phrased for someone
   non-technical (a support lead, a manager).
4. **The fix** — what changed, in one or two sentences plus the corrected
   snippet.
5. **How a reviewer would have caught it** — the one thing a code reviewer
   should have flagged in the original pull request.

Keep spoilers out of your own notes until your group's turn — the other
group should get to find their own bug first.
