# Laravel equivalents

The lab application is built with NestJS, but half of the audience works with Laravel. Every session carries a **Laravel equivalent fix note** so that the lesson transfers.

Placeholder: notes are added here, one file per session, as sessions are written (for example `session-1-access-control.md`). Each note covers:

- The Laravel construct that corresponds to the Nest fix (for example Policies and `authorize()` for ownership checks, Form Requests for validation, Eloquent bindings or the query builder for parameterized queries, Blade escaping for output).
- A short code sample.
- Common Laravel-specific pitfalls for the same vulnerability (for example `DB::raw`, mass assignment with `$guarded = []`, `{!! !!}` in Blade).

The same text also appears in the "Fix (Laravel equivalent)" section of the session file in `docs/sessions/`.
