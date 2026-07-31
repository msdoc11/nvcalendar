# Security policy

## Supported versions

The latest published minor release receives fixes. Until 1.0 that is whatever
`npm view nvcalendar version` reports.

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's private reporting under
**Security → Report a vulnerability**, or email <email@qsyro.com>.

Include what you found, how to reproduce it, and the impact you expect. You will
get an acknowledgement within a few days and an estimate for a fix.

## Scope

The package renders dates and formats strings; it makes no network requests,
reads no storage and executes nothing it is given. Two areas are still worth a
look:

- **Attribute content.** `class`, `style` and popover labels come from your
  application and are rendered as text or as bound attributes. The `day-popover`
  and `day-content` slots put you in control of the markup, so escaping data
  from an untrusted source is the application's responsibility.
- **Input parsing.** Masks are compiled into regular expressions. A mask comes
  from your code rather than from user input; treat a mask built from untrusted
  data as you would any dynamic pattern.
