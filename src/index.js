import Color from 'color'

const defaultConfig = {
  focus: 0.85,
  blur: 0.9
}

let opacityConfig = null
const browserWindowQueue = []
const browserWindows = []

const setOpacity = win => {
  if (!win.isDestroyed()) {
    if (win.isFocused()) {
      win.setOpacity(opacityConfig.focus)
    } else {
      win.setOpacity(opacityConfig.blur)
    }
    win.on('blur', () => {
      win.setOpacity(opacityConfig.blur)
    })
    win.on('focus', () => {
      win.setOpacity(opacityConfig.focus)
    })
  }
}

const trySetOpacity = () => {
  if (opacityConfig) {
    let _win
    while ((_win = browserWindowQueue.shift())) {
      setOpacity(_win)
    }
  }
}

const backgroundColor = '#002833'
const foregroundColor = '#839495'

export const decorateConfig = config => {
  let _opacityConfig = config.opacity

  if (typeof _opacityConfig === 'number') {
    _opacityConfig = { focus: _opacityConfig, blur: _opacityConfig }
  } else if (typeof _opacityConfig !== 'object') {
    _opacityConfig = {}
  }

  opacityConfig = Object.assign({}, defaultConfig, _opacityConfig)

  browserWindowQueue.push(...browserWindows)
  trySetOpacity()

  const bgColor = Color(backgroundColor)
  const colors = {
    light: bgColor.lightness(27).string(),
    dark: bgColor.darken(0.18).string()
  }

  return Object.assign({}, config, {
    fontSize: 12,
    padding: '2px 0px 2px 4px',
    foregroundColor: foregroundColor,
    backgroundColor: backgroundColor,
    borderColor: bgColor.darken(0.2).string(),
    css: `
      ${config.css || ''}
      .header_header { background-color: ${colors.dark}; }
      .term_term { height: 100%; }
      .xterm-scroll-area { margin-right: 2px; }
      .xterm-viewport::-webkit-scrollbar-button { width: 0; height: 0; display: none; }
      .xterm-viewport::-webkit-scrollbar-corner { background-color: transparent; }
      .xterm-viewport::-webkit-scrollbar { width: 2px; height: 4px; }
      .xterm-viewport::-webkit-scrollbar-track,
      .xterm-viewport::-webkit-scrollbar-thumb { -webkit-border-radius: 4px; }
      .xterm-viewport::-webkit-scrollbar-track { background-color: ${colors.dark}; }
      .xterm-viewport::-webkit-scrollbar-thumb { background-color: ${colors.light}; -webkit-box-shadow: none; }
      .xterm .xterm-viewport { overflow-y: auto; }
    `
  })
}

export const onWindow = win => {
  browserWindowQueue.push(win)
  browserWindows.push(win)
  trySetOpacity()
}
