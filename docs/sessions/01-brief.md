# Session 1: Broken Access Control & Injection

Duration: 120 minutes (each group now has two graduated findings). Branch:
`session-1/vulnerable`.

## Story

Lab Store just shipped a quick round of features: a self-service order
history page, a smarter product search box, an editable profile page, and an
internal admin order dashboard. Support has started getting strange tickets
— a customer mentions seeing order totals that "don't look like mine", a
vendor partner asks why their product catalog search sometimes returns
results that look nothing like products, and someone on the support team
jokes that "the new profile page feels a little too flexible." Nothing is
confirmed yet. Your team has been asked to quietly verify whether any of
this points to a real problem before anyone tells customers anything.

You are split into two groups. Each group owns one part of the app and has
two findings to make this session: a **Level 1** finding (get this first)
and a **Level 2** finding (harder, build on what you learned in Level 1).
By the end of the session, each group must be able to explain both of their
findings to the other group as if the other group had never seen the code.

## Group A mission: order history & account access

### Level 1

Investigate the order endpoints. Customers can view their own past orders
from the web app. Your job is to determine whether a user can ever see an
order that does not belong to them, and if so, prove it with concrete
requests (not just reading code).

Starting point: the web app's order detail page, and the API routes behind
it.

### Level 2

Once Level 1 is confirmed and fixed, look at the rest of account management:
the profile page, and anything that depends on who you are (your role).
There is a second, harder finding here. It does not show up anywhere in the
web interface — you will not find it by clicking around. It also will not
pop open an "unauthorized" page by accident; you have to go looking for it
with direct requests against the API, thinking about what each endpoint
actually trusts about the caller.

Starting point: the API routes behind the profile page, and anything in the
app that behaves differently for a regular customer versus an internal
admin user.

## Group B mission: product search & sorting

### Level 1

Investigate the product catalog search. Customers can filter and search
products from the storefront. Your job is to determine whether the search
input is handled safely by the backend, and if not, prove what an attacker
could extract through it.

Starting point: the storefront's product listing page, and the API route
behind the search box.

### Level 2

Once Level 1 is confirmed and fixed, look at the other controls on the same
listing page. There is a second, harder finding here. It will not hand you
any data directly in the response body — you will not see it by just
reading a JSON payload back. The signal is more subtle: something about how
results come back changes depending on what you send in, even though
nothing looks obviously broken. Think about what else on that page accepts
user input besides the search box, and what that input is used for inside
the query.

Starting point: the storefront's product listing page (all of its controls,
not just search), and the API route behind it.

## Goals (both groups, both levels)

1. **Find** the weak spot: narrow it down to a specific endpoint and input.
2. **Exploit** it: get concrete proof (a request/response pair, or a
   sequence of requests) that the behavior is wrong, not just a hunch.
3. **Fix** it: change the code so the behavior is correct again, without
   breaking normal use of the feature.
4. **Prove the fix**: repeat your exploit against your fixed code and show it
   no longer works. Confirm normal use still works too.
5. **Prepare to teach**: get ready to walk the other group through both of
   your findings using the cross-teach template below. Assume they have not
   looked at your code at all.

## Rules of engagement

- Lab only. Everything happens against the local Docker stack on your own
  machine (`localhost:3000` web, `localhost:3001` API). Never point any tool
  at a system you do not own or operate, in this workshop or afterwards.
- Use the seeded accounts only (ask the facilitator if you do not have the
  credentials). Do not create your own users to work around the scenario.
- No automated scanners against shared infrastructure. Manual requests
  (curl, browser dev tools, Postman/Insomnia) are enough for both tracks,
  including Level 2.
- If you believe you found something, confirm it with a teammate before
  moving to the fix step — two sets of eyes, same as a real triage.
- Stay on your assigned track until both groups are ready to cross-teach.
  You are welcome to peek at the other app's UI, but dig into the other
  group's backend code only after the cross-teach starts.
- If your group finishes Level 2 early, ask the facilitator for a hint
  toward the other group's track instead of spoiling your own Level 2 for
  teammates who are still working on it.

## Cross-teach template

When it is your group's turn, present each of your two findings using this
structure (five minutes per finding, keep it tight):

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
group should get to find their own bugs first.
