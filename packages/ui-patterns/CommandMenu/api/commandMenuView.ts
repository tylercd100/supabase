import { proxy } from 'valtio'

const commandMenuView = proxy({
  init: false,
  open: false,
  runInit: () => !commandMenuView.init && (commandMenuView.init = true),
  setOpen: (open: boolean) => {
    console.log('芝麻开门')
    commandMenuView.runInit()
    commandMenuView.open = open
  },
  toggleOpen: () => {
    commandMenuView.runInit()
    commandMenuView.open = !commandMenuView.open
  },
})

export { commandMenuView }
