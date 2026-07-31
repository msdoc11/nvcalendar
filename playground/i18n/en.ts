export default {
  meta: {
    title: 'nvcalendar — calendar and date picker for Nuxt',
    description:
      'Calendar, date picker and attribute-driven date visualisation for Nuxt and Vue 3. Zero dependencies, Intl-powered, fully typed.',
  },

  nav: {
    docs: 'Docs',
    demos: 'Demos',
    github: 'GitHub',
    language: 'Language',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    accent: 'Accent',
    menu: 'Menu',
    skip: 'Skip to content',
  },

  hero: {
    badge: 'v0.1 · MIT',
    title: 'Dates, done properly.',
    subtitle:
      'A calendar, a date picker and a way to paint meaning onto days. One Nuxt module, no runtime dependencies, every locale the browser already knows.',
    install: 'Install',
    copy: 'Copy',
    copied: 'Copied',
    primary: 'Read the docs',
    secondary: 'Browse demos',
    hint: 'Drag across the days to pick a range.',
  },

  features: {
    title: 'What you get',
    lead: 'Everything below ships in the module. Nothing else to install.',
    items: {
      calendar: {
        title: 'Calendar',
        text: 'Any number of month panes, keyboard navigation, touch swipe and page transitions.',
      },
      picker: {
        title: 'Date picker',
        text: 'Single, multiple and range selection, with or without a clock, inline or in a popover.',
      },
      attributes: {
        title: 'Attributes',
        text: 'Highlights, dots, bars and popovers driven by plain data, including recurrence rules.',
      },
      intl: {
        title: 'Built on Intl',
        text: 'Month names, first day of week and input masks come from the locale. No translation files.',
      },
      theming: {
        title: 'Theming',
        text: 'One custom property drives the palette. Eighteen presets, light, dark and system.',
      },
      a11y: {
        title: 'Accessible',
        text: 'Grid semantics, roving tab index, arrow-key navigation and visible focus.',
      },
    },
  },

  showcase: {
    title: 'Data in, meaning out',
    lead: 'Attributes are plain objects, so a schedule from an API becomes a calendar without a mapping layer.',
  },

  cta: {
    title: 'Add it to your project',
    lead: 'One command, then the components are auto-imported.',
    action: 'Getting started',
  },

  card: {
    tabDemo: 'Preview',
    tabCode: 'Code',
    copy: 'Copy',
    copied: 'Copied',
    noteTheme: 'theme is { color, isDark } from the switches in the header',
    noteDay: 'day(n) is the nth day of the current month',
  },

  docs: {
    title: 'Documentation',
    onThisPage: 'On this page',
    nav: {
      start: 'Getting started',
      calendar: 'Calendar',
      picker: 'Date picker',
      attributes: 'Attributes',
      theming: 'Theming',
      locales: 'Locales and formats',
      api: 'API reference',
    },

    start: {
      title: 'Getting started',
      lead: 'Install the module, add it to nuxt.config, use the components. There is no third step.',
      installTitle: 'Installation',
      installText: 'The module is published on npm and works with Nuxt 3 and Nuxt 4.',
      installAuto: 'The quickest way is the Nuxt CLI, which installs the package and registers the module for you.',
      installManual: 'Or install it yourself and add it to the modules array.',
      usageTitle: 'First component',
      usageText:
        'Components are auto-imported and the stylesheet is registered by the module, so a picker is one tag.',
      optionsTitle: 'Module options',
      optionsText:
        'Every option is optional. Defaults apply to every component and are overridden by props on individual components.',
      vueTitle: 'Plain Vue 3',
      vueText: 'Outside Nuxt, install the plugin and import the stylesheet yourself.',
      ssrTitle: 'Server rendering',
      ssrText:
        'All components render on the server. Popovers are teleported to the body and mount on the client only, so nothing needs wrapping in ClientOnly. Dates are handled in the visitor\'s own time zone; pass the today prop when a test needs a fixed reference date.',
    },

    calendar: {
      title: 'Calendar',
      lead: 'A month grid with everything around it: panes, navigation, week numbers and the keyboard.',
      panesTitle: 'Panes',
      panesText:
        'rows and columns lay out several months at once. step sets how many months one navigation click moves; it defaults to the number of panes.',
      pageTitle: 'Controlling the month',
      pageText:
        'Leave it alone and the calendar manages its own page. Bind v-model:page to control it, or call the exposed methods on the component instance.',
      boundsTitle: 'Bounds and disabled days',
      boundsText:
        'minDate and maxDate limit both selection and navigation. disabledDates blocks individual days, ranges or recurrences; availableDates is its inverse.',
      keyboardTitle: 'Keyboard',
      keyboardText: 'The grid is a single tab stop. Once focused, the arrows move between days.',
    },

    picker: {
      title: 'Date picker',
      lead: 'The calendar plus selection: one date, several dates, or a range, with an optional clock.',
      modesTitle: 'Selection modes',
      modesText: 'The selection prop decides the shape of the model value.',
      timeTitle: 'Time',
      timeText:
        'mode="dateTime" adds a clock below the calendar, mode="time" hides the calendar. The rules prop restricts which hours, minutes and seconds can be picked.',
      inputTitle: 'Attaching to an input',
      inputText:
        'Fill the default slot and the picker turns into a popover anchored to whatever you put there. The slot receives the formatted value, the event handlers to bind, and the popover controls.',
      modelTitle: 'Model value',
      modelText:
        'Dates, ISO strings and timestamps are all accepted as input. Model modifiers control what comes back out.',
    },

    attributes: {
      title: 'Attributes',
      lead: 'An attribute attaches meaning to dates: how they look, what a popover says, and any payload you want back in events.',
      datesTitle: 'Which dates',
      datesText: 'The dates field accepts a single date, a range, a recurrence, or an array mixing all three.',
      repeatTitle: 'Recurrence',
      repeatText:
        'Rules describe repeating dates without listing them. Every field is a filter; combine them freely.',
      decorationsTitle: 'Decorations',
      decorationsText:
        'highlight, dot, bar and content take a boolean, a colour, a config object, or an object with start, base and end to style the edges of a range differently.',
      popoverTitle: 'Popovers',
      popoverText: 'A label is enough for the built-in layout. Use the day-popover slot for full control.',
    },

    theming: {
      title: 'Theming',
      lead: 'Every colour is derived from one custom property, so a theme is a single line of CSS.',
      accentTitle: 'Accent',
      accentText:
        'The color prop takes a preset name or any CSS colour. Attributes accept the same values, so highlight: \'pink\' matches color="pink".',
      darkTitle: 'Light and dark',
      darkText:
        'isDark takes true, false, or "system" to follow prefers-color-scheme reactively. It also sets color-scheme, so native controls inside the calendar match.',
      varsTitle: 'Custom properties',
      varsText: 'Override any of these on the calendar element or on an ancestor.',
    },

    locales: {
      title: 'Locales and formats',
      lead: 'Month names, weekday names, the first day of the week and the input mask all come from Intl.',
      localeTitle: 'Choosing a locale',
      localeText:
        'Pass a BCP-47 id, or leave it out to use the visitor\'s browser locale. Anything Intl knows works, with no translation files to ship.',
      masksTitle: 'Masks',
      masksText: 'Masks are token strings. The input mask is derived from the locale unless you override it.',
      tokensTitle: 'Format tokens',
    },

    api: {
      title: 'API reference',
      lead: 'Props, events, slots and exposed methods, generated from the source.',
      calendarProps: 'Calendar props',
      pickerProps: 'Date picker props',
      pickerNote: 'The date picker also accepts every calendar prop listed above.',
      events: 'Events',
      slots: 'Slots',
      methods: 'Exposed methods',
      columns: {
        prop: 'Prop',
        type: 'Type',
        default: 'Default',
        description: 'Description',
        event: 'Event',
        payload: 'Payload',
        slot: 'Slot',
        scope: 'Scope',
        method: 'Method',
        signature: 'Signature',
      },
    },
  },

  demo: {
    title: 'Demos',
    lead: 'Every example is live. Switch to the Code tab to see exactly what produced it.',
    nav: {
      calendar: 'Calendar',
      picker: 'Date picker',
      attributes: 'Attributes',
      time: 'Time',
      inputs: 'Inputs',
      slots: 'Slots and events',
      locales: 'Locales',
      theming: 'Theming',
    },

    calendar: {
      title: 'Calendar',
      lead: 'Layout, navigation and the shape of the grid.',
      cards: {
        panes: {
          title: 'Panes',
          hint: 'rows by columns, with an independent navigation step.',
        },
        page: {
          title: 'Controlled month',
          hint: 'Bind v-model:page to drive the calendar from outside.',
        },
        grid: {
          title: 'Week grid',
          hint: 'Fixed six weeks or only the weeks in the month, with locale or ISO week numbers.',
        },
        firstDay: {
          title: 'First day of week',
          hint: 'Overrides what the locale would choose.',
        },
        chrome: {
          title: 'Chrome',
          hint: 'Everything around the grid can be removed.',
        },
        transitions: {
          title: 'Transitions',
          hint: 'Applies when the month changes.',
        },
        bounds: {
          title: 'Bounds',
          hint: 'Navigation stops at the limits and days outside them cannot be picked.',
        },
        disabled: {
          title: 'Disabled days',
          hint: 'Single dates, ranges and recurrences, or the inverse with availableDates.',
        },
      },
    },

    picker: {
      title: 'Date picker',
      lead: 'Selection modes, model shapes and how the selection is painted.',
      cards: {
        single: { title: 'Single date', hint: 'Click the selected day again to clear it.' },
        noClear: { title: 'Not clearable', hint: 'allowClear stops a selection from being emptied.' },
        multiple: { title: 'Multiple dates', hint: 'Each click toggles one day.' },
        range: { title: 'Range', hint: 'Click a start day, move the pointer, click an end day. Escape cancels.' },
        rangeTwo: { title: 'Range over two months', hint: 'The drag continues across panes.' },
        span: { title: 'Range length limits', hint: 'Between three and seven days; anything else restarts the drag.' },
        styled: { title: 'Custom selection styling', hint: 'selectAttribute paints the value, dragAttribute the preview.' },
        disabled: { title: 'Disabled days', hint: 'Weekends and a blocked range cannot be picked.' },
        string: { title: 'String model', hint: 'The value comes back formatted with the modelValue mask.' },
        number: { title: 'Timestamp model', hint: 'The value comes back as milliseconds since the epoch.' },
      },
    },

    attributes: {
      title: 'Attributes',
      lead: 'Plain objects, so a response from an API can be rendered directly.',
      cards: {
        fill: { title: 'Fill modes', hint: 'Solid, light and outline, with or without a colour.' },
        segmented: { title: 'Segmented range', hint: 'Different styling for the first day, the middle and the last day.' },
        dots: { title: 'Dots and bars', hint: 'Several attributes stack on the same day.' },
        repeat: { title: 'Recurrence', hint: 'Weekdays, days of month, ordinal weekdays and intervals.' },
        exclude: { title: 'Excluded dates', hint: 'A month-long range minus every weekend.' },
        popovers: { title: 'Popovers', hint: 'Opening on hover, on click or on focus, with several rows per day.' },
        custom: { title: 'Custom class and style', hint: 'Any CSS, including gradients, on the fill and the label.' },
        order: { title: 'Paint order', hint: 'A higher order value is drawn on top.' },
      },
    },

    time: {
      title: 'Time',
      lead: 'The clock follows the locale unless you tell it otherwise.',
      cards: {
        dateTime: { title: 'Date and time', hint: 'The clock sits below the calendar.' },
        timeOnly: { title: 'Time only', hint: 'The calendar is hidden entirely.' },
        hr24: { title: 'Forced 24-hour clock', hint: 'Overrides the locale preference.' },
        accuracy: { title: 'Accuracy', hint: 'Hours only, or down to seconds.' },
        rules: { title: 'Business hours', hint: 'Nine to six, in quarter-hour slots.' },
        range: { title: 'Range with two clocks', hint: 'One for the start of the range, one for the end.' },
      },
    },

    inputs: {
      title: 'Inputs and popovers',
      lead: 'Filling the default slot turns the picker into a popover anchored to your own markup.',
      cards: {
        plain: { title: 'Plain input', hint: 'Type a date or pick one. Parsing follows the locale masks.' },
        button: { title: 'Input with a toggle', hint: 'The slot exposes the popover controls.' },
        range: { title: 'Range with two inputs', hint: 'The value and the handlers are split into start and end.' },
        multiple: { title: 'Multiple dates in one input', hint: 'Comma-separated values are parsed back.' },
        dateTime: { title: 'Date and time input', hint: 'The mask includes the clock.' },
        placement: { title: 'Popover placement', hint: 'A side without enough room flips to the opposite one.' },
        mask: { title: 'Custom input mask', hint: 'Try typing 15 March 2027.' },
      },
    },

    slots: {
      title: 'Slots and events',
      lead: 'Every part of the calendar can be replaced and every interaction is emitted.',
      cards: {
        dayContent: { title: 'Custom day content', hint: 'customData drives a workload badge under each day number.' },
        dayPopover: { title: 'Custom day popover', hint: 'Hover a decorated day.' },
        header: { title: 'Custom header and weekdays', hint: 'Title, arrows, weekday labels, week numbers and footer.' },
        methods: {
          title: 'Exposed methods',
          hint: 'moveToDate only scrolls the panes, so it does nothing when the date is already on screen. focusDay also moves keyboard focus.',
        },
        events: { title: 'Events', hint: 'Click, hover and use the keyboard on the calendar below.' },
      },
      log: 'no events yet',
    },

    locales: {
      title: 'Locales',
      lead: 'Names, first day of week and input masks come from Intl, so any locale the browser knows is supported.',
      cards: {
        pick: { title: 'Pick a locale', hint: 'The input parses whatever format that locale writes.' },
        masks: { title: 'Masks', hint: 'Override any of the format masks.' },
      },
      gallery: 'Side by side',
    },

    theming: {
      title: 'Theming',
      lead: 'One custom property drives everything else.',
      cards: {
        custom: { title: 'Custom accent', hint: 'Any CSS colour works, not just the presets.' },
        vars: { title: 'Custom properties', hint: 'Bigger cells, square corners, larger type. No props involved.' },
        forced: { title: 'Forced light and dark', hint: 'Independent of the page theme.' },
      },
      presets: 'All eighteen presets',
    },

    controls: {
      rows: 'rows',
      columns: 'columns',
      step: 'step',
      trimWeeks: 'trim weeks',
      weeknumbers: 'week numbers',
      isoWeeknumbers: 'ISO numbers',
      firstDay: 'first day',
      locale: 'locale',
      placement: 'placement',
      accuracy: 'accuracy',
      colour: 'colour',
      none: 'none',
      left: 'left',
      right: 'right',
      value: 'Value',
    },
  },

  footer: {
    built: 'An independent MIT implementation. Not affiliated with any other calendar library.',
    docs: 'Docs',
    demos: 'Demos',
    npm: 'npm',
    github: 'GitHub',
  },

  notFound: {
    title: 'Page not found',
    action: 'Back home',
  },
}
