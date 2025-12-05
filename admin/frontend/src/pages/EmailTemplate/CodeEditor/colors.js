const colors = [
  {
    '--text': ['rgb(14,20,27)', 'rgb(245,245,245)']
  },
  {
    '--color-gray-500:': ['hsl(225deg, 7%, 60%)', 'hsl(210deg, 8%, 50%)']
  },
  {
    '--color-gray-600:': ['hsl(225deg, 15%, 50%)', 'hsl(210deg, 12%, 55%)']
  },
  {
    '--prism-base': ['#25414e', '#f8f8f2']
  },
  {
    '--prism-background': ['#eeeff1', '#172028']
  },
  {
    '--prism-comment': ['#aabfc9', '#8292a2']
  },
  {
    '--prism-prolog': ['#aabfc9', '#8292a2']
  },
  {
    '--prism-doctype': ['#aabfc9', '#8292a2']
  },
  {
    '--prism-cdata': ['#39adb5', '#8292a2']
  },
  {
    '--prism-punctuation': ['#39adb5', '#f8f8f2']
  },
  {
    '--prism-namespace': ['#90a4ae', '#f8f8f2']
  },
  {
    '--prism-property': ['#0eb6c2', '#f92672']
  },
  {
    '--prism-tag': ['#e53935', '#ee5f93']
  },
  {
    '--prism-constant': ['#7c4dff', '#f92672']
  },
  {
    '--prism-symbol': ['#7c4dff', '#f92672']
  },
  {
    '--prism-deleted': ['#e53935', '#f92672']
  },
  {
    '--prism-boolean': ['#7c4dff', '#f92672']
  },
  {
    '--prism-number': ['#f76d47', '#ae81ff']
  },
  {
    '--prism-selector': ['#17242c', '#a6e22e']
  },
  {
    '--prism-attr-name': ['#1950c2', '#a6e22e']
  },
  {
    '--prism-string': ['#474545', '#e6db74']
  },
  {
    '--prism-char': ['#39adb5', '#a6e22e']
  },
  {
    '--prism-builtin': ['#39adb5', '#a6e22e']
  },
  {
    '--prism-inserted': ['#39adb5', '#a6e22e']
  },
  {
    '--prism-operator': ['#39adb5', '#f8f8f2']
  },
  {
    '--prism-entity': ['#393566', '#f8f8f2']
  },
  {
    '--prism-url': ['#e53935', '#f8f8f2']
  },
  {
    '--prism-variable': ['#e53935', '#fd971f']
  },
  {
    '--prism-atrule': ['#7c4dff', '#e6db74']
  },
  {
    '--prism-attr-value': ['#3c77b1', '#e6db74']
  },
  {
    '--prism-function': ['#ff7c4d', '#e6db74']
  },
  {
    '--prism-class-name': ['#ca3253', '#e46e86']
  },
  {
    '--prism-keyword': ['#0a14f5', '#66d9ef']
  },
  {
    '--prism-regex': ['#6182b8', '#e90']
  },
  {
    '--prism-important': ['#7c4dff', '#fd971f']
  },
  {
    '--playground-top': ['rgb(223, 223, 223)', 'rgb(32, 40, 48)']
  }
]

export const setTheme = (theme) => {
  colors.forEach((value) => {
    document.documentElement.style.setProperty(
      Object.keys(value)[0],
      theme === 'light'
        ? Object.values(value)[0][0]
        : Object.values(value)[0][1]
    )
  })
}
